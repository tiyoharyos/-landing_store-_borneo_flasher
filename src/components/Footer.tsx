import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import logoBlack from "@/assets/img/logo-black.png";
import mandiri from "@/assets/img/mandiri.png";
import bni from "@/assets/img/bni.png";
import bri from "@/assets/img/bri.png";
import bca from "@/assets/img/bca.png";
import ovo from "@/assets/img/ovo.png";
import dana from "@/assets/img/dana.png";
import qris from "@/assets/img/qris.png";
import linkBank from "@/assets/img/link.png";
import jne from "@/assets/img/jne.png";
import jnt from "@/assets/img/jnt.png";
import sicepat from "@/assets/img/sicepat.png";
import anteraja from "@/assets/img/anteraja.png";
import lion from "@/assets/img/lion.png";
import { STORE_ADDRESS, WHATSAPP_NUMBER } from "@/config/config";

export default function Footer() {
  const location = useLocation();
  const isSearchOrMitraDetail =
    location.pathname === "/" || location.pathname.startsWith("/mitra/");

  return (
    <footer className="footer mt-auto">
      <div className="container">
        {!isSearchOrMitraDetail && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-4 mb-4 border-b border-[var(--color-light)]">
            <div className="md:col-span-2">
              <img src={logoBlack} alt="GadgetShop" className="w-20" />
              <div className="content-info mt-3">
                <p>
                  <Link to="/privasi">Kebijakan Privasi</Link>
                </p>
                <p>
                  <Link to="/terms">Syarat dan Ketentuan</Link>
                </p>
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="title-info">Menu</p>
              <div className="content-info">
                <p>
                  <Link to="/">Home</Link>
                </p>
                <p>
                  <Link to="/mitra">Mitra Kami</Link>
                </p>
              </div>
            </div>
            <div className="md:col-span-4">
              <p className="title-bayar">Pembayaran</p>
              <div className="content-bayar flex flex-wrap items-center">
                {[mandiri, bni, bri, bca, ovo, dana, qris, linkBank].map((img, i) => (
                  <img key={i} src={img} alt="metode pembayaran" />
                ))}
              </div>
            </div>
            <div className="md:col-span-4">
              <p className="title-bayar">Pengiriman</p>
              <div className="content-bayar flex flex-wrap items-center">
                {[jne, jnt, sicepat, anteraja, lion].map((img, i) => (
                  <img key={i} src={img} alt="metode pengiriman" />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="cr">
          <p className="flex items-center gap-2">
            <Icon icon="mdi:map-marker" />
            {STORE_ADDRESS}
          </p>
          <p>Copyright © 2026 Gadgetshop All rights reserved.</p>
        </div>
      </div>

      <a
        href={`https://api.whatsapp.com/send?phone=62${WHATSAPP_NUMBER}&text=Halo+Admin+saya+ingin+bertanya`}
        className="float"
        target="_blank"
        rel="noreferrer"
        title="Hubungi Admin"
      >
        <Icon icon="ic:baseline-whatsapp" />
      </a>
    </footer>
  );
}
