// Dados fixos da empresa e textos institucionais únicos. Listas (valores, bancos,
// produtos…) ficam em src/content/.

// Missão e visão oficiais: referência, não exibidas no site hoje.

export const mission =
  'Oferecer uma prestação de serviço personalizada e transformadora que impulsione o crescimento de nossos parceiros e colaboradores. Buscamos, através da transparência, gerar um impacto positivo, construindo relações sólidas e duradouras junto ao mercado.';

export const vision =
  'Ser reconhecida como referência no mercado, através da nossa excelência na prestação de serviços, agilidade no atendimento, com foco na satisfação e no sucesso de nossos parceiros e colaboradores.';

// Posicionamento exibido na seção Sobre (Home e /sobre).
// Derivada dos textos oficiais: validar com quem responde pela marca.
export const homePositioning =
  'Prestamos um serviço personalizado que impulsiona o crescimento dos nossos parceiros, com transparência e relações sólidas e duradouras com o mercado.';

/**
 * Números da empresa ("A Única em números", na página /sobre). Só aparecem os marcados
 * `confirmado: true`, e a faixa só é exibida com pelo menos dois. O total de bancos não
 * entra aqui: é calculado da lista em src/content/bancos.json.
 * Números confirmados pela empresa em 03/10/2026.
 */
export const numerosEmpresa: { valor: string; rotulo: string; confirmado: boolean }[] = [
  { valor: '27', rotulo: 'estados atendidos', confirmado: true },
  { valor: '500+', rotulo: 'parceiros ativos', confirmado: true },
  { valor: '10+', rotulo: 'anos de mercado', confirmado: true },
];

export const companyInfo = {
  legalName: 'Única Promotora',
  address: 'R. Rio de Janeiro, 600 – Sala 401 a 408 - Centro, Belo Horizonte - MG, 30160-041',
  /** Endereço para exibição em duas linhas (rodapé, contato). */
  addressLines: ['R. Rio de Janeiro, 600, salas 401 a 408', 'Centro, Belo Horizonte/MG · 30160-041'],
  email: 'contato@unicapromotora.com.br',
  rhEmail: 'rh@unicapromotora.com.br',
  privacyEmail: 'privacidade@unicapromotora.com.br',
  phone: '(31) 2116-5020',
  phoneRaw: '+553121165020',
  dpo: 'Karla Josiane Teodoro',
  mapsUrl: 'https://maps.google.com/?q=%C3%9Anica+Promotora,+R.+Rio+de+Janeiro,+600,+Belo+Horizonte+-+MG',
};
