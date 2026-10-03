import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, id, className, required, rows = 5, ...rest }, ref) => {
    const areaId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    const errorId = `${areaId}-error`;

    return (
      <div className="flex flex-col gap-1.5 text-left">
        <label htmlFor={areaId} className="text-sm font-semibold text-secondary">
          {label} {required && <span className="text-primary">*</span>}
        </label>
        <textarea
          ref={ref}
          id={areaId}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'w-full resize-y rounded-control border border-surface-borderMuted bg-white px-4 py-3 text-secondary placeholder:text-secondary-300 transition-colors duration-200',
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

TextArea.displayName = 'TextArea';
