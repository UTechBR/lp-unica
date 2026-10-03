import { motion } from 'framer-motion';
import type { SystemTool } from '../types';
import { staggerItem } from './AnimatedSection';

interface SystemCardProps {
  tool: SystemTool;
}

// Card informativo: o acesso aos sistemas fica no menu "Acessar sistemas" do header,
// para a seção falar com quem ainda vai virar parceiro.
export function SystemCard({ tool }: SystemCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      className="flex h-full flex-col gap-3 rounded-2xl bg-white p-6 shadow-lg shadow-black/10 sm:p-7"
    >
      <h3 className="text-[clamp(1.05rem,0.85rem+1vw,1.35rem)] font-heading font-bold leading-snug text-secondary">
        {tool.name}
      </h3>
      <p className="text-[clamp(0.85rem,0.78rem+0.3vw,0.95rem)] font-brand font-normal leading-relaxed text-secondary-400">
        {tool.description}
      </p>
    </motion.div>
  );
}
