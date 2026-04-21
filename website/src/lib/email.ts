import { supabase } from './supabase';

export interface EmailCampaign {
    id: string;
    subject: string;
    body_html: string;
    status: 'draft' | 'sending' | 'completed' | 'failed';
    sent_by: string;
    recipient_type: 'all_subscribers' | 'single_customer';
    target_email?: string;
    sent_at: string;
    created_at: string;
}

/**
 * Triggers the Supabase Edge Function to send emails via Resend.
 * @param subject Email subject
 * @param htmlContent Email body in HTML format
 * @param recipientType 'all_subscribers' or 'single_customer'
 * @param targetEmail Email address if sending to a single customer
 */
export async function dispatchEmailCampaign(
    subject: string,
    htmlContent: string,
    recipientType: 'all_subscribers' | 'single_customer',
    targetEmail?: string
) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (!session || sessionError) {
        throw new Error('Authentication required to send emails.');
    }

    // Step 1: Trigger Edge Function
    const { data: fnData, error: fnError } = await supabase.functions.invoke('send-email', {
        body: { subject, htmlContent, recipientType, targetEmail },
        headers: {
            Authorization: `Bearer ${session.access_token}`
        }
    });

    if (fnError) {
        console.error('Edge Function Error:', fnError);
        throw new Error(fnError.message || 'Error occurred while contacting email server.');
    }

    // Step 2: Log to DB
    const { error: dbError } = await supabase.from('email_campaigns').insert({
        subject,
        body_html: htmlContent,
        recipient_type: recipientType,
        target_email: targetEmail,
        status: fnData?.status === 'simulated' ? 'completed (simulated)' : 'completed',
        sent_by: session.user.id
    });

    if (dbError) {
        console.error('Campaign log error:', dbError);
        // Do not throw, email was already assigned
    }

    return fnData;
}

export async function fetchCampaignHistory() {
    const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as EmailCampaign[];
}

// ==========================================
// EMAIL TEMPLATES
// ==========================================

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

/**
 * Modern J.Denis template inspired by Stitch layout - PRODUCT LAUNCH
 */
export function getProductLaunchTemplate(title: string, headline: string, bodyText: string, imageUrl: string, buttonText: string, buttonUrl: string) {
    return `
    <div style="${BASE_STYLES} padding: 40px 20px;">
        <div style="${CONTAINER_STYLES}">
            <div style="background-color: #000F21; padding: 24px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">J. DENIS</h1>
            </div>
            
            ${imageUrl ? `<img src="${imageUrl}" alt="${title}" style="width: 100%; height: auto; display: block;" />` : ''}
            
            <div style="padding: 32px; text-align: center;">
                <h2 style="color: #000F21; font-size: 24px; margin-top: 0; margin-bottom: 16px;">${headline}</h2>
                <p style="color: #4b5563; font-size: 16px; margin-bottom: 24px; white-space: pre-wrap;">${bodyText}</p>
                
                ${buttonText && buttonUrl ? `<a href="${buttonUrl}" style="${BUTTON_STYLES}">${buttonText}</a>` : ''}
            </div>
            
            <div style="background-color: #f3f4f6; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 12px; margin: 0;">
                    Recibes este correo porque te suscribiste al newsletter de J. Denis.<br/>
                    © ${new Date().getFullYear()} J. Denis. Todos los derechos reservados.
                </p>
            </div>
        </div>
    </div>
    `;
}

/**
 * Modern J.Denis template inspired by Stitch layout - PROMO/SALE
 */
