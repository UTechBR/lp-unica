import { mainNav } from '../data/navigation';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { cn } from '../utils/cn';

const baseItemCls =
  'relative px-3 py-2 font-heading text-xl font-normal text-white transition-colors ' +
  'after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-[var(--accent-on-dark)] after:transition-transform after:duration-300 after:content-[""]';
const restingCls = 'after:scale-x-0 hover:after:scale-x-100 focus-visible:after:scale-x-100';
const activeItemCls = 'after:scale-x-100';

// ids em ordem de topo a baixo na Home — usados pelo scroll-spy para saber em
// qual seção o usuário está de fato, em vez de confiar na hash.
const SPY_IDS = ['produtos', 'ecossistema', 'sobre', 'shorts'];
// Um pouco abaixo do header compactado (~60px).
const SPY_OFFSET = 100;

interface NavbarProps {
  /**
   * Astro não tem client router: em vez de `useLocation()`, a página passa a própria
   * rota (`Astro.url.pathname`) como prop. É a mesma informação, só entra por fora
   * em vez de vir de um hook do react-router.
   */
  currentPath: string;
}

export function Navbar({ currentPath }: NavbarProps) {
  const spyId = useScrollSpy(SPY_IDS, SPY_OFFSET);
  const onHome = currentPath === '/';

  const isItemActive = (href: string) => {
    const [, hash] = href.split('#');
    if (hash) return onHome && spyId === hash;
    return currentPath === href;
  };

  return (
    <nav aria-label="Navegação principal" className="hidden lg:block">
      <ul className="flex items-center gap-2">
        {mainNav.map((item) => {
          const active = isItemActive(item.href);
          const classes = cn(baseItemCls, active ? activeItemCls : restingCls);

          return (
            <li key={item.label}>
              {item.external ? (
                <a href={item.href} target="_blank" rel="noreferrer" className={classes}>
                  {item.label}
                </a>
              ) : (
                <a href={item.href} className={classes} aria-current={active ? 'location' : undefined}>
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
