import { contatoAssuntos } from '../utils/schemas';
import type { LeadFormData, ContactFormData, OuvidoriaFormData, DenuncieFormData } from '../utils/schemas';

// Cada formulário é persistido por um script PHP hospedado junto com o site
// estático na Hostgator (public/api/*.php). LeadForm e ContatoForm gravam na
// mesma planilha (public/api/leads.csv, coluna "origem" diferencia); Ouvidoria
// e Denuncie têm suas próprias planilhas por serem canais de compliance.
// Caminho relativo (mesma origem) em vez de um backend externo.

/**
 * Resultado comum a todos os envios. `error` é o código devolvido pelo PHP
 * (ex.: missing_consent), "network" sem conexão ou "unknown" para resposta inválida;
 * a mensagem para a pessoa vem de mensagemDeErro (components/form/Envio.tsx).
 */
export type EnvioResultado = { success: true; protocolo?: string } | { success: false; error: string };

async function enviar(endpoint: string, init: RequestInit): Promise<EnvioResultado> {
  let response: Response;
  try {
    response = await fetch(`/api/${endpoint}`, { method: 'POST', ...init });
  } catch {
    return { success: false, error: 'network' };
  }
  try {
    const result = await response.json();
    if (result?.success) {
      return typeof result.protocolo === 'string' ? { success: true, protocolo: result.protocolo } : { success: true };
    }
    return { success: false, error: String(result?.error ?? 'unknown') };
  } catch {
    return { success: false, error: 'unknown' }; // resposta não-JSON (ex.: erro do servidor)
  }
}

const enviarJson = (endpoint: string, data: unknown) =>
  enviar(endpoint, { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });

export function submitLead(data: LeadFormData): Promise<EnvioResultado> {
  return enviarJson('leads.php', data);
}

// Na planilha, o assunto vai pelo rótulo legível ("Sou cliente"), não pelo código.
export function submitContact(data: ContactFormData): Promise<EnvioResultado> {
  const rotulo = contatoAssuntos.find((a) => a.valor === data.subject)?.rotulo ?? data.subject;
  return enviarJson('contact.php', { ...data, subject: rotulo });
}

export function submitOuvidoria(data: OuvidoriaFormData): Promise<EnvioResultado> {
  return enviarJson('ouvidoria.php', data);
}

// Denúncia vai como multipart/form-data por causa dos anexos. Em modo anônimo, os dados
// de identificação não saem do navegador.
export function submitDenuncia(data: DenuncieFormData): Promise<EnvioResultado> {
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
  return enviar('denuncie.php', { body });
}
