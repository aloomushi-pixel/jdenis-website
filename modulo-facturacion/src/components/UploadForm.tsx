'use client';

import React, { useState } from 'react';
import { FileUp, Link as LinkIcon, Send, RefreshCw } from 'lucide-react';

interface UploadFormProps {
  requestId: string;
  email: string;
  ticketNumber: string;
}

type InputMode = 'file' | 'url';

export function UploadForm({ requestId, email, ticketNumber }: UploadFormProps) {
  const [pdfMode, setPdfMode] = useState<InputMode>('file');
  const [xmlMode, setXmlMode] = useState<InputMode>('file');

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [xmlUrl, setXmlUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [etherealUrl, setEtherealUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if ((pdfMode === 'file' && !pdfFile) && (pdfMode === 'url' && !pdfUrl)) {
        throw new Error('Debes proporcionar el archivo o la URL del PDF.');
      }
      if ((xmlMode === 'file' && !xmlFile) && (xmlMode === 'url' && !xmlUrl)) {
        throw new Error('Debes proporcionar el archivo o la URL del XML.');
      }

      const formData = new FormData();
      formData.append('requestId', requestId);
      formData.append('email', email);
      formData.append('ticketNumber', ticketNumber);

      formData.append('pdfMode', pdfMode);
      if (pdfMode === 'file' && pdfFile) formData.append('pdfFile', pdfFile);
      if (pdfMode === 'url') formData.append('pdfUrl', pdfUrl);

      formData.append('xmlMode', xmlMode);
      if (xmlMode === 'file' && xmlFile) formData.append('xmlFile', xmlFile);
      if (xmlMode === 'url') formData.append('xmlUrl', xmlUrl);

      const res = await fetch('/api/admin/process', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar la factura');
      }

      setSuccess(true);
      if (data.infoUrl) {
        setEtherealUrl(data.infoUrl);
      }
      
      // Reload page to refresh pending requests
      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Error inesperado.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center space-y-3">
        <div className="text-green-800 font-bold text-lg">¡Factura enviada con éxito!</div>
        <div className="text-green-700 text-sm">El estado se actualizó a "Realizada". La página se recargará en breve.</div>
        {etherealUrl && (
          <a
            href={etherealUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition"
          >
            Ver correo en Ethereal
          </a>
        )}
      </div>
    );
  }

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
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
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
                  value={xmlUrl}
                  onChange={(e) => setXmlUrl(e.target.value)}
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
          className={`flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
