import { forwardRef } from "react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
  buttonClasses,
  ICON_SIZE,
  type ButtonSize,
  type ButtonVariant,
} from "./Button";

interface SharedProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: string;
  iconRight?: string;
  className?: string;
  children?: ReactNode;
}

export type ButtonLinkProps = SharedProps &
  Omit<LinkProps, "className" | "children">;

const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  { variant = "primary", size = "md", fullWidth = false, icon, iconRight, className = "", children, ...rest },
  ref
) {
  const classes = buttonClasses({ variant, size, fullWidth, className });
  return (
    <Link ref={ref} className={classes} {...rest}>
      {icon && <Icon icon={icon} width={ICON_SIZE[size]} />}
      {children && <span>{children}</span>}
      {iconRight && <Icon icon={iconRight} width={ICON_SIZE[size]} />}
    </Link>
  );
});

export type ExternalButtonLinkProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">;

export const ExternalButtonLink = forwardRef<HTMLAnchorElement, ExternalButtonLinkProps>(
  function ExternalButtonLink(
    { variant = "primary", size = "md", fullWidth = false, icon, iconRight, className = "", children, ...rest },
    ref
  ) {
    const classes = buttonClasses({ variant, size, fullWidth, className });
    return (
      <a ref={ref} className={classes} {...rest}>
        {icon && <Icon icon={icon} width={ICON_SIZE[size]} />}
        {children && <span>{children}</span>}
        {iconRight && <Icon icon={iconRight} width={ICON_SIZE[size]} />}
      </a>
    );
  }
);

export default ButtonLink;
