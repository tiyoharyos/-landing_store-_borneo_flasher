import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // behavior "instant" dipakai supaya reset posisi scroll tidak ikut
    // dianimasikan oleh CSS `scroll-behavior: smooth` global — biar transisi
    // fade/slide dari PageTransition yang menangani kesan "smooth"-nya,
    // bukan scroll yang mengejar ke atas.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
