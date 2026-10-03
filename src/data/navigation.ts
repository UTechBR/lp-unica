import type { NavItem, SocialLink, SystemAccessLink } from '../types';
import {
  FacebookIcon,
  GoogleIcon,
  InstagramIcon,
  LinkedinIcon,
} from '../components/SocialIcons';

export const TRABALHE_CONOSCO_URL = 'https://forms.gle/nk5JjHSgHQUt8e8CA';
export const DADOS_TITULARIDADE_URL = 'https://share.google/LoVjPdisKzClKI77t';
export const PARTNER_SYSTEM_URL = 'https://sistema.unicapromotora.com.br/';
export const CONTACT_EMAIL = 'contato@unicapromotora.com.br';

export const POLICY_URLS = {
  compliance: '/assets_docs/compliance.pdf',
  privacidade: '/assets_docs/POLITICA-DE-PRIVACIDADE-DE-DADOS.pdf',
  cookies: '/assets_docs/POLITICA-DE-COOKIES.pdf',
  incidentes: '/assets_docs/POLITICA-GESTAO-INCID.pdf',
} as const;

export const LEAD_FORM_HREF = '/#seja-parceiro';

// Segue a ordem das seções da Home. Shorts, Trabalhe Conosco e Contato ficam no rodapé.
export const mainNav: NavItem[] = [
  { label: 'Produtos', href: '/#produtos' },
  { label: 'Sistemas', href: '/#sistemas' },
  { label: 'Sobre', href: '/#sobre' },
];

// Menu "Acessar sistemas": para quem já é parceiro.
export const systemAccessLinks: SystemAccessLink[] = [
  { name: 'Portal do parceiro', description: 'Sistema da Única Promotora', href: PARTNER_SYSTEM_URL },
  { name: 'Astor', description: 'Tech, Chat e Multibank', href: 'https://crm.astortech.com.br/' },
  { name: 'Ultra Fácil', description: 'Consultas e campanhas', href: 'https://ultrafacil.consigbr.com/admin' },
  { name: 'Única Mais', description: 'Vantagens e prêmios', href: 'https://unicamais.com/' },
  // URL definitiva ainda pendente com a equipe interna.
  { name: 'Única Design', description: 'Design da equipe Única' },
];

export const socialLinks: SocialLink[] = [
  { label: 'Facebook', href: 'https://facebook.com/unicapromotora/', icon: FacebookIcon },
  { label: 'Instagram', href: 'https://instagram.com/unicapromotora/', icon: InstagramIcon },
  { label: 'Google', href: 'https://g.page/unicapromotora/', icon: GoogleIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/unicapromotora/', icon: LinkedinIcon },
];
