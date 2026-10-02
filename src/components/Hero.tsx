import { Container } from './Container';
import { LeadForm } from './LeadForm';

export function Hero() {
  return (
    <section id="parceirounica" className="scroll-mt-32 bg-white">
      <Container className="grid gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="lg:pt-8">
          <h1 className="text-[45px] font-heading font-light leading-[1.1] text-secondary md:text-[64px]">
            Transformando vidas com <strong className="font-bold">Conexões Únicas</strong>
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-secondary-400">
            Seja um parceiro Única e conte com soluções, tecnologia e suporte para crescer com segurança.
          </p>
        </div>

        <div id="lead-form" className="scroll-mt-32 rounded-xl border border-surface-border bg-white p-6 shadow-card md:p-8">
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-semibold text-secondary">Seja um parceiro Única</h2>
            <p className="mt-1 text-sm text-secondary-400">Preencha e nosso time fala com você pelo WhatsApp.</p>
          </div>
          <LeadForm />
        </div>
      </Container>
    </section>
  );
}
