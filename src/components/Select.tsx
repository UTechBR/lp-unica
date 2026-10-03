import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, id, className, required, ...rest }, ref) => {
    const selectId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    const errorId = `${selectId}-error`;

    return (
      <div className="flex flex-col gap-1.5 text-left">
        <label htmlFor={selectId} className="text-sm font-semibold text-secondary">
          {label} {required && <span className="text-primary">*</span>}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'w-full appearance-none rounded-control border border-surface-borderMuted bg-white px-4 py-3 pr-10 text-secondary transition-colors duration-200',
              'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
              error && 'border-primary-400 focus:border-primary-500 focus:ring-primary/30',
              className,
            )}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
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
        {error && (
          <p id={errorId} role="alert" className="text-xs font-medium text-primary-600">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
