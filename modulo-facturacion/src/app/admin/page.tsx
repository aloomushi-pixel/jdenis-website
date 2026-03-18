import db from '@/lib/db';
import { UploadForm } from '@/components/UploadForm';
import { Mail, Hash, Building2, MapPin, FileText, Calendar, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getPendingRequests() {
  const stmt = db.prepare('SELECT * FROM InvoiceRequest WHERE status = ? ORDER BY createdAt ASC');
  return stmt.all('Pendiente') as any[];
}

export default async function AdminDashboard() {
  const requests = await getPendingRequests();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Facturación</h1>
            <p className="text-gray-500 mt-1">Gestión de solicitudes pendientes de clientes</p>
          </div>
          <div className="bg-orange-100 text-orange-700 font-semibold px-4 py-2 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            {requests.length} Pendiente{requests.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="space-y-6">
          {requests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Todo al día</h3>
              <p className="text-gray-500 mt-2">No tienes solicitudes de factura pendientes por enviar.</p>
            </div>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div className="p-6 border-b border-gray-50">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">{req.businessName}</h3>
                        <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          {req.rfc}
                        </span>
                      </div>
                      <div className="flex flex-wrap text-sm text-gray-500 gap-x-4 gap-y-2 mt-2">
                        <span className="flex items-center gap-1.5"><Hash className="w-4 h-4"/>TKT: {req.ticketNumber}</span>
                        <span className="flex items-center gap-1.5"><Mail className="w-4 h-4"/>{req.email}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/>CP: {req.postalCode}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/>
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
                    <div>
                      <span className="block text-gray-500 text-xs mb-1 uppercase tracking-wider font-semibold">Régimen Fiscal</span>
                      <span className="font-medium text-gray-900">{req.taxRegime}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs mb-1 uppercase tracking-wider font-semibold">Uso CFDI</span>
                      <span className="font-medium text-gray-900">{req.cfdiUse}</span>
                    </div>
                  </div>
                </div>

                {/* Upload Section */}
                <div className="bg-gray-50/50 p-6 border-t border-gray-100">
                   <UploadForm requestId={req.id} email={req.email} ticketNumber={req.ticketNumber} />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

// Ensure lucide icon checkcircle is imported 
import { CheckCircle2 } from 'lucide-react';
