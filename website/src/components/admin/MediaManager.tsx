import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Trash2, Copy, Image as ImageIcon, CheckCircle, RefreshCw } from 'lucide-react';

// URL del servidor de medios en el VPS
const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || 'https://media.jdenis.store';

interface MediaFile {
  name: string;
  url: string;
  size: number;
  createdAt?: string;
}

interface MediaManagerProps {
  onSelect?: (url: string) => void;
  isModal?: boolean;
}

export function MediaManager({ onSelect, isModal = false }: MediaManagerProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${MEDIA_URL}/api/files`);
      if (!response.ok) {
        throw new Error('Error al cargar los archivos. Verifica que media.jdenis.store apunte al VPS.');
      }
      
      const data = await response.json();
      setFiles(data.files || []);
    } catch (err: any) {
      setError(err.message || 'Error de conexión con el servidor de medios.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('files', selectedFiles[i]);
      }

      const response = await fetch(`${MEDIA_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al subir los archivos');

      await fetchFiles(); // Refrescar la lista
    } catch (err: any) {
      setError(err.message || 'Error al subir los archivos');
    } finally {
      setUploading(false);
      // Limpiar el input
      event.target.value = '';
    }
  };

  const handleDelete = async (filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`¿Estás seguro de que deseas eliminar ${filename}? Esta acción no se puede deshacer y romperá los enlaces donde se esté utilizando.`)) return;

    try {
      setError(null);
      const response = await fetch(`${MEDIA_URL}/api/files/${filename}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar el archivo');

      // Actualizar estado local
      setFiles(files.filter(f => f.name !== filename));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el archivo');
    }
  };

  const handleCopyUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const fullUrl = url.startsWith('http') ? url : `${MEDIA_URL}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(fullUrl);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleFileClick = (file: MediaFile) => {
    if (onSelect) {
      const fullUrl = file.url.startsWith('http') ? file.url : `${MEDIA_URL}${file.url}`;
      onSelect(fullUrl);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${isModal ? 'h-[70vh]' : 'h-[calc(100vh-12rem)]'}`}>
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-[#0b1f3d]" />
          Gestor Multimedia VPS
        </h2>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchFiles}
            className="p-2 text-gray-500 hover:text-[#0b1f3d] hover:bg-gray-100 rounded-lg transition-colors"
            title="Refrescar"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*,video/*,application/pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <button className={`flex items-center gap-2 px-4 py-2 bg-[#0b1f3d] text-white rounded-lg hover:bg-[#1a365d] transition-colors ${uploading ? 'opacity-70 cursor-wait' : ''}`}>
              <Upload className="w-4 h-4" />
              {uploading ? 'Subiendo...' : 'Subir Archivos'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="m-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loading && files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mb-2 text-[#0b1f3d]" />
            <p>Cargando biblioteca multimedia...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-white p-8">
            <ImageIcon className="w-12 h-12 mb-3 text-gray-300" />
            <p className="text-lg font-medium text-gray-600">No hay archivos multimedia</p>
            <p className="text-sm mt-1">Sube imágenes o videos para comenzar</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {files.map((file) => {
              const fullUrl = file.url.startsWith('http') ? file.url : `${MEDIA_URL}${file.url}`;
              const isImage = file.name.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);
              
              return (
                <div 
                  key={file.name}
                  onClick={() => handleFileClick(file)}
                  className={`group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#d4af37] hover:shadow-md transition-all ${onSelect ? 'cursor-pointer' : ''}`}
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    {isImage ? (
                      <img 
                        src={fullUrl} 
                        alt={file.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-xs font-medium uppercase">{file.name.split('.').pop()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-700 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {formatSize(file.size)}
                    </p>
                  </div>

                  {/* Actions overlay */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => handleDelete(file.name, e)}
                      className="p-1.5 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => handleCopyUrl(fullUrl, e)}
                      className="p-1.5 bg-white text-gray-700 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                      title="Copiar URL"
                    >
                      {copiedUrl === fullUrl ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
