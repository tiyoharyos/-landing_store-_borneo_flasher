import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "@iconify/react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "inverted"
  | "outline"
  | "ghost"
  | "danger"
  | "subtle";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: string;
  iconRight?: string;
  children?: ReactNode;
}

const ICON_SIZE: Record<ButtonSize, number> = { sm: 15, md: 17, lg: 19 };

/* 4 varian utama sesuai style guide: Primary / Secondary / Inverted / Outlined */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand border-brand text-white hover:bg-brand-dark hover:border-brand-dark",
  secondary:
    "bg-cream border-cream text-ink hover:bg-cream-deep hover:border-cream-deep",
  inverted:
    "bg-ink border-ink text-surface hover:bg-black hover:border-black",
  outline:
    "bg-surface border-line text-ink hover:bg-cream",
  ghost:
    "bg-transparent border-transparent text-ink-soft hover:bg-cream-deep hover:text-ink",
  subtle:
    "bg-cream border-cream text-ink hover:bg-cream-deep",
  danger:
    "bg-warn border-warn text-white hover:brightness-90",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-[34px] px-[16px] text-[12.5px] rounded-full gap-1.5",
  md: "h-[42px] px-[22px] text-sm rounded-full gap-2",
  lg: "h-[50px] px-7 text-[15px] rounded-full gap-2",
};

const SPINNER_BORDER: Record<ButtonVariant, string> = {
  primary: "border-white/45 border-t-white",
  inverted: "border-white/45 border-t-white",
  danger: "border-white/45 border-t-white",
  secondary: "border-ink-soft/20 border-t-ink-soft",
  outline: "border-ink-soft/20 border-t-ink-soft",
  ghost: "border-ink-soft/20 border-t-ink-soft",
  subtle: "border-ink-soft/20 border-t-ink-soft",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    icon,
    iconRight,
    className = "",
    children,
    disabled,
    type = "button",
    ...rest
  },
  ref
) {
  const classes = [
    "inline-flex items-center justify-center border-[1.5px] font-semibold whitespace-nowrap select-none cursor-pointer transition-colors active:translate-y-px active:scale-[0.99] focus-visible:outline-none focus-visible:ring-[3.5px] focus-visible:ring-brand/15",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? "flex w-full" : "",
    disabled || loading ? "cursor-not-allowed opacity-60" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button ref={ref} type={type} className={classes} disabled={disabled || loading} {...rest}>
      {loading && (
        <span
          className={`w-[15px] h-[15px] rounded-full border-2 animate-spin ${SPINNER_BORDER[variant]}`}
          aria-hidden="true"
        />
      )}
      {!loading && icon && <Icon icon={icon} width={ICON_SIZE[size]} />}
      {children && <span>{children}</span>}
      {!loading && iconRight && <Icon icon={iconRight} width={ICON_SIZE[size]} />}
    </button>
  );
});

export default Button;
