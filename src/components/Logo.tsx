import logoLpks from "../assets/img/logo-lpks.png";

interface LogoProps {
  variant?: "auto" | "light";
  className?: string;
}

export default function Logo({ variant = "auto", className = "" }: LogoProps) {
  const isLight = variant === "light";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img src={logoLpks} alt="Borneo Flasher Store" className="h-10 w-auto" />
      <div className="leading-tight">
        <p
          className={`font-display font-extrabold tracking-tight text-[15px] ${
            isLight ? "text-[var(--footer-text)]" : "text-ink"
          }`}
        >
          BORNEO FLASHER
        </p>
        <p
          className={`font-mono text-[9px] tracking-[0.18em] uppercase ${
            isLight ? "text-[var(--footer-muted)]" : "text-muted"
          }`}
        >
          Web Store
        </p>
      </div>
    </div>
  );
}