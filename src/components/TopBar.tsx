import { Play } from 'lucide-react';
import { socialLinks, PARTNER_SYSTEM_URL } from '../data/navigation';
import { Container } from './Container';

export function TopBar() {
  return (
    <div className="bg-secondary text-white">
      <Container className="flex flex-wrap items-center justify-between gap-3 py-[24px]">
        <div className="flex items-center gap-2.5">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary transition-transform hover:scale-110"
            >
              <Icon width={14} height={14} />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={PARTNER_SYSTEM_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-[3px] bg-white px-6 py-3 text-center font-heading text-xl font-normal leading-none text-secondary transition-colors hover:bg-secondary hover:text-white"
          >
            Sou Parceiro
          </a>
          <a
            href="/#parceirounica"
            className="flex items-center gap-[15px] rounded-[3px] bg-secondary px-6 py-3 font-heading text-xl font-normal leading-none text-white transition-colors hover:bg-white hover:text-secondary"
          >
            <span>
              Quero ser parceiro <strong className="font-bold">agora</strong>
            </span>
            <Play size={16} fill="currentColor" />
          </a>
        </div>
      </Container>
    </div>
  );
}
