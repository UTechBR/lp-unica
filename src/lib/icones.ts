import {
  Award,
  Banknote,
  Calculator,
  CreditCard,
  Database,
  Gift,
  HandHeart,
  Landmark,
  LayoutGrid,
  Megaphone,
  MessageCircle,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react';
import type { IconComponent } from '../types';

/**
 * Ícones disponíveis para o conteúdo em src/content/*.json (campo "icone").
 * O nome é o mesmo da Lucide (lucide.dev/icons). Para usar um ícone novo no
 * conteúdo, importe-o acima e inclua aqui: o esquema rejeita nomes fora desta lista.
 */
export const icones = {
  Award,
  Banknote,
  Calculator,
  CreditCard,
  Database,
  Gift,
  HandHeart,
  Landmark,
  LayoutGrid,
  Megaphone,
  MessageCircle,
  ShieldCheck,
  Target,
  Users,
} satisfies Record<string, IconComponent>;

export type NomeIcone = keyof typeof icones;

export const nomesIcones = Object.keys(icones) as [NomeIcone, ...NomeIcone[]];
