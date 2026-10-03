import type { FooterLinkColumn, SacContact } from '../types';
import { DADOS_TITULARIDADE_URL, LEAD_FORM_HREF, POLICY_URLS, TRABALHE_CONOSCO_URL } from './navigation';

export const footerColumns: FooterLinkColumn[] = [
  {
    title: 'Institucional',
    links: [
      { label: 'Seja parceiro', href: LEAD_FORM_HREF },
      { label: 'Bancos parceiros', href: '/#bancos' },
      { label: 'Produtos', href: '/#produtos' },
      { label: 'Sistemas', href: '/#sistemas' },
      { label: 'Sobre nós', href: '/#sobre' },
      { label: 'Única shorts', href: '/#shorts' },
      { label: 'Trabalhe Conosco', href: TRABALHE_CONOSCO_URL, external: true },
    ],
  },
  {
    title: 'Links Úteis',
    links: [
      { label: 'Compliance', href: POLICY_URLS.compliance, external: true },
      { label: 'Dados de Titularidade', href: DADOS_TITULARIDADE_URL, external: true },
      { label: 'Políticas de Privacidade', href: POLICY_URLS.privacidade, external: true },
      { label: 'Políticas de Cookies', href: POLICY_URLS.cookies, external: true },
      { label: 'Políticas de Gestão de Incidentes', href: POLICY_URLS.incidentes, external: true },
      { label: 'Denuncie', href: '/denuncie' },
    ],
  },
];

export const sacContacts: SacContact[] = [
  { bank: 'Banco do Brasil', phone: '0800 729 0722', hours: '24 horas, todos os dias' },
  { bank: 'Itaú Consignado', phone: '0800 724 2101', hours: 'Seg a Sex, 8h às 20h' },
  { bank: 'Mercantil do Brasil', phone: '0800 707 0398', hours: '24 horas, todos os dias' },
  { bank: 'Banco BMG', phone: '0800 889 0200', hours: '24 horas, todos os dias' },
  { bank: 'Banco Daycoval', phone: '0800 721 5300', hours: '24 horas, todos os dias' },
  { bank: 'Banco Pan', phone: '0800 775 8686', hours: '24 horas, todos os dias' },
  { bank: 'Santander', phone: '0800 702 3535', hours: 'Seg a Sex, 6h às 22h' },
  { bank: 'Banco Banrisul', phone: '3003 0511', hours: '24 horas, todos os dias' },
  { bank: 'Safra Financeira', phone: '0800 772 5755', hours: 'Seg a Sex, 9h às 19h' },
  { bank: 'Facta Financeira', phone: '0800 942 0462', hours: 'Seg a Sex' },
];
