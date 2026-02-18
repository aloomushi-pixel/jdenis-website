import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Header from './components/Header';
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

import ProductEditor from './pages/admin/ProductEditor';
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
import AvisoPrivacidad from './pages/AvisoPrivacidad';
import { useAuthStore } from './store/authStore';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tienda" element={<Shop />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
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
            <Route path="/pago-resultado" element={<PaymentResult />} />

            {/* Admin / ERP Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />

              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<UserManager />} />
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

              <Route path="catalog" element={<ProductEditor />} />
            </Route>
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </BrowserRouter>
  );
}

export default App;

