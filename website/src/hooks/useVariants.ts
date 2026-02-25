import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface VariantGroupDB {
    id: string;
    name: string;
    attribute_names: string[];
    created_at?: string;
}

export interface ProductVariantDB {
    id: string;
    group_id: string;
    product_id: string;
    attributes: Record<string, string>;
    created_at?: string;
}

export interface VariantGroupWithVariants extends VariantGroupDB {
    variants: ProductVariantDB[];
}

export function useVariants() {
    const [groups, setGroups] = useState<VariantGroupWithVariants[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Core fetch function — always runs when called (no stale guard)
    const fetchGroups = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch groups
            const { data: groupsData, error: groupsError } = await supabase
                .from('variant_groups')
                .select('*')
                .order('created_at', { ascending: false });

            if (groupsError) throw groupsError;

            // Fetch variants
            const { data: variantsData, error: variantsError } = await supabase
                .from('product_variants')
                .select('*');

            if (variantsError) throw variantsError;

            // Merge
            const merged = (groupsData || []).map(group => ({
                ...group,
                variants: (variantsData || []).filter(v => v.group_id === group.id)
            }));

            setGroups(merged);
            setError(null);
        } catch (err: unknown) {
            console.error('Error fetching variants:', err);
            setError((err as any).message || 'Error al cargar variantes');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch on mount
    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const createGroup = async (name: string, attributeNames: string[]) => {
        try {
            const { data, error } = await supabase
                .from('variant_groups')
                .insert([{ name, attribute_names: attributeNames }])
                .select()
                .single();

            if (error) throw error;
            await fetchGroups(); // Refresh list
            return data;
        } catch (err: unknown) {
            console.error('Error creating group:', err);
            throw err; // Re-throw so VariantManager can show toast
        }
    };

    const deleteGroup = async (id: string) => {
        try {
            const { error } = await supabase
                .from('variant_groups')
                .delete()
                .eq('id', id);

            if (error) throw error;
            // Optimistic removal + refresh
            setGroups(prev => prev.filter(g => g.id !== id));
        } catch (err: unknown) {
            console.error('Error deleting group:', err);
            throw err;
        }
    };

    const addVariant = async (groupId: string, productId: string, attributes: Record<string, string>) => {
        try {
            const { data, error } = await supabase
                .from('product_variants')
                .insert([{ group_id: groupId, product_id: productId, attributes }])
                .select()
                .single();

            if (error) throw error;
            await fetchGroups(); // Refresh list
            return data;
        } catch (err: unknown) {
            console.error('Error adding variant:', err);
            throw err;
        }
    };

    const removeVariant = async (variantId: string) => {
        try {
            const { error } = await supabase
                .from('product_variants')
                .delete()
                .eq('id', variantId);

            if (error) throw error;
            await fetchGroups(); // Refresh list
        } catch (err: unknown) {
            console.error('Error removing variant:', err);
            throw err;
        }
    };

    return {
        groups,
        loading,
        error,
        fetchGroups,
        createGroup,
        deleteGroup,
        addVariant,
        removeVariant
    };
}
