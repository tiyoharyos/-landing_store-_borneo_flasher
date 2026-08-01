import logoLpks from "../assets/img/logo-lpks.png";
interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
}

export default function Logo({ variant = "dark", className = "" }: LogoProps) {
  const isLight = variant === "light";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img src={logoLpks} alt="Borneo Flasher Store" className="h-10 w-auto" />
      <div className="leading-tight">
        <p
          className="font-display font-extrabold tracking-tight text-[15px]"
          style={{ color: isLight ? "#faf6f1" : "#1c1613" }}
        >
          BORNEO FLASHER
        </p>
        <p
          className="font-mono text-[9px] tracking-[0.18em] uppercase"
          style={{ color: isLight ? "#e7ddd1" : "#8a8078" }}
        >
          Web Store
        </p>
      </div>
    </div>
  );
}
