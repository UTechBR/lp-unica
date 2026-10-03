// Padrão dos formulários do site (parceria, contato, denúncia, ouvidoria).
//
// Visual: campos de 48px com texto de 16px (o iPhone não dá zoom ao focar), borda
// visível, foco grafite e erro num espaço reservado abaixo do campo (o layout não pula).
//
// Comportamento (para um formulário novo, siga LeadForm ou ContatoForm):
// - Campos: Input, Select e TextArea. Todo campo é obrigatório; só os opcionais são
//   sinalizados, com `optional` ("(opcional)" no rótulo). Não há asterisco nem aviso geral.
// - Validação: zod + react-hook-form, só no envio; depois revalida ao digitar. Todos os
//   erros aparecem juntos e o foco vai ao primeiro (em Controller, passe ref={field.ref}).
// - Mensagens de erro: sempre de `msg` em utils/schemas.ts.
// - Privacidade: <Consentimento> quando o tratamento depende de consentimento (parceria,
//   contato); <AvisoPrivacidade> quando não (ouvidoria, denúncias). Ambos com <LinkPrivacidade />.
// - Envio: <BotaoEnviar> (largura total) e <ErroEnvio> logo abaixo; mensagens de falha
//   de mensagemDeErro. Sucesso: <SucessoEnvio> no lugar do formulário, no mesmo card.
// - Card: cardCls + cardTituloCls (+ cardSubtituloCls).

export const campoWrapCls = 'flex min-w-0 flex-col gap-1.5 text-left';
export const rotuloCls = 'text-sm font-medium text-secondary-700';
export const opcionalCls = 'font-normal text-secondary-300';

export const controleCls =
  'w-full rounded-control border border-surface-borderMuted bg-white px-3.5 text-base text-secondary ' +
  'placeholder:text-secondary-300 transition-colors ' +
  'focus-visible:border-secondary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-200 ' +
  'aria-[invalid=true]:border-primary-400';

/** Altura dos campos de uma linha (input, select). */
export const alturaCls = 'h-12';

export const erroCls = 'min-h-4 text-xs leading-tight text-primary-600';
export const ajudaCls = 'text-xs text-secondary-400';

/** Espaço entre campos dentro do <form>. */
export const formCls = 'flex w-full min-w-0 flex-col gap-2';

/** Card que envolve um formulário nas páginas. */
export const cardCls = 'rounded-surface border border-surface-border bg-white p-6 shadow-card md:p-7';
export const cardTituloCls = 'font-heading text-[22px] font-semibold text-secondary';
export const cardSubtituloCls = 'mt-1 text-sm text-secondary-400';
