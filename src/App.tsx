import { useLocation } from "react-router-dom";
import AppRouter from "@/router/AppRouter";
import Footer from "@/components/Footer";
import { MITRA_LIST } from "@/data/mockData";

const KNOWN_STATIC_ROUTES = ["/", "/mitra"];

function App() {
  const location = useLocation();

  const isKnownRoute =
    KNOWN_STATIC_ROUTES.includes(location.pathname) ||
    MITRA_LIST.some((m) => location.pathname === `/mitra/${m.masking_name}`);

  return (
    <div id="app">
      <AppRouter />
      {isKnownRoute && <Footer />}
    </div>
  );
}

export default App;
