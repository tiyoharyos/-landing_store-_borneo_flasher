import AppRouter from "@/router/AppRouter";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div id="app">
          <ScrollToTop />
          <AppRouter />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
