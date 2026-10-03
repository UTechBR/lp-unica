import { z } from 'zod';
import { brazilianStates } from '../types';
import { unmaskDigits } from './masks';

/** Mínimo de caracteres de toda área de texto dos formulários (contador no TextArea). */
export const MIN_TEXTO = 50;

// Mensagens de erro: o mesmo texto para o mesmo tipo de erro em todos os formulários.
export const msg = {
  nome: 'Informe seu nome completo',
  email: 'Informe um e-mail válido',
  telefone: 'Informe um telefone válido com DDD',
  selecione: (campo: string) => `Selecione ${campo}`,
  informe: (campo: string) => `Informe ${campo}`,
  minimo: (n: number) => `Escreva pelo menos ${n} caracteres`,
  maximo: (n: number) => `Use no máximo ${n} caracteres`,
  consentimento: 'Marque a autorização para continuar',
};

const nameField = z
  .string()
  .trim()
  .min(3, msg.nome)
  .max(100, msg.maximo(100));

const phoneField = z
  .string()
  .trim()
  .refine((value) => unmaskDigits(value).length >= 10, msg.telefone);

const emailField = z.string().trim().email(msg.email);

export const leadFormSchema = z.object({
  name: nameField,
  phone: phoneField,
  email: emailField,
  city: z.string().trim().min(2, msg.informe('sua cidade')),
  state: z.enum(brazilianStates, { message: msg.selecione('a UF') }),
  consent: z.literal(true, { message: msg.consentimento }),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

// Assuntos da página /contato. "parceria" não usa o formulário: a página desvia para o
// cadastro de parceiros. O valor também pode vir na URL (/contato?assunto=cliente).
export const contatoAssuntos = [
  { valor: 'parceria', rotulo: 'Quero ser parceiro' },
  { valor: 'suporte', rotulo: 'Já sou parceiro (suporte)' },
  { valor: 'cliente', rotulo: 'Sou cliente' },
  { valor: 'outros', rotulo: 'Outros assuntos' },
] as const;

export type ContatoAssunto = (typeof contatoAssuntos)[number]['valor'];

export const contactFormSchema = z.object({
  name: nameField,
  email: emailField,
  phone: phoneField,
  subject: z.enum(
    contatoAssuntos.map((a) => a.valor) as [ContatoAssunto, ...ContatoAssunto[]],
    { message: msg.selecione('o assunto') },
  ),
  message: z.string().trim().min(MIN_TEXTO, msg.minimo(MIN_TEXTO)).max(1000, msg.maximo(1000)),
  consent: z.literal(true, { message: msg.consentimento }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Ouvidoria: nome, e-mail, telefone, tipo de manifestação, banco relacionado (opcional)
// e mensagem. Tipos de manifestação: espelham TIPOS em public/api/ouvidoria.php.
export const ouvidoriaTipos = ['Reclamação', 'Solicitação', 'Sugestão', 'Elogio'] as const;

export const ouvidoriaFormSchema = z.object({
  name: nameField,
  email: emailField,
  phone: phoneField,
  tipo: z.enum(ouvidoriaTipos, { message: msg.selecione('o tipo de manifestação') }),
  /** Nome do banco (bancos.json) ou vazio; opcional. */
  banco: z.string().optional(),
  message: z.string().trim().min(MIN_TEXTO, msg.minimo(MIN_TEXTO)).max(2000, msg.maximo(2000)),
});

export type OuvidoriaFormData = z.infer<typeof ouvidoriaFormSchema>;

// Categorias e campos replicados do formulário real "Denuncie!" (Tipo de Fraude):
// Nome, Email, Telefone, Tipo de Fraude, Mensagem, Arquivos.
export const denuncieCategories = [
  'Corrupção',
  'Fraudes internas',
  'Lavagem de dinheiro',
  'Conflito de interesses',
  'Assédio moral e sexual',
  'Discriminação',
  'Conduta/Comportamento',
  'Outros',
] as const;

// Limites dos anexos: espelham public/api/denuncie.php (manter os dois iguais).
export const denunciaAnexos = {
  maxArquivos: 5,
  maxBytesArquivo: 10 * 1024 * 1024,
  maxBytesTotal: 25 * 1024 * 1024,
  extensoes: ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'heic', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'mp3', 'm4a', 'mp4', 'mov'],
} as const;

const categoryField = z.enum(denuncieCategories, { message: msg.selecione('a categoria') });
const descriptionField = z.string().trim().min(MIN_TEXTO, msg.minimo(MIN_TEXTO)).max(3000, msg.maximo(3000));

// Identificação só é exigida quando a denúncia não é anônima. Todas as regras ficam no
// superRefine, que o zod só executa se o objeto-base for válido: assim todos os erros
// aparecem juntos, em vez de os de identificação surgirem só depois dos outros.
export const denuncieFormSchema = z
  .object({
    anonimo: z.boolean(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    category: z.string().optional(),
    description: z.string(),
    files: z.array(z.instanceof(File)),
  })
  .superRefine((data, ctx) => {
    const campos = [
      ['category', categoryField],
      ['description', descriptionField],
      ...(data.anonimo
        ? []
        : ([
            ['name', nameField],
            ['email', emailField],
            ['phone', phoneField],
          ] as const)),
    ] as const;
    for (const [path, field] of campos) {
      const result = field.safeParse(data[path]);
      if (!result.success) ctx.addIssue({ code: 'custom', path: [path], message: result.error.issues[0].message });
    }

    const { files } = data;
    const { maxArquivos, maxBytesArquivo, maxBytesTotal, extensoes } = denunciaAnexos;
    const mb = (bytes: number) => `${bytes / 1024 / 1024} MB`;
    let message = '';
    if (files.length > maxArquivos) message = `Envie no máximo ${maxArquivos} arquivos`;
    else if (files.some((f) => !(extensoes as readonly string[]).includes(f.name.split('.').pop()?.toLowerCase() ?? '')))
      message = 'Tipo de arquivo não aceito. Use PDF, imagem, documento, áudio ou vídeo';
    else if (files.some((f) => f.size > maxBytesArquivo)) message = `Cada arquivo pode ter até ${mb(maxBytesArquivo)}`;
    else if (files.reduce((total, f) => total + f.size, 0) > maxBytesTotal)
      message = `Os arquivos juntos podem ter até ${mb(maxBytesTotal)}`;
    if (message) ctx.addIssue({ code: 'custom', path: ['files'], message });
  });

export type DenuncieFormData = z.infer<typeof denuncieFormSchema>;
