import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Headset, MessageCircleWarning, Phone, X } from 'lucide-react';
import type { Banco } from '../types/banco';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { WhatsappIcon } from './SocialIcons';

function CanalIcon({ label }: { label: string }) {
  if (label.toLowerCase().includes('whatsapp')) {
    return <WhatsappIcon width={18} height={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />;
  }
  return <Headset size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />;
}

interface BancoModalProps {
  banco: Banco | null;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function BancoModal({ banco, onClose }: BancoModalProps) {
  const isOpen = banco !== null;
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement as HTMLElement;
    } else {
      previouslyFocused.current?.focus?.();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialog) return;

      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Astro faz uma passada de SSR mesmo pra componentes client:visible — sem esse guard,
  // createPortal(..., document.body) explode no servidor, onde document não existe.
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && banco && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="banco-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-10 w-[95%] max-h-[85vh] overflow-y-auto rounded-surface border border-white/10 bg-surface-dark p-6 shadow-2xl sm:w-[90%] md:p-8 lg:w-[800px]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="absolute right-4 top-4 rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
              <div className="flex h-24 w-auto max-w-[260px] shrink-0 items-center justify-center rounded-surface border border-white/10 bg-white/5 px-6 py-4 sm:h-28">
                <img src={banco.logo} alt="" className="h-full w-auto max-w-full object-contain" />
              </div>
              <h2 id="banco-modal-title" className="font-heading text-2xl font-bold text-white">
                {banco.nome}
              </h2>
            </div>

            {(banco.sac || banco.telefone || banco.ouvidoria) && (
              <dl className="mt-6 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
                {banco.sac && (
                  <div className="flex items-start gap-3">
                    <Headset size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-wide text-white/50">SAC</dt>
                      <dd className="text-sm text-white/85">{banco.sac}</dd>
                    </div>
                  </div>
                )}
                {banco.telefone && (
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-wide text-white/50">Telefone</dt>
                      <dd className="text-sm text-white/85">{banco.telefone}</dd>
                    </div>
                  </div>
                )}
                {banco.ouvidoria && (
                  <div className="flex items-start gap-3">
                    <MessageCircleWarning size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-wide text-white/50">Ouvidoria</dt>
                      <dd className="text-sm text-white/85">{banco.ouvidoria}</dd>
                    </div>
                  </div>
                )}
              </dl>
            )}

            {banco.canais && banco.canais.length > 0 && (
              <div className="mt-6 border-t border-white/10 pt-6">
                <dl className="grid gap-4 sm:grid-cols-2">
                  {banco.canais.map((canal) => (
                    <div key={canal.label} className="flex items-start gap-3">
                      <CanalIcon label={canal.label} />
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-wide text-white/50">{canal.label}</dt>
                        <dd className="text-sm text-white/85">{canal.valor}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
                {banco.horario && <p className="mt-4 text-xs text-white/50">{banco.horario}</p>}
              </div>
            )}

            {banco.site && (
              <a
                href={banco.site}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Acessar site do ${banco.nome} (abre em nova aba)`}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-control bg-primary px-6 py-3 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-primary-600 sm:w-auto"
              >
                Acessar Site
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
