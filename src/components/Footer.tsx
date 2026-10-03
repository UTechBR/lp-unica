import { ArrowUpRight, ShieldAlert } from 'lucide-react';
import { Container } from './Container';
import { footerColumns, legalLinks } from '../config/rodape';
import { socialLinks } from '../config/navegacao';
import type { NavItem } from '../types';
import { cn } from '../utils/cn';

import logoBranca from '../assets/marca/logo-branca.png';
const ano = new Date().getFullYear();

const linkCls =
  'group text-white/70 decoration-white/40 underline-offset-4 transition-colors duration-150 ' +
  'hover:text-white hover:underline focus-visible:text-white focus-visible:underline';

interface FooterLinkProps {
  link: NavItem;
  className?: string;
  /** Sem a seta de link externo (ex.: barra legal, onde todos os links são PDFs em nova aba). */
  semSeta?: boolean;
}

function FooterLink({ link, className, semSeta = false }: FooterLinkProps) {
  return (
    <a
      href={link.href}
      className={cn(linkCls, 'whitespace-pre-line', className)}
      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {link.label}
      {link.external && !semSeta && (
        <ArrowUpRight
          size={12}
          className="ml-1 inline-block align-[-1px] text-white/40 group-hover:text-white/80"
          aria-hidden="true"
        />
      )}
      {link.external && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  );
}

export function Footer() {
  return (
    <footer id="contato" className="focus-on-dark scroll-mt-20 bg-surface-dark text-white">
      {/* Mobile: "Para parceiros" e "Institucional" lado a lado; marca e Atendimento na linha toda. */}
      <Container className="grid grid-cols-2 gap-x-6 gap-y-12 py-16 md:gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1.3fr]">
        <div className="col-span-2 lg:col-span-1">
          <a href="/" aria-label="Única Promotora — início" className="inline-block rounded-control">
            <img
              src={logoBranca.src}
              alt="Única Promotora"
              width={logoBranca.width}
              height={logoBranca.height}
              className="h-16 w-auto"
            />
          </a>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/70">
            Serviço personalizado que impulsiona o crescimento dos nossos parceiros.
          </p>
          <ul className="mt-6 flex items-center gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-150 hover:border-white hover:bg-white hover:text-secondary focus-visible:border-white focus-visible:bg-white focus-visible:text-secondary"
                >
                  <Icon width={16} height={16} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {footerColumns.map((column, index) => (
          <nav
            key={column.title}
            aria-label={column.title}
            className={cn(index === footerColumns.length - 1 && 'col-span-2 md:col-span-1')}
          >
            <h2 className="font-heading text-base font-semibold text-white">{column.title}</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.detail && (
                    <span className="block text-xs uppercase tracking-[0.06em] text-white/50">{link.detail}</span>
                  )}
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <div className="border-t border-white/10">
        {/* Folga para o botão flutuante do chat: embaixo no mobile, à direita no desktop. */}
        <Container className="space-y-4 py-8 pb-24 text-xs text-white/60 lg:pb-8 lg:pr-28">
          {/* TODO(compliance): razão social, CNPJ e identificação como correspondente bancário
              e instituições contratantes. Não publicar com placeholders. */}
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <FooterLink link={link} semSeta />
              </li>
            ))}
            <li>
              <a href="/denuncie" className={cn(linkCls, 'inline-flex items-center gap-1.5')}>
                <ShieldAlert size={14} aria-hidden="true" />
                Denuncie
              </a>
            </li>
            <li>
              {/* Aberto pelo CookieConsent via data-cookie-preferences (o rodapé não é hidratado). */}
              <button type="button" data-cookie-preferences className={linkCls}>
                Preferências de cookies
              </button>
            </li>
          </ul>
          <p>
            © {ano} Única Promotora · Desenvolvido por Única Tech
          </p>
        </Container>
      </div>
    </footer>
  );
}
