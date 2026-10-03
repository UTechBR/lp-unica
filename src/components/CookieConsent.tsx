import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { POLICY_URLS } from '../data/navigation';
import { cn } from '../utils/cn';

const logo = '/images/cropped-unica-favicon.png';

const STORAGE_KEY = 'cmplz_consent';

type Category = 'preferences' | 'statistics' | 'marketing';

interface Consent {
  functional: true;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
}

const CATEGORIES: { id: Category; title: string; description: string }[] = [
  {
    id: 'preferences',
    title: 'Preferências',
    description:
      'O armazenamento ou acesso técnico é necessário para o propósito legítimo de armazenar preferências que não são solicitadas pelo assinante ou usuário.',
  },
  {
    id: 'statistics',
    title: 'Estatísticas',
    description: 'O armazenamento ou acesso técnico que é usado exclusivamente para fins estatísticos.',
  },
  {
    id: 'marketing',
    title: 'Marketing',
    description:
      'O armazenamento ou acesso técnico é necessário para criar perfis de usuário para enviar publicidade ou para rastrear o usuário em um site ou em vários sites para fins de marketing semelhantes.',
  },
];

function readStoredConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

// Réplica do banner real (plugin Complianz): cartão no canto inferior direito e
// categorias em acordeão (Funcional sempre ativo). Depois da decisão, as
// preferências são reabertas pelo link do rodapé.
export function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [openCategory, setOpenCategory] = useState<Category | null>(null);
  const [choices, setChoices] = useState<Record<Category, boolean>>({
    preferences: false,
    statistics: false,
    marketing: false,
  });

  useEffect(() => {
    if (!readStoredConsent()) setIsOpen(true);
  }, []);

  // Reabertura pelo link "Preferências de cookies" do rodapé (HTML estático, sem
  // hidratação): qualquer elemento com data-cookie-preferences abre as preferências.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target as Element).closest?.('[data-cookie-preferences]')) return;
      event.preventDefault();
      const stored = readStoredConsent();
      if (stored) setChoices({ preferences: stored.preferences, statistics: stored.statistics, marketing: stored.marketing });
      setShowPreferences(true);
      setIsOpen(true);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const persist = (consent: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      // armazenamento bloqueado: a escolha vale só para esta visita
    }
    setIsOpen(false);
    setShowPreferences(false);
  };

  const acceptAll = () => persist({ functional: true, preferences: true, statistics: true, marketing: true });
  const denyAll = () => persist({ functional: true, preferences: false, statistics: false, marketing: false });
  const savePreferences = () => persist({ functional: true, ...choices });

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label="Gerenciar Consentimento de Cookies"
            className="fixed bottom-[90px] right-[105px] z-[110] w-[calc(100vw-2rem)] max-w-[380px] overflow-hidden rounded-surface bg-white text-secondary shadow-card max-sm:bottom-[90px] max-sm:right-4"
          >
            <div className="flex items-center gap-3 px-4 pt-4">
              <img src={logo} alt="Única Promotora" width={28} height={28} className="h-7 w-7 shrink-0 rounded" />
              <h2 className="flex-1 text-sm font-bold text-secondary">Gerenciar Consentimento de Cookies</h2>
              <button
                type="button"
                onClick={denyAll}
                aria-label="Fechar diálogo"
                className="shrink-0 text-secondary-300 hover:text-secondary"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mx-4 my-3 border-t border-surface-border" />

            <div className="max-h-[60vh] overflow-y-auto px-4 pb-2 text-xs leading-relaxed text-secondary-400">
              <p>
                Usamos tecnologias como cookies para armazenar e/ou acessar informações do dispositivo. Fazemos isso
                para melhorar a experiência de navegação e para mostrar anúncios (não) personalizados. O
                consentimento para essas tecnologias nos permitirá processar dados como comportamento de navegação
                ou IDs exclusivos neste site. Não consentir ou retirar o consentimento pode afetar negativamente
                determinados recursos e funções.
              </p>

              {showPreferences && (
                <div className="mt-3 flex flex-col divide-y divide-surface-border border-y border-surface-border">
                  {/* Funcional: sempre ativo, sem opção de desligar */}
                  <div className="py-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-secondary">Funcional</span>
                      <span className="text-[11px] font-medium text-secondary-300">Sempre ativo</span>
                    </div>
                  </div>

                  {CATEGORIES.map((category) => {
                    const expanded = openCategory === category.id;
                    return (
                      <div key={category.id} className="py-2.5">
                        <button
                          type="button"
                          onClick={() => setOpenCategory(expanded ? null : category.id)}
                          className="flex w-full items-center justify-between text-left"
                        >
                          <span className="font-semibold text-secondary">{category.title}</span>
                          <span className="flex items-center gap-2">
                            <label
                              className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-surface-borderMuted transition-colors has-[:checked]:bg-primary"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={choices[category.id]}
                                onChange={(event) =>
                                  setChoices((prev) => ({ ...prev, [category.id]: event.target.checked }))
                                }
                              />
                              <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
                            </label>
                            <ChevronDown
                              size={16}
                              className={cn('text-secondary-300 transition-transform', expanded && 'rotate-180')}
                            />
                          </span>
                        </button>
                        {expanded && <p className="mt-2 text-secondary-300">{category.description}</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mx-4 my-2 border-t border-surface-border" />
            <div className="flex flex-wrap gap-2 px-4 pb-3">
              <button
                type="button"
                onClick={acceptAll}
                className="flex-1 rounded-control bg-primary px-4 py-2 text-xs font-bold uppercase text-white transition-colors hover:bg-primary-600"
              >
                Aceitar
              </button>
              <button
                type="button"
                onClick={denyAll}
                className="flex-1 rounded-control border border-surface-borderMuted px-4 py-2 text-xs font-bold uppercase text-secondary transition-colors hover:bg-surface-subtle"
              >
                Negar
              </button>
              {showPreferences ? (
                <button
                  type="button"
                  onClick={savePreferences}
                  className="flex-1 rounded-control border border-secondary px-4 py-2 text-xs font-bold uppercase text-secondary transition-colors hover:bg-surface-subtle"
                >
                  Salvar preferências
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPreferences(true)}
                  className="flex-1 rounded-control border border-secondary px-4 py-2 text-xs font-bold uppercase text-secondary transition-colors hover:bg-surface-subtle"
                >
                  Ver preferências
                </button>
              )}
            </div>

            <div className="border-t border-surface-border px-4 py-2.5">
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                <li>
                  <a
                    href={POLICY_URLS.cookies}
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary-300 underline hover:text-primary"
                  >
                    Política de Cookies
                  </a>
                </li>
                <li>
                  <a
                    href={POLICY_URLS.privacidade}
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary-300 underline hover:text-primary"
                  >
                    Política de Privacidade
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
