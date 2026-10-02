import { motion } from 'framer-motion';
import type { Banco } from '../types/banco';

interface BancoCardProps {
  banco: Banco;
  onSelect: (banco: Banco) => void;
}

export function BancoCard({ banco, onSelect }: BancoCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(banco)}
      aria-haspopup="dialog"
      aria-label={`Ver canais de atendimento do ${banco.nome}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex h-24 w-auto items-center justify-center opacity-70 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100"
    >
      <img
        src={banco.logo}
        alt={banco.nome}
        loading="lazy"
        className="max-h-16 w-auto max-w-[180px] object-contain grayscale opacity-60 transition-[filter,opacity] duration-300 hover:grayscale-0 hover:opacity-100"
      />
    </motion.button>
  );
}
