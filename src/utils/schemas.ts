import { z } from 'zod';
import { brazilianStates } from '../types';
import { unmaskDigits } from './masks';

const nameField = z
  .string()
  .trim()
  .min(3, 'Informe seu nome completo')
  .max(100, 'Nome muito longo');

const phoneField = z
  .string()
  .trim()
  .refine((value) => unmaskDigits(value).length >= 10, 'Informe um telefone válido com DDD');

const emailField = z.string().trim().email('Informe um e-mail válido');

export const leadFormSchema = z.object({
  name: nameField,
  phone: phoneField,
  email: emailField,
  city: z.string().trim().min(2, 'Informe sua cidade'),
  state: z.enum(brazilianStates, { message: 'Selecione um estado' }),
  consent: z.literal(true, { message: 'Autorize o contato para continuar' }),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

export const contactFormSchema = z.object({
  name: nameField,
  email: emailField,
  phone: phoneField,
  subject: z.string().trim().min(3, 'Informe o assunto'),
  message: z.string().trim().min(10, 'Sua mensagem precisa ter pelo menos 10 caracteres').max(1000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Campos replicados do popup real "Ouvidoria" (o mesmo que o link "Contato" do rodapé abre):
// Nome, Email, Telefone, Assunto, Mensagem (opcional).
export const ouvidoriaFormSchema = z.object({
  name: nameField,
  email: emailField,
  phone: phoneField,
  subject: z.string().trim().min(3, 'Informe o assunto'),
  message: z.string().trim().max(2000).optional(),
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

const categoryField = z.enum(denuncieCategories, { message: 'Selecione a categoria' });
const descriptionField = z.string().trim().min(20, 'Descreva a denúncia com pelo menos 20 caracteres').max(3000);

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
