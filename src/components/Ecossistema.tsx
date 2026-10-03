import { ArrowRight } from 'lucide-react';
import { Container } from './Container';
import { LegacyAnchor } from './LegacyAnchor';
import { ecosystemTools } from '../data/ecossistema';
import { LEAD_FORM_HREF } from '../data/navigation';

// Estática (sem client:*): sem animação de entrada, que nesta seção atrapalhava a
// leitura no mobile.
export function Ecossistema() {
  return (
    <>
      <LegacyAnchor id="sistemas" />
      <section id="ecossistema" className="scroll-mt-20 bg-surface-muted py-16 md:py-24">
        <Container>
          <header className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-[clamp(2rem,1.5rem+3vw,3.5rem)] leading-tight text-secondary">
              <span className="font-light">Ecossistema</span> <strong className="font-bold">Única</strong>
            </h2>
            <p className="mt-4 text-lg text-secondary-400">Ferramentas que acompanham cada etapa da sua operação.</p>
          </header>

          {/* sm: 2 colunas, com o card de fechamento na largura toda; lg: grade 3×2. */}
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ecosystemTools.map(({ slug, stage, name, description, icon: Icon }) => (
              <li key={slug} className="flex flex-col rounded-surface bg-white p-7 shadow-sm">
                <div className="mb-3.5 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">{stage}</span>
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-100 text-secondary"
                    aria-hidden="true"
                  >
                    <Icon size={20} />
                  </span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-secondary">{name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-secondary-400">{description}</p>
              </li>
            ))}

            <li className="flex flex-col justify-center rounded-surface bg-surface-dark p-7 sm:col-span-2 lg:col-span-1">
              <p className="font-heading text-[22px] font-semibold leading-snug text-white">
                Tudo isso disponível para quem é parceiro Única.
              </p>
              <a
                href={LEAD_FORM_HREF}
                className="mt-5 inline-flex items-center gap-2 self-start rounded-control bg-white px-5 py-3 font-heading text-[15px] font-bold text-secondary transition-colors hover:bg-secondary-50 focus-visible:ring-white focus-visible:ring-offset-surface-dark"
              >
                Quero ser parceiro
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </li>
          </ul>
        </Container>
      </section>
    </>
  );
}
