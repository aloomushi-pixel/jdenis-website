export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  price_public: number;
  price_wholesale: number;
  stock: number;
  image?: string;
};

export type Client = {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  type: 'MAYORISTA' | 'MENUDEO' | 'DISTRIBUIDOR';
  lastPurchaseDate: string;
  status: 'ACTIVO' | 'INACTIVO' | 'ALERTA';
  notes: string;
};

export type OrderStatus = 'COTIZADO' | 'PAGO_CONFIRMADO' | 'EN_EMPAQUE' | 'ENVIADO';

export type Order = {
  id: string;
  clientId: string;
  total: number;
  status: OrderStatus;
  date: string;
  shippingAddress: string;
  trackingNumber?: string;
  paymentProof?: string;
  items: {
    productId: string;
    quantity: number;
    priceApplied: number;
  }[];
};

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', sku: 'JD-ADH-01', name: 'Adhesivo Quirúrgico Negro (10ml)', category: 'Adhesivos', price_public: 350, price_wholesale: 200, stock: 150 },
  { id: 'p2', sku: 'JD-ADH-02', name: 'Adhesivo Transparente (5ml)', category: 'Adhesivos', price_public: 280, price_wholesale: 150, stock: 80 },
  { id: 'p3', sku: 'JD-LASH-C1', name: 'Blíster Pestañas Curva C (Mix 8-15mm)', category: 'Pestañas', price_public: 220, price_wholesale: 130, stock: 300 },
  { id: 'p4', sku: 'JD-LASH-D1', name: 'Blíster Pestañas Curva D (Mix 8-15mm)', category: 'Pestañas', price_public: 220, price_wholesale: 130, stock: 250 },
  { id: 'p5', sku: 'JD-LIFT-01', name: 'Kit Lash Lifting Premium', category: 'Kits', price_public: 850, price_wholesale: 500, stock: 45 },
  { id: 'p6', sku: 'JD-ACC-01', name: 'Microbrushes (Paquete 100pz)', category: 'Accesorios', price_public: 90, price_wholesale: 45, stock: 500 },
  { id: 'p7', sku: 'JD-ACC-02', name: 'Pinzas Rectas para Aislamiento', category: 'Accesorios', price_public: 150, price_wholesale: 80, stock: 120 },
  { id: 'p8', sku: 'JD-ACC-03', name: 'Anillos para Cola (Pack 50pz)', category: 'Accesorios', price_public: 75, price_wholesale: 35, stock: 600 },
  { id: 'p9', sku: 'JD-LIQ-01', name: 'Primer Preparador de Pestañas', category: 'Líquidos', price_public: 180, price_wholesale: 100, stock: 200 },
  { id: 'p10', sku: 'JD-LIQ-02', name: 'Removedor en Crema', category: 'Líquidos', price_public: 210, price_wholesale: 115, stock: 90 },
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'María López', businessName: 'Lash Studio by Mary', phone: '555-0101', email: 'mary@lashstudio.com', type: 'MAYORISTA', lastPurchaseDate: '2023-10-05', status: 'ACTIVO', notes: 'Compra frecuentemente adhesivos y blisters mixtos.' },
  { id: 'c2', name: 'Roberto Gómez', businessName: 'Beauty Supplies SA', phone: '555-0202', email: 'roberto@beautysupplies.com', type: 'DISTRIBUIDOR', lastPurchaseDate: '2023-08-15', status: 'ALERTA', notes: 'No ha comprado desde agosto. Contactar pronto.' },
  { id: 'c3', name: 'Ana Silva', businessName: 'Ana Silva Beauty', phone: '555-0303', email: 'contacto@anasilva.com', type: 'MENUDEO', lastPurchaseDate: '2023-10-20', status: 'ACTIVO', notes: 'Prefiere la curva D. Posible candidata a mayorista.' },
  { id: 'c4', name: 'Carmen Ruiz', businessName: 'Studio Ruiz', phone: '555-0404', email: 'info@studioruiz.com', type: 'MAYORISTA', lastPurchaseDate: '2023-09-01', status: 'ALERTA', notes: 'Suele pedir líquidos de lashing.' },
  { id: 'c5', name: 'Luis Torres', businessName: 'Salón Glam', phone: '555-0505', email: 'luis@glam.com', type: 'MAYORISTA', lastPurchaseDate: '2023-11-01', status: 'ACTIVO', notes: 'Cliente nuevo, excelente volumen.' },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-1001', clientId: 'c1', total: 3200, status: 'COTIZADO', date: '2023-11-10T10:00:00Z', shippingAddress: 'Av. Siempre Viva 123, CDMX', items: [{ productId: 'p1', quantity: 10, priceApplied: 200 }, { productId: 'p3', quantity: 10, priceApplied: 120 }] },
  { id: 'ORD-1002', clientId: 'c5', total: 1500, status: 'PAGO_CONFIRMADO', date: '2023-11-09T14:30:00Z', shippingAddress: 'Calle Las Palmas 45, MTY', paymentProof: 'img1.png', items: [{ productId: 'p5', quantity: 3, priceApplied: 500 }] },
  { id: 'ORD-1003', clientId: 'c3', total: 640, status: 'EN_EMPAQUE', date: '2023-11-08T09:15:00Z', shippingAddress: 'Insurgentes Sur 999, CDMX', items: [{ productId: 'p2', quantity: 2, priceApplied: 280 }, { productId: 'p6', quantity: 1, priceApplied: 80 }] },
  { id: 'ORD-1004', clientId: 'c1', total: 4200, status: 'ENVIADO', date: '2023-11-01T16:00:00Z', shippingAddress: 'Av. Siempre Viva 123, CDMX', trackingNumber: 'FEDEX-123456789', items: [{ productId: 'p4', quantity: 30, priceApplied: 140 }] },
  { id: 'ORD-1005', clientId: 'c4', total: 2000, status: 'COTIZADO', date: '2023-11-12T11:20:00Z', shippingAddress: 'Reforma 222, CDMX', items: [{ productId: 'p9', quantity: 20, priceApplied: 100 }] },
];
