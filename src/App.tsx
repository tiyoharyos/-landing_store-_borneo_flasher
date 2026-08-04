import AppRouter from "@/router/AppRouter";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AddressProvider } from "@/context/AddressContext";
import { ToastProvider } from "@/components/ui/Toast";

function App() {
  return (
    <ToastProvider defaultPosition="top-right">
      <AuthProvider>
        <AddressProvider>
          <CartProvider>
            <WishlistProvider>
              <div id="app">
                <ScrollToTop />
                <AppRouter />
                <Footer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AddressProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
