import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import CategoryDetailPage from "@/pages/CategoryDetailPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AccountOrdersPage from "@/pages/AccountOrdersPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/kategori" element={<CategoryDetailPage />} />
      <Route path="/kategori/:category" element={<CategoryDetailPage />} />
      <Route path="/produk/:slug" element={<ProductDetailPage />} />
      <Route path="/keranjang" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/pesanan/sukses/:orderId" element={<OrderSuccessPage />} />
      <Route path="/masuk" element={<LoginPage />} />
      <Route path="/daftar" element={<RegisterPage />} />
      <Route path="/akun/pesanan" element={<AccountOrdersPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
