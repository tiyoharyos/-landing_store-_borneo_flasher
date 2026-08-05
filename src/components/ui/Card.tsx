import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  interactive?: boolean;
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
    "bg-surface border border-line rounded-[18px] shadow-sm transition-all",
    noPadding ? "" : "p-[1.4rem]",
    interactive ? "cursor-pointer hover:shadow-md hover:border-cream-deep hover:-translate-y-0.5" : "",
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
    <div className={`flex items-start justify-between gap-3 mb-4 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`font-display font-extrabold text-[1.05rem] text-ink ${className}`} {...rest}>
      {children}
    </p>
  );
}

export function CardSubtitle({ className = "", children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-[12.5px] text-muted mt-0.5 ${className}`} {...rest}>
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
    <div
      className={`mt-[1.1rem] pt-4 border-t border-line flex items-center justify-end gap-2.5 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
