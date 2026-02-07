import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Header from './components/Header';
import AdminLayout from './components/layouts/AdminLayout';
import About from './pages/About';
import Academy from './pages/Academy';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminProducts from './pages/admin/Products';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import Login from './pages/Login';
import MyAccount from './pages/MyAccount';
import ProductDetail from './pages/ProductDetail';
import RegistroDistribuidor from './pages/RegistroDistribuidor';
import Shop from './pages/Shop';
import { useAuthStore } from './store/authStore';

function App() {
  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <BrowserRouter>
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
            <Route path="/registro-distribuidor" element={<RegistroDistribuidor />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
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

