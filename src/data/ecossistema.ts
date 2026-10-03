import { Calculator, Database, Gift, Megaphone, MessageCircle } from 'lucide-react';
import type { EcosystemTool } from '../types';

// Ordem = jornada do parceiro. Etapas e textos a validar com quem opera as
// ferramentas ("Simulação" para o Multibank é o mais incerto). Os links de acesso
// ficam em systemAccessLinks (data/navigation.ts), no menu "Acessar sistemas".
export const ecosystemTools: EcosystemTool[] = [
  {
    slug: 'astor-tech',
    stage: 'Base',
    name: 'Astor Tech',
    description: 'Consulta, higienização e enriquecimento das suas bases.',
    icon: Database,
  },
  {
    slug: 'ultra-facil',
    stage: 'Campanhas',
    name: 'Ultra Fácil',
    description: 'Disparos de mensagens e criação de campanhas.',
    icon: Megaphone,
  },
  {
    slug: 'astor-chat',
    stage: 'Atendimento',
    name: 'Astor Chat',
    description: 'Atendimento e relacionamento com o cliente via WhatsApp.',
    icon: MessageCircle,
  },
  {
    slug: 'astor-multibank',
    stage: 'Simulação',
    name: 'Astor Multibank',
    description: 'Consulta multibanco para o Consignado CLT.',
    icon: Calculator,
  },
  {
    slug: 'unica-mais',
    stage: 'Vantagens',
    name: 'Única Mais',
    description: 'Solicite bases e troque pontos por prêmios.',
    icon: Gift,
  },
];
