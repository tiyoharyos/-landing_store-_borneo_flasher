import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import NavbarHome from "@/components/NavbarHome";
import { CLASS_TABS, classCountByCategory, type ClassCategory } from "@/data/mockData";

const CATEGORY_ICON: Record<ClassCategory, string> = {
  offline: "mdi:school-outline",
  online: "mdi:laptop",
  tour: "mdi:bus-side",
  khusus: "mdi:star-outline",
};

export default function CategoryPage() {
  return (
    <div>
      <NavbarHome />
      <div className="container">
        <div className="category-hero">
          <p className="title">Kategori Kelas</p>
          <p className="desc">Pilih jenis kelas training LPKS Borneo Flasher Indonesia</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-16">
          {CLASS_TABS.map((tab) => {
            const count = classCountByCategory(tab.key);
            return (
              <div key={tab.key} className="category-card">
                <div>
                  <div className="icon-wrap">
                    <Icon icon={CATEGORY_ICON[tab.key]} />
                  </div>
                  <p className="name mt-3">{tab.label}</p>
                  <p className="count">
                    {count > 0 ? `${count} kelas tersedia` : "Belum ada kelas"}
                  </p>
                </div>
                <Link to={`/kategori/${tab.key}`} className="btn-visit">
                  <Icon icon="mdi:arrow-right" />
                  Lihat Kelas
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
