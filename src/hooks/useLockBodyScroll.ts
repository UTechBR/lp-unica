import { useEffect } from 'react';

// Quantos overlays estão abertos ao mesmo tempo (ex.: modal aberto a partir de outro).
let openOverlays = 0;

/**
 * Trava a rolagem enquanto um overlay (drawer, modal, popup) está aberto e marca
 * <html> com `.overlay-open`, que esconde os flutuantes (chat) para não cobrirem o overlay.
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    openOverlays += 1;
    document.documentElement.classList.add('overlay-open');

    return () => {
      document.body.style.overflow = originalOverflow;
      openOverlays -= 1;
      if (openOverlays === 0) document.documentElement.classList.remove('overlay-open');
    };
  }, [locked]);
}
