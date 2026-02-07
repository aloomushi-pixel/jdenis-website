// ERP Data Layer — J-Denis Industrial
// Supabase CRUD functions for all ERP tables
import { supabase } from './supabase';

// =============================================
// TYPE DEFINITIONS
// =============================================

export type UserRole = 'ADMIN' | 'CLIENT' | 'COLLABORATOR' | 'TECHNICIAN' | 'TRANSPORTISTA' | 'ALMACEN_MP' | 'ALMACEN_PF' | 'FABRICA' | 'EJECUTIVO';

export interface ERPUser {
    id: string;
    email: string;
    fullName: string | null;
    role: UserRole;
    phone: string | null;
    created_at: string | null;
}

export interface ResourceCategory {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    icon: string | null;
    is_active: boolean;
    sort_order: number;
}

export interface Resource {
    id: string;
    custom_id: string | null;
    category_id: string;
    title: string;
    description: string | null;
    format: string;
    quantity: number;
    min_quantity: number;
    brand: string | null;
    unit_cost: number;
    image_url: string | null;
    is_active: boolean;
    created_at: string | null;
    updated_at: string | null;
    // Joined
    resource_categories?: ResourceCategory;
}

export interface ResourceMovement {
    id: string;
    resource_id: string;
    movement_type: string;
    quantity: number;
    previous_quantity: number;
    new_quantity: number;
    origin: string | null;
    destination: string | null;
    reference_id: string | null;
    reference_type: string | null;
    notes: string | null;
    photo_urls: string[] | null;
    performed_by: string;
    confirmed_by: string | null;
    created_at: string;
    // Joined
    resources?: Resource;
    users?: ERPUser;
}

export interface FinishedProduct {
    id: string;
    custom_id: string | null;
    title: string;
    description: string | null;
    price: number;
    sat_code: string | null;
    image_url: string | null;
    raw_material_cost: number;
    packaging_cost: number;
    total_cost: number;
    is_active: boolean;
    created_at: string | null;
}

