import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import { leadFormSchema } from '../utils/schemas';
import type { LeadFormData } from '../utils/schemas';
import { maskPhone } from '../utils/masks';
import { submitLead } from '../services/leadService';
import { cn } from '../utils/cn';
import { Modal } from './Modal';
import { Button } from './Button';

const logoCompleta = '/images/Logo-unica-completa.svg';

const stateOptions: { label: string; value: string }[] = [
  ['Acre', 'AC'],
  ['Alagoas', 'AL'],
  ['Amapá', 'AP'],
  ['Amazonas', 'AM'],
  ['Bahia', 'BA'],
  ['Ceará', 'CE'],
  ['Espírito Santo', 'ES'],
  ['Goiás', 'GO'],
  ['Maranhão', 'MA'],
  ['Mato Grosso', 'MT'],
  ['Mato Grosso do Sul', 'MS'],
  ['Minas Gerais', 'MG'],
  ['Pará', 'PA'],
  ['Paraíba', 'PB'],
  ['Paraná', 'PR'],
  ['Pernambuco', 'PE'],
  ['Piauí', 'PI'],
  ['Rio de Janeiro', 'RJ'],
  ['Rio Grande do Norte', 'RN'],
  ['Rio Grande do Sul', 'RS'],
  ['Rondônia', 'RO'],
  ['Roraima', 'RR'],
  ['Santa Catarina', 'SC'],
  ['São Paulo', 'SP'],
  ['Sergipe', 'SE'],
  ['Tocantins', 'TO'],
  ['Distrito Federal', 'DF'],
].map(([label, value]) => ({ label, value }));

const fieldWrap = 'flex min-w-0 flex-col gap-1.5';
const labelCls = 'text-sm font-medium text-secondary-700';
const controlCls =
  'h-12 w-full rounded-control border border-surface-borderMuted bg-white px-3.5 text-base text-secondary placeholder:text-secondary-300 focus-visible:border-secondary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-200';
const errorCls = 'min-h-4 text-xs leading-tight text-primary-600';

export function LeadForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { name: '', phone: '', email: '', city: '', state: undefined, consent: false },
  });

  const onSubmit = async (data: LeadFormData) => {
    const result = await submitLead(data);
    if (result.success) {
      setIsSuccess(true);
      reset();
    }
  };

  return (
    <>
      <Modal isOpen={isSuccess} onClose={() => setIsSuccess(false)}>
        <div className="flex flex-col items-center gap-4 pt-2 text-center">
          <div className="rounded-control bg-secondary px-5 py-3">
            <img src={logoCompleta} alt="Única Promotora" className="h-8 w-auto md:h-9" />
          </div>

          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
            <CheckCircle2 size={36} className="text-primary" strokeWidth={2} />
          </span>

          <div className="flex flex-col gap-1.5">
            <h3 className="heading-md text-secondary">Recebemos seu contato!</h3>
            <p className="max-w-sm text-sm text-secondary-400">
              Nossa equipe entrará em contato em breve para apresentar a melhor solução para você.
            </p>
          </div>

          <Button type="button" onClick={() => setIsSuccess(false)} className="mt-2">
            Fechar
          </Button>
        </div>
      </Modal>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex w-full max-w-full flex-col gap-2"
      >
        <div className={fieldWrap}>
          <label htmlFor="lead-nome" className={labelCls}>
            Nome
          </label>
          <input id="lead-nome" autoComplete="name" required className={controlCls} {...register('name')} />
          <span className={errorCls} aria-live="polite">
            {errors.name?.message}
          </span>
        </div>

        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <div className={fieldWrap}>
              <label htmlFor="lead-whatsapp" className={labelCls}>
                WhatsApp
              </label>
              <input
                id="lead-whatsapp"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className={controlCls}
                placeholder="(31) 99999-9999"
                required
                value={field.value}
                onChange={(event) => field.onChange(maskPhone(event.target.value))}
              />
              <span className={errorCls} aria-live="polite">
                {errors.phone?.message}
              </span>
            </div>
          )}
        />

        <div className={fieldWrap}>
          <label htmlFor="lead-email" className={labelCls}>
            Email
          </label>
          <input
            id="lead-email"
            type="email"
            autoComplete="email"
            required
            className={controlCls}
            {...register('email')}
          />
          <span className={errorCls} aria-live="polite">
            {errors.email?.message}
          </span>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_96px] gap-3">
          <div className={fieldWrap}>
            <label htmlFor="lead-cidade" className={labelCls}>
              Cidade
            </label>
            <input id="lead-cidade" autoComplete="address-level2" required className={controlCls} {...register('city')} />
            <span className={errorCls} aria-live="polite">{errors.city?.message}</span>
          </div>
          <Controller
            control={control}
            name="state"
            render={({ field }) => (
              <div className={fieldWrap}>
                <label htmlFor="lead-estado" className={labelCls}>UF</label>
                <select
                  id="lead-estado"
                  autoComplete="address-level1"
                  required
                  className={cn(controlCls, 'appearance-none [&>option]:text-secondary')}
                  value={field.value ?? ''}
                  onChange={(event) => field.onChange(event.target.value)}
                >
                  <option value="" disabled>UF</option>
                  {stateOptions.map((option) => <option key={option.value} value={option.value}>{option.value}</option>)}
                </select>
                <span className={errorCls} aria-live="polite">{errors.state?.message}</span>
              </div>
            )}
          />
        </div>

        <label className="flex items-start gap-2 text-xs leading-relaxed text-secondary-400">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby="lead-consent-erro"
            {...register('consent')}
          />
          <span>Autorizo a Única Promotora a entrar em contato sobre oportunidades de parceria.</span>
        </label>
        <span id="lead-consent-erro" className={errorCls} aria-live="polite">{errors.consent?.message}</span>

        {/* Sempre habilitado: sem consentimento, o envio mostra o erro acima (ver schemas.ts). */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-control bg-primary font-heading text-base font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400 disabled:opacity-60"
        >
          {isSubmitting ? 'Enviando...' : 'Quero ser parceiro'}
        </button>
      </form>
    </>
  );
}
