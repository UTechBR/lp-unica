import { Container } from './Container';
import { LegacyAnchor } from './LegacyAnchor';
import { homePositioning, valueHighlights } from '../data/company';

const bannerBruno = '/images/Banner-Bruno-1.png';

// Sobre da Home, condensado. Uma imagem só para os dois layouts: no mobile é um
// bloco 4:3 acima do texto; a partir de lg vira fundo da seção, como antes.
export function SobreSection() {
  return (
    <>
      <LegacyAnchor id="sobre-nos" />
      <section id="sobre" className="relative scroll-mt-20 overflow-hidden bg-surface-dark text-white">
        <figure className="relative aspect-[4/3] w-full lg:absolute lg:inset-0 lg:aspect-auto">
          <img
            src={bannerBruno}
            alt="Bruno Iacomini, CEO da Única Promotora"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-[78%_center] lg:object-[65%_center]"
          />
          {/* Mobile: funde a base da foto no grafite */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/10 to-transparent lg:hidden"
            aria-hidden="true"
          />
          {/* Desktop: escurece o lado do texto */}
          <div
            className="absolute inset-0 hidden bg-gradient-to-r from-surface-dark from-25% via-surface-dark/70 to-transparent lg:block"
            aria-hidden="true"
          />
          <figcaption className="absolute bottom-4 left-5 lg:bottom-10 lg:left-auto lg:right-16 lg:text-right">
            <span className="block font-heading text-base font-semibold">Bruno Iacomini</span>
            <span className="block text-sm text-white/70">CEO · Única Promotora</span>
          </figcaption>
        </figure>

        <Container className="relative pb-16 pt-8 md:pb-24 lg:py-24">
          <div className="max-w-xl lg:max-w-[55%]">
            <h2 className="font-heading text-[clamp(2.25rem,1.5rem+3vw,3.75rem)] leading-[1.05] tracking-tight text-white">
              <span className="block font-bold">União,</span>
              <span className="block font-light">transformação</span>
              <span className="block font-light">e inovação.</span>
            </h2>

            <p className="mt-8 max-w-[560px] text-lg leading-relaxed md:text-xl">{homePositioning}</p>

            <h3 className="mt-10 text-sm font-semibold uppercase tracking-[0.08em] text-white/70">Valores</h3>
            <ul className="mt-5 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {valueHighlights.map(({ title, description, icon: Icon }) => (
                <li key={title} className="flex gap-3">
                  <Icon size={20} strokeWidth={1.75} className="mt-0.5 shrink-0 text-white/80" aria-hidden="true" />
                  <div>
                    <p className="font-heading text-base font-semibold">{title}</p>
                    <p className="mt-0.5 text-[15px] leading-relaxed text-white/75">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
