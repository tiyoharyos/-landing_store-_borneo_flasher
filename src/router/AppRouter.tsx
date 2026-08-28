import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import HomePage from "@/pages/HomePage";
import KategoriPage from "@/pages/KategoriPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AccountOrdersPage from "@/pages/AccountOrdersPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/kategori" element={<PageTransition><KategoriPage /></PageTransition>} />
        <Route path="/kategori/:category" element={<PageTransition><KategoriPage /></PageTransition>} />
        <Route path="/produk/:slug" element={<PageTransition><ProductDetailPage /></PageTransition>} />
        <Route path="/keranjang" element={<PageTransition><CartPage /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
        <Route path="/pesanan/sukses/:orderId" element={<PageTransition><OrderSuccessPage /></PageTransition>} />
        <Route path="/masuk" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/daftar" element={<PageTransition><RegisterPage /></PageTransition>} />
        <Route path="/akun/pesanan" element={<PageTransition><AccountOrdersPage /></PageTransition>} />
        <Route path="/akun/profil" element={<PageTransition><ProfilePage /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}
