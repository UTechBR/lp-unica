import type { ComponentType, SVGProps } from 'react';

export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: string | number }>;

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: IconComponent;
}

export interface Product {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  icon: IconComponent;
  color: 'primary' | 'accent' | 'secondary';
  highlights: string[];
}

export interface ProductCategory {
  slug: string;
  title: string;
  icon: IconComponent;
  items: string[];
  /** Produto principal: coluna em altura dupla, itens em chips e descrição opcional. */
  featured?: boolean;
  description?: string;
}

export interface EcosystemTool {
  slug: string;
  /** Etapa da operação do parceiro que a ferramenta cobre. */
  stage: string;
  name: string;
  description: string;
  icon: IconComponent;
}

export interface PartnerBank {
  name: string;
  logo: string;
}

export interface ValueItem {
  title: string;
  description: string;
  icon: IconComponent;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatarInitials: string;
  rating: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FooterLinkColumn {
  title: string;
  links: NavItem[];
}

export interface SacContact {
  bank: string;
  phone: string;
  hours: string;
  deficient?: string;
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
