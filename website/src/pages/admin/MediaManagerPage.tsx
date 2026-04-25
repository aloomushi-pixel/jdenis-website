import React from 'react';
import { MediaManager } from '../../components/admin/MediaManager';

export default function MediaManagerPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestor Multimedia</h1>
        <p className="text-sm text-gray-500 mt-1">Administra todas las imágenes y videos utilizados en la plataforma.</p>
      </div>
      
      <MediaManager />
    </div>
  );
}
