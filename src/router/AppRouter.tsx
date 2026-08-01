import { Routes, Route } from "react-router-dom";
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
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/kategori" element={<KategoriPage />} />
      <Route path="/kategori/:category" element={<KategoriPage />} />
      <Route path="/produk/:slug" element={<ProductDetailPage />} />
      <Route path="/keranjang" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/pesanan/sukses/:orderId" element={<OrderSuccessPage />} />
      <Route path="/masuk" element={<LoginPage />} />
      <Route path="/daftar" element={<RegisterPage />} />
      <Route path="/akun/pesanan" element={<AccountOrdersPage />} />
      <Route path="/akun/profil" element={<ProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
