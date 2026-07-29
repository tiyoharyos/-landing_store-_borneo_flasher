import type { FormHTMLAttributes, HTMLAttributes, ReactNode } from "react";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children?: ReactNode;
}

/** Wrapper <form> yang otomatis mencegah default submit (dipakai bersama onSubmit). */
export function Form({ className = "", children, onSubmit, ...rest }: FormProps) {
  return (
    <form
      className={`ui-form ${className}`}
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

/** Grid responsif untuk menata beberapa field field berdampingan. */
export function FormRow({ columns = 2, className = "", children, ...rest }: FormRowProps) {
  return (
    <div className={`ui-form-row ui-form-row-${columns} ${className}`} {...rest}>
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
    <div className={`ui-form-section ${className}`} {...rest}>
      {title && <p className="ui-form-section-title">{title}</p>}
      {description && <p className="ui-form-section-desc">{description}</p>}
      <div className="ui-form-section-body">{children}</div>
    </div>
  );
}

/** Elemen full-width di dalam FormRow (mis. textarea alamat). */
export function FormSpan({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`ui-form-span ${className}`} {...rest}>
      {children}
    </div>
  );
}
