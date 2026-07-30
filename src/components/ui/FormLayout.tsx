import type { FormHTMLAttributes, HTMLAttributes, ReactNode } from "react";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children?: ReactNode;
}

/** Wrapper <form> yang otomatis mencegah default submit (dipakai bersama onSubmit). */
export function Form({ className = "", children, onSubmit, ...rest }: FormProps) {
  return (
    <form
      className={`flex flex-col gap-4 ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(e);
      }}
      {...rest}
    >
      {children}
    </form>
  );
}

interface FormRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Jumlah kolom pada layar besar. Otomatis menjadi 1 kolom di layar kecil. */
  columns?: 1 | 2 | 3;
  children?: ReactNode;
}

const ROW_COLUMNS: Record<1 | 2 | 3, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
};

/** Grid responsif untuk menata beberapa field field berdampingan. */
export function FormRow({ columns = 2, className = "", children, ...rest }: FormRowProps) {
  return (
    <div className={`grid gap-3.5 ${ROW_COLUMNS[columns]} ${className}`} {...rest}>
      {children}
    </div>
  );
}

interface FormSectionProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: string;
  children?: ReactNode;
}

/** Grup field dengan judul kecil di atasnya — cocok untuk form panjang bertahap. */
export function FormSection({ title, description, className = "", children, ...rest }: FormSectionProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`} {...rest}>
      {title && <p className="font-display text-[0.95rem] font-extrabold text-ink">{title}</p>}
      {description && <p className="mb-1.5 text-xs text-muted">{description}</p>}
      <div className="flex flex-col gap-3.5">{children}</div>
    </div>
  );
}

/** Elemen full-width di dalam FormRow (mis. textarea alamat). */
export function FormSpan({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`col-span-full ${className}`} {...rest}>
      {children}
    </div>
  );
}
