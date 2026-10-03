// Documentos legais em public/documentos/ (URL fixa, sem processamento).
// Ao trocar um PDF, mantenha o nome do arquivo para não quebrar links já enviados.
// Caminhos antigos (/assets_docs/…) redirecionam para estes em public/.htaccess.
export const documentos = {
  compliance: { titulo: 'Compliance', href: '/documentos/compliance.pdf' },
  privacidade: { titulo: 'Política de Privacidade', href: '/documentos/politica-de-privacidade.pdf' },
  cookies: { titulo: 'Política de Cookies', href: '/documentos/politica-de-cookies.pdf' },
  incidentes: { titulo: 'Gestão de Incidentes', href: '/documentos/politica-de-gestao-de-incidentes.pdf' },
} as const;
