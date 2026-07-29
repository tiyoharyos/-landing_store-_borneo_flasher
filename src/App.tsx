import AppRouter from "@/router/AppRouter";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div id="app">
          <AppRouter />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
