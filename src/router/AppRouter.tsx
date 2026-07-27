import { Routes, Route } from "react-router-dom";
import SearchPage from "@/pages/SearchPage";
import MitraPage from "@/pages/MitraPage";
import MitraDetailPage from "@/pages/MitraDetailPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/mitra" element={<MitraPage />} />
      <Route path="/mitra/:nameStoreMitra" element={<MitraDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
