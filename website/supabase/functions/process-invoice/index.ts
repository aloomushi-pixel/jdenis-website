import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReqData {
  requestId: string;
  pdfMode: 'file' | 'url';
  pdfSource: string; // bucket path or URL
  xmlMode: 'file' | 'url';
  xmlSource: string; // bucket path or URL
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const rescendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!rescendApiKey) {
      throw new Error("RESEND_API_KEY is missing");
    }

    const { requestId, pdfMode, pdfSource, xmlMode, xmlSource } = await req.json() as ReqData;

    if (!requestId) {
      throw new Error("Solicitud sin requestId");
    }

    // Obtener información de la solicitud
    const { data: requestRecord, error: reqError } = await supabaseClient
      .from('invoice_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (reqError || !requestRecord) {
      throw new Error(`Error buscando solicitud: ${reqError?.message}`);
    }

    const { email, ticket_number: ticketNumber } = requestRecord;

    // Helper to get file buffer
    const getFileBuffer = async (mode: 'file' | 'url', source: string) => {
      let arrayBuffer: ArrayBuffer;
      if (mode === 'url') {
        const response = await fetch(source);
        if (!response.ok) throw new Error(`Could not fetch URL: ${source}`);
        arrayBuffer = await response.arrayBuffer();
      } else {
        // file mode means it's a storage path
        const { data, error } = await supabaseClient
          .storage
          .from('invoices')
          .download(source);
        if (error || !data) throw new Error(`Could not download storage object: ${source}`);
        arrayBuffer = await data.arrayBuffer();
      }
      return arrayBuffer;
    };

    // Prepare attachments
    const attachments = [];

    if (pdfSource) {
      const pdfBytes = await getFileBuffer(pdfMode, pdfSource);
      attachments.push({
        filename: `Factura_Ticket_${ticketNumber}.pdf`,
        content: Array.from(new Uint8Array(pdfBytes)) // Resend accepts arrays or base64
      });
    }

    if (xmlSource) {
      const xmlBytes = await getFileBuffer(xmlMode, xmlSource);
      attachments.push({
        filename: `Factura_Ticket_${ticketNumber}.xml`,
        content: Array.from(new Uint8Array(xmlBytes))
      });
    }

    // Convert attachment contents to Base64 for Resend
    // A better approach for Resend with Deno is using base64 encoding strings
    // let's map them
    const base64Attachments = attachments.map(att => ({
        filename: att.filename,
        content: btoa(String.fromCharCode.apply(null, att.content as number[])),
    }));

    // Enviar correo con Resend
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${rescendApiKey}`
      },
      body: JSON.stringify({
        from: 'J. DENIS <facturacion@jdenis.com.mx>', // You may need to verify this domain in Resend
        to: email,
        subject: `Tu Factura del Ticket ${ticketNumber} está lista`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #000;">¡Tu factura está lista!</h2>
            <p>Hola,</p>
            <p>Hemos procesado exitosamente tu solicitud de facturación. Adjunto a este correo encontrarás los archivos XML y PDF de tu comprobante fiscal correspondiente al ticket/pedido <strong>${ticketNumber}</strong>.</p>
            <p>Gracias por tu preferencia.</p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888;">Este es un mensaje automático, por favor no respondas a este correo.</p>
          </div>
        `,
        attachments: base64Attachments
      })
    });

    const resendData = await resendRes.json();
    if (!resendRes.ok) {
        console.error("Resend Error:", resendData);
        throw new Error(`Resend Error: ${JSON.stringify(resendData)}`);
    }

    // Actualizar estado en DB
    const { error: updateError } = await supabaseClient
      .from('invoice_requests')
      .update({ status: 'Realizada', updated_at: new Date().toISOString() })
      .eq('id', requestId);

    if (updateError) {
      throw new Error(`Error actualizando el estado de la factura: ${updateError.message}`);
    }

    // Opcional: Eliminar archivos temporales de almacenamiento de Supabase si se configuró en modo 'file'
    if (pdfMode === 'file') {
        const { error: delErr } = await supabaseClient.storage.from('invoices').remove([pdfSource]);
        if (delErr) console.warn("Could not cleanup temporary PDF", delErr);
    }
    if (xmlMode === 'file') {
        const { error: delErr } = await supabaseClient.storage.from('invoices').remove([xmlSource]);
        if (delErr) console.warn("Could not cleanup temporary XML", delErr);
    }

    return new Response(JSON.stringify({ success: true, message: 'Factura procesada y enviada correctamente' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error("Error en process-invoice:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
