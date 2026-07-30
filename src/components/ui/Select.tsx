import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { Icon } from "@iconify/react";

const FIELD_INPUT_BASE =
  "w-full h-11 rounded-xl border-[1.5px] bg-white px-[14px] font-body text-[13.75px] text-ink outline-none transition-[border-color,box-shadow] duration-[180ms]";

const fieldInputBorder = (hasError?: string) =>
  hasError
    ? "border-warn focus:shadow-[0_0_0_3.5px_rgba(217,78,63,0.14)]"
    : "border-line focus:border-brand focus:shadow-[0_0_0_3.5px_rgba(192,39,45,0.14)]";

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
          className={`${FIELD_INPUT_BASE} ${fieldInputBorder(error)} cursor-pointer appearance-none pr-9 ${className}`}
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
        <Icon icon="mdi:chevron-down" width={17} className="pointer-events-none absolute right-[13px] text-muted" />
      </div>
      {error ? (
        <span className="text-xs font-semibold text-warn">{error}</span>
      ) : hint ? (
        <span className="text-[11.5px] text-muted">{hint}</span>
      ) : null}
    </div>
  );
});

export default Select;
