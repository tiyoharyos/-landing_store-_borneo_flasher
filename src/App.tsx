import AppRouter from "@/router/AppRouter";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AddressProvider } from "@/context/AddressContext";

function App() {
  return (
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
  );
}

export default App;
