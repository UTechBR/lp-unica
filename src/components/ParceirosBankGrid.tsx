import { motion } from 'framer-motion';
import { Container } from './Container';
import { SectionHeading } from './SectionHeading';
import { staggerContainer, staggerItem } from './AnimatedSection';
import type { Banco } from '../types/conteudo';

export function ParceirosBankGrid({ bancos }: { bancos: Banco[] }) {
  return (
    <section className="section-padding">
      <Container>
        <SectionHeading
          eyebrow="Instituições"
          title="Nossos bancos parceiros"
          description="Correspondente bancário autorizado, com acesso direto às melhores condições do mercado."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        >
          {bancos.map((bank) => (
            <motion.div
              key={bank.id}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              className="flex h-24 flex-col items-center justify-center gap-2 rounded-surface border border-surface-border bg-secondary p-4 text-center shadow-soft transition-shadow hover:shadow-card"
            >
              <img src={bank.logo.src} alt={bank.nome} className="max-h-10 w-auto max-w-[110px] object-contain" />
              <span className="text-[11px] text-white/60">{bank.nome}</span>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
