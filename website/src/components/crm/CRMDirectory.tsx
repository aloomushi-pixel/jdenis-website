import { useState } from 'react';
import { MOCK_CLIENTS, type Client } from '../../lib/mockData';
import { User, Phone, Mail, AlertTriangle, Building, Search, Activity } from 'lucide-react';

export default function CRMDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = MOCK_CLIENTS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
      {/* DIRECTORY TABLE */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-sans text-slate-800">Directorio de Clientes CRM</h2>
            <p className="text-slate-500 text-sm mt-1">Gestiona leads y monitorea el estado de compra.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-semibold">
                <th className="pb-3 pl-2">Cliente</th>
                <th className="pb-3">Tipo</th>
                <th className="pb-3">Última Compra</th>
                <th className="pb-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredClients.map(client => (
                <tr 
                  key={client.id} 
                  onClick={() => setSelectedClient(client)}
                  className={`cursor-pointer transition-colors hover:bg-slate-50 ${selectedClient?.id === client.id ? 'bg-amber-50/50' : ''}`}
                >
                  <td className="py-4 pl-2">
                    <div className="font-semibold text-slate-800">{client.businessName}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{client.name}</div>
                  </td>
                  <td className="py-4">
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide">
                      {client.type}
                    </span>
                  </td>
                  <td className="py-4 text-slate-600">{new Date(client.lastPurchaseDate).toLocaleDateString()}</td>
                  <td className="py-4">
                    {client.status === 'ALERTA' ? (
                      <span className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2.5 py-1 rounded-md w-fit">
                        <AlertTriangle size={14} /> Atendido Urgente
                      </span>
                    ) : (
                      <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                        Activo
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClients.length === 0 && (
            <div className="text-center py-10 text-slate-400">No se encontraron clientes.</div>
          )}
        </div>
      </div>

      {/* 360 CLIENT PROFILE */}
      <div className="bg-navy p-6 rounded-2xl shadow-luxury text-white relative overflow-hidden flex flex-col h-[75vh]">
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl"></div>
        {selectedClient ? (
          <div className="relative z-10 flex-1 flex flex-col">
            <h3 className="text-xs uppercase tracking-widest text-gold font-bold mb-6">Perfil 360°</h3>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-gold text-2xl font-sans">
                {selectedClient.businessName.charAt(0)}{selectedClient.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-sans">{selectedClient.businessName}</h2>
                <p className="text-white/60">{selectedClient.name}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-white/80 bg-white/5 p-3 rounded-lg">
                <Phone size={16} className="text-gold" /> {selectedClient.phone}
              </div>
              <div className="flex items-center gap-3 text-white/80 bg-white/5 p-3 rounded-lg flex-wrap">
                <Mail size={16} className="text-gold" /> {selectedClient.email}
              </div>
              <div className="flex items-center gap-3 text-white/80 bg-white/5 p-3 rounded-lg">
                <Building size={16} className="text-gold" /> {selectedClient.type}
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={16} className="text-gold" />
                <h4 className="font-semibold text-sm">Notas del Ejecutivo</h4>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{selectedClient.notes}</p>
            </div>

            <button className="w-full bg-gold hover:bg-amber-400 text-navy font-bold py-3 rounded-xl transition-colors mt-auto shadow-lg">
              Registrar Actividad
            </button>
          </div>
        ) : (
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white/40 opacity-70">
            <User size={64} className="mb-4" />
            <p>Selecciona un cliente para ver su perfil completo.</p>
          </div>
        )}
      </div>
    </div>
  );
}
