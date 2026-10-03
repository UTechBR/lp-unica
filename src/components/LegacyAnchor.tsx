/**
 * Âncora invisível que mantém um id antigo funcionando depois de uma renomeação,
 * para não quebrar links já distribuídos (campanhas, WhatsApp). Renderizar logo
 * antes da seção, para cair no mesmo ponto de rolagem.
 */
export function LegacyAnchor({ id }: { id: string }) {
  return <span id={id} className="block scroll-mt-20" aria-hidden="true" />;
}
