import { Container } from './Container';
import { AnimatedSection } from './AnimatedSection';
import { DenuncieForm } from './DenuncieForm';
import { denuncieCategories } from '../utils/schemas';

export function DenuncieContent() {
  return (
    <section className="section-padding">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <AnimatedSection direction="left">
          <h2 className="heading-md">Categorias apuradas</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {denuncieCategories.map((category) => (
              <li
                key={category}
                className="rounded-control border border-surface-border bg-white px-4 py-3 text-sm font-medium text-secondary shadow-soft"
              >
                {category}
              </li>
            ))}
          </ul>
        </AnimatedSection>

        <AnimatedSection direction="right" delay={0.15} className="card-surface p-6 md:p-8">
          <DenuncieForm />
        </AnimatedSection>
      </Container>
    </section>
  );
}
