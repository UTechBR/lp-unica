import { Container } from './Container';
import { productCategories } from '../data/productCategories';
import { cn } from '../utils/cn';

export function ProductsSection() {
  return (
    <section id="produtos" className="scroll-mt-20 bg-brand py-16 md:py-24">
      <Container>
        <h2 className="text-center font-heading text-3xl font-light text-white md:text-5xl">
          Nossos <strong className="font-bold">produtos</strong>
        </h2>
        {/* Branco sólido: text-white/80 sobre o vermelho cai para ~3,7:1. Texto a validar com o comercial. */}
        <p className="mx-auto mt-4 max-w-[620px] text-balance text-center text-lg text-white">
          Um portfólio completo para você atender cada perfil de cliente, do aposentado ao trabalhador CLT.
        </p>

        {/* Mobile: 1 coluna. sm: Consignado na largura toda e os demais 2×2.
            lg: Consignado em altura dupla à esquerda, os demais 2×2 à direita. */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr]">
          {productCategories.map((category) => {
            const Icon = category.icon;

            return (
              <article
                key={category.slug}
                className={cn(
                  'flex flex-col rounded-lg bg-white p-7 shadow-sm',
                  category.featured && 'sm:col-span-2 lg:col-span-1 lg:row-span-2',
                )}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-100 text-secondary">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-heading text-xl font-semibold text-secondary">{category.title}</h3>

                {category.description && (
                  <p className="mt-2 text-[15px] leading-relaxed text-secondary-400">{category.description}</p>
                )}

                {category.featured ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <li key={item} className="rounded-full bg-secondary-50 px-3.5 py-1.5 text-sm text-secondary">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="mt-3 space-y-1.5 text-[15px] text-secondary-400">
                    {category.items.map((item) => (
                      <li key={item} className="flex items-baseline gap-2.5">
                        {/* marcador neutro: nada aqui é clicável */}
                        <span className="h-1.5 w-1.5 shrink-0 -translate-y-0.5 rounded-full bg-secondary/40" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
