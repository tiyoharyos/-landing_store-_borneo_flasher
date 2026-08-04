import logoLpks from "../assets/img/logo-lpks.png";

interface LogoProps {
  className?: string;
  // variant dihapus saja jika ingin sepenuhnya otomatis mengikuti sistem tema
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img src={logoLpks} alt="Borneo Flasher Store" className="h-10 w-auto" />
      <div className="leading-tight">
        {/* Gunakan text-ink agar otomatis hitam di mode terang dan putih di mode gelap */}
        <p className="font-display font-extrabold tracking-tight text-[15px] text-ink">
          BORNEO FLASHER
        </p>
        {/* Gunakan text-muted agar otomatis abu-abu menyesuaikan mode */}
        <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-muted">
          Web Store
        </p>
      </div>
    </div>
  );
}