import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "@iconify/react";

import {
  buttonClasses,
  ICON_SIZE,
  SPINNER_BORDER,
  type ButtonSize,
  type ButtonVariant,
} from "./buttonStyles";

export type { ButtonSize, ButtonVariant } from "./buttonStyles";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: string;
  iconRight?: string;
  children?: ReactNode;
}

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
  const classes = buttonClasses({
    variant,
    size,
    fullWidth,
    disabled: disabled || loading,
    className,
  });

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
