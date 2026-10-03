import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { erroCls } from './estilos';
import { documentos } from '../../config/documentos';

// Peças comuns a todo formulário: aviso de obrigatórios (no início), consentimento ou
// aviso de privacidade, botão de envio, erro de envio e o estado de sucesso, que
// substitui o formulário no mesmo card.

/** Primeira linha de todo formulário: todos os campos são obrigatórios, salvo "(opcional)". */
export function AvisoObrigatorios() {
  return <p className="mb-2 text-xs text-secondary-400">Todos os campos são obrigatórios, exceto os marcados como opcionais.</p>;
}

export function LinkPrivacidade() {
  return (
    <a
      href={documentos.privacidade.href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 hover:text-secondary"
    >
      Política de Privacidade<span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

/**
 * Para canais em que o tratamento não depende de consentimento (ouvidoria, denúncias):
 * informa o uso dos dados, sem checkbox.
 */
export function AvisoPrivacidade({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-relaxed text-secondary-400">{children}</p>;
}

interface ConsentimentoProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  error?: string;
  children: ReactNode;
}

export const Consentimento = forwardRef<HTMLInputElement, ConsentimentoProps>(
  ({ id, error, children, ...rest }, ref) => {
    const errorId = `${id}-error`;
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="flex items-start gap-2.5 text-xs leading-relaxed text-secondary-400">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            {...rest}
          />
          <span>{children}</span>
        </label>
        <span id={errorId} className={erroCls} aria-live="polite">
          {error}
        </span>
      </div>
    );
  },
);

Consentimento.displayName = 'Consentimento';

export function BotaoEnviar({ enviando, children }: { enviando: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={enviando}
      className="h-12 w-full rounded-control bg-brand font-heading text-base font-bold text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
    >
      {enviando ? 'Enviando...' : children}
    </button>
  );
}

/** Mensagem de falha no envio, lida por leitores de tela. Vazia quando não há erro. */
export function ErroEnvio({ mensagem }: { mensagem: string | null }) {
  return (
    <p role="status" aria-live="polite" className="text-sm font-medium text-primary empty:hidden">
      {mensagem}
    </p>
  );
}

interface SucessoEnvioProps {
  titulo: string;
  children: ReactNode;
  /** Ex.: número de protocolo, exibido em destaque. */
  destaque?: string;
  acao?: { rotulo: string; onClick: () => void };
}

/** Substitui o formulário depois de um envio bem-sucedido, no mesmo card. */
export function SucessoEnvio({ titulo, children, destaque, acao }: SucessoEnvioProps) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-6 text-center">
      <CheckCircle2 size={44} className="text-primary" aria-hidden="true" />
      <h3 className="font-heading text-xl font-semibold text-secondary">{titulo}</h3>
      {destaque && (
        <p className="rounded-control bg-secondary-50 px-4 py-2 font-heading text-lg font-bold tracking-wide text-secondary">
          {destaque}
        </p>
      )}
      <div className="max-w-sm text-sm text-secondary-400">{children}</div>
      {acao && (
        <button
          type="button"
          onClick={acao.onClick}
          className="mt-2 text-sm font-semibold text-secondary underline underline-offset-4 hover:text-primary"
        >
          {acao.rotulo}
        </button>
      )}
    </div>
  );
}

// Mensagens para os códigos de erro devolvidos pelos scripts em public/api/.
const mensagensErro: Record<string, string> = {
  network: 'Não foi possível conectar. Verifique sua internet e tente de novo.',
  missing_consent: 'Marque a autorização para continuar.',
  file_too_large: 'Os anexos passaram do tamanho permitido. Reduza ou remova algum arquivo e tente de novo.',
  too_many_files: 'Há anexos demais. Remova algum e tente de novo.',
  file_type_not_allowed: 'Um dos anexos tem um tipo de arquivo não aceito.',
};

export const mensagemDeErro = (codigo: string) =>
  mensagensErro[codigo] ?? 'Não foi possível enviar agora. Tente de novo em alguns minutos.';
