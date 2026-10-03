import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container } from './Container';
import { Button } from './Button';

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-brand-gradient py-16 md:py-20">
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        aria-hidden="true"
      />
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="heading-lg max-w-2xl text-balance text-white"
        >
          Faça parte da promotora que mais cresce no mercado!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-xl text-white/85"
        >
          Junte-se a centenas de parceiros que transformam vidas — e faturam — oferecendo as melhores soluções
          financeiras do Brasil.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a href="/#seja-parceiro">
            <Button variant="secondary" size="lg" rightIcon={<ArrowRight size={20} aria-hidden="true" />}>
              Quero ser parceiro agora
            </Button>
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
