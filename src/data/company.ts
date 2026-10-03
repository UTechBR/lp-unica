import { Award, HandHeart, Target, Users } from 'lucide-react';
import type { ValueItem } from '../types';

export const mission =
  'Oferecer uma prestação de serviço personalizada e transformadora que impulsione o crescimento de nossos parceiros e colaboradores. Buscamos, através da transparência, gerar um impacto positivo, construindo relações sólidas e duradouras junto ao mercado.';

export const vision =
  'Ser reconhecida como referência no mercado, através da nossa excelência na prestação de serviços, agilidade no atendimento, com foco na satisfação e no sucesso de nossos parceiros e colaboradores.';

export const values: ValueItem[] = [
  {
    title: '1. Integridade:',
    description:
      'Comprometemo-nos com a honestidade, transparência e ética em todas as nossas operações e relacionamentos.',
    icon: Award,
  },
  {
    title: '2. Agilidade:',
    description:
      'Estamos prontos para nos ajustar rapidamente às mudanças do ambiente, da tecnologia e do mercado.',
    icon: Target,
  },
  {
    title: '3. Incentivo:',
    description:
      'Buscamos a excelência em tudo o que fazemos, sempre com foco em impulsionar o crescimento e o desenvolvimento de nossos parceiros e colaboradores.',
    icon: HandHeart,
  },
  {
    title: '4. Trabalho em Equipe:',
    description:
      'Valorizamos a colaboração, o respeito mútuo e a diversidade de opiniões, reconhecendo que o trabalho em equipe é essencial para alcançarmos nossos objetivos comuns.',
    icon: Users,
  },
];

// Versão condensada para a Home (a página /sobre usa mission, vision e values
// completos). Derivada dos textos oficiais: validar com quem responde pela marca.
export const homePositioning =
  'Prestamos um serviço personalizado que impulsiona o crescimento dos nossos parceiros, com transparência e relações sólidas e duradouras com o mercado.';

export const valueHighlights: ValueItem[] = [
  { title: 'Integridade', description: 'Ética e transparência em cada operação.', icon: Award },
  { title: 'Agilidade', description: 'Prontos para as mudanças do mercado.', icon: Target },
  { title: 'Incentivo', description: 'Foco no crescimento de quem está com a gente.', icon: HandHeart },
  { title: 'Trabalho em equipe', description: 'Colaboração e respeito em tudo o que fazemos.', icon: Users },
];

export const companyInfo = {
  legalName: 'Única Promotora',
  address: 'R. Rio de Janeiro, 600 – Sala 401 a 408 - Centro, Belo Horizonte - MG, 30160-041',
  email: 'contato@unicapromotora.com.br',
  rhEmail: 'rh@unicapromotora.com.br',
  privacyEmail: 'privacidade@unicapromotora.com.br',
  phone: '(31) 2116-5020',
  phoneRaw: '+553121165020',
  dpo: 'Karla Josiane Teodoro',
  mapsUrl: 'https://maps.google.com/?q=%C3%9Anica+Promotora,+R.+Rio+de+Janeiro,+600,+Belo+Horizonte+-+MG',
  copyright: '© Copyright 2026 – Única Promotora | Developed by Única Tech.',
};
