import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import PageLoader from "@/components/PageLoader";
import HomePage from "@/pages/HomePage";

// Halaman selain Home di-lazy-load per rute: mengecilkan bundle awal
// supaya render pertama & transisi antar halaman lebih ringan/mulus.
const KategoriPage = lazy(() => import("@/pages/KategoriPage"));
const ProductDetailPage = lazy(() => import("@/pages/ProductDetailPage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("@/pages/OrderSuccessPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const VerifyPage = lazy(() => import("@/pages/VerifyPage"));
const AccountOrdersPage = lazy(() => import("@/pages/AccountOrdersPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export default function AppRouter() {
  const location = useLocation();

  return (
    <div className="relative">
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="popLayout" initial={false}>
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
            <Route path="/verifikasi" element={<PageTransition><VerifyPage /></PageTransition>} />
            <Route path="/akun/pesanan" element={<PageTransition><AccountOrdersPage /></PageTransition>} />
            <Route path="/akun/profil" element={<PageTransition><ProfilePage /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  );
}
