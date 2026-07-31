import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Efek elevasi lebih terasa + sedikit naik saat hover */
  interactive?: boolean;
  /** Tanpa padding bawaan, dipakai kalau isinya sudah punya section sendiri */
  noPadding?: boolean;
}

export function Card({
  className = "",
  children,
  interactive = false,
  noPadding = false,
  ...rest
}: CardProps) {
  const classes = [
    "ui-card",
    interactive ? "ui-card-interactive" : "",
    noPadding ? "ui-card-flush" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`ui-card-header ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`ui-card-title ${className}`} {...rest}>
      {children}
    </p>
  );
}

export function CardSubtitle({ className = "", children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`ui-card-subtitle ${className}`} {...rest}>
      {children}
    </p>
  );
}

export function CardBody({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`ui-card-body ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`ui-card-footer ${className}`} {...rest}>
      {children}
    </div>
  );
}

export default Card;
