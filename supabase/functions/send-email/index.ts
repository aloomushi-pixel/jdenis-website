import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
    type: 'contact' | 'distributor';
    name: string;
    email: string;
    phone?: string;
    message?: string;
    business_name?: string;
    city?: string;
    state?: string;
}

Deno.serve(async (req: Request) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        if (!RESEND_API_KEY) {
            throw new Error("Missing RESEND_API_KEY environment variable. Please configure it in Supabase secrets.");
        }

        const payload: EmailRequest = await req.json();

        let subject = '';
        let htmlContent = '';

        if (payload.type === 'contact') {
            subject = `Nuevo mensaje de contacto de: ${payload.name}`;
            htmlContent = `
            <h2>Nuevo Mensaje de Contacto web</h2>
            <p><strong>Nombre:</strong> ${payload.name}</p>
            <p><strong>Email:</strong> ${payload.email}</p>
            <p><strong>Teléfono:</strong> ${payload.phone || 'N/A'}</p>
            <p><strong>Mensaje:</strong><br/>${payload.message || 'N/A'}</p>
        `;
        } else if (payload.type === 'distributor') {
            subject = `Nueva solicitud de distribuidor: ${payload.name}`;
            htmlContent = `
            <h2>Nueva Solicitud de Distribuidor</h2>
            <p><strong>Nombre:</strong> ${payload.name}</p>
            <p><strong>Email:</strong> ${payload.email}</p>
            <p><strong>Teléfono:</strong> ${payload.phone}</p>
            <p><strong>Negocio:</strong> ${payload.business_name || 'N/A'}</p>
            <p><strong>Ubicación:</strong> ${payload.city || 'N/A'}, ${payload.state || 'N/A'}</p>
            <p><strong>Mensaje adicional:</strong><br/>${payload.message || 'N/A'}</p>
        `;
        } else {
            throw new Error("Invalid request type. Must be 'contact' or 'distributor'");
        }

        // Attempt to send email via Resend REST API
        const resendRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                // IMPORTANTE: Para usar 'notificaciones@jdenis.com', el dominio jdenis.com DEBE estar verificado en Resend.
                // Si la cuenta de Resend es nueva y no está verificada, solo funcionará si usas una dirección verificada o el 'onboarding@resend.dev'
                from: 'J. Denis Notificaciones <onboarding@resend.dev>',
                to: ['soporte@jdenis.com', 'caballeroangela49@gmail.com'], // Envíamos a soporte y al admin
                subject: subject,
                html: htmlContent,
            }),
        });

        const data = await resendRes.json();

        if (!resendRes.ok) {
            console.error("Resend API error:", data);
            throw new Error(data.message || "Failed to send email via Resend");
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error("Edge function error:", error.stack || error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
