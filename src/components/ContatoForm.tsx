import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import { Input } from './Input';
import { Select } from './Select';
import { TextArea } from './TextArea';
import { contactFormSchema, contatoAssuntos } from '../utils/schemas';
import type { ContactFormData, ContatoAssunto } from '../utils/schemas';
import { maskPhone } from '../utils/masks';
import { submitContact } from '../services/leadService';
import { LEAD_FORM_HREF } from '../config/navegacao';

const assuntoOptions = contatoAssuntos.map((a) => ({ label: a.rotulo, value: a.valor }));
const ehAssunto = (valor: string | null): valor is ContatoAssunto => contatoAssuntos.some((a) => a.valor === valor);

const avisoCls = 'rounded-control bg-surface-muted p-3.5 text-sm text-secondary';
const linkAvisoCls = 'font-semibold underline underline-offset-4 hover:text-primary';

export function ContatoForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', phone: '', subject: undefined, message: '' },
  });
  const assunto = watch('subject');

  // Assunto pré-selecionado pela URL (ex.: /contato?assunto=cliente).
  useEffect(() => {
    const doLink = new URLSearchParams(window.location.search).get('assunto');
    if (ehAssunto(doLink)) setValue('subject', doLink);
  }, [setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setErroEnvio(false);
    const result = await submitContact(data);
    if (result.success) {
      setIsSuccess(true);
      reset();
    } else {
      setErroEnvio(true);
    }
  };

  if (isSuccess) {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 size={44} className="text-primary" aria-hidden="true" />
        <h3 className="font-heading text-xl font-semibold text-secondary">Mensagem enviada</h3>
        <p className="text-sm text-secondary-400">Obrigado pelo contato. Nosso time vai responder pelo e-mail ou telefone informado.</p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="mt-2 text-sm font-semibold text-secondary underline underline-offset-4 hover:text-primary"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Controller
        control={control}
        name="subject"
        render={({ field }) => (
          <Select
            id="contato-assunto"
            label="Assunto"
            required
            placeholder="Selecione"
            options={assuntoOptions}
            error={errors.subject?.message}
            value={field.value ?? ''}
            onChange={(event) => field.onChange(event.target.value)}
          />
        )}
      />

      {assunto === 'parceria' ? (
        // Cadastro de parceiros tem formulário próprio: aqui só o desvio.
        <p className={avisoCls}>
          O cadastro de parceiros tem um formulário próprio.{' '}
          <a href={LEAD_FORM_HREF} className={linkAvisoCls}>
            Ir para o cadastro →
          </a>
        </p>
      ) : (
        <>
          {assunto === 'cliente' && (
            <p className={avisoCls}>
              Para dúvidas sobre um contrato, fale direto com o banco responsável.{' '}
              <a href="/bancos-parceiros" className={linkAvisoCls}>
                Ver canais dos bancos →
              </a>
            </p>
          )}

          <Input id="contato-nome" label="Nome completo" required autoComplete="name" error={errors.name?.message} {...register('name')} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="contato-email"
              label="E-mail"
              required
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <Input
                  id="contato-telefone"
                  label="Telefone"
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(31) 99999-9999"
                  error={errors.phone?.message}
                  value={field.value}
                  onChange={(event) => field.onChange(maskPhone(event.target.value))}
                />
              )}
            />
          </div>
          <TextArea id="contato-mensagem" label="Mensagem" required rows={5} error={errors.message?.message} {...register('message')} />

          <label className="flex items-start gap-2.5 text-sm text-secondary-400">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby="contato-consent-erro"
              {...register('consent')}
            />
            Autorizo a Única Promotora a usar estes dados para responder ao meu contato.
          </label>
          <span id="contato-consent-erro" className="-mt-2 text-xs font-medium text-primary empty:hidden" aria-live="polite">
            {errors.consent?.message}
          </span>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-control bg-brand font-heading text-base font-bold text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
          </button>
          <p role="status" aria-live="polite" className="text-sm font-medium text-primary empty:hidden">
            {erroEnvio && 'Não foi possível enviar agora. Tente de novo em alguns minutos ou ligue para nós.'}
          </p>
        </>
      )}
    </form>
  );
}
