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
 * Modern J.Denis template inspired by Stitch layout.
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
