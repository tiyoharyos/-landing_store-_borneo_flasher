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

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, icon, className = "", containerClassName = "", id, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div className={`ui-field ${error ? "has-error" : ""} ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="ui-field-label">
          {label}
        </label>
      )}
      <div className="ui-input-wrap">
        {icon && <Icon icon={icon} width={17} className="ui-input-icon" />}
        <input
          ref={ref}
          id={inputId}
          className={`ui-input ${icon ? "has-icon" : ""} ${className}`}
          {...rest}
        />
      </div>
      {error ? (
        <span className="ui-field-error">{error}</span>
      ) : hint ? (
        <span className="ui-field-hint">{hint}</span>
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
    <div className={`ui-field ${error ? "has-error" : ""} ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="ui-field-label">
          {label}
        </label>
      )}
      <textarea ref={ref} id={inputId} rows={rows} className={`ui-input ui-textarea ${className}`} {...rest} />
      {error ? (
        <span className="ui-field-error">{error}</span>
      ) : hint ? (
        <span className="ui-field-hint">{hint}</span>
      ) : null}
    </div>
  );
});

export default Input;
