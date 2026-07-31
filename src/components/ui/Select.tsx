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
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="text-[12.5px] font-bold text-ink-soft">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          className={`w-full h-11 border-[1.5px] rounded-xl bg-surface pl-3.5 pr-9 text-[13.75px] font-body text-ink outline-none appearance-none cursor-pointer transition-all focus:border-brand focus:ring-[3.5px] focus:ring-brand/15 ${
            error ? "border-warn focus:ring-warn/15" : "border-line"
          } ${className}`}
          {...rest}
        >
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
        <Icon icon="mdi:chevron-down" width={17} className="absolute right-[13px] text-muted pointer-events-none" />
      </div>
      {error ? (
        <span className="text-xs text-warn font-semibold">{error}</span>
      ) : hint ? (
        <span className="text-[11.5px] text-muted">{hint}</span>
      ) : null}
    </div>
  );
});

export default Select;
