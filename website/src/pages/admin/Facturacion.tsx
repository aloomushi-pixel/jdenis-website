import React, { useState, useEffect } from 'react';
import { Mail, Hash, MapPin, Calendar, CheckCircle2, Link as LinkIcon, Send, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type InputMode = 'file' | 'url';

interface RequestRecord {
  id: string;
  business_name: string;
  rfc: string;
  postal_code: string;
  tax_regime: string;
  cfdi_use: string;
  email: string;
  ticket_number: string;
  status: string;
  created_at: string;
}

function UploadForm({ req, onProcessed }: { req: RequestRecord, onProcessed: () => void }) {
  const [pdfMode, setPdfMode] = useState<InputMode>('file');
  const [xmlMode, setXmlMode] = useState<InputMode>('file');

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [pdfUrlInput, setPdfUrlInput] = useState('');
  const [xmlUrlInput, setXmlUrlInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if ((pdfMode === 'file' && !pdfFile) || (pdfMode === 'url' && !pdfUrlInput)) {
        throw new Error('Debes proporcionar el archivo o la URL del PDF.');
      }
      if ((xmlMode === 'file' && !xmlFile) || (xmlMode === 'url' && !xmlUrlInput)) {
        throw new Error('Debes proporcionar el archivo o la URL del XML.');
      }

      let pdfSource = pdfUrlInput;
      let xmlSource = xmlUrlInput;

      // Upload to supabase storage if it's a file
      if (pdfMode === 'file' && pdfFile) {
        const filePath = `temp/${req.id}/${pdfFile.name}`;
        const { error: uploadErr } = await supabase.storage.from('invoices').upload(filePath, pdfFile, { upsert: true });
        if (uploadErr) throw new Error(`Error subiendo PDF: ${uploadErr.message}`);
        pdfSource = filePath;
      }

      if (xmlMode === 'file' && xmlFile) {
        const filePath = `temp/${req.id}/${xmlFile.name}`;
        const { error: uploadErr } = await supabase.storage.from('invoices').upload(filePath, xmlFile, { upsert: true });
        if (uploadErr) throw new Error(`Error subiendo XML: ${uploadErr.message}`);
        xmlSource = filePath;
      }

      // Call Edge Function
      const { data, error: fnError } = await supabase.functions.invoke('process-invoice', {
        body: {
          requestId: req.id,
          pdfMode,
          pdfSource,
          xmlMode,
          xmlSource
        }
      });

      if (fnError || data?.error) {
        throw new Error(`Error en Edge Function: ${fnError?.message || data?.error}`);
      }

      window.alert('Factura procesada y enviada correctamente');
      onProcessed();

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Input */}
        <div className="space-y-3 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900 border-b-2 border-red-500 pb-1">Archivo PDF</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setPdfMode('file')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${pdfMode === 'file' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Subir
              </button>
              <button
                type="button"
                onClick={() => setPdfMode('url')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${pdfMode === 'url' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                URL
              </button>
            </div>
          </div>

          <div className="mt-3">
            {pdfMode === 'file' ? (
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 transition-all cursor-pointer"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/factura.pdf"
                  required
                  value={pdfUrlInput}
                  onChange={(e) => setPdfUrlInput(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all"
                />
              </div>
            )}
          </div>
        </div>

        {/* XML Input */}
        <div className="space-y-3 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900 border-b-2 border-blue-500 pb-1">Archivo XML</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setXmlMode('file')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${xmlMode === 'file' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Subir
              </button>
              <button
                type="button"
                onClick={() => setXmlMode('url')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${xmlMode === 'url' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                URL
              </button>
            </div>
          </div>

          <div className="mt-3">
            {xmlMode === 'file' ? (
              <div className="relative">
                <input
                  type="file"
                  accept=".xml"
                  required
                  onChange={(e) => setXmlFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/factura.xml"
                  required
                  value={xmlUrlInput}
                  onChange={(e) => setXmlUrlInput(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Procesando...</>
          ) : (
            <><Send className="w-4 h-4" /> Enviar Factura y Finalizar</>
          )}
        </button>
      </div>
    </form>
  );
}

export default function FacturacionAdmin() {
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('invoice_requests')
      .select('*')
      .eq('status', 'Pendiente')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error(error);
      window.alert('Error cargando solicitudes pendientes');
    } else if (data) {
      setRequests(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
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

      {loading ? (
        <div className="flex justify-center p-12">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
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
                        <h3 className="text-lg font-bold text-gray-900">{req.business_name}</h3>
                        <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          {req.rfc}
                        </span>
                      </div>
                      <div className="flex flex-wrap text-sm text-gray-500 gap-x-4 gap-y-2 mt-2">
                        <span className="flex items-center gap-1.5"><Hash className="w-4 h-4"/>TKT: {req.ticket_number}</span>
                        <span className="flex items-center gap-1.5"><Mail className="w-4 h-4"/>{req.email}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/>CP: {req.postal_code}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/>
                          {new Date(req.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
                    <div>
                      <span className="block text-gray-500 text-xs mb-1 uppercase tracking-wider font-semibold">Régimen Fiscal</span>
                      <span className="font-medium text-gray-900">{req.tax_regime}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs mb-1 uppercase tracking-wider font-semibold">Uso CFDI</span>
                      <span className="font-medium text-gray-900">{req.cfdi_use}</span>
                    </div>
                  </div>
                </div>

                {/* Upload Section */}
                <div className="bg-gray-50/50 p-6 border-t border-gray-100">
                   <UploadForm req={req} onProcessed={fetchRequests} />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
