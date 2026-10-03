import { Container } from './Container';
import { LegacyAnchor } from './LegacyAnchor';
import { LeadForm } from './LeadForm';
import { BancosHero } from './BancosHero';
import type { Banco } from '../types/conteudo';

export function Hero({ bancos }: { bancos: Banco[] }) {
  return (
    <>
      {/* ids antigos: o hero e a antiga seção de bancos, para links já distribuídos */}
      <LegacyAnchor id="parceirounica" />
      <LegacyAnchor id="bancos" />
      <LegacyAnchor id="parceiros" />
      <section id="seja-parceiro" className="scroll-mt-20 bg-white">
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
            id="lead-form"
            className="scroll-mt-20 rounded-surface border border-surface-border bg-white p-6 shadow-card md:p-8 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start"
          >
            <div className="mb-6">
              <h2 className="font-heading text-2xl font-semibold text-secondary">Seja um parceiro Única</h2>
              <p className="mt-1 text-sm text-secondary-400">Preencha e nosso time fala com você pelo WhatsApp.</p>
            </div>
            <LeadForm />
          </div>

          <BancosHero bancos={bancos} />
        </Container>
      </section>
    </>
  );
}
