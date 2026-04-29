import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calculator, ChevronDown, Clock, CheckCircle, XCircle, Send, Search, Filter } from 'lucide-react';
import Quoter from '../../components/crm/Quoter';
import { getQuotations, getQuotationItems, updateQuotationStatus, type Quotation, type QuotationItem } from '../../lib/erp';
import { supabase } from '../../lib/supabase';

type Tab = 'quoter' | 'manage';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  DRAFT: { label: 'Borrador', color: 'bg-gray-100 text-gray-600', icon: FileText },
  SENT: { label: 'Enviada', color: 'bg-blue-100 text-blue-700', icon: Send },
  ACCEPTED: { label: 'Aceptada', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  REJECTED: { label: 'Rechazada', color: 'bg-red-100 text-red-700', icon: XCircle },
  CONVERTED: { label: 'Convertida', color: 'bg-purple-100 text-purple-700', icon: CheckCircle },
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function fmtMoney(n: number) {
  return '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2 });
}

export default function SalesOrders() {
  const [activeTab, setActiveTab] = useState<Tab>('quoter');
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [itemsCache, setItemsCache] = useState<Record<string, (QuotationItem & { product_name?: string; product_image?: string })[]>>({});
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadQuotations = useCallback(async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (filterStatus) filters.status = filterStatus;
      const data = await getQuotations(filters);
      setQuotations(data || []);
    } catch (e) {
      console.error('Error loading quotations:', e);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    if (activeTab === 'manage') loadQuotations();
  }, [activeTab, loadQuotations]);

  const handleExpand = async (id: string) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    if (!itemsCache[id]) {
      try {
        const items = await getQuotationItems(id);
        // Enrich with product names
        const enriched = await Promise.all(items.map(async (item) => {
          const { data: prod } = await supabase.from('products').select('name, image_url').eq('id', item.resource_id).single();
          return { ...item, product_name: prod?.name || item.resource_id, product_image: prod?.image_url || null };
        }));
        setItemsCache(prev => ({ ...prev, [id]: enriched }));
      } catch (e) { console.error(e); }
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await updateQuotationStatus(id, status as any);
      setQuotations(prev => prev.map(q => q.id === id ? { ...q, status: status as any } : q));
    } catch (e) { console.error(e); }
    finally { setUpdatingId(null); }
  };

  // Enrich quotations with customer names
  const [customerNames, setCustomerNames] = useState<Record<string, string>>({});
  useEffect(() => {
    const ids = quotations.map(q => q.customer_id).filter(id => !customerNames[id]);
    if (ids.length === 0) return;
    const unique = [...new Set(ids)];
    supabase.from('users').select('id, fullName, email').in('id', unique).then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((u: any) => { map[u.id] = u.fullName || u.email; });
        setCustomerNames(prev => ({ ...prev, ...map }));
      }
    });
  }, [quotations]);

  const filtered = quotations.filter(q => {
    if (searchTerm) {
      const name = customerNames[q.customer_id] || '';
      const match = name.toLowerCase().includes(searchTerm.toLowerCase()) || q.id.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  const tabs = [
    { id: 'quoter' as Tab, label: 'Cotizador B2B', icon: <Calculator className="w-4 h-4" /> },
    { id: 'manage' as Tab, label: 'Gestión de Cotizaciones', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
              ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
        <div className="ml-auto text-xs text-gray-400 pr-4">
          Módulo de Ventas y Cotizaciones
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'quoter' && (
          <motion.div key="quoter" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Quoter />
          </motion.div>
        )}

        {activeTab === 'manage' && (
          <motion.div key="manage" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Buscar por cliente o ID..." value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                  className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">Todos</option>
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg whitespace-nowrap">{filtered.length} cotizaciones</span>
            </div>

            {/* List */}
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-sm text-center border border-gray-100">
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg font-medium">No hay cotizaciones</p>
                <p className="text-gray-400 text-sm mt-2">Crea una cotización desde el tab "Cotizador B2B"</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((q, idx) => {
                  const isExpanded = expandedId === q.id;
                  const items = itemsCache[q.id] || [];
                  const st = STATUS_CONFIG[q.status] || STATUS_CONFIG.DRAFT;
                  const customerName = customerNames[q.customer_id] || 'Cargando...';
                  const shortId = q.id.slice(0, 8).toUpperCase();

                  return (
                    <motion.div key={q.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-200 transition-colors overflow-hidden">
                      {/* Row Header */}
                      <div className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3"
                        onClick={() => handleExpand(q.id)}>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1.5">
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            <span className="font-mono font-bold text-gray-900 text-sm">#{shortId}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                          </div>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm ml-7">
                            <div>
                              <p className="text-gray-400 text-xs">Cliente</p>
                              <p className="font-medium text-gray-800 truncate">{customerName}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Total</p>
                              <p className="font-semibold text-gray-900">{fmtMoney(Number(q.total_amount))}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Fecha</p>
                              <p className="text-gray-600">{fmtDate(q.created_at)}</p>
                            </div>
                            {q.expiration_date && (
                              <div>
                                <p className="text-gray-400 text-xs">Vence</p>
                                <p className="text-gray-600">{fmtDate(q.expiration_date)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-7 md:ml-0" onClick={e => e.stopPropagation()}>
                          <select value={q.status} onChange={e => handleStatusChange(q.id, e.target.value)}
                            disabled={updatingId === q.id}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-gray-50 hover:bg-white disabled:opacity-50">
                            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                              <option key={k} value={k}>{v.label}</option>
                            ))}
                          </select>
                          {updatingId === q.id && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-indigo-600" />}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                            className="border-t border-gray-100 bg-gray-50/50">
                            <div className="p-5">
                              {q.notes && (
                                <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
                                  <strong>Notas:</strong> {q.notes}
                                </div>
                              )}
                              {items.length === 0 ? (
                                <div className="text-sm text-gray-400 text-center py-4">
                                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-indigo-400 mx-auto mb-2" />
                                  Cargando productos...
                                </div>
                              ) : (
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                  <ul className="divide-y divide-gray-100">
                                    {items.map((item, i) => (
                                      <li key={item.id || i} className="p-4 flex items-center gap-4 hover:bg-gray-50/50">
                                        {item.product_image ? (
                                          <img src={item.product_image} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                                        ) : (
                                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">IMG</div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-gray-900 truncate">{item.product_name}</p>
                                          <p className="text-sm text-gray-500">Cant: <span className="font-medium text-gray-700">{item.quantity}</span> × {fmtMoney(item.unit_price)}</p>
                                        </div>
                                        <div className="text-sm font-bold text-gray-900">{fmtMoney(item.unit_price * item.quantity)}</div>
                                      </li>
                                    ))}
                                  </ul>
                                  <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between text-base font-bold">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-indigo-600">{fmtMoney(Number(q.total_amount))}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
