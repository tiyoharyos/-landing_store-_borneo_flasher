import { useLocation } from "react-router-dom";
import AppRouter from "@/router/AppRouter";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AddressProvider } from "@/context/AddressContext";
import { ToastProvider } from "@/components/ui/Toast";
import CustomCursor from "@/components/ui/CustomCursor";
import CursorStyleUpdater from "@/components/ui/CursorStyleUpdater";

// Halaman yang tampil tanpa navbar & footer global (layout auth full-page sendiri)
const NO_CHROME_ROUTES = ["/masuk", "/daftar"];

function App() {
  const { pathname } = useLocation();
  const hideChrome = NO_CHROME_ROUTES.includes(pathname);

  return (
    <ToastProvider defaultPosition="top-right">
      <AuthProvider>
        <AddressProvider>
          <CartProvider>
            <WishlistProvider>
              <div id="app">
                <CustomCursor />
                <CursorStyleUpdater />
                <ScrollToTop />
                <AppRouter />
                {!hideChrome && <Footer />}
              </div>
            </WishlistProvider>
          </CartProvider>
        </AddressProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
