import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || Deno.env.get('SUPABASE_DB_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const BASE_STYLES = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #333333;
  margin: 0;
  padding: 0;
  background-color: #f9fafb;
`;

const CONTAINER_STYLES = `
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const BUTTON_STYLES = `
  display: inline-block;
  background-color: #18898F;
  color: #ffffff;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 999px;
  font-weight: 600;
  margin-top: 16px;
  text-align: center;
`;

function getAbandonedCartTemplate(customerName: string, checkoutUrl: string, productsHtml: string) {
    return `
    <div style="${BASE_STYLES} padding: 40px 20px; background-color: #fce7f3;">
        <div style="${CONTAINER_STYLES} box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-top: 6px solid #be185d;">
            <div style="background-color: white; padding: 32px; text-align: center;">
                <h1 style="color: #be185d; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">¿Dejaste algo atrás?</h1>
            </div>
            
            <div style="padding: 10px 32px; text-align: center; background-color: white;">
                <h2 style="color: #000F21; font-size: 20px; margin-top: 0; margin-bottom: 24px; font-weight: 500;">Hola ${customerName || 'visitante'}, notamos que no terminaste tu pedido en J. Denis.</h2>
                <p style="color: #4b5563; font-size: 16px; margin-bottom: 32px; line-height: 1.6;">
                    Tus artículos favoritos siguen esperándote en tu carrito. Regresa antes de que se agoten las existencias.
                </p>
                
                <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 32px; border: 1px dashed #d1d5db; text-align: left;">
                    ${productsHtml || '<p style="color: #6b7280; font-style: italic; margin: 0; text-align: center;">Tus productos están guardados con seguridad.</p>'}
                </div>
                
                <a href="${checkoutUrl}" style="${BUTTON_STYLES} background-color: #be185d; padding: 16px 40px; font-size: 18px; width: 100%; box-sizing: border-box; display: block;">Continuar mi compra</a>
            </div>
            
            <div style="background-color: #ffffff; padding: 24px; text-align: center; border-top: 1px solid #f3f4f6;">
                <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                    Este es un correo automático de tu cuenta en J. Denis.<br/>
                    © ${new Date().getFullYear()} J. Denis. Todos los derechos reservados.
                </p>
            </div>
        </div>
    </div>
    `;
}

function generateProductsHtml(cartItems: any[]) {
    if (!cartItems || cartItems.length === 0) return '';
    
    let html = '<table style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
    cartItems.slice(0, 3).forEach(item => {
        html += `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" />
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; vertical-align: top;">
                <strong style="display: block; font-size: 16px; color: #111827;">${item.name}</strong>
                <span style="color: #6b7280; font-size: 14px;">Cantidad: ${item.quantity}</span>
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; vertical-align: top; text-align: right;">
                <strong style="font-size: 16px; color: #111827;">$${item.price.toFixed(2)}</strong>
            </td>
        </tr>
        `;
    });
    
    if (cartItems.length > 3) {
        html += `
        <tr>
            <td colspan="3" style="padding: 12px 0; text-align: center; color: #6b7280; font-size: 14px;">
                + ${cartItems.length - 3} artículos adicionales
            </td>
        </tr>
        `;
    }
    html += '</table>';
    return html;
}

Deno.serve(async (req: Request) => {
    try {
        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error('Missing Supabase variables');
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        
        // Target: active carts older than 2 hours that haven't been emailed yet
        // For testing, we might want a shorter interval, but 2 hours is standard.
        const twoHoursAgo = new Date();
        twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

        const { data: carts, error: dbError } = await supabase
            .from('abandoned_carts')
            .select('*')
            .eq('status', 'active')
            .lt('last_updated', twoHoursAgo.toISOString())
            .limit(50); // limit to process in batches

        if (dbError) throw dbError;

        if (!carts || carts.length === 0) {
            return new Response(JSON.stringify({ message: "No abandoned carts found", processed: 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        let sentCount = 0;
        let failedCount = 0;

        for (const cart of carts) {
            const items = cart.cart_state || [];
            if (items.length === 0) {
                // Cart is empty, just mark as abandoned so we ignore it
                await supabase.from('abandoned_carts').update({ status: 'abandoned' }).eq('id', cart.id);
                continue;
            }

            const productsHtml = generateProductsHtml(items);
            const htmlContent = getAbandonedCartTemplate(cart.name, 'https://jdenis.store/checkout', productsHtml);

            // Send via Resend
            if (RESEND_API_KEY) {
                const res = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': \`Bearer \${RESEND_API_KEY}\`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: "J. Denis <ventas@jdenis.store>",
                        to: [cart.email],
                        subject: "¿Olvidaste algo en J. Denis?",
                        html: htmlContent
                    })
                });

                if (res.ok) {
                    await supabase.from('abandoned_carts').update({ status: 'abandoned' }).eq('id', cart.id);
                    sentCount++;
                } else {
                    console.error('Failed to send to', cart.email, await res.text());
                    failedCount++;
                }
            } else {
                // Dummy mode if Resend is not configured: just mark abandoned
                console.log('Simulating email to', cart.email);
                await supabase.from('abandoned_carts').update({ status: 'abandoned' }).eq('id', cart.id);
                sentCount++;
            }
        }

        return new Response(JSON.stringify({ 
            message: "Finished processing abandoned carts", 
            processed: carts.length,
            sent: sentCount,
            failed: failedCount
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
});
