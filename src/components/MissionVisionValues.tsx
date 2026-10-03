import { Container } from './Container';
import { LegacyAnchor } from './LegacyAnchor';
import { mission, values, vision } from '../data/company';

const bannerBruno = '/images/Banner-Bruno-1.png';

export function MissionVisionValues() {
  return (
    <>
    <LegacyAnchor id="sobre-nos" />
    <section id="sobre" className="relative scroll-mt-20 overflow-hidden bg-secondary text-white">
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={bannerBruno}
          alt=""
          className="h-full w-full object-cover object-[65%_center]"
        />
        {/* escurece só o lado esquerdo (onde fica o texto) e libera a foto à direita */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary from-20% via-secondary/75 via-45% to-transparent to-75%" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent md:hidden" />
      </div>

      {/* elementor-element-b1d1318: padding 170px/150px desktop, 80px/80px mobile — preservado
          até md. A partir de lg (>=1024px) o padding e a tipografia são compactados e
          Missão/Visão/Valores passam de pilha vertical pra grid, pra a seção caber inteira
          em 1920x1080 sem scroll. */}
      <Container className="relative py-16 md:py-24">
        <div className="max-w-2xl lg:max-w-none">
          <h2 className="font-heading leading-[36px] tracking-tight text-white md:leading-[90px] lg:text-[60px] lg:leading-[1.05]">
            <span className="relative inline-block pl-5 text-[40px] font-bold md:text-[96px] lg:text-[60px]">
              União,
            </span>
            <br />
            <span className="text-[40px] font-thin text-white md:text-[96px] lg:text-[60px]">transformação</span>
            <br />
            <span className="text-[40px] font-thin text-white md:text-[96px] lg:text-[60px]">e inovação.</span>
          </h2>

          <div className="mt-12 space-y-10 md:w-[60%] lg:mt-10 lg:w-[55%] lg:space-y-0">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:gap-y-8">
              <div>
                <h3 className="font-heading text-[32.858px] font-bold text-white lg:text-xl">Missão</h3>
                <p className="mt-3 font-brand text-[17.86px] leading-relaxed text-white/90 lg:mt-2.5 lg:text-[15px]">
                  {mission}
                </p>
              </div>

              <div>
                <h3 className="font-heading text-[32.858px] font-bold text-white lg:text-xl">Visão</h3>
                <p className="mt-3 font-brand text-[17.86px] leading-relaxed text-white/90 lg:mt-2.5 lg:text-[15px]">
                  {vision}
                </p>
              </div>

              <div className="lg:col-span-2">
                <h3 className="font-heading text-[32.858px] font-bold text-white lg:text-xl">Valores</h3>
                <div className="mt-3 space-y-3 font-brand text-[17.86px] leading-relaxed text-white/90 lg:mt-4 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:gap-y-4 lg:space-y-0">
                  {values.map((value) => {
                    const Icon = value.icon;
                    return (
                      <p key={value.title} className="lg:flex lg:items-start lg:gap-2.5 lg:text-[14px] lg:leading-snug">
                        <Icon
                          size={16}
                          className="hidden shrink-0 text-[var(--accent-on-dark)] lg:mt-0.5 lg:block"
                          aria-hidden="true"
                        />
                        <span>
                          <strong className="font-semibold text-white">{value.title}</strong> {value.description}
                        </span>
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
    </>
  );
}
