import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Trash2, Copy, Image as ImageIcon, CheckCircle, RefreshCw, FolderOpen } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MediaFile {
  name: string;
  path: string;
  bucket: string;
  url: string;
  size: number;
  createdAt?: string;
}

interface MediaManagerProps {
  onSelect?: (url: string) => void;
  isModal?: boolean;
}

const BUCKETS = [
  { id: 'media-library', label: 'Biblioteca General' },
  { id: 'blog-images', label: 'Blog y Noticias' },
  { id: 'academy-images', label: 'Academia' },
  { id: 'reels', label: 'Reels / Videos' },
] as const;

export function MediaManager({ onSelect, isModal = false }: MediaManagerProps) {
  const [activeBucket, setActiveBucket] = useState<string>('media-library');
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: rootItems, error: listErr } = await supabase.storage
        .from(activeBucket)
        .list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });

      if (listErr) throw listErr;

      const resolved: MediaFile[] = [];

      for (const item of rootItems || []) {
        if (item.name === '.emptyFolderPlaceholder') continue;
        // If item has no id/metadata, it may be a subfolder (e.g. 'courses' in academy-images)
        if (!item.id) {
          const { data: subItems } = await supabase.storage
            .from(activeBucket)
            .list(item.name, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
          for (const sub of subItems || []) {
            if (!sub.id || sub.name === '.emptyFolderPlaceholder') continue;
            const fullPath = `${item.name}/${sub.name}`;
            const { data: pub } = supabase.storage.from(activeBucket).getPublicUrl(fullPath);
            resolved.push({
              name: sub.name,
              path: fullPath,
              bucket: activeBucket,
              url: pub.publicUrl,
              size: Number((sub.metadata as Record<string, unknown>)?.size || 0),
              createdAt: sub.created_at,
            });
          }
        } else {
          const { data: pub } = supabase.storage.from(activeBucket).getPublicUrl(item.name);
          resolved.push({
            name: item.name,
            path: item.name,
            bucket: activeBucket,
            url: pub.publicUrl,
            size: Number((item.metadata as Record<string, unknown>)?.size || 0),
            createdAt: item.created_at,
          });
        }
      }

      setFiles(resolved);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar la biblioteca multimedia.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [activeBucket]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    try {
      setUploading(true);
      setError(null);

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = `${Date.now()}_${safeName}`;
        const { error: uploadErr } = await supabase.storage
          .from(activeBucket)
          .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (uploadErr) throw uploadErr;
      }

      await fetchFiles();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir los archivos';
      setError(msg);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDelete = async (file: MediaFile, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`¿Estás seguro de que deseas eliminar ${file.name}? Esta acción no se puede deshacer.`)) return;

    try {
      setError(null);
      const { error: delErr } = await supabase.storage
        .from(file.bucket)
        .remove([file.path]);

      if (delErr) throw delErr;

      setFiles(prev => prev.filter(f => f.path !== file.path));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar el archivo';
      setError(msg);
    }
  };

  const handleCopyUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleFileClick = (file: MediaFile) => {
    if (onSelect) {
      onSelect(file.url);
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '—';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${isModal ? 'h-[70vh]' : 'h-[calc(100vh-12rem)]'}`}>
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#0b1f3d]" />
            Gestor Multimedia Cloud
          </h2>
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-gray-200">
            {BUCKETS.map(b => (
              <button
                key={b.id}
                type="button"
                onClick={() => setActiveBucket(b.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                  activeBucket === b.id
                    ? 'bg-[#0b1f3d] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
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
            <button
              type="button"
              className={`flex items-center gap-2 px-4 py-2 bg-[#0b1f3d] text-white rounded-lg hover:bg-[#1a365d] transition-colors text-sm font-medium ${uploading ? 'opacity-70 cursor-wait' : ''}`}
            >
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
            <p className="text-lg font-medium text-gray-600">No hay archivos en esta carpeta</p>
            <p className="text-sm mt-1">Sube imágenes, videos o documentos PDF para comenzar</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {files.map((file) => {
              const isImage = /\.(jpeg|jpg|gif|png|webp|svg|avif)$/i.test(file.name);

              return (
                <div
                  key={file.path}
                  onClick={() => handleFileClick(file)}
                  className={`group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#d4af37] hover:shadow-md transition-all ${onSelect ? 'cursor-pointer' : ''}`}
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    {isImage ? (
                      <img
                        src={file.url}
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

                  <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(file, e)}
                      className="p-1.5 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleCopyUrl(file.url, e)}
                      className="p-1.5 bg-white text-gray-700 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                      title="Copiar URL"
                    >
                      {copiedUrl === file.url ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
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
