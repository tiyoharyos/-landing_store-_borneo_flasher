import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "@iconify/react";

export type ButtonVariant = "primary" | "outline" | "ghost" | "danger" | "subtle";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  /** Iconify icon id, ditampilkan sebelum label */
  icon?: string;
  /** Iconify icon id, ditampilkan setelah label */
  iconRight?: string;
  children?: ReactNode;
}

const ICON_SIZE: Record<ButtonSize, number> = { sm: 15, md: 17, lg: 19 };

export const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 border-[1.5px] border-transparent font-body font-semibold whitespace-nowrap select-none transition-[background-color,border-color,color,transform,box-shadow] duration-[180ms] enabled:active:translate-y-px enabled:active:scale-[0.99] focus-visible:outline-none focus-visible:shadow-[0_0_0_3.5px_rgba(192,39,45,0.14)] disabled:cursor-not-allowed disabled:opacity-[0.62]";

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-[34px] gap-1.5 rounded-lg px-[13px] text-[12.5px]",
  md: "h-[42px] rounded-xl px-[18px] text-sm",
  lg: "h-[50px] rounded-xl px-6 text-[15px]",
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand border-brand text-white enabled:hover:bg-brand-dark enabled:hover:border-brand-dark",
  outline: "bg-white border-brand text-brand enabled:hover:bg-brand-tint",
  ghost: "bg-transparent border-transparent text-ink-soft enabled:hover:bg-cream-deep enabled:hover:text-ink",
  subtle: "bg-cream-deep border-cream-deep text-ink-soft enabled:hover:bg-line",
  danger: "bg-warn border-warn text-white enabled:hover:bg-[#b73d30] enabled:hover:border-[#b73d30]",
};

const SPINNER_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "border-[rgba(255,255,255,0.45)] border-t-white",
  outline: "border-[rgba(28,22,19,0.18)] border-t-ink-soft",
  ghost: "border-[rgba(28,22,19,0.18)] border-t-ink-soft",
  subtle: "border-[rgba(28,22,19,0.18)] border-t-ink-soft",
  danger: "border-[rgba(255,255,255,0.45)] border-t-white",
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
    BUTTON_BASE,
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    fullWidth ? "flex w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button ref={ref} type={type} className={classes} disabled={disabled || loading} {...rest}>
      {loading && (
        <span
          className={`h-[15px] w-[15px] rounded-full border-2 [animation:ui-spin_0.65s_linear_infinite] ${SPINNER_VARIANT_CLASSES[variant]}`}
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
