import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      businessName,
      rfc,
      postalCode,
      taxRegime,
      cfdiUse,
      email,
      ticketNumber,
    } = body;

    // Basic validation
    if (!businessName || !rfc || !postalCode || !taxRegime || !cfdiUse || !email || !ticketNumber) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios.' },
        { status: 400 }
      );
    }

    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);

    const stmt = db.prepare(`
      INSERT INTO InvoiceRequest 
      (id, businessName, rfc, postalCode, taxRegime, cfdiUse, email, ticketNumber, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    stmt.run(
      id,
      businessName,
      rfc,
      postalCode,
      taxRegime,
      cfdiUse,
      email,
      ticketNumber,
      'Pendiente'
    );

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error('Error procesando solicitud de factura:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar la solicitud.' },
      { status: 500 }
    );
  }
}
