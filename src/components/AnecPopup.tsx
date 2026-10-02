import { useState } from 'react';
import { X } from 'lucide-react';

const anecImage = '/images/card-1118-1.jpg';

const ANEC_LINK = 'https://anecbrasil.com.br/certificaco';

// Faixa promocional discreta, sem bloquear a primeira impressão da página.
export function AnecPopup() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Certificação ANEC com desconto exclusivo"
      className="relative border-b border-primary/20 bg-secondary px-4 py-2 text-white"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 pr-8 sm:gap-5">
        <a
          href={ANEC_LINK}
          target="_blank"
          rel="noreferrer"
          className="flex min-w-0 items-center gap-3 text-sm font-semibold transition-opacity hover:opacity-85 sm:text-base"
        >
          <img
            src={anecImage}
            alt=""
            width={96}
            height={54}
            className="h-10 w-[72px] shrink-0 rounded object-cover sm:h-12 sm:w-[86px]"
          />
          <span className="truncate">Certificação ANEC com desconto exclusivo: use o cupom UNICA20</span>
        </a>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Fechar aviso da ANEC"
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>
    </aside>
  );
}
