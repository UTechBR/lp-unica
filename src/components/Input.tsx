import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, required, ...rest }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5 text-left">
        <label htmlFor={inputId} className="text-sm font-semibold text-secondary">
          {label} {required && <span className="text-primary">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'w-full rounded-control border border-surface-borderMuted bg-white px-4 py-3 text-secondary placeholder:text-secondary-300 transition-colors duration-200',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            error && 'border-primary-400 focus:border-primary-500 focus:ring-primary/30',
            className,
          )}
          {...rest}
        />
        {hint && !error && <p className="text-xs text-secondary-300">{hint}</p>}
        {error && (
          <p id={errorId} role="alert" className="text-xs font-medium text-primary-600">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
