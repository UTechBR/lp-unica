import { motion } from 'framer-motion';
import type { Banco } from '../types/banco';

interface BancoCardProps {
  banco: Banco;
  onSelect: (banco: Banco) => void;
  /** Cópia visual usada só para preencher a esteira contínua. */
  decorative?: boolean;
}

export function BancoCard({ banco, onSelect, decorative = false }: BancoCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(banco)}
      aria-hidden={decorative || undefined}
      tabIndex={decorative ? -1 : undefined}
      aria-haspopup="dialog"
      aria-label={`Ver canais de atendimento do ${banco.nome}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group flex h-24 w-auto items-center justify-center"
    >
      <img
        src={banco.logo}
        alt={banco.nome}
        loading="lazy"
        className="max-h-16 w-auto max-w-[180px] object-contain opacity-90 contrast-125 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:contrast-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:contrast-100 group-focus-visible:grayscale-0"
      />
    </motion.button>
  );
}
