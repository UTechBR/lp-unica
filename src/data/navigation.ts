import type { NavItem, SocialLink } from '../types';
import {
  FacebookIcon,
  GoogleIcon,
  InstagramIcon,
  LinkedinIcon,
  WhatsappIcon,
} from '../components/SocialIcons';

export const TRABALHE_CONOSCO_URL = 'https://forms.gle/nk5JjHSgHQUt8e8CA';
export const DADOS_TITULARIDADE_URL = 'https://share.google/LoVjPdisKzClKI77t';
export const PARTNER_SYSTEM_URL = 'https://sistema.unicapromotora.com.br/';
export const CONTACT_EMAIL = 'contato@unicapromotora.com.br';
export const CONTACT_GMAIL_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`;

export const POLICY_URLS = {
  compliance: '/assets_docs/compliance.pdf',
  privacidade: '/assets_docs/POLITICA-DE-PRIVACIDADE-DE-DADOS.pdf',
  cookies: '/assets_docs/POLITICA-DE-COOKIES.pdf',
  incidentes: '/assets_docs/POLITICA-GESTAO-INCID.pdf',
} as const;

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/#parceirounica' },
  { label: 'Produtos', href: '/#produtos' },
  { label: 'Nossos Sistemas', href: '/#sistemas' },
  { label: 'Bancos Parceiros', href: '/#parceiros' },
  { label: 'Trabalhe Conosco', href: TRABALHE_CONOSCO_URL, external: true },
  { label: 'Contato', href: CONTACT_GMAIL_URL, external: true },
];

export const socialLinks: SocialLink[] = [
  { label: 'Facebook', href: 'https://facebook.com/unicapromotora/', icon: FacebookIcon },
  { label: 'Instagram', href: 'https://instagram.com/unicapromotora/', icon: InstagramIcon },
  { label: 'Google', href: 'https://g.page/unicapromotora/', icon: GoogleIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/unicapromotora/', icon: LinkedinIcon },
  {
    label: 'WhatsApp',
    href: 'https://api.whatsapp.com/send/?phone=553121165020&text&type=phone_number&app_absent=0',
    icon: WhatsappIcon,
  },
];
