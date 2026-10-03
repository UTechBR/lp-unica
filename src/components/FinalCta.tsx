import { ArrowRight } from 'lucide-react';
import { Container } from './Container';

// Fecha a página: o formulário só existe no topo, então quem chega convencido ao
// fim ganha um atalho de volta, sem um segundo formulário.
export function FinalCta() {
  return (
    <section className="bg-surface-muted py-12 md:py-16">
      <Container className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <h2 className="font-heading text-3xl font-light text-secondary md:text-4xl">
            Pronto para crescer com a <strong className="font-bold">Única</strong>?
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
