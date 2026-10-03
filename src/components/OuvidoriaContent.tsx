import { Container } from './Container';
import { AnimatedSection } from './AnimatedSection';
import { OuvidoriaForm } from './OuvidoriaForm';
import { cardCls, cardTituloCls } from './form/estilos';
import { cn } from '../utils/cn';

export function OuvidoriaContent() {
  return (
    <section className="section-padding">
      <Container className="max-w-2xl">
        <AnimatedSection direction="up">
          <div className="rounded-surface border border-surface-border bg-surface-muted p-6 text-sm text-secondary-400">
            Antes de acionar a Ouvidoria, procure primeiro o atendimento habitual. Caso a solução apresentada não
            tenha sido satisfatória, ou o prazo de resposta tenha sido ultrapassado, registre sua manifestação
            abaixo. Você também pode buscar o{' '}
            <a
              href="https://www.consumidor.gov.br"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              consumidor.gov.br
            </a>{' '}
            para soluções alternativas de conflito.
          </div>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={0.15} className={cn(cardCls, 'mt-8')}>
          <h2 className={cardTituloCls}>Registre sua manifestação</h2>
          <div className="mt-6">
            <OuvidoriaForm />
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
