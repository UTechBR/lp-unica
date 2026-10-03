import { forwardRef, useState } from 'react';
import type { ChangeEvent, TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import { ajudaCls, campoWrapCls, controleCls, erroCls, opcionalCls, rotuloCls } from './form/estilos';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  /** Obrigatório no padrão: uma instrução do que escrever. */
  placeholder: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  /** Mínimo de caracteres (sem os espaços das pontas), mostrado no contador. */
  minChars: number;
  /** Máximo de caracteres, mostrado no contador depois de atingido o mínimo. */
  maxChars: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, optional, minChars, maxChars, id, className, rows = 5, onChange, ...rest }, ref) => {
    const areaId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    const errorId = `${areaId}-error`;
    const hintId = `${areaId}-hint`;
    const contadorId = `${areaId}-contador`;
    const [total, setTotal] = useState(0);

    const atingiuMinimo = total >= minChars;
    const contador = atingiuMinimo ? `${total}/${maxChars}` : `${total}/${minChars}`;
    const contadorDescricao = atingiuMinimo
      ? `${total} de no máximo ${maxChars} caracteres`
      : `${total} de no mínimo ${minChars} caracteres`;

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
          maxLength={maxChars}
          aria-invalid={error ? true : undefined}
          aria-describedby={[error && errorId, hint && hintId, contadorId].filter(Boolean).join(' ')}
          className={cn(controleCls, 'resize-y py-3', className)}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
            setTotal(event.target.value.trim().length);
            onChange?.(event);
          }}
          {...rest}
        />
        {hint && (
          <p id={hintId} className={ajudaCls}>
            {hint}
          </p>
        )}
        {/* Erro à esquerda, contador à direita, na mesma linha. */}
        <div className="flex items-start justify-between gap-3">
          <span id={errorId} className={erroCls} aria-live="polite">
            {error}
          </span>
          <span
            id={contadorId}
            className={cn('shrink-0 text-xs tabular-nums', atingiuMinimo ? 'text-secondary-700' : 'text-secondary-400')}
          >
            <span aria-hidden="true">{contador}</span>
            <span className="sr-only">{contadorDescricao}</span>
          </span>
        </div>
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
