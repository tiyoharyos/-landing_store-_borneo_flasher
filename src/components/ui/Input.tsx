import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Icon } from "@iconify/react";

const FIELD_INPUT_BASE =
  "w-full rounded-xl border-[1.5px] bg-white px-[14px] font-body text-[13.75px] text-ink outline-none transition-[border-color,box-shadow] duration-[180ms] placeholder:text-muted";

const fieldInputBorder = (hasError?: string) =>
  hasError
    ? "border-warn focus:shadow-[0_0_0_3.5px_rgba(217,78,63,0.14)]"
    : "border-line focus:border-brand focus:shadow-[0_0_0_3.5px_rgba(192,39,45,0.14)]";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  /** Iconify icon id, ditampilkan di sisi kiri input */
  icon?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, icon, className = "", containerClassName = "", id, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-[12.5px] font-bold text-ink-soft">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && <Icon icon={icon} width={17} className="pointer-events-none absolute left-[13px] text-muted" />}
        <input
          ref={ref}
          id={inputId}
          className={`${FIELD_INPUT_BASE} ${fieldInputBorder(error)} h-11 ${icon ? "pl-10" : ""} ${className}`}
          {...rest}
        />
      </div>
      {error ? (
        <span className="text-xs font-semibold text-warn">{error}</span>
      ) : hint ? (
        <span className="text-[11.5px] text-muted">{hint}</span>
      ) : null}
    </div>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, className = "", containerClassName = "", id, rows = 3, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-[12.5px] font-bold text-ink-soft">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={`${FIELD_INPUT_BASE} ${fieldInputBorder(error)} h-auto resize-y py-2.5 leading-[1.5] ${className}`}
        {...rest}
      />
      {error ? (
        <span className="text-xs font-semibold text-warn">{error}</span>
      ) : hint ? (
        <span className="text-[11.5px] text-muted">{hint}</span>
      ) : null}
    </div>
  );
});

export default Input;
