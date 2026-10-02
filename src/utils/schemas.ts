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

export const denuncieFormSchema = z.object({
  name: nameField,
  email: emailField,
  phone: phoneField,
  category: z.enum(denuncieCategories, { message: 'Selecione o tipo de fraude' }),
  description: z.string().trim().min(20, 'Descreva a denúncia com pelo menos 20 caracteres').max(3000),
});

export type DenuncieFormData = z.infer<typeof denuncieFormSchema>;
