import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

const ANEC_LINK = 'https://anecbrasil.com.br/certificaco';

const SESSION_KEY = 'anec-popup-shown';

interface AnecPopupProps {
  /** Imagem já otimizada no build (getImage em BaseLayout). */
  imagem: { src: string; width: number; height: number };
}

export function AnecPopup({ imagem }: AnecPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  useLockBodyScroll(isOpen);

  useEffect(() => {
    let triggered = false;

    const trigger = () => {
      if (triggered || sessionStorage.getItem(SESSION_KEY)) return;
      triggered = true;
      sessionStorage.setItem(SESSION_KEY, 'true');
      setIsOpen(true);
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(timer);
    };

    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight > 0 && window.scrollY / scrollableHeight >= 0.5) trigger();
    };

    if (sessionStorage.getItem(SESSION_KEY)) return;
    const timer = window.setTimeout(trigger, 20_000);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Fechar aviso da ANEC"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 cursor-default bg-secondary-900/70 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Certificação ANEC com desconto exclusivo"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-[800px] overflow-hidden rounded-surface shadow-card"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-secondary shadow-soft hover:bg-surface-subtle"
            >
              <X size={18} />
            </button>
            <a href={ANEC_LINK} target="_blank" rel="noreferrer" onClick={() => setIsOpen(false)}>
              <img
                src={imagem.src}
                alt="Adquira sua Certificação ANEC com desconto exclusivo da Única Promotora — cupom UNICA20"
                width={imagem.width}
                height={imagem.height}
                className="block h-auto w-full"
              />
            </a>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
