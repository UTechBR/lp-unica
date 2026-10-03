import { useEffect, useState } from 'react';
import { Play, X } from 'lucide-react';
import { Container } from './Container';
import { LegacyAnchor } from './LegacyAnchor';

const capa01 = '/images/CAPA-VIDEO.-01.jpg.jpeg';
const capa02 = '/images/CAPA-VIDEO.-02.jpg.jpeg';
const capa03 = '/images/CAPA-VIDEO.-03.jpg.jpeg';
const capa04 = '/images/CAPA-VIDEO.-04.jpg.jpeg';

const BASE = 'https://unicapromotora.com.br/wp-content/uploads/2026/05';

const shorts = [
  { thumb: capa01, video: `${BASE}/Depoimento-1.webm` },
  { thumb: capa02, video: `${BASE}/Depoimento-3.webm` },
  { thumb: capa03, video: `${BASE}/5-anos-Unica-Dia-1.webm` },
  { thumb: capa04, video: `${BASE}/snapinsta.com_.br-69fb78681ff71.mp4` },
];

export function UnicaShorts() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active]);

  return (
    <>
    <LegacyAnchor id="blog" />
    <section id="shorts" className="scroll-mt-20 bg-white py-16 md:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-heading text-[40px] leading-[36px] tracking-tight text-secondary md:text-[96px] md:leading-[90px]">
            <span className="font-bold">Única</span> <span className="font-thin">shorts</span>
          </h2>
          <a
            href="https://instagram.com/unicapromotora/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-brand text-xl font-normal text-secondary hover:text-primary"
          >
            <span className="h-px w-8 bg-secondary" aria-hidden="true" />
            Ver mais no Instagram
          </a>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {shorts.map((short, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(short.video)}
              className="group relative aspect-[9/16] overflow-hidden bg-secondary"
            >
              <img
                src={short.thumb}
                alt={`Única shorts ${i + 1}`}
                className="h-full w-full object-cover brightness-[.85] grayscale transition duration-500 group-hover:scale-105 group-hover:brightness-100 group-hover:grayscale-0 group-focus-visible:brightness-100 group-focus-visible:grayscale-0"
              />
              {/* Duotone vermelho suave: unifica fotos de origens diferentes. Só em seção
                  clara e nesta intensidade — a seção de Produtos, logo abaixo, já é
                  vermelho sólido. A interação revela a foto real. */}
              <span
                className="absolute inset-0 bg-brand opacity-[.55] mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0"
                aria-hidden="true"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand shadow-md transition-transform group-hover:scale-110">
                  <Play size={22} fill="currentColor" className="translate-x-[1px]" />
                </span>
              </span>
            </button>
          ))}
        </div>
      </Container>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Fechar"
            className="absolute right-5 top-5 text-white/80 hover:text-white"
            onClick={() => setActive(null)}
          >
            <X size={30} />
          </button>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            src={active}
            controls
            autoPlay
            playsInline
            className="max-h-[85vh] w-auto max-w-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
    </>
  );
}
