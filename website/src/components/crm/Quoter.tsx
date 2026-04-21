import { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MOCK_PRODUCTS, type Product } from '../../lib/mockData';
import { cn } from '../../lib/utils';
import { Search, Plus, ShoppingCart, MessageCircle, AlertCircle, FileText } from 'lucide-react';

interface CartItem extends Product {
  cartQuantity: number;
}

export default function Quoter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const getPrice = (item: CartItem) => {
    return item.price_wholesale; // Siempre retorna el precio preferencial para el cotizador
  };

  const addItemToCart = (product: Product, quantity = 1) => {
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

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + (getPrice(item) * item.cartQuantity), 0);
  }, [cart]);

  const addKit = () => {
    const p1 = MOCK_PRODUCTS.find(p => p.sku === 'JD-LASH-C1');
    const p2 = MOCK_PRODUCTS.find(p => p.sku === 'JD-ADH-01');
    const p3 = MOCK_PRODUCTS.find(p => p.sku === 'JD-ACC-01');
    if (p1 && p2 && p3) {
      addItemToCart(p1, 5);
      addItemToCart(p2, 2);
      addItemToCart(p3, 2);
      showToast('Kit Lash Premium Agregado Exitosamente');
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

      // Pre-load all product images to base64
      const cartWithImages = await Promise.all(cart.map(async (item) => {
        const imgSrc = item.image ? item.image : '/logo-new.jpeg'; // fallback to logo
        const base64 = await getBase64ImageFromUrl(imgSrc);
        return { ...item, base64 };
      }));
      
      // AutoTable
      autoTable(doc, {
        startY: 55,
        head: [['Img', 'SKU', 'Producto', 'Cant', 'Precio U.', 'Total']],
        body: cartWithImages.map(item => [
          '', // image placeholder
          item.sku,
          item.name,
          item.cartQuantity,
          `$${getPrice(item).toFixed(2)}`,
          `$${(getPrice(item) * item.cartQuantity).toFixed(2)}`
        ]),
        headStyles: {
          fillColor: [10, 25, 47], // Navy
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [253, 251, 247] // Cream
        },
        bodyStyles: {
          valign: 'middle'
        },
        columnStyles: {
          0: { cellWidth: 20, minCellHeight: 20 }, // Img column
          1: { cellWidth: 30 }, // SKU
          2: { cellWidth: 'auto' }, // Producto
          3: { cellWidth: 20, halign: 'center' }, // Cant
          4: { cellWidth: 25, halign: 'right' }, // Precio
          5: { cellWidth: 30, halign: 'right', fontStyle: 'bold' } // Total
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
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(212, 175, 55); // Gold
      doc.text(`Total Final: $${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 190, finalY + 15, { align: 'right' });
      
      // Footer text
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 150, 150);
      doc.text('Gracias por su preferencia.', 105, finalY + 30, { align: 'center' });
      doc.text('jdenis.store', 105, finalY + 35, { align: 'center' });
      
      doc.save('Cotizacion_JDenis.pdf');
      showToast('✅ PDF Generado Exitosamente');
    } catch (e) {
      console.error(e);
      showToast('❌ Error genarando PDF');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-serif text-slate-800">Cotizador Mayorista B2B</h2>
          <p className="text-slate-500 text-sm">Crea cotizaciones y envíalas al instante.</p>
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
        {/* BUSCADOR Y RESULTADOS */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[70vh]">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar SKU o nombre de producto..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {filteredProducts.map(p => (
              <div key={p.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-all cursor-pointer" onClick={() => addItemToCart(p, 1)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-medium text-xs border border-slate-200">IMG</div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm leading-tight">{p.name}</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{p.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-600 text-sm">${p.price_public}</p>
                  <p className="text-[10px] text-slate-400">Mayoreo: ${p.price_wholesale}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARTA DE COTIZACIÓN */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[70vh]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-lg font-medium flex items-center gap-2"><ShoppingCart size={18}/> Cotización Actual</h3>
            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-md font-semibold">{cart.length} items</span>
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
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800">${getPrice(item) * item.cartQuantity}</p>
                        <span className="text-[10px] bg-amber-200 text-amber-800 px-1 py-0.5 rounded font-bold uppercase tracking-wider">Precio Distribuidor</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-sm">
                        <button onClick={() => updateQuantity(item.id, item.cartQuantity - 1)} className="text-slate-400 hover:text-slate-600 px-1">-</button>
                        <span className="text-sm font-semibold w-6 text-center">{item.cartQuantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.cartQuantity + 1)} className="text-slate-400 hover:text-slate-600 px-1">+</button>
                      </div>
                      <p className="text-xs text-slate-400">${getPrice(item)} c/u</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Total Venta</span>
              <span className="text-3xl font-serif font-bold text-navy">${total.toLocaleString('es-MX')}</span>
            </div>
            <button className="w-full bg-navy hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-colors shadow-md flex justify-center items-center gap-2">
              <MessageCircle size={18} /> Compartir por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
