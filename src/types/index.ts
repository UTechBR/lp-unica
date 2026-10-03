import type { ComponentType, SVGProps } from 'react';

export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: string | number }>;

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  /** Rótulo curto acima do link (ex.: "Currículos"). */
  detail?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: IconComponent;
}

export interface FooterLinkColumn {
  title: string;
  links: NavItem[];
}

export interface SystemAccessLink {
  name: string;
  description: string;
  /** Sem href = endereço ainda não definido; o item aparece como "em breve". */
  href?: string;
}

export const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

export type BrazilianState = (typeof brazilianStates)[number];
