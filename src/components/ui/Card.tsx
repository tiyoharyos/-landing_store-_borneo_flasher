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
    "rounded-[18px] border border-line bg-white shadow-card-xs transition-[box-shadow,transform,border-color] duration-200",
    noPadding ? "p-0" : "p-[1.4rem]",
    interactive ? "cursor-pointer hover:-translate-y-0.5 hover:border-cream-deep hover:shadow-card-md" : "",
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
    <div className={`mb-4 flex items-start justify-between gap-3 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`font-display text-[1.05rem] font-extrabold text-ink ${className}`} {...rest}>
      {children}
    </p>
  );
}

export function CardSubtitle({ className = "", children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`mt-0.5 text-[12.5px] text-muted ${className}`} {...rest}>
      {children}
    </p>
  );
}

export function CardBody({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-[1.1rem] flex items-center justify-end gap-2.5 border-t border-line pt-4 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export default Card;
