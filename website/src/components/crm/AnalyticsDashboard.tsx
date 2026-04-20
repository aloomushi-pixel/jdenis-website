import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';

const dataHot = [
  { name: 'Adhesivo Quirúr.', ventas: 120 },
  { name: 'Pestañas Curva D', ventas: 98 },
  { name: 'Microbrushes', ventas: 86 },
  { name: 'Primer Prep.', ventas: 75 },
  { name: 'Kit Lifting', ventas: 64 },
];

const dataSlow = [
  { name: 'Pinzas Curvas', ventas: 12 },
  { name: 'Parches Hidrogel', ventas: 8 },
  { name: 'Removedor Gel', ventas: 5 },
];

const COLORS = ['#D4AF37', '#e8c962', '#1a1a2e', '#4b5563', '#9ca3af'];

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat icon={<DollarSign/>} label="Ventas Totales (Mes)" value="$125,430" trend="+14%" up />
        <Stat icon={<Target/>} label="Cotizaciones Emitidas" value="48" trend="+5%" up />
        <Stat icon={<TrendingUp/>} label="Conversión a Venta" value="68%" trend="-2%" up={false} />
        <Stat icon={<Users/>} label="Nuevos Clientes (B2B)" value="12" trend="+3" up />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-serif text-lg text-slate-800 mb-6">Top 5: Productos Más Vendidos</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={dataHot} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 500}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="ventas" radius={[0, 4, 4, 0]} barSize={24}>
                  {dataHot.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-serif text-lg text-slate-800 mb-6">Alerta Lenta Rotación (Slow Movers)</h3>
          <div className="flex-1 space-y-4">
            {dataSlow.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <h4 className="font-medium text-slate-700">{item.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">Sólo {item.ventas} unidades este mes.</p>
                </div>
                <button className="bg-navy text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                  Crear Promo
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center mt-4">Usa estos insights para elaborar paquetes o descuentos.</p>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, trend, up }: { icon: React.ReactNode, label: string, value: string, trend: string, up: boolean }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-800 my-0.5">{value}</p>
        <p className={`text-xs font-bold ${up ? 'text-emerald-500' : 'text-red-500'}`}>{trend}</p>
      </div>
    </div>
  );
}
