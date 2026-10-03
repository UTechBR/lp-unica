import { Container } from './Container';
import { LegacyAnchor } from './LegacyAnchor';
import { LeadForm } from './LeadForm';
import { cardCls, cardSubtituloCls, cardTituloCls } from './form/estilos';
import { cn } from '../utils/cn';
import { BancosHero } from './BancosHero';
import type { Banco } from '../types/conteudo';

export function Hero({ bancos }: { bancos: Banco[] }) {
  return (
    <>
      {/* ids antigos do hero e da antiga seção de bancos, para links já distribuídos.
          "#seja-parceiro" fica no card do formulário: todo CTA cai direto nele. */}
      <LegacyAnchor id="parceirounica" />
      <LegacyAnchor id="bancos" />
      <LegacyAnchor id="parceiros" />
      <section className="bg-white">
        {/* Mobile: texto, formulário, bancos. Desktop: texto e bancos à esquerda, formulário à direita. */}
        <Container className="grid gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_420px] lg:grid-rows-[auto_1fr] lg:gap-y-10">
          <div className="lg:pt-8">
            <h1 className="text-[45px] font-heading font-light leading-[1.1] text-secondary md:text-[64px]">
              Transformando vidas com <strong className="font-bold">Conexões Únicas</strong>
            </h1>
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-secondary-400">
              Seja um parceiro Única e conte com soluções, tecnologia e suporte para crescer com segurança.
            </p>
          </div>

          <div
            id="seja-parceiro"
            className={cn(cardCls, 'scroll-mt-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start')}
          >
            <div className="mb-6">
              <h2 className={cardTituloCls}>Seja um parceiro Única</h2>
              <p className={cardSubtituloCls}>Preencha e nosso time fala com você pelo WhatsApp.</p>
            </div>
            <LeadForm />
          </div>

          <BancosHero bancos={bancos} />
        </Container>
      </section>
    </>
  );
}