export interface ProductionOrder {
    id: string;
    order_number: string;
    status: string;
    raw_materials: any[];
    total_raw_input: number;
    finished_output: any[];
    total_finished_output: number;
    tolerance_coefficient: number;
    actual_loss: number;
    loss_notes: string | null;
    linked_purchase_order_id: string | null;
    created_by: string;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface PurchaseOrder {
    id: string;
    order_number: string;
    supplier_name: string | null;
    supplier_contact: string | null;
    status: string;
    items: any[];
    subtotal: number;
    tax: number;
    total: number;
    notes: string | null;
    created_by: string;
    approved_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface SalesOrder {
    id: string;
    order_number: string;
    client_id: string;
    status: string;
    status_history: any[];
    items: any[];
    subtotal: number;
    tax: number;
    total: number;
    delivery_date: string | null;
    delivery_address: string | null;
    notes: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
    // Joined
    users?: ERPUser;
}

export interface TransportAssignment {
    id: string;
    sales_order_id: string | null;
    driver_id: string;
    vehicle_resource_id: string | null;
    status: string;
    scheduled_date: string;
    pickup_confirmed: boolean;
    pickup_photo_urls: string[] | null;
    pickup_weight: number | null;
    pickup_packing_list: string | null;
    delivery_confirmed: boolean;
    delivery_photo_urls: string[] | null;
    delivery_weight: number | null;
    notes: string | null;
    confirmed_at: string | null;
    created_at: string;
}

export interface PackagingRecord {
    id: string;
    sales_order_id: string | null;
    production_order_id: string | null;
    status: string;
    items: any[];
    total_packages: number;
    packing_list: string | null;
    photo_urls: string[] | null;
    weight: number | null;
    packaged_by: string | null;
    created_at: string;
    completed_at: string | null;
}

export interface EventLogEntry {
    id: string;
    event_type: string;
    module: string;
    action: string;
    entity_type: string | null;
    entity_id: string | null;
    metadata: Record<string, any>;
    performed_by: string;
    created_at: string;
    // Joined
    users?: ERPUser;
}

// =============================================
// USER MANAGEMENT
// =============================================

export async function getUsers(role?: UserRole) {
    let query = supabase.from('users').select('*').order('created_at', { ascending: false });
    if (role) query = query.eq('role', role);
    const { data, error } = await query;
    if (error) throw error;
    return data as ERPUser[];
}

export async function updateUserRole(userId: string, role: UserRole) {
    const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// =============================================
// RESOURCE CATEGORIES
// =============================================

export async function getResourceCategories() {
    const { data, error } = await supabase
        .from('resource_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
    if (error) throw error;
    return data as ResourceCategory[];
}

// =============================================
// RESOURCES
// =============================================

export async function getResources(categorySlug?: string) {
    let query = supabase
        .from('resources')
        .select('*, resource_categories(id, slug, name, icon)')
        .eq('is_active', true)
        .order('title');
    if (categorySlug) {
        const cat = await supabase.from('resource_categories').select('id').eq('slug', categorySlug).single();
        if (cat.data) query = query.eq('category_id', cat.data.id);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data as Resource[];
}

export async function createResource(resource: Partial<Resource>) {
    const { data, error } = await supabase.from('resources').insert(resource).select().single();
    if (error) throw error;
    return data;
}

export async function updateResource(id: string, updates: Partial<Resource>) {
    const { data, error } = await supabase
        .from('resources')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function deleteResource(id: string) {
    const { error } = await supabase.from('resources').update({ is_active: false }).eq('id', id);
    if (error) throw error;
}

// =============================================
// RESOURCE MOVEMENTS
// =============================================

export async function getResourceMovements(resourceId?: string, limit = 50) {
    let query = supabase
        .from('resource_movements')
        .select('*, resources(id, title, format), users:performed_by(id, email, fullName)')
        .order('created_at', { ascending: false })
        .limit(limit);
    if (resourceId) query = query.eq('resource_id', resourceId);
    const { data, error } = await query;
    if (error) throw error;
    return data as ResourceMovement[];
}

export async function createResourceMovement(movement: {
    resource_id: string;
    movement_type: string;
    quantity: number;
    origin?: string;
    destination?: string;
    reference_id?: string;
    reference_type?: string;
    notes?: string;
    photo_urls?: string[];
    performed_by: string;
}) {
    // Get current quantity
    const { data: resource } = await supabase
        .from('resources')
        .select('quantity')
        .eq('id', movement.resource_id)
        .single();
    if (!resource) throw new Error('Resource not found');

    const prevQty = Number(resource.quantity);
    const delta = movement.movement_type === 'EGRESO' || movement.movement_type === 'MERMA'
        ? -Math.abs(movement.quantity)
        : Math.abs(movement.quantity);
    const newQty = prevQty + delta;

    // Insert movement
    const { data, error } = await supabase.from('resource_movements').insert({
        ...movement,
        previous_quantity: prevQty,
        new_quantity: newQty,
    }).select().single();
    if (error) throw error;

    // Update resource quantity
    await supabase.from('resources').update({ quantity: newQty, updated_at: new Date().toISOString() }).eq('id', movement.resource_id);

    return data;
}

// =============================================
// FINISHED PRODUCTS
// =============================================

export async function getFinishedProducts() {
    const { data, error } = await supabase
        .from('finished_products')
        .select('*')
        .eq('is_active', true)
        .order('title');
    if (error) throw error;
    return data as FinishedProduct[];
}

export async function createFinishedProduct(product: Partial<FinishedProduct>) {
    const { data, error } = await supabase.from('finished_products').insert(product).select().single();
    if (error) throw error;
    return data;
}

export async function updateFinishedProduct(id: string, updates: Partial<FinishedProduct>) {
    const { data, error } = await supabase
        .from('finished_products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// =============================================
// PRODUCTION ORDERS
// =============================================

export async function getProductionOrders(status?: string) {
    let query = supabase.from('production_orders').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    return data as ProductionOrder[];
}

export async function createProductionOrder(order: {
    order_number: string;
    raw_materials?: any[];
    total_raw_input?: number;
    linked_purchase_order_id?: string;
    created_by: string;
}) {
    const { data, error } = await supabase.from('production_orders').insert(order).select().single();
    if (error) throw error;
    return data;
}

export async function updateProductionOrderStatus(id: string, status: string, extra?: Partial<ProductionOrder>) {
    const updates: any = { status, updated_at: new Date().toISOString(), ...extra };
    if (status === 'EN_PROCESO') updates.started_at = new Date().toISOString();
    if (status === 'COMPLETADA') updates.completed_at = new Date().toISOString();
    const { data, error } = await supabase.from('production_orders').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
}

// =============================================
// PURCHASE ORDERS
// =============================================

export async function getPurchaseOrders(status?: string) {
    let query = supabase.from('purchase_orders').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    return data as PurchaseOrder[];
}

export async function createPurchaseOrder(order: {
    order_number: string;
    supplier_name?: string;
    supplier_contact?: string;
    items?: any[];
    subtotal?: number;
    tax?: number;
    total?: number;
    notes?: string;
    created_by: string;
}) {
    const { data, error } = await supabase.from('purchase_orders').insert(order).select().single();
    if (error) throw error;
    return data;
}

export async function updatePurchaseOrderStatus(id: string, status: string) {
    const { data, error } = await supabase
        .from('purchase_orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// =============================================
// SALES ORDERS
// =============================================

export async function getSalesOrders(status?: string) {
    let query = supabase
        .from('sales_orders')
        .select('*, users:client_id(id, email, fullName)')
        .order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    return data as SalesOrder[];
}

export async function createSalesOrder(order: {
    order_number: string;
    client_id: string;
    items?: any[];
    subtotal?: number;
    tax?: number;
    total?: number;
    delivery_date?: string;
    delivery_address?: string;
    notes?: string;
    created_by: string;
}) {
    const statusEntry = { status: 'PENDIENTE', changed_by: order.created_by, timestamp: new Date().toISOString(), notes: 'Pedido creado' };
    const { data, error } = await supabase
        .from('sales_orders')
        .insert({ ...order, status_history: [statusEntry] })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function updateSalesOrderStatus(id: string, status: string, changedBy: string, notes?: string) {
    // Get current history
    const { data: current } = await supabase.from('sales_orders').select('status_history').eq('id', id).single();
    const history = Array.isArray(current?.status_history) ? current.status_history : [];
    history.push({ status, changed_by: changedBy, timestamp: new Date().toISOString(), notes: notes || '' });

    const { data, error } = await supabase
        .from('sales_orders')
        .update({ status, status_history: history, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// =============================================
// TRANSPORT ASSIGNMENTS
// =============================================

export async function getTransportAssignments(driverId?: string) {
    let query = supabase
        .from('transport_assignments')
        .select('*, sales_orders(id, order_number, status), users:driver_id(id, email, fullName)')
        .order('scheduled_date', { ascending: false });
    if (driverId) query = query.eq('driver_id', driverId);
    const { data, error } = await query;
    if (error) throw error;
    return data as TransportAssignment[];
}

export async function updateTransportAssignment(id: string, updates: Partial<TransportAssignment>) {
    const { data, error } = await supabase
        .from('transport_assignments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function createTransportAssignment(assignment: {
    sales_order_id?: string;
    driver_id: string;
    vehicle_resource_id?: string;
    scheduled_date: string;
    notes?: string;
}) {
    const { data, error } = await supabase.from('transport_assignments').insert(assignment).select().single();
    if (error) throw error;
    return data;
}

// =============================================
// PACKAGING RECORDS
// =============================================

export async function getPackagingRecords(status?: string) {
    let query = supabase.from('packaging_records').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    return data as PackagingRecord[];
}

export async function createPackagingRecord(record: {
    sales_order_id?: string;
    production_order_id?: string;
    items?: any[];
    packaged_by?: string;
}) {
    const { data, error } = await supabase.from('packaging_records').insert(record).select().single();
    if (error) throw error;
    return data;
}

export async function updatePackagingStatus(id: string, status: string, extra?: Partial<PackagingRecord>) {
    const updates: any = { status, ...extra };
    if (status === 'COMPLETADO') updates.completed_at = new Date().toISOString();
    const { data, error } = await supabase.from('packaging_records').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
}

// =============================================
// EVENT LOG
// =============================================

export async function getEventLog(limit = 50, filters?: { event_type?: string; module?: string }) {
    let query = supabase
        .from('event_log')
        .select('*, users:performed_by(id, email, fullName)')
        .order('created_at', { ascending: false })
        .limit(limit);
    if (filters?.event_type) query = query.eq('event_type', filters.event_type);
    if (filters?.module) query = query.eq('module', filters.module);
    const { data, error } = await query;
    if (error) throw error;
    return data as EventLogEntry[];
}

export async function logEvent(entry: {
    event_type: string;
    module: string;
    action: string;
    entity_type?: string;
    entity_id?: string;
    metadata?: Record<string, any>;
    performed_by: string;
}) {
    const { data, error } = await supabase.from('event_log').insert(entry).select().single();
    if (error) throw error;
    return data;
}

// =============================================
// DASHBOARD RPC FUNCTIONS
// =============================================

export async function getMonthlySales(month?: number, year?: number) {
    const { data, error } = await supabase.rpc('get_monthly_sales', {
        target_month: month || null,
        target_year: year || null,
    });
    if (error) throw error;
    return Number(data) || 0;
}

export async function getMonthlyPurchases(month?: number, year?: number) {
    const { data, error } = await supabase.rpc('get_monthly_purchases', {
        target_month: month || null,
        target_year: year || null,
    });
    if (error) throw error;
    return Number(data) || 0;
}

export async function getResourceSummary() {
    const { data, error } = await supabase.rpc('get_resource_summary');
    if (error) throw error;
    return data as { category_name: string; total_items: number; total_value: number; low_stock_count: number }[];
}

export async function getProductionSummary() {
    const { data, error } = await supabase.rpc('get_production_summary');
    if (error) throw error;
    return (data as any[])?.[0] || { total_orders: 0, pending_orders: 0, in_progress: 0, completed: 0, total_loss: 0 };
}
