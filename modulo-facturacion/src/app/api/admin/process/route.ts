import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const requestId = formData.get('requestId') as string;
    const email = formData.get('email') as string;
    const ticketNumber = formData.get('ticketNumber') as string;

    const pdfMode = formData.get('pdfMode') as string;
    const xmlMode = formData.get('xmlMode') as string;

    if (!requestId || !email) {
      return NextResponse.json({ error: 'Faltan datos de la solicitud.' }, { status: 400 });
    }

    // Prepare attachments
    const attachments: any[] = [];

    // PDF 
    if (pdfMode === 'file') {
      const pdfFile = formData.get('pdfFile') as File;
      if (pdfFile) {
        const buffer = Buffer.from(await pdfFile.arrayBuffer());
        attachments.push({
          filename: pdfFile.name || `Factura_Ticket_${ticketNumber}.pdf`,
          content: buffer,
          contentType: 'application/pdf',
        });
      }
    } else {
      const pdfUrl = formData.get('pdfUrl') as string;
      if (pdfUrl) {
        attachments.push({
          filename: `Factura_Ticket_${ticketNumber}.pdf`,
          path: pdfUrl,
        });
      }
    }

    // XML
    if (xmlMode === 'file') {
      const xmlFile = formData.get('xmlFile') as File;
      if (xmlFile) {
        const buffer = Buffer.from(await xmlFile.arrayBuffer());
        attachments.push({
          filename: xmlFile.name || `Factura_Ticket_${ticketNumber}.xml`,
          content: buffer,
          contentType: 'application/xml',
        });
      }
    } else {
      const xmlUrl = formData.get('xmlUrl') as string;
      if (xmlUrl) {
        attachments.push({
          filename: `Factura_Ticket_${ticketNumber}.xml`,
          path: xmlUrl,
        });
      }
    }

    // Generate Ethereal test account on the fly for development
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    const mailOptions = {
        from: '"Facturación Automática" <noreply@empresa.example.com>',
        to: email,
        subject: `Tu Factura del Ticket ${ticketNumber} está lista`,
        text: `Hola, adjuntamos a este correo los archivos correspondientes a la facturación de tu ticket/pedido ${ticketNumber}.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #000;">¡Tu factura está lista!</h2>
            <p>Hola,</p>
            <p>Hemos procesado exitosamente tu solicitud. Adjunto a este correo encontrarás el archivo PDF y XML de tu factura correspondiente al ticket/pedido <strong>${ticketNumber}</strong>.</p>
            <p>Gracias por tu preferencia.</p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888;">Este es un mensaje automático, por favor no respondas a este correo.</p>
          </div>
        `,
        attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    const etherealUrl = nodemailer.getTestMessageUrl(info);

    // Update status in DB
    const stmt = db.prepare(`UPDATE InvoiceRequest SET status = 'Realizada', updatedAt = datetime('now') WHERE id = ?`);
    stmt.run(requestId);

    return NextResponse.json({ 
      success: true, 
      message: 'Factura enviada correctamente.',
      infoUrl: etherealUrl 
    });

  } catch (error: any) {
    console.error('Error in process invoice:', error);
    return NextResponse.json({ error: error.message || 'Error procesando la solicitud' }, { status: 500 });
  }
}
