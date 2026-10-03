import type { LeadFormData, ContactFormData, OuvidoriaFormData, DenuncieFormData } from '../utils/schemas';

// Cada formulário é persistido por um script PHP hospedado junto com o site
// estático na Hostgator (public/api/*.php). LeadForm e ContatoForm gravam na
// mesma planilha (public/api/leads.csv, coluna "origem" diferencia); Ouvidoria
// e Denuncie têm suas próprias planilhas por serem canais de compliance.
// Caminho relativo (mesma origem) em vez de um backend externo.
async function postToPhp(endpoint: string, data: unknown): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return { success: Boolean(result?.success) };
  } catch {
    return { success: false };
  }
}

export function submitLead(data: LeadFormData): Promise<{ success: boolean }> {
  return postToPhp('leads.php', data);
}

export function submitContact(data: ContactFormData): Promise<{ success: boolean }> {
  return postToPhp('contact.php', data);
}

export function submitOuvidoria(data: OuvidoriaFormData): Promise<{ success: boolean }> {
  return postToPhp('ouvidoria.php', data);
}

export type DenunciaResultado = { success: true; protocolo: string } | { success: false; error: string };

// Denúncia vai como multipart/form-data por causa dos anexos. Em modo anônimo, os dados
// de identificação não saem do navegador.
export async function submitDenuncia(data: DenuncieFormData): Promise<DenunciaResultado> {
  const body = new FormData();
  if (data.anonimo) {
    body.append('anonimo', 'sim');
  } else {
    body.append('name', data.name);
    body.append('email', data.email);
    body.append('phone', data.phone);
  }
  body.append('category', data.category ?? '');
  body.append('description', data.description);
  for (const file of data.files) body.append('files[]', file);

  let response: Response;
  try {
    response = await fetch('/api/denuncie.php', { method: 'POST', body });
  } catch {
    return { success: false, error: 'network' };
  }
  try {
    const result = await response.json();
    if (result?.success && typeof result.protocolo === 'string') return { success: true, protocolo: result.protocolo };
    return { success: false, error: String(result?.error ?? 'unknown') };
  } catch {
    return { success: false, error: 'unknown' }; // resposta não-JSON (ex.: erro do servidor)
  }
}
