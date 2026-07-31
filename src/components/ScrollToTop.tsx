import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Setiap kali route/path berubah, otomatis scroll window ke posisi paling atas.
 * Taruh komponen ini di dalam <BrowserRouter>, biasanya bersebelahan dengan <AppRouter />.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
