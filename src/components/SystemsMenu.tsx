import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { systemAccessLinks } from '../data/navigation';
import { cn } from '../utils/cn';

// Dropdown "Acessar sistemas" (para quem já é parceiro). Abre por clique, não por
// hover, para funcionar no teclado e no touch; fecha com Esc e clique fora.
export function SystemsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex items-center gap-1.5 rounded-md px-3 py-2 font-heading text-base text-on-dark-muted transition-colors hover:text-white"
      >
        Acessar sistemas
        <ChevronDown
          size={16}
          className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          id={panelId}
          className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-surface-border bg-white p-2 text-secondary shadow-card"
        >
          {systemAccessLinks.map((item) => (
            <li key={item.name}>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center justify-between gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-surface-subtle"
                >
                  <span>
                    <span className="block font-heading text-sm font-bold">{item.name}</span>
                    <span className="block text-xs text-secondary-400">{item.description}</span>
                  </span>
                  <ArrowUpRight size={16} className="shrink-0 text-secondary-300 group-hover:text-secondary" aria-hidden="true" />
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              ) : (
                <span className="flex items-center justify-between gap-3 px-3 py-2.5 text-secondary-300">
                  <span>
                    <span className="block font-heading text-sm font-bold">{item.name}</span>
                    <span className="block text-xs">{item.description}</span>
                  </span>
                  <span className="shrink-0 text-xs">em breve</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
