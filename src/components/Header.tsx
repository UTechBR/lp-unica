import { Menu } from 'lucide-react';
import { Navbar } from './Navbar';
import { SystemsMenu } from './SystemsMenu';
import { MobileMenu } from './MobileMenu';
import { Container } from './Container';
import { Drawer } from './Drawer';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { useDisclosure } from '../hooks/useDisclosure';
import { LEAD_FORM_HREF } from '../config/navegacao';
import { cn } from '../utils/cn';

import logoBranca from '../assets/marca/logo-branca.png';

interface HeaderProps {
  currentPath: string;
}

export function Header({ currentPath }: HeaderProps) {
  const scrolled = useScrollPosition(16);
  const { isOpen, open, close } = useDisclosure();

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          'focus-on-dark bg-secondary text-white transition-shadow duration-300',
          scrolled ? 'shadow-header' : 'shadow-none',
        )}
      >
        <Container
          className={cn(
            'flex items-center justify-between gap-6 transition-all duration-300',
            scrolled ? 'py-2' : 'py-3',
          )}
        >
          <a href="/" className="inline-flex shrink-0 items-center" aria-label="Única Promotora — início">
            <img
              src={logoBranca.src}
              alt="Única Promotora"
              width={logoBranca.width}
              height={logoBranca.height}
              className={cn('w-auto object-contain transition-all duration-300', scrolled ? 'h-11' : 'h-14')}
            />
          </a>

          <Navbar currentPath={currentPath} />

          <div className="hidden items-center gap-2 lg:flex">
            <SystemsMenu />
            <a
              href={LEAD_FORM_HREF}
              className="rounded-control bg-brand px-5 py-2.5 font-heading text-base font-semibold text-white transition-colors hover:bg-primary-600"
            >
              Quero ser parceiro
            </a>
          </div>

          <button
            type="button"
            onClick={open}
            aria-label="Abrir menu"
            className="-mr-2.5 flex h-11 w-11 items-center justify-center rounded-control text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            <Menu size={26} aria-hidden="true" />
          </button>
        </Container>
      </div>

      <Drawer isOpen={isOpen} onClose={close}>
        <MobileMenu onNavigate={close} currentPath={currentPath} />
      </Drawer>
    </header>
  );
}
