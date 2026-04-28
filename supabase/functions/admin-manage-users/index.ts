import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.0';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // Verify Caller Auth
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            throw new Error('No authorization header');
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        
        if (authError || !user) {
            throw new Error('Unauthorized');
        }

        // Verify Caller is Admin
        const { data: userData, error: roleError } = await supabaseAdmin
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        if (roleError || userData?.role !== 'ADMIN') {
            throw new Error('Forbidden: Only Admins can perform this action');
        }

        // Parse Request body
        const body = await req.json();
        const { action, payload } = body;

        let responseData = {};

        switch (action) {
            case 'invite_user':
                const { email, role, fullName } = payload;
                if (!email || !role) throw new Error('Missing required fields for invite');

                // Generate Invite Link
                const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.generateLink({
                    type: 'invite',
                    email: email,
                    options: {
                        data: {
                            full_name: fullName,
                            role: role
                        }
                    }
                });

                if (inviteError) throw inviteError;

                const actionLink = inviteData.properties.action_link;

                // Send email using Resend
                const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
                if (RESEND_API_KEY) {
                    const res = await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${RESEND_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            from: 'J. Denis <no-reply@jdenis.store>',
                            to: [email],
                            subject: 'Bienvenido a J. Denis - Configura tu acceso',
                            html: `
                                <h2>Hola ${fullName || 'Usuario'},</h2>
                                <p>Has sido invitado para acceder al panel de J. Denis con el rol de <strong>${role}</strong>.</p>
                                <p>Por favor, haz clic en el siguiente enlace para establecer tu contraseña y activar tu cuenta:</p>
                                <a href="${actionLink}" style="display:inline-block;padding:12px 24px;background-color:#0A2B1D;color:#ffffff;text-decoration:none;border-radius:4px;">Configurar mi cuenta</a>
                                <p>Si no esperabas este correo, puedes ignorarlo.</p>
                            `
                        })
                    });
                    if (!res.ok) {
                        console.error('Error sending email:', await res.text());
                    }
                }

                responseData = { success: true, message: 'Invitación enviada exitosamente' };
                break;

            case 'ban_user':
                const { target_user_id, is_banned } = payload;
                if (!target_user_id) throw new Error('Missing target_user_id');

                if (target_user_id === user.id) {
                    throw new Error('No puedes banearte a ti mismo');
                }

                const banDuration = is_banned ? '876000h' : 'none';
                
                const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(
                    target_user_id,
                    { ban_duration: banDuration }
                );

                if (banError) throw banError;
                
                // If banning, sign them out immediately
                if (is_banned) {
                    await supabaseAdmin.auth.admin.signOut(target_user_id);
                }

                responseData = { success: true, message: `Usuario ${is_banned ? 'baneado' : 'desbaneado'}` };
                break;

            case 'sign_out_user':
                const { uid } = payload;
                if (!uid) throw new Error('Missing uid');
                
                const { error: signOutError } = await supabaseAdmin.auth.admin.signOut(uid);
                if (signOutError) throw signOutError;

                responseData = { success: true, message: 'Sesiones invalidadas' };
                break;

            default:
                throw new Error('Unknown action');
        }

        return new Response(JSON.stringify(responseData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error: any) {
        console.error('Error:', error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
