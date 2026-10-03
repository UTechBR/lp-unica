import type { FooterLinkColumn, NavItem, SacContact } from '../types';
import { companyInfo } from './company';
import {
  DADOS_TITULARIDADE_URL,
  LEAD_FORM_HREF,
  PARTNER_SYSTEM_URL,
  POLICY_URLS,
  TRABALHE_CONOSCO_URL,
} from './navigation';

// Colunas de navegação do rodapé (a primeira coluna é a marca).
export const footerColumns: FooterLinkColumn[] = [
  {
    title: 'Para parceiros',
    links: [
      { label: 'Seja parceiro', href: LEAD_FORM_HREF },
      { label: 'Produtos', href: '/#produtos' },
      { label: 'Ecossistema', href: '/#ecossistema' },
      { label: 'Acessar sistemas', href: PARTNER_SYSTEM_URL, external: true },
    ],
  },
  {
    title: 'Institucional',
    links: [
      { label: 'Sobre nós', href: '/#sobre' },
      { label: 'Única shorts', href: '/#shorts' },
      { label: 'Trabalhe conosco', href: TRABALHE_CONOSCO_URL, external: true },
      { label: 'Canais de atendimento dos bancos', href: '/canais-de-atendimento' },
    ],
  },
  {
    title: 'Atendimento',
    links: [
      {
        label: 'R. Rio de Janeiro, 600, salas 401 a 408 · Centro, Belo Horizonte/MG · 30160-041',
        href: companyInfo.mapsUrl,
        external: true,
      },
      { label: companyInfo.email, href: `mailto:${companyInfo.email}` },
      { label: companyInfo.phone, href: `tel:${companyInfo.phoneRaw}` },
      { label: companyInfo.dpo, detail: 'Encarregada de dados (DPO)', href: `mailto:${companyInfo.privacyEmail}` },
      { label: companyInfo.rhEmail, detail: 'Currículos', href: `mailto:${companyInfo.rhEmail}` },
    ],
  },
];

// Barra legal, abaixo das colunas.
// TODO(compliance): validar o destino de "Direitos do titular".
export const legalLinks: NavItem[] = [
  { label: 'Compliance (PDF)', href: POLICY_URLS.compliance, external: true },
  { label: 'Política de Privacidade (PDF)', href: POLICY_URLS.privacidade, external: true },
  { label: 'Política de Cookies (PDF)', href: POLICY_URLS.cookies, external: true },
  { label: 'Gestão de Incidentes (PDF)', href: POLICY_URLS.incidentes, external: true },
  { label: 'Direitos do titular', href: DADOS_TITULARIDADE_URL, external: true },
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
