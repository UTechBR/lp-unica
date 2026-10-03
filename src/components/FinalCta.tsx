import { ArrowRight } from 'lucide-react';
import { Container } from './Container';
import { cn } from '../utils/cn';

interface FinalCtaProps {
  /** Título em duas partes: "{titulo} {destaque}?", com o destaque em negrito. */
  titulo?: string;
  destaque?: string;
  /** Fundo da faixa: contraste com a seção anterior. */
  fundo?: 'muted' | 'white';
  /** Números da empresa exibidos acima do convite (ex.: na página /sobre). */
  numeros?: { valor: string; rotulo: string }[];
}

// Fecha a página: o formulário só existe no topo da Home, então quem chega convencido
// ao fim ganha um atalho de volta, sem um segundo formulário.
export function FinalCta({
  titulo = 'Pronto para crescer com a',
  destaque = 'Única',
  fundo = 'muted',
  numeros,
}: FinalCtaProps) {
  return (
    <section className={cn('py-12 md:py-16', fundo === 'muted' ? 'bg-surface-muted' : 'bg-white')}>
      {numeros && numeros.length > 0 && (
        // Números grafite em cards brancos: o destaque vem do tamanho, não da cor.
        <Container className="mb-10 md:mb-12">
          <dl className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
            {numeros.map(({ valor, rotulo }) => (
              <div key={rotulo} className="flex flex-col-reverse rounded-surface border border-surface-border bg-white p-5 md:p-6">
                <dt className="mt-2 text-[15px] text-secondary-400">{rotulo}</dt>
                <dd className="font-heading text-[clamp(2rem,1.6rem+2vw,3rem)] font-bold leading-none text-secondary">{valor}</dd>
              </div>
            ))}
          </dl>
        </Container>
      )}
      <Container className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <h2 className="font-heading text-3xl font-light text-secondary md:text-4xl">
            {titulo} <strong className="font-bold">{destaque}</strong>?
          </h2>
          <p className="mt-2 text-secondary-400">Cadastre-se e nosso time fala com você pelo WhatsApp.</p>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-3 md:items-end">
          <a
            href="/#seja-parceiro"
            className="inline-flex items-center gap-2 rounded-control bg-brand px-6 py-3 font-heading text-base font-semibold text-white transition-colors hover:bg-primary-600"
          >
            Quero ser parceiro
            <ArrowRight size={18} aria-hidden="true" />
          </a>
          <p className="text-sm text-secondary-400">
            Outro assunto?{' '}
            <a href="/contato" className="font-semibold text-secondary underline underline-offset-4 hover:text-primary">
              Fale conosco
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
