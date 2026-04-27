import { useEffect } from 'react';
import { X } from 'lucide-react';
import { MediaManager } from './MediaManager';

interface MediaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function MediaManagerModal({ isOpen, onClose, onSelect }: MediaManagerModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (url: string) => {
    onSelect(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-full max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Seleccionar Archivo Multimedia</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-red-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden bg-gray-50 p-4">
          <MediaManager isModal={true} onSelect={handleSelect} />
        </div>
      </div>
    </div>
  );
}
