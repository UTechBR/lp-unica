import { useEffect, useId, useRef, useState } from 'react';
import { BancoModal } from './BancoModal';
import { bancos } from '../data/bancos';
import type { Banco } from '../types/banco';
import { cn } from '../utils/cn';

const VISIVEIS = 12;

// Ajuste óptico (altura máx. em px) para logos que pesam de mais ou de menos na grade.
const ALTURA_POR_LOGO: Record<string, number> = {
  '/images/banks/itau-1.png': 36,
  '/images/banks/CBA-1.png': 36,
  '/images/banks/alfa.png': 26,
};

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function LogoBanco({ banco, onSelect }: { banco: Banco; onSelect: (banco: Banco) => void }) {
  return (
    <li className="flex h-10 min-w-0 items-center">
      <button
        type="button"
        onClick={() => onSelect(banco)}
        aria-haspopup="dialog"
        aria-label={`Ver canais de atendimento do ${banco.nome}`}
        className="group flex h-full max-w-full items-center rounded-sm"
      >
        {/* Os arquivos são silhuetas brancas: a <img> invisível só define o tamanho e a
            cor vem de um <span> mascarado pelo logo (cinza médio → grafite no hover). */}
        <span className="relative flex max-w-full">
          <img
            src={banco.logo}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-auto max-w-[min(100%,110px)] object-contain opacity-0"
            style={{ maxHeight: ALTURA_POR_LOGO[banco.logo] ?? 30 }}
          />
          <span
            className="absolute inset-0 bg-secondary-300 transition-colors duration-300 [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] group-hover:bg-secondary group-focus-visible:bg-secondary"
            style={{ maskImage: `url("${banco.logo}")`, WebkitMaskImage: `url("${banco.logo}")` }}
          />
        </span>
      </button>
    </li>
  );
}

// Grade de bancos do hero. A ordem é embaralhada a cada visita para nenhum banco
// ficar sempre em destaque; até lá a grade fica transparente, para não "pular".
export function BancosHero() {
  const [ordem, setOrdem] = useState(bancos);
  const [pronto, setPronto] = useState(false);
  const [popAberto, setPopAberto] = useState(false);
  const [selecionado, setSelecionado] = useState<Banco | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const popId = useId();

  // Embaralha só depois da hidratação: fazer isso no estado inicial geraria HTML do
  // servidor diferente do cliente.
  useEffect(() => {
    setOrdem(embaralhar(bancos));
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!popAberto) return;
    const onPointerDown = (e: PointerEvent) => {
      if (selecionado) return; // clique dentro do modal não fecha o popover
      if (!rootRef.current?.contains(e.target as Node)) setPopAberto(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || selecionado) return;
      setPopAberto(false);
      botaoRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [popAberto, selecionado]);

  const visiveis = ordem.slice(0, VISIVEIS);
  const restantes = ordem.slice(VISIVEIS);

  return (
    <div ref={rootRef} className="relative">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-0.5 w-7 shrink-0 bg-brand" aria-hidden="true" />
        <p className="text-lg leading-snug text-secondary">
          Opere com <strong className="font-bold">mais de 20 bancos</strong> e financeiras
        </p>
      </div>

      <ul
        aria-label="Bancos e financeiras parceiros"
        className={cn(
          'bancos-hero-grid grid max-w-[560px] grid-cols-3 items-center gap-x-5 gap-y-6 sm:gap-x-8 transition-opacity duration-300 sm:grid-cols-4',
          pronto ? 'opacity-100' : 'opacity-0',
        )}
      >
        {visiveis.map((banco) => (
          <LogoBanco key={banco.id} banco={banco} onSelect={setSelecionado} />
        ))}
      </ul>

      {restantes.length > 0 && (
        <>
          <button
            ref={botaoRef}
            type="button"
            onClick={() => setPopAberto((aberto) => !aberto)}
            aria-expanded={popAberto}
            aria-controls={popId}
            className="mt-5 text-sm text-secondary underline underline-offset-4 hover:text-black"
          >
            + {restantes.length} instituições
          </button>

          <div
            id={popId}
            hidden={!popAberto}
            className="z-30 mt-4 w-full max-w-[560px] rounded-xl border border-surface-border bg-white p-5 lg:absolute lg:left-0 lg:top-full lg:mt-3 lg:shadow-card"
          >
            <ul className="grid grid-cols-3 items-center gap-x-5 gap-y-4 sm:grid-cols-4 sm:gap-x-6">
              {restantes.map((banco) => (
                <LogoBanco key={banco.id} banco={banco} onSelect={setSelecionado} />
              ))}
            </ul>
          </div>
        </>
      )}

      <BancoModal banco={selecionado} onClose={() => setSelecionado(null)} />
    </div>
  );
}
