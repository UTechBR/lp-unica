import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Container } from './Container';
import { Button } from './Button';
import { icones } from '../lib/icones';
import type { Produto } from '../types/conteudo';
import { cn } from '../utils/cn';

const colorMap = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  secondary: 'bg-secondary/10 text-secondary',
} as const;

export function ProdutosContent({ produtos }: { produtos: Produto[] }) {
  return (
    <section className="section-padding">
      <Container className="flex flex-col gap-16">
        {produtos.map((product, index) => {
          const Icon = icones[product.icone];
          return (
          <motion.div
            key={product.id}
            id={product.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className={cn(
              'scroll-mt-28 grid grid-cols-1 items-center gap-10 lg:grid-cols-2',
              index % 2 === 1 && 'lg:[&>*:first-child]:order-2',
            )}
          >
            <div>
              <span className={cn('flex h-16 w-16 items-center justify-center rounded-surface', colorMap[product.cor])}>
                <Icon size={30} aria-hidden="true" />
              </span>
              <h2 className="heading-lg mt-6">{product.titulo}</h2>
              <p className="mt-4 body-lg text-secondary-400">{product.descricao}</p>

              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {product.destaques.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2 text-sm font-medium text-secondary">
                    <CheckCircle2 size={18} className="shrink-0 text-primary" aria-hidden="true" />
                    {highlight}
                  </li>
                ))}
              </ul>

              <a href="/#seja-parceiro" className="mt-8 inline-block">
                <Button rightIcon={<ArrowRight size={18} aria-hidden="true" />}>Simular agora</Button>
              </a>
            </div>

            <div className="relative flex aspect-video items-center justify-center rounded-surface bg-surface-muted">
              <div className={cn('flex h-28 w-28 items-center justify-center rounded-full', colorMap[product.cor])}>
                <Icon size={52} aria-hidden="true" />
              </div>
            </div>
          </motion.div>
          );
        })}
      </Container>
    </section>
  );
}
