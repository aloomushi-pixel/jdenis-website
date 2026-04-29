import { useState, useMemo, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useProducts, type DisplayProduct } from '../../hooks/useProducts';
import { Search, Plus, ShoppingCart, AlertCircle, FileText, Send, Save, User, Edit3, Check, X } from 'lucide-react';
import { getUsers, createQuotation, type ERPUser } from '../../lib/erp';
import { useAuthStore } from '../../store/authStore';

interface CartItem extends DisplayProduct {
  cartQuantity: number;
  itemDiscount?: number;
}

export default function Quoter() {
  const { products: dbProducts, loading: loadingProducts, saveProduct, saveStatus } = useProducts();
  const user = useAuthStore(s => s.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  
  const [customers, setCustomers] = useState<ERPUser[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');



  useEffect(() => {
    async function loadCustomers() {
      try {
        const distributors = await getUsers('DISTRIBUIDOR');
        setCustomers(distributors);
      } catch (err) {
        console.error("Error loading distributors:", err);
      }
    }
    loadCustomers();
  }, []);

  // Show ALL products, no distributor price filter
  const filteredProducts = useMemo(() => {
    return dbProducts.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, dbProducts]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const getStandardPrice = (item: CartItem) => {
    return item.price;
  };

  const getPrice = (item: CartItem) => {
    const standard = getStandardPrice(item);
    if (item.itemDiscount && item.itemDiscount > 0) {
      return standard * (1 - item.itemDiscount / 100);
    }
    return standard;
  };

  const updateItemDiscount = (id: string, discountStr: string) => {
    const val = parseFloat(discountStr);
    setCart(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, itemDiscount: isNaN(val) ? undefined : Math.max(0, Math.min(100, val)) };
      }
      return p;
    }));
  };

  const addItemToCart = (product: DisplayProduct, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, cartQuantity: p.cartQuantity + quantity } : p);
      }
      return [...prev, { ...product, cartQuantity: quantity }];
    });

    // Cross-sell logic
    if (product.category === 'Adhesivos' && !cart.some(p => p.category === 'Accesorios')) {
      showToast('💡 ¡Tip de Venta! Agrega anillos y microbrushes a tu cotización de adhesivos.');
    }
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(p => p.id !== id));
      return;
    }
    setCart(prev => prev.map(p => p.id === id ? { ...p, cartQuantity: qty } : p));
  };

  const { subtotal, discountAmount, ivaAmount, totalFinal } = useMemo(() => {
    const sub = cart.reduce((acc, item) => acc + (getPrice(item) * item.cartQuantity), 0);
    const disc = discountType === 'PERCENTAGE' ? sub * (discountValue / 100) : discountValue;
    const validDisc = Math.min(Math.max(0, disc), sub) || 0;
    const baseForIva = sub - validDisc;
    const iva = baseForIva * 0.16;
    const final = baseForIva + iva;
    return { subtotal: sub, discountAmount: validDisc, ivaAmount: iva, totalFinal: final };
  }, [cart, discountValue, discountType]);

  const addKit = () => {
    const p1 = dbProducts.find(p => p.category.toLowerCase().includes('lash lifting') || p.name.toLowerCase().includes('kit'));
    const p2 = dbProducts.find(p => p.category.toLowerCase().includes('adhesivos') || p.name.toLowerCase().includes('adhesivo'));
    const p3 = dbProducts.find(p => p.category.toLowerCase().includes('accesorios') || p.name.toLowerCase().includes('microbrush'));
    
    let added = false;
    if (p1) { addItemToCart(p1, 5); added = true; }
    if (p2) { addItemToCart(p2, 2); added = true; }
    if (p3) { addItemToCart(p3, 2); added = true; }
    
    if (added) {
      showToast('Kit Lash Premium Agregado Exitosamente');
    } else {
      showToast('No se encontraron productos para el kit');
    }
  };



  const getBase64ImageFromUrl = async (imageUrl: string): Promise<string | null> => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return null;
    }
  };

  const exportPDF = async () => {
    try {
      showToast('Generando PDF...');
      const doc = new jsPDF();
      
      // Load J. Denis Logo
      const logoBase64 = await getBase64ImageFromUrl('/logo-new.jpeg');
      if (logoBase64) {
        doc.addImage(logoBase64, 'JPEG', 20, 15, 30, 30);
      }
      
      // Document Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(10, 25, 47); // Navy
      doc.text('Cotización Ejecutiva', 55, 25);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('Distribuidora J. Denis', 55, 33);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 55, 39);
      doc.text(`ID Cotización: JD-${Math.floor(1000 + Math.random() * 9000)}`, 55, 45);
      doc.text(`Atendido por: ${user?.fullName || user?.email || 'Administrador'}`, 55, 51);

      // Pre-load all product images to base64
      const cartWithImages = await Promise.all(cart.map(async (item) => {
        const imgSrc = item.image ? item.image : '/logo-new.jpeg';
        const base64 = await getBase64ImageFromUrl(imgSrc);
        return { ...item, base64 };
      }));
      
      // AutoTable
      autoTable(doc, {
        startY: 55,
        head: [['Img', 'SKU', 'Producto', 'Cant', 'Precio U.', 'Total']],
        body: cartWithImages.map(item => [
          '',
          item.id,
          item.name,
          item.cartQuantity,
          `$${getPrice(item).toFixed(2)}`,
          `$${(getPrice(item) * item.cartQuantity).toFixed(2)}`
        ]),
        headStyles: {
          fillColor: [10, 25, 47],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [253, 251, 247]
        },
        bodyStyles: {
          valign: 'middle'
        },
        columnStyles: {
          0: { cellWidth: 20, minCellHeight: 20 },
          1: { cellWidth: 30 },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 20, halign: 'center' },
          4: { cellWidth: 25, halign: 'right' },
          5: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
        },
        didDrawCell: (data) => {
          if (data.column.index === 0 && data.cell.section === 'body') {
            const item = cartWithImages[data.row.index];
            if (item.base64) {
              const dim = data.cell.height - 4;
              doc.addImage(item.base64, 'JPEG', data.cell.x + 2, data.cell.y + 2, dim, dim);
            }
          }
        }
      });

      // Total Footer
      // @ts-ignore
      const finalY = doc.lastAutoTable.finalY || 60;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      
      let currentY = finalY + 10;
      doc.text(`Subtotal: $${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 190, currentY, { align: 'right' });
      
      if (discountAmount > 0) {
        currentY += 6;
        doc.text(`Descuento: -$${discountAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 190, currentY, { align: 'right' });
      }
      
      currentY += 6;
      doc.text(`I.V.A. (16%): $${ivaAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 190, currentY, { align: 'right' });

      currentY += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(212, 175, 55);
      doc.text(`Total Final: $${totalFinal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 190, currentY, { align: 'right' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 150, 150);
      doc.text('Gracias por su preferencia.', 105, currentY + 15, { align: 'center' });
      doc.text('jdenis.store', 105, currentY + 20, { align: 'center' });
      
      doc.save('Cotizacion_JDenis.pdf');
      showToast('✅ PDF Generado Exitosamente');
    } catch (e) {
      console.error(e);
      showToast('❌ Error genarando PDF');
    }
  };

  const handleSaveQuotation = async (status: 'DRAFT' | 'SENT') => {
    if (!selectedCustomerId) {
      showToast('❌ Por favor selecciona un distribuidor primero');
      return;
    }
    if (cart.length === 0) {
      showToast('❌ Agrega productos a la cotización');
      return;
    }

    try {
      setIsSaving(true);
      
      const quotationData = {
        customer_id: selectedCustomerId,
        status: status,
        total_amount: totalFinal,
        notes: `Atendido por: ${user?.fullName || user?.email || 'Administrador'} | Subtotal: $${subtotal.toFixed(2)} | Descuento: $${discountAmount.toFixed(2)} | IVA: $${ivaAmount.toFixed(2)}.`,
        created_by: user?.id,
      };

      const items = cart.map(item => ({
        resource_id: item.id,
        quantity: item.cartQuantity,
        unit_price: getPrice(item)
      }));

      await createQuotation(quotationData, items);
      
      if (status === 'SENT') {
        showToast('✉️ Cotización enviada al distribuidor exitosamente');
      } else {
        showToast('💾 Borrador guardado exitosamente');
      }
      
      setCart([]);
      setSelectedCustomerId('');
      
    } catch (error) {
      console.error("Error saving quotation:", error);
      showToast('❌ Ocurrió un error al guardar la cotización');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-100 gap-3">
        <div>
          <h2 className="text-2xl font-sans text-slate-800">Cotizador Mayorista B2B</h2>
          <p className="text-slate-500 text-sm">Crea cotizaciones y envíalas al instante. Puedes aplicar descuentos individuales por producto.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={addKit} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
            <Plus size={16} /> Kit Inicio Rápido
          </button>
          <button onClick={exportPDF} disabled={cart.length === 0} className="bg-amber-500 disabled:opacity-50 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
            <FileText size={16} /> Generar PDF
          </button>
        </div>
      </div>

      {toast && (
        <div className="animate-in fade-in slide-in-from-top-4 fixed top-4 right-4 bg-navy text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3">
          <AlertCircle className="text-gold" />
          <p className="font-medium text-sm">{toast}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PRODUCT CATALOG */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[70vh]">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre, ID o categoría..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs text-slate-400 font-medium">{filteredProducts.length} productos</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
            {loadingProducts ? (
              <div className="text-center py-10 text-slate-400">Cargando productos...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-10 text-slate-400">No se encontraron productos</div>
            ) : filteredProducts.map(p => {
              return (
                <div key={p.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-all group">
                  <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => addItemToCart(p, 1)}>
                    {p.image && p.image !== '/placeholder.webp' ? (
                      <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-medium text-xs border border-slate-200 flex-shrink-0">IMG</div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-semibold text-slate-800 text-sm leading-tight truncate">{p.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{p.category}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="font-bold text-slate-700 text-sm">${p.price}</p>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* QUOTATION CART */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[70vh]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-sans text-lg font-medium flex items-center gap-2"><ShoppingCart size={18}/> Cotización Actual</h3>
            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-md font-semibold">{cart.length} items</span>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
              <User size={14} /> Seleccionar Distribuidor
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-sm"
            >
              <option value="">-- Selecciona un distribuidor --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{(c as any).full_name || c.fullName || c.email}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <ShoppingCart size={48} className="opacity-20" />
                <p className="text-sm">Agrega productos para cotizar</p>
              </div>
            ) : (
              cart.map(item => {
                return (
                  <div key={item.id} className="p-3 rounded-xl border transition-all border-amber-200 bg-amber-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="pr-4">
                        <h4 className="font-semibold text-slate-800 text-sm leading-tight">{item.name}</h4>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800">${(getPrice(item) * item.cartQuantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                        {item.distributorPrice != null && item.distributorPrice > 0 ? (
                          <span className="text-[10px] bg-amber-200 text-amber-800 px-1 py-0.5 rounded font-bold uppercase tracking-wider">Precio Distribuidor</span>
                        ) : (
                          <span className="text-[10px] bg-slate-200 text-slate-600 px-1 py-0.5 rounded font-bold uppercase tracking-wider">Precio Público</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-sm">
                        <button onClick={() => updateQuantity(item.id, item.cartQuantity - 1)} className="text-slate-400 hover:text-slate-600 px-1">-</button>
                        <span className="text-sm font-semibold w-6 text-center">{item.cartQuantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.cartQuantity + 1)} className="text-slate-400 hover:text-slate-600 px-1">+</button>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-2">
                           {item.itemDiscount ? (
                             <span className="text-[10px] text-slate-400 line-through">${getStandardPrice(item).toFixed(2)} base</span>
                           ) : (
                             <span className="text-[10px] text-slate-500">Base: ${getStandardPrice(item).toFixed(2)}</span>
                           )}
                           <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-slate-300 shadow-sm focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-all">
                             <input
                               type="number"
                               step="1"
                               min="0"
                               max="100"
                               value={item.itemDiscount !== undefined ? item.itemDiscount : ''}
                               onChange={(e) => updateItemDiscount(item.id, e.target.value)}
                               placeholder="0"
                               className="w-8 text-xs text-right bg-transparent outline-none font-medium text-slate-700"
                             />
                             <span className="text-[10px] font-bold text-slate-400">% desc</span>
                           </div>
                        </div>
                        <p className="text-sm font-semibold text-amber-700">${getPrice(item).toLocaleString('es-MX', { minimumFractionDigits: 2 })} c/u</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4 space-y-3">
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Importe (Subtotal)</span>
              <span className="font-medium">${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between items-center text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span>Descuento</span>
                <div className="flex items-center border border-slate-200 rounded overflow-hidden">
                  <input 
                    type="number" 
                    min="0"
                    value={discountValue || ''} 
                    onChange={e => setDiscountValue(parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-0.5 text-right outline-none"
                    placeholder="0"
                  />
                  <select 
                    value={discountType} 
                    onChange={e => setDiscountType(e.target.value as any)}
                    className="bg-slate-50 border-l border-slate-200 px-1 py-0.5 outline-none text-xs"
                  >
                    <option value="PERCENTAGE">%</option>
                    <option value="FIXED">$</option>
                  </select>
                </div>
              </div>
              <span className="font-medium text-red-500">-${discountAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>I.V.A. (16%)</span>
              <span className="font-medium">${ivaAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between items-center mb-2 pt-2 border-t border-slate-100">
              <span className="text-slate-800 font-semibold">Total Final</span>
              <span className="text-3xl font-sans font-bold text-navy">${totalFinal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => handleSaveQuotation('SENT')}
                disabled={isSaving || cart.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
              >
                <Send size={18} /> Enviar Cotización
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
