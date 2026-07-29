import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { Icon } from "@iconify/react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, options, placeholder, className = "", containerClassName = "", id, ...rest },
  ref
) {
  const autoId = useId();
  const selectId = id || autoId;
  return (
    <div className={`ui-field ${error ? "has-error" : ""} ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="ui-field-label">
          {label}
        </label>
      )}
      <div className="ui-select-wrap">
        <select ref={ref} id={selectId} className={`ui-input ui-select ${className}`} {...rest}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <Icon icon="mdi:chevron-down" width={17} className="ui-select-icon" />
      </div>
      {error ? (
        <span className="ui-field-error">{error}</span>
      ) : hint ? (
        <span className="ui-field-hint">{hint}</span>
      ) : null}
    </div>
  );
});

export default Select;
