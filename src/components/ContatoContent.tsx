import { Mail, MapPin, Phone } from 'lucide-react';
import { Container } from './Container';
import { AnimatedSection } from './AnimatedSection';
import { ContatoForm } from './ContatoForm';
import { companyInfo } from '../data/company';

const contactInfo = [
  { icon: MapPin, label: 'Endereço', value: companyInfo.address },
  { icon: Phone, label: 'Telefone', value: companyInfo.phone, href: `tel:${companyInfo.phoneRaw}` },
  { icon: Mail, label: 'E-mail', value: companyInfo.email, href: `mailto:${companyInfo.email}` },
];

export function ContatoContent() {
  return (
    <section className="section-padding">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <AnimatedSection direction="left">
          <h2 className="heading-md">Informações de contato</h2>
          <div className="mt-6 flex flex-col gap-5">
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm text-secondary-300">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="font-semibold text-secondary hover:text-primary">
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-semibold text-secondary">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 aspect-video overflow-hidden rounded-surface border border-surface-border">
            <iframe
              title="Localização Única Promotora"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-43.9430%2C-19.9236%2C-43.9349%2C-19.9156&layer=mapnik&marker=-19.9196%2C-43.9389"
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        </AnimatedSection>

        <AnimatedSection direction="right" delay={0.15} className="card-surface p-6 md:p-8">
          <h2 className="heading-md">Envie uma mensagem</h2>
          <p className="mt-2 mb-6 text-sm text-secondary-400">Respondemos em até 1 dia útil.</p>
          <ContatoForm />
        </AnimatedSection>
      </Container>
    </section>
  );
}
