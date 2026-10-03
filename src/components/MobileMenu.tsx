import { useState } from 'react';
import { ArrowUpRight, ChevronDown, ChevronRight } from 'lucide-react';
import { mainNav, socialLinks, systemAccessLinks, LEAD_FORM_HREF } from '../config/navegacao';
import { cn } from '../utils/cn';

interface MobileMenuProps {
  onNavigate: () => void;
  currentPath: string;
}

export function MobileMenu({ onNavigate, currentPath }: MobileMenuProps) {
  const [systemsOpen, setSystemsOpen] = useState(false);
  // Âncoras da Home não têm estado ativo aqui: o drawer só fica aberto no topo da navegação.
  const isActive = (href: string) => !href.includes('#') && href === currentPath;

  return (
    <div className="flex h-full flex-col">
      <nav aria-label="Navegação mobile" className="flex-1">
        <ul className="flex flex-col divide-y divide-surface-border">
          {mainNav.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'flex items-center justify-between py-4 font-heading font-semibold text-secondary hover:text-primary',
                  isActive(item.href) && 'text-primary',
                )}
              >
                {item.label}
                <ChevronRight size={18} aria-hidden="true" />
              </a>
            </li>
          ))}

          <li>
            <button
              type="button"
              onClick={() => setSystemsOpen((open) => !open)}
              aria-expanded={systemsOpen}
              className="flex w-full items-center justify-between py-4 font-heading font-semibold text-secondary hover:text-primary"
            >
              Acessar sistemas
              <ChevronDown
                size={18}
                className={cn('transition-transform duration-200', systemsOpen && 'rotate-180')}
                aria-hidden="true"
              />
            </button>

            {systemsOpen && (
              <ul className="flex flex-col gap-1 pb-3">
                {systemAccessLinks.map((item) => (
                  <li key={item.name}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={onNavigate}
                        className="flex items-center justify-between rounded-control px-3 py-2 text-sm text-secondary hover:bg-surface-subtle"
                      >
                        {item.name}
                        <ArrowUpRight size={16} className="text-secondary-300" aria-hidden="true" />
                        <span className="sr-only">(abre em nova aba)</span>
                      </a>
                    ) : (
                      <span className="flex items-center justify-between px-3 py-2 text-sm text-secondary-300">
                        {item.name}
                        <span className="text-xs">em breve</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <div className="flex flex-col gap-3 border-t border-surface-border pt-6">
        <a
          href={LEAD_FORM_HREF}
          onClick={onNavigate}
          className="inline-flex w-full items-center justify-center rounded-control bg-primary px-6 py-3 font-heading text-base font-bold text-white shadow-button transition-colors duration-200 hover:bg-primary-600"
        >
          Quero ser parceiro
        </a>

        <div className="mt-2 flex items-center justify-center gap-3">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-subtle text-secondary hover:bg-primary hover:text-white"
            >
              <Icon size={16} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
