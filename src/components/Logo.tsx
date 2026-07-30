interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
}

export default function Logo({ variant = "dark", className = "" }: LogoProps) {
  const isLight = variant === "light";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <rect width="34" height="34" rx="9" fill="#C0272D" />
        <path
          d="M11 24V10L17 17L23 10V24"
          stroke="#F2A93B"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="leading-tight">
        <p
          className={`font-display font-extrabold tracking-tight text-[15px] ${
            isLight ? "text-cream" : "text-ink"
          }`}
        >
          BORNEO FLASHER
        </p>
        <p
          className={`font-mono text-[9px] tracking-[0.18em] uppercase ${
            isLight ? "text-line" : "text-muted"
          }`}
        >
          LPKS Indonesia
        </p>
      </div>
    </div>
  );
}
