import { motion } from 'framer-motion';
import { WhatsappIcon } from './SocialIcons';

export function WhatsappButton() {
  return (
    <motion.a
      href="https://api.whatsapp.com/send/?phone=553121165020&text&type=phone_number&app_absent=0"
      target="_blank"
      rel="noreferrer"
      aria-label="Dúvidas? Fale Conosco pelo WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="fixed bottom-6 left-6 z-40 flex items-center gap-3 rounded-surface bg-white py-2.5 pl-2.5 pr-4 shadow-card"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
        <WhatsappIcon width={24} height={24} />
      </span>
      <span className="text-sm font-bold leading-tight text-secondary">
        Dúvidas? Fale
        <br />
        Conosco.
      </span>
    </motion.a>
  );
}
