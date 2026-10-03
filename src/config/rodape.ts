import type { FooterLinkColumn, NavItem } from '../types';
import { companyInfo } from './empresa';
import { documentos } from './documentos';
import { DADOS_TITULARIDADE_URL, LEAD_FORM_HREF, PARTNER_SYSTEM_URL, TRABALHE_CONOSCO_URL } from './navegacao';

// Colunas de navegação do rodapé (a primeira coluna é a marca).
export const footerColumns: FooterLinkColumn[] = [
  {
    title: 'Para parceiros',
    links: [
      { label: 'Seja parceiro', href: LEAD_FORM_HREF },
      { label: 'Bancos parceiros', href: '/bancos-parceiros' },
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
    ],
  },
  {
    title: 'Atendimento',
    links: [
      // Do canal mais comum ao mais específico.
      { label: 'Fale conosco', href: '/contato' },
      { label: 'Canais dos bancos', href: '/bancos-parceiros' },
      { label: 'Ouvidoria', href: '/ouvidoria' },
      { label: 'Canal de denúncias', href: '/denuncie' },
      {
        // \n vira quebra de linha no rodapé (a seta de link externo fica só no fim).
        label: companyInfo.addressLines.join('\n'),
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
  ...Object.values(documentos).map((doc) => ({ label: `${doc.titulo} (PDF)`, href: doc.href, external: true })),
  { label: 'Direitos do titular', href: DADOS_TITULARIDADE_URL, external: true },
];
