import { useEffect, useState } from 'react';
import { BancoModal } from './BancoModal';
import type { Banco } from '../types/conteudo';
import { cn } from '../utils/cn';

const VISIVEIS = 12;

// Altura máx. padrão dos logos na grade; o ajuste óptico por banco é logoAltura (bancos.json).
const ALTURA_PADRAO = 30;

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
        className="group flex h-full max-w-full items-center rounded-control"
      >
        {/* Os arquivos são silhuetas brancas: a <img> invisível só define o tamanho e a
            cor vem de um <span> mascarado pelo logo (cinza médio → grafite no hover). */}
        <span className="relative flex max-w-full">
          <img
            src={banco.logo.src}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-auto max-w-[min(100%,110px)] object-contain opacity-0"
            style={{ maxHeight: banco.logoAltura ?? ALTURA_PADRAO }}
          />
          <span
            className="absolute inset-0 bg-secondary-300 transition-colors duration-300 [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] group-hover:bg-secondary group-focus-visible:bg-secondary"
            style={{ maskImage: `url("${banco.logo.src}")`, WebkitMaskImage: `url("${banco.logo.src}")` }}
          />
        </span>
      </button>
    </li>
  );
}

// Grade de bancos do hero. A ordem é embaralhada a cada visita para nenhum banco
// ficar sempre em destaque; até lá a grade fica transparente, para não "pular".
// A lista completa fica em /bancos-parceiros (busca e canais), no link abaixo da grade.
export function BancosHero({ bancos }: { bancos: Banco[] }) {
  const [ordem, setOrdem] = useState(bancos);
  const [pronto, setPronto] = useState(false);
  const [selecionado, setSelecionado] = useState<Banco | null>(null);

  // Embaralha só depois da hidratação: fazer isso no estado inicial geraria HTML do
  // servidor diferente do cliente.
  useEffect(() => {
    setOrdem(embaralhar(bancos));
    setPronto(true);
  }, [bancos]);

  // Dezena abaixo do total, para "mais de N" seguir verdadeiro quando a lista mudar (22 → 20).
  const maisDe = Math.floor((bancos.length - 1) / 10) * 10;
  const visiveis = ordem.slice(0, VISIVEIS);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="h-0.5 w-7 shrink-0 bg-brand" aria-hidden="true" />
        <p className="text-lg leading-snug text-secondary">
          Opere com <strong className="font-bold">mais de {maisDe} bancos</strong> e financeiras
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

      {/* Link de navegação (mesma aba): a página de bancos termina com o caminho de volta ao formulário. */}
      {bancos.length > VISIVEIS && (
        <a
          href="/bancos-parceiros"
          className="mt-5 inline-flex items-center gap-1.5 text-sm text-secondary underline underline-offset-4 hover:text-primary"
        >
          Ver todos os bancos parceiros <span aria-hidden="true">→</span>
        </a>
      )}

      <BancoModal banco={selecionado} onClose={() => setSelecionado(null)} />
    </div>
  );
}
