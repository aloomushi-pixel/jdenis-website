import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MOCK_ORDERS, type Order, type OrderStatus } from '../../lib/mockData';
import { Truck, Package, CheckCircle, Clock } from 'lucide-react';

const COLUMNS: { id: OrderStatus; title: string; icon: React.ReactNode; color: string }[] = [
  { id: 'COTIZADO', title: 'Cotizado', icon: <Clock size={16} />, color: 'bg-slate-100 text-slate-600 border-slate-200' },
  { id: 'PAGO_CONFIRMADO', title: 'Pago Confirm.', icon: <CheckCircle size={16} />, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'EN_EMPAQUE', title: 'En Empaque', icon: <Package size={16} />, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'ENVIADO', title: 'Enviado', icon: <Truck size={16} />, color: 'bg-blue-50 text-blue-700 border-blue-200' },
];

export default function KanbanLogistics() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      setOrders(prev => prev.map(o => {
        if (o.id === draggableId) {
          return { ...o, status: destination.droppableId as OrderStatus };
        }
        return o;
      }));
      // Aquí se podrían abrir modales según el destino (ej. pedir número guía si se pasó a ENVIADO).
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[85vh]">
      <div className="mb-6">
        <h2 className="text-2xl font-sans text-slate-800">Logística de Pedidos</h2>
        <p className="text-slate-500 text-sm mt-1">Arrastra las tarjetas para cambiar el estado del pedido.</p>
      </div>

      <div className="flex-1 overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 h-full min-w-max pb-4">
            {COLUMNS.map(col => {
              const colOrders = orders.filter(o => o.status === col.id);
              
              return (
                <div key={col.id} className="w-80 flex flex-col bg-slate-50/50 rounded-2xl border border-slate-100 h-full overflow-hidden">
                  <div className={`px-4 py-3 border-b flex justify-between items-center ${col.color}`}>
                    <div className="flex items-center gap-2 font-medium text-sm">
                      {col.icon} {col.title}
                    </div>
                    <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold">{colOrders.length}</span>
                  </div>
                  
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto p-3 space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-slate-100/50' : ''}`}
                      >
                        {colOrders.map((order, index) => (
                          <Draggable key={order.id} draggableId={order.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white p-4 rounded-xl border shadow-sm transition-all ${snapshot.isDragging ? 'shadow-lg border-amber-300 rotate-2' : 'border-slate-100 hover:border-slate-300'}`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-mono font-bold text-navy text-sm">{order.id}</span>
                                  <span className="text-xs font-semibold text-slate-500">${order.total.toLocaleString()}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-700 mb-1 line-clamp-1">{order.clientId} (Mock Clte)</p>
                                <p className="text-xs text-slate-400 mb-3">{new Date(order.date).toLocaleDateString()}</p>
                                
                                <div className="border-t border-slate-50 pt-3 flex justify-between items-center text-xs text-slate-500">
                                  <span>{order.items.length} items</span>
                                  <button className="hover:text-amber-600 hover:underline">Ver Detalle</button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
