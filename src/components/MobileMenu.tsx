import { ChevronRight, LogIn } from 'lucide-react';
import { mainNav, socialLinks, PARTNER_SYSTEM_URL } from '../data/navigation';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface MobileMenuProps {
  onNavigate: () => void;
  currentPath: string;
}

export function MobileMenu({ onNavigate, currentPath }: MobileMenuProps) {
  const isActive = (href: string) => (href.split('#')[0] || '/') === currentPath;

  return (
    <div className="flex h-full flex-col">
      <nav aria-label="Navegação mobile" className="flex-1">
        <ul className="flex flex-col divide-y divide-surface-border">
          {mainNav.map((item) => (
            <li key={item.label}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={onNavigate}
                  className="flex items-center justify-between py-4 font-heading font-semibold text-secondary hover:text-primary"
                >
                  {item.label}
                  <ChevronRight size={18} aria-hidden="true" />
                </a>
              ) : (
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
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-col gap-3 border-t border-surface-border pt-6">
        <Button
          variant="outline"
          leftIcon={<LogIn size={18} aria-hidden="true" />}
          onClick={() => {
            window.open(PARTNER_SYSTEM_URL, '_blank', 'noopener');
            onNavigate();
          }}
        >
          Sou Parceiro
        </Button>
        <a
          href="/#parceirounica"
          onClick={onNavigate}
          className="inline-flex w-full items-center justify-center rounded-[3px] bg-primary px-6 py-3 font-heading text-base font-bold text-white shadow-button transition-colors duration-200 hover:bg-primary-600"
        >
          Quero ser parceiro agora
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
