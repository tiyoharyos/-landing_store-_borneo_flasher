import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import NavbarHome from "@/components/NavbarHome";
import { MITRA_LIST } from "@/data/mockData";

export default function MitraPage() {
  return (
    <div
      className="mitraSection"
      style={{ background: "linear-gradient(180deg, #FBEAEA 0%, #F5F5F5 100%)" }}
    >
      <NavbarHome />
      <div className="container">
        <div className="contentMitra">
          <div className="headerMitra">
            <p className="titleHeader">Mitra Kami</p>
            <p className="descHeader">Tersebar diseluruh Indonesia</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 justify-center">
            {MITRA_LIST.map((item) => (
              <div key={item.id} className="card-mitra">
                <div>
                  <p className="nameMitra">{item.name}</p>
                  <p className="addressMitra">{item.address}</p>
                </div>
                <div className="footerCard">
                  <a
                    href={`http://wa.me/62${item.phone}`}
                    className="numberMitra"
                    target="_blank"
                    rel="noreferrer"
                    title="Hubungi via WhatsApp"
                  >
                    <Icon icon="ic:baseline-whatsapp" width={20} />
                  </a>
                  <Link to={`/mitra/${item.masking_name}`} className="btnMitra">
                    <Icon icon="mdi:open-in-new" />
                    Kunjungi Website
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
