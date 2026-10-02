import { motion } from 'framer-motion';
import { Container } from './Container';
import { SystemCard } from './SystemCard';
import { AnimatedSection, staggerContainer, staggerItem } from './AnimatedSection';
import { systemBrands, systemTools } from '../data/sistemas';
import type { SystemBrand } from '../types';

function BrandBadge({ brand }: { brand: SystemBrand }) {
  if (brand.logo) {
    return (
      <div className="flex h-16 w-full max-w-[150px] items-center justify-center sm:h-20">
        <img src={brand.logo} alt={brand.name} className="max-h-full max-w-full object-contain" />
      </div>
    );
  }

  return (
    <div className="flex h-16 w-full max-w-[150px] items-center gap-3 rounded-full border border-black/10 bg-white px-5 shadow-soft sm:h-20">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E30613] font-heading text-sm font-bold text-white">
        {brand.name.charAt(0)}
      </span>
      <span className="truncate font-heading text-base font-bold text-[#111111]">{brand.name}</span>
    </div>
  );
}

export function NossoSistema() {
  return (
    <section id="sistemas" className="scroll-mt-32 bg-[#F4F4F4]">
      <Container className="py-16 md:py-20 lg:py-24">
        <AnimatedSection className="mx-auto max-w-3xl text-center">
          <h2 className="text-[clamp(2rem,1.5rem+3vw,3.5rem)] font-heading font-bold leading-tight text-[#111111]">
            Nosso Sistema
          </h2>
          <p className="mt-4 text-[clamp(1rem,0.85rem+1vw,1.25rem)] font-heading font-bold text-[#E30613]">
            5 Ferramentas: Oportunidades e Benefícios para Parceiros Única
          </p>
          <p className="mt-4 text-[clamp(0.9rem,0.85rem+0.3vw,1rem)] font-brand font-normal leading-relaxed text-[#111111]/70">
            Pensando em apoiar o crescimento e a produtividade dos nossos parceiros, seguem as
            condições vigentes das ferramentas:
          </p>
        </AnimatedSection>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 min-[1440px]:grid-cols-6"
        >
          {systemTools.map((tool) => (
            <SystemCard key={tool.slug} tool={tool} />
          ))}

          <motion.div
            variants={staggerItem}
            className="flex flex-col justify-center gap-4 rounded-2xl bg-[#2F2C31] p-7 md:col-span-2 lg:col-span-1"
          >
            <span className="h-1 w-10 rounded-full bg-[#E30613]" aria-hidden="true" />
            <p className="text-[clamp(1rem,0.9rem+0.5vw,1.25rem)] font-heading font-bold leading-snug text-white">
              Mais tecnologia, mais <span className="text-[#E30613]">oportunidades</span> e mais{' '}
              <span className="text-[#E30613]">suporte</span> para{' '}
              <span className="text-[#E30613]">ajudar você</span> a escalar sua produção.
            </p>
          </motion.div>
        </motion.div>

        <AnimatedSection
          delay={0.2}
          className="mt-14 flex flex-col items-center gap-6 border-t border-black/10 pt-10 md:mt-16"
        >
          <span className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-[#111111]/50">
            Sistemas parceiros
          </span>
          <div className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-6">
            {systemBrands.map((brand) => (
              <div
                key={brand.slug}
                className="flex basis-[calc(50%-16px)] justify-center sm:basis-[calc(33.333%-21.333px)] lg:basis-[calc(20%-25.6px)]"
              >
                <BrandBadge brand={brand} />
              </div>
            ))}
          </div>
        </AnimatedSection>
      </Container>

    </section>
  );
}
