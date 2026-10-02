import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { SystemTool } from '../types';
import { staggerItem } from './AnimatedSection';

interface SystemCardProps {
  tool: SystemTool;
}

export function SystemCard({ tool }: SystemCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex h-full flex-col justify-between gap-6 rounded-2xl bg-white p-6 shadow-lg shadow-black/10 hover:shadow-xl sm:p-7"
    >
      <div className="flex flex-col gap-3">
        <h3 className="text-[clamp(1.05rem,0.85rem+1vw,1.35rem)] font-heading font-bold leading-snug text-secondary">
          {tool.name}
        </h3>
        <p className="text-[clamp(0.85rem,0.78rem+0.3vw,0.95rem)] font-brand font-normal leading-relaxed text-secondary-400">
          {tool.description}
        </p>
      </div>

      <motion.a
        href={tool.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Acessar sistema ${tool.name} (abre em nova aba)`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-secondary px-5 py-2.5 font-heading text-sm font-bold text-white transition-colors duration-300 hover:bg-secondary-700 sm:w-auto"
      >
        Acessar Sistema
        <ArrowUpRight size={16} aria-hidden="true" />
      </motion.a>
    </motion.div>
  );
}
