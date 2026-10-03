import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import { ajudaCls, campoWrapCls, controleCls, erroCls, opcionalCls, rotuloCls } from './form/estilos';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, optional, id, className, rows = 5, ...rest }, ref) => {
    const areaId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    const errorId = `${areaId}-error`;
    const hintId = `${areaId}-hint`;

    return (
      <div className={campoWrapCls}>
        <label htmlFor={areaId} className={rotuloCls}>
          {label} {optional && <span className={opcionalCls}>(opcional)</span>}
        </label>
        <textarea
          ref={ref}
          id={areaId}
          rows={rows}
          required={!optional}
          aria-invalid={error ? true : undefined}
          aria-describedby={[error && errorId, hint && hintId].filter(Boolean).join(' ') || undefined}
          className={cn(controleCls, 'resize-y py-3', className)}
          {...rest}
        />
        {hint && (
          <p id={hintId} className={ajudaCls}>
            {hint}
          </p>
        )}
        <span id={errorId} className={erroCls} aria-live="polite">
          {error}
        </span>
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
