import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useParams } from 'react-router-dom';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Header from './components/Header';
import GlobalSearchModal from './components/GlobalSearchModal';
import PWAInstallBanner from './components/PWAInstallBanner';
import TelemetryProvider from './components/TelemetryProvider';
import AdminLayout from './components/layouts/AdminLayout';
import About from './pages/About';
import Academy from './pages/Academy';
import AdminDashboard from './pages/admin/Dashboard';
import EventLog from './pages/admin/EventLog';
import AdminOrders from './pages/admin/Orders';
import PackagingRecords from './pages/admin/PackagingRecords';
import ProductionOrders from './pages/admin/ProductionOrders';

import PurchaseOrders from './pages/admin/PurchaseOrders';
import ResourceManager from './pages/admin/ResourceManager';
import SalesOrders from './pages/admin/SalesOrders';
import TransportAssignments from './pages/admin/TransportAssignments';
import UserManager from './pages/admin/UserManager';
import ReviewModeration from './pages/admin/ReviewModeration';
import AcademyManager from './pages/admin/AcademyManager';
import BlogManager from './pages/admin/BlogManager';
import ReelsManager from './pages/admin/ReelsManager';
import MediaManagerPage from './pages/admin/MediaManagerPage';

import ProductEditor from './pages/admin/ProductEditor';
import CartPromoSettings from './pages/admin/CartPromoSettings';
import WarehouseQueue from './pages/admin/WarehouseQueue';
import DistributorRequests from './pages/admin/DistributorRequests';
import FacturacionAdmin from './pages/admin/Facturacion';
import CouponManager from './pages/admin/CouponManager';
import EmailManager from './pages/admin/EmailManager';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import NewsPost from './pages/NewsPost';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import Login from './pages/Login';
import MyAccount from './pages/MyAccount';
import ProductDetail from './pages/ProductDetail';
import RegistroDistribuidor from './pages/RegistroDistribuidor';
import Shop from './pages/Shop';
import PaymentResult from './pages/PaymentResult';
import ResetPassword from './pages/ResetPassword';
import AvisoPrivacidad from './pages/AvisoPrivacidad';
import PoliticaDevoluciones from './pages/PoliticaDevoluciones';
import SolicitarFactura from './pages/SolicitarFactura';
import CategorySeoHub from './pages/CategorySeoHub';
import { useAuthStore } from './store/authStore';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProductDetailWrapper() {
  const { id } = useParams();
  return <ProductDetail key={id} />;
}

function Layout() {
  const location = useLocation();
  const isAdminOrAccount = location.pathname.startsWith('/admin') || location.pathname.startsWith('/mi-cuenta');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminOrAccount && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tienda" element={<Shop />} />
          <Route path="/cejas" element={<CategorySeoHub key="cejas" hubSlug="cejas" />} />
          <Route path="/pestanas" element={<CategorySeoHub key="pestanas" hubSlug="pestanas" />} />
          <Route path="/laminado-de-cejas" element={<CategorySeoHub key="laminado-de-cejas" hubSlug="laminado-de-cejas" />} />
          <Route path="/lash-lifting" element={<CategorySeoHub key="lash-lifting" hubSlug="lash-lifting" />} />
          <Route path="/henna-y-pigmentos" element={<CategorySeoHub key="henna-y-pigmentos" hubSlug="henna-y-pigmentos" />} />
          <Route path="/producto/:id" element={<ProductDetailWrapper />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mi-cuenta" element={<MyAccount />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/academia" element={<Academy />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/noticias/:slug" element={<NewsPost />} />
          <Route path="/registro-distribuidor" element={<RegistroDistribuidor />} />
          <Route path="/aviso-de-privacidad" element={<AvisoPrivacidad />} />
          <Route path="/politica-de-devoluciones" element={<PoliticaDevoluciones />} />
          <Route path="/devoluciones" element={<PoliticaDevoluciones />} />
          <Route path="/solicitar-factura" element={<SolicitarFactura />} />
          <Route path="/pago-resultado" element={<PaymentResult />} />
          <Route path="/restablecer-contrasena" element={<ResetPassword />} />

          {/* Admin / ERP Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />

            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<UserManager />} />
            <Route path="emails" element={<EmailManager />} />
            <Route path="resources" element={<ResourceManager />} />
            <Route path="production" element={<ProductionOrders />} />
            <Route path="purchases" element={<PurchaseOrders />} />
            <Route path="sales" element={<SalesOrders />} />
            <Route path="transport" element={<TransportAssignments />} />
            <Route path="packaging" element={<PackagingRecords />} />
            <Route path="event-log" element={<EventLog />} />
            <Route path="reviews" element={<ReviewModeration />} />
            <Route path="academy" element={<AcademyManager />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="reels" element={<ReelsManager />} />
            <Route path="media" element={<MediaManagerPage />} />

            <Route path="catalog" element={<ProductEditor />} />
            <Route path="cart-promos" element={<CartPromoSettings />} />
            <Route path="warehouse-queue" element={<WarehouseQueue />} />
            <Route path="distributors" element={<DistributorRequests />} />
            <Route path="facturacion" element={<FacturacionAdmin />} />
            <Route path="coupons" element={<CouponManager />} />
          </Route>
        </Routes>
      </main>
      {!isAdminOrAccount && <Footer />}
      <CartDrawer />
      <GlobalSearchModal />
    </div>
  );
}

function App() {
  const checkSession = useAuthStore((s) => s.checkSession);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [showPWA, setShowPWA] = useState(false);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Show PWA banner after engagement (3s for logged-in users, 12s for visitors) — max once per week
  useEffect(() => {
    const lastShown = localStorage.getItem('pwa-prompt-shown');
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    if (lastShown && Date.now() - Number(lastShown) < oneWeek) return;
    const delayMs = isAuthenticated ? 3000 : 12000;
    const t = setTimeout(() => {
      setShowPWA(true);
      localStorage.setItem('pwa-prompt-shown', String(Date.now()));
    }, delayMs);
    return () => clearTimeout(t);
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <TelemetryProvider />
      <ScrollToTop />
      <Layout />
      <PWAInstallBanner show={showPWA} />
    </BrowserRouter>
  );
}

export default App;
