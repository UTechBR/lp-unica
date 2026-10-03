import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import { alturaCls, ajudaCls, campoWrapCls, controleCls, erroCls, opcionalCls, rotuloCls } from './form/estilos';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Obrigatório no padrão: um exemplo do formato esperado (ex.: "nome@exemplo.com"). */
  placeholder: string;
  error?: string;
  hint?: string;
  /** Mostra "(opcional)" no rótulo. Sem isso, o campo é tratado como obrigatório. */
  optional?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, optional, id, className, ...rest }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className={campoWrapCls}>
        <label htmlFor={inputId} className={rotuloCls}>
          {label} {optional && <span className={opcionalCls}>(opcional)</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          required={!optional}
          aria-invalid={error ? true : undefined}
          aria-describedby={[error && errorId, hint && hintId].filter(Boolean).join(' ') || undefined}
          className={cn(controleCls, alturaCls, className)}
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

Input.displayName = 'Input';
