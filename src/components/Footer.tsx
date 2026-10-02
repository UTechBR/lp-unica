import { Info } from 'lucide-react';
import { Container } from './Container';
import { footerColumns } from '../data/footer';
import { companyInfo } from '../data/company';
import { socialLinks } from '../data/navigation';

const logoBranca = '/images/logo-unica-branca.png';

export function Footer() {
  return (
    <footer id="contato" className="scroll-mt-32 bg-black text-white">
      <Container className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src={logoBranca} alt="Única Promotora" className="h-24 w-auto" width={880} height={890} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
            Utilizamos nossa experiência e conhecimento diariamente para oferecer a solução mais eficaz{' '}
            <strong className="font-bold text-white">para você.</strong>
          </p>
          <div className="mt-6 flex items-center gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-secondary-700 text-white transition-transform hover:scale-110 hover:border-white"
              >
                <Icon width={15} height={15} />
              </a>
            ))}
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <h2 className="font-brand text-lg font-bold text-[var(--accent-on-dark)]">{column.title}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-white/80 hover:text-[var(--accent-on-dark)]"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a href={link.href} className="flex items-center gap-1.5 text-sm text-white/80 hover:text-[var(--accent-on-dark)]">
                      {link.label === 'Denuncie' && <Info size={14} className="text-[var(--accent-on-dark)]" aria-hidden="true" />}
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="font-brand text-lg font-bold text-[var(--accent-on-dark)]">Contato</h2>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-white/80">
            <li>
              <a href={companyInfo.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-[var(--accent-on-dark)]">
                R. Rio de Janeiro, 600
                <br />
                Sala 401 a 408 - Centro
                <br />
                Belo Horizonte - MG, 30160-041
              </a>
            </li>
            <li>
              <a href={`mailto:${companyInfo.email}`} className="hover:text-[var(--accent-on-dark)]">
                {companyInfo.email}
              </a>
            </li>
            <li>
              <a href={`tel:${companyInfo.phoneRaw}`} className="hover:text-[var(--accent-on-dark)]">
                {companyInfo.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${companyInfo.privacyEmail}`} className="hover:text-[var(--accent-on-dark)]">
                DPO {companyInfo.dpo}
              </a>
            </li>
            <li>
              Envie seu currículo para:
              <br />
              <a href={`mailto:${companyInfo.rhEmail}`} className="hover:text-[var(--accent-on-dark)]">
                {companyInfo.rhEmail}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-6 text-center text-xs text-white/50">
          <p>{companyInfo.copyright}</p>
        </Container>
      </div>
    </footer>
  );
}
