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
    "ui-btn",
    `ui-btn-${variant}`,
    `ui-btn-${size}`,
    fullWidth ? "ui-btn-block" : "",
    loading ? "is-loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button ref={ref} type={type} className={classes} disabled={disabled || loading} {...rest}>
      {loading && <span className="ui-btn-spinner" aria-hidden="true" />}
      {!loading && icon && <Icon icon={icon} width={ICON_SIZE[size]} />}
      {children && <span className="ui-btn-label">{children}</span>}
      {!loading && iconRight && <Icon icon={iconRight} width={ICON_SIZE[size]} />}
    </button>
  );
});

export default Button;
