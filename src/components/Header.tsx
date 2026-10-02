import { Menu } from 'lucide-react';
import { TopBar } from './TopBar';
import { Navbar } from './Navbar';
import { InternalToolsMenu } from './InternalToolsMenu';
import { MobileMenu } from './MobileMenu';
import { Container } from './Container';
import { Drawer } from './Drawer';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { useDisclosure } from '../hooks/useDisclosure';
import { cn } from '../utils/cn';

const logoBranca = '/images/logo-unica-branca.png';

interface HeaderProps {
  currentPath: string;
}

export function Header({ currentPath }: HeaderProps) {
  const scrolled = useScrollPosition(16);
  const { isOpen, open, close } = useDisclosure();

  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-50">
        <div
          className={cn(
            'bg-secondary text-white transition-shadow duration-300',
            scrolled ? 'shadow-header' : 'shadow-none',
          )}
        >
          <Container
            className={cn(
              'flex items-center justify-between gap-6 transition-all duration-300',
              scrolled ? 'py-[14px]' : 'py-[24px]',
            )}
          >
            <a href="/" className="inline-flex shrink-0 items-center" aria-label="Única Promotora">
              <img
                src={logoBranca}
                alt="Única Promotora"
                width={879}
                height={892}
                className={cn(
                  'h-14 w-auto object-contain transition-all duration-300 sm:h-16',
                  scrolled ? 'lg:h-14' : 'lg:h-16',
                )}
              />
            </a>
            <div className="flex items-center gap-3">
              <Navbar currentPath={currentPath} />
              <InternalToolsMenu />
            </div>

            <button
              type="button"
              onClick={open}
              aria-label="Abrir menu"
              className="flex h-[33px] w-[33px] items-center justify-center rounded-[3px] bg-white text-primary lg:hidden"
            >
              <Menu size={22} />
            </button>
          </Container>
        </div>

        <Drawer isOpen={isOpen} onClose={close}>
          <MobileMenu onNavigate={close} currentPath={currentPath} />
        </Drawer>
      </header>
    </>
  );
}
