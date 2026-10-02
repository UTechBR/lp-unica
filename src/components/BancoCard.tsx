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
      {/* Os arquivos de logo são silhuetas brancas: a <img> invisível só define o tamanho
          e a cor vem de um <span> mascarado pelo próprio logo. */}
      <span className="relative inline-flex">
        <img src={banco.logo} alt={banco.nome} loading="lazy" className="max-h-16 w-auto max-w-[180px] object-contain opacity-0" />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-secondary-300 transition-colors duration-300 [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] group-hover:bg-secondary group-focus-visible:bg-secondary"
          style={{ maskImage: `url("${banco.logo}")`, WebkitMaskImage: `url("${banco.logo}")` }}
        />
      </span>
    </motion.button>
  );
}
