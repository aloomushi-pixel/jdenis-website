import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useParams } from 'react-router-dom';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Header from './components/Header';
import GlobalSearchModal from './components/GlobalSearchModal';
import PWAInstallBanner from './components/PWAInstallBanner';
import TelemetryProvider from './components/TelemetryProvider';
import UxFeedbackBubble from './components/UxFeedbackBubble';

// Eager public storefront routes for instant LCP & SEO
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CategorySeoHub from './pages/CategorySeoHub';
import Checkout from './pages/Checkout';
import PaymentResult from './pages/PaymentResult';
import { useAuthStore } from './store/authStore';
import { invalidateProductsCache } from './hooks/useProducts';
import { invalidateVariantsCache } from './hooks/useVariants';

// Lazy-loaded secondary public routes
const About = lazy(() => import('./pages/About'));
const Academy = lazy(() => import('./pages/Academy'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const NewsPost = lazy(() => import('./pages/NewsPost'));
const Login = lazy(() => import('./pages/Login'));
const MyAccount = lazy(() => import('./pages/MyAccount'));
const RegistroDistribuidor = lazy(() => import('./pages/RegistroDistribuidor'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const AvisoPrivacidad = lazy(() => import('./pages/AvisoPrivacidad'));
const PoliticaDevoluciones = lazy(() => import('./pages/PoliticaDevoluciones'));
const SolicitarFactura = lazy(() => import('./pages/SolicitarFactura'));

// Lazy-loaded Admin / ERP routes (isolates jspdf, xlsx, recharts, dnd from public storefront)
const AdminLayout = lazy(() => import('./components/layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const EventLog = lazy(() => import('./pages/admin/EventLog'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const PackagingRecords = lazy(() => import('./pages/admin/PackagingRecords'));
const ProductionOrders = lazy(() => import('./pages/admin/ProductionOrders'));
const PurchaseOrders = lazy(() => import('./pages/admin/PurchaseOrders'));
const ResourceManager = lazy(() => import('./pages/admin/ResourceManager'));
const SalesOrders = lazy(() => import('./pages/admin/SalesOrders'));
const TransportAssignments = lazy(() => import('./pages/admin/TransportAssignments'));
const UserManager = lazy(() => import('./pages/admin/UserManager'));
const ReviewModeration = lazy(() => import('./pages/admin/ReviewModeration'));
const AcademyManager = lazy(() => import('./pages/admin/AcademyManager'));
const BlogManager = lazy(() => import('./pages/admin/BlogManager'));
const ReelsManager = lazy(() => import('./pages/admin/ReelsManager'));
const MediaManagerPage = lazy(() => import('./pages/admin/MediaManagerPage'));
const ProductEditor = lazy(() => import('./pages/admin/ProductEditor'));
const CartPromoSettings = lazy(() => import('./pages/admin/CartPromoSettings'));
const WarehouseQueue = lazy(() => import('./pages/admin/WarehouseQueue'));
const DistributorRequests = lazy(() => import('./pages/admin/DistributorRequests'));
const FacturacionAdmin = lazy(() => import('./pages/admin/Facturacion'));
const CouponManager = lazy(() => import('./pages/admin/CouponManager'));
const EmailManager = lazy(() => import('./pages/admin/EmailManager'));

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

function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Layout() {
  const location = useLocation();
  const isAdminOrAccount = location.pathname.startsWith('/admin') || location.pathname.startsWith('/mi-cuenta');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminOrAccount && <Header />}
      <main className="flex-1">
        <Suspense fallback={<RouteFallback />}>
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
        </Suspense>
      </main>
      {!isAdminOrAccount && <Footer />}
      <CartDrawer />
      <GlobalSearchModal />
      <UxFeedbackBubble />
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

  // Purge legacy stale Workbox Supabase cache & check Service Worker updates
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('caches' in window) {
      caches.delete('supabase-products-cache').then((deleted) => {
        if (deleted) {
          invalidateProductsCache();
          invalidateVariantsCache();
          window.dispatchEvent(new Event('jdenis:catalog-cache-purged'));
        }
      }).catch(() => {});
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => {
          reg.update().catch(() => {});
        });
      }).catch(() => {});
    }
  }, []);

  // Show PWA banner after engagement (4s for logged-in users, 25s for visitors) — max once per week
  useEffect(() => {
    const lastShown = localStorage.getItem('pwa-prompt-shown');
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    if (lastShown && Date.now() - Number(lastShown) < oneWeek) return;
    const delayMs = isAuthenticated ? 4000 : 25000;
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