export function getPromoTemplate(title: string, headline: string, bodyText: string, imageUrl: string, buttonText: string, buttonUrl: string) {
    return `
    <div style="${BASE_STYLES} padding: 40px 20px; background-color: #000F21;">
        <div style="${CONTAINER_STYLES} box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
            <div style="background-color: #18898F; padding: 24px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 2px;">OFERTA EXCLUSIVA</h1>
            </div>
            
            ${imageUrl ? `<img src="${imageUrl}" alt="${title}" style="width: 100%; height: auto; display: block; border-bottom: 4px solid #000F21;" />` : ''}
            
            <div style="padding: 40px 32px; text-align: center; background-color: white;">
                <span style="display: inline-block; padding: 4px 12px; background-color: #fce7f3; color: #be185d; border-radius: 999px; font-weight: bold; font-size: 14px; margin-bottom: 16px; text-transform: uppercase;">${title}</span>
                <h2 style="color: #000F21; font-size: 28px; margin-top: 0; margin-bottom: 16px; font-weight: 800;">${headline}</h2>
                <p style="color: #374151; font-size: 18px; margin-bottom: 32px; white-space: pre-wrap; line-height: 1.8;">${bodyText}</p>
                
                ${buttonText && buttonUrl ? `<a href="${buttonUrl}" style="${BUTTON_STYLES} font-size: 18px; padding: 16px 32px; background-color: #000F21;">${buttonText}</a>` : ''}
            </div>
            
            <div style="background-color: #111827; padding: 24px; text-align: center;">
                <img src="https://jdenis.store/logo-blanco.png" alt="J. Denis" style="height: 30px; margin-bottom: 16px; opacity: 0.5;" onerror="this.style.display='none'"/>
                <p style="color: #6b7280; font-size: 12px; margin: 0;">
                    Recibes esta promoción porque eres un cliente VIP de J. Denis.<br/>
                    © ${new Date().getFullYear()} J. Denis. Todos los derechos reservados.
                </p>
            </div>
        </div>
    </div>
    `;
}

/**
 * Modern J.Denis template inspired by Stitch layout - NEWSLETTER/INFORMATIVE
 */
export function getNewsletterTemplate(title: string, headline: string, bodyText: string, imageUrl: string, buttonText: string, buttonUrl: string) {
    return `
    <div style="${BASE_STYLES} padding: 40px 20px;">
        <div style="${CONTAINER_STYLES} border-top: 6px solid #18898F;">
            <div style="padding: 32px 32px 16px 32px; text-align: left;">
                <h1 style="color: #000F21; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 1px;">J. DENIS <span style="color: #18898F; font-weight: 400;">/ BOLETÍN ESPACIAL</span></h1>
            </div>
            
            <div style="padding: 0 32px 24px 32px; text-align: left;">
                <h2 style="color: #111827; font-size: 32px; margin-top: 16px; margin-bottom: 8px; line-height: 1.2;">${headline}</h2>
                <p style="color: #6b7280; font-size: 14px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">${title}</p>
            </div>

            ${imageUrl ? `
            <div style="padding: 0 32px;">
                <img src="${imageUrl}" alt="${title}" style="width: 100%; height: auto; border-radius: 12px; display: block;" />
            </div>
            ` : ''}
            
            <div style="padding: 32px; text-align: left;">
                <div style="color: #4b5563; font-size: 16px; margin-bottom: 32px; white-space: pre-wrap; line-height: 1.8;">${bodyText}</div>
                
                ${buttonText && buttonUrl ? `
                <div style="text-align: center;">
                    <a href="${buttonUrl}" style="${BUTTON_STYLES} background-color: white; color: #18898F; border: 2px solid #18898F; padding: 14px 40px;">${buttonText}</a>
                </div>
                ` : ''}
            </div>
            
            <div style="background-color: #f3f4f6; padding: 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                    Enviado con ♥ por el equipo de J. Denis.<br/>
                    Si ya no deseas recibir estos correos, puedes gestionar tus preferencias en tu cuenta.
                </p>
            </div>
        </div>
    </div>
    `;
}

/**
 * Template for 1-on-1 customer support.
 */
export function getCustomerSupportTemplate(customerName: string, replyText: string) {
    return `
    <div style="${BASE_STYLES} padding: 40px 20px;">
        <div style="${CONTAINER_STYLES} padding: 32px;">
            <div style="margin-bottom: 24px;">
                <strong style="color: #18898F; font-size: 20px;">J. DENIS <span style="color: #9ca3af; font-weight: 400; font-size: 16px;">Soporte</span></strong>
            </div>

            <p style="font-size: 16px;">Hola <strong>${customerName || 'Cliente'}</strong>,</p>
            
            <div style="font-size: 16px; color: #374151; white-space: pre-wrap; margin: 24px 0;">
                ${replyText}
            </div>
            
            <p style="font-size: 16px; margin-top: 32px;">
                Cualquier otra duda, no dudes en respondernos directamente.<br/><br/>
                Saludos cordiales,<br/>
                <strong>El equipo de J. Denis</strong>
            </p>
        </div>
    </div>
    `;
}
