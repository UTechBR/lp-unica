import { ChevronRight } from 'lucide-react';
import { Container } from './Container';
import { productCategories } from '../data/productCategories';
import { cn } from '../utils/cn';

export function ProductsSection() {
  return (
    <section id="produtos" className="scroll-mt-32 bg-brand py-16 md:py-24">
      <Container>
        <h2 className="text-center font-heading text-white">
          <span className="text-3xl font-thin md:text-5xl">Nossos </span>
          <span className="text-3xl font-bold italic md:text-5xl">produtos</span>
        </h2>

        <div className="mx-auto mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-fr">
          {productCategories.map((category) => {
            const Icon = category.icon;
            const badgeOnBottom = category.badgePosition === 'bottom';

            return (
              <div
                key={category.slug}
                className={cn(
                  'relative rounded-[28px] bg-white px-7 pb-8 pt-9 shadow-2xl shadow-black/30',
                  category.className,
                )}
              >
                <span
                  className={cn(
                    'absolute right-6 flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-white shadow-soft',
                    badgeOnBottom ? '-bottom-5' : '-top-5',
                  )}
                >
                  <Icon size={20} />
                </span>

                <h3 className="font-brand text-xl font-bold italic leading-tight text-secondary">
                  {category.title}
                </h3>

                <ul className="mt-4 space-y-2">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-1.5 font-brand text-[15px] font-bold italic leading-snug text-secondary"
                    >
                      <ChevronRight size={14} className="mt-1 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
