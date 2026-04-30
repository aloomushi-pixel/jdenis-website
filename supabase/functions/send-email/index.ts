import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
    type: 'contact' | 'distributor' | 'quotation';
    name: string;
    email: string;
    phone?: string;
    message?: string;
    business_name?: string;
    city?: string;
    state?: string;
    quotationData?: {
        id: string;
        total: number;
        subtotal: number;
        discount: number;
        iva: number;
        items: { name: string; quantity: number; price: number }[];
        notes: string;
    };
    toEmail?: string;
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
        let toAddresses = ['soporte@jdenis.com', 'caballeroangela49@gmail.com'];

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
        } else if (payload.type === 'quotation') {
            subject = `Nueva Cotización B2B - J. Denis`;
            if (payload.toEmail) {
                toAddresses.push(payload.toEmail);
            }
            htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #0A192F;">Nueva Cotización B2B</h2>
                <p>Hola <strong>${payload.name}</strong>,</p>
                <p>Adjuntamos el resumen de su nueva cotización generada por nuestro equipo:</p>
                
                <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0;"><strong>Detalles de la cotización:</strong></p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #e2e8f0; text-align: left;">
                                <th style="padding: 8px;">Producto</th>
                                <th style="padding: 8px;">Cant.</th>
                                <th style="padding: 8px;">Precio U.</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${payload.quotationData?.items.map(item => `
                                <tr>
                                    <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.name}</td>
                                    <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
                                    <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">$${item.price.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div style="margin-top: 20px; text-align: right;">
                        <p style="margin: 5px 0;"><strong>Subtotal:</strong> $${payload.quotationData?.subtotal.toFixed(2)}</p>
                        ${payload.quotationData?.discount ? `<p style="margin: 5px 0; color: #ef4444;"><strong>Descuento:</strong> -$${payload.quotationData?.discount.toFixed(2)}</p>` : ''}
                        <p style="margin: 5px 0;"><strong>IVA (16%):</strong> $${payload.quotationData?.iva.toFixed(2)}</p>
                        <h3 style="margin: 10px 0; color: #D4AF37;">Total Final: $${payload.quotationData?.total.toFixed(2)}</h3>
                    </div>
                </div>
                
                <p style="font-size: 14px; color: #666; font-style: italic;">Notas: ${payload.quotationData?.notes}</p>
                
                <p>Si tiene alguna pregunta, no dude en contactarnos.</p>
                <p>Saludos,<br/><strong>El equipo de J. Denis</strong></p>
            </div>
        `;
        } else {
            throw new Error("Invalid request type. Must be 'contact', 'distributor', or 'quotation'");
        }

        // Attempt to send email via Resend REST API
        const resendRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'J. Denis <onboarding@resend.dev>', // Usar un dominio verificado si es posible
                to: toAddresses, 
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
