import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';
import { alturaCls, campoWrapCls, controleCls, erroCls, opcionalCls, rotuloCls } from './form/estilos';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { label: string; value: string }[];
  /** Obrigatório no padrão: "Selecione" (ou equivalente curto). */
  placeholder: string;
  optional?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, optional, id, className, ...rest }, ref) => {
    const selectId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    const errorId = `${selectId}-error`;

    return (
      <div className={campoWrapCls}>
        <label htmlFor={selectId} className={rotuloCls}>
          {label} {optional && <span className={opcionalCls}>(opcional)</span>}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={!optional}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(controleCls, alturaCls, 'appearance-none pr-10', className)}
            {...rest}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary-300"
            aria-hidden="true"
          />
        </div>
        <span id={errorId} className={erroCls} aria-live="polite">
          {error}
        </span>
      </div>
    );
  },
);

Select.displayName = 'Select';
