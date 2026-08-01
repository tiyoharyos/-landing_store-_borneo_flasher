import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Icon } from "@iconify/react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  /** Iconify icon id, ditampilkan di sisi kiri input */
  icon?: string;
  containerClassName?: string;
}

const FIELD_BASE = "w-full h-11 border-[1.5px] rounded-xl bg-surface px-3.5 text-[13.75px] font-body text-ink outline-none transition-all placeholder:text-muted focus:border-brand focus:ring-[3.5px] focus:ring-brand/15";

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
        {icon && <Icon icon={icon} width={17} className="absolute left-[13px] text-muted pointer-events-none" />}
        <input
          ref={ref}
          id={inputId}
          className={`${FIELD_BASE} ${icon ? "pl-10" : ""} ${
            error ? "border-warn focus:ring-warn/15" : "border-line"
          } ${className} transition-colors duration-200`}
          {...rest}
        />
      </div>
      {error ? (
        <span className="text-xs text-warn font-semibold">{error}</span>
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
        className={`${FIELD_BASE} h-auto py-2.5 resize-y leading-relaxed ${
          error ? "border-warn focus:ring-warn/15" : "border-line"
        } ${className} transition-colors duration-200`}
        {...rest}
      />
      {error ? (
        <span className="text-xs text-warn font-semibold">{error}</span>
      ) : hint ? (
        <span className="text-[11.5px] text-muted">{hint}</span>
      ) : null}
    </div>
  );
});

export default Input;
