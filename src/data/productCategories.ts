import { Banknote, CreditCard, Landmark, LayoutGrid, ShieldCheck } from 'lucide-react';
import type { ProductCategory } from '../types';

// Ordem = ordem na grade: Consignado em destaque à esquerda, os demais em 2×2.
export const productCategories: ProductCategory[] = [
  {
    slug: 'consignado',
    title: 'Consignado',
    icon: Landmark,
    featured: true,
    description:
      'Crédito com parcelas descontadas direto da folha ou do benefício, para aposentados, pensionistas, servidores, militares e trabalhadores do setor privado.',
    items: ['INSS', 'Público', 'Privado', 'Federal/Civil (SIAPE)', 'Marinha', 'Aeronáutica', 'Exército'],
  },
  {
    slug: 'credito',
    title: 'Crédito',
    icon: Banknote,
    items: ['Pessoal', 'Empréstimo / FGTS', 'Car Equity'],
  },
  {
    slug: 'cartoes',
    title: 'Cartões',
    icon: CreditCard,
    items: ['Cartão Benefício Consignável', 'Cartão Consignado com Saque Complementar'],
  },
  {
    slug: 'seguros',
    title: 'Seguros',
    icon: ShieldCheck,
    items: ['Prestamista'],
  },
  {
    slug: 'outros-produtos',
    title: 'Outros Produtos',
    icon: LayoutGrid,
    items: ['BB Mais', 'Santander (Abertura de Conta)'],
  },
];
