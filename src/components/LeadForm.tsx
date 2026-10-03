import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadFormSchema } from '../utils/schemas';
import type { LeadFormData } from '../utils/schemas';
import { brazilianStates } from '../types';
import { maskPhone } from '../utils/masks';
import { submitLead } from '../services/leadService';
import { Input } from './Input';
import { Select } from './Select';
import {
  CampoIsca,
  BotaoEnviar,
  Consentimento,
  ErroEnvio,
  LinkPrivacidade,
  SucessoEnvio,
  mensagemDeErro,
} from './form/Envio';
import { formCls } from './form/estilos';

const ufOptions = brazilianStates.map((uf) => ({ label: uf, value: uf }));

export function LeadForm() {
  const [enviado, setEnviado] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { name: '', phone: '', email: '', city: '', state: undefined, consent: undefined },
  });

  const onSubmit = async (data: LeadFormData) => {
    setErroEnvio(null);
    const result = await submitLead(data);
    if (result.success) {
      setEnviado(true);
      reset();
    } else {
      setErroEnvio(mensagemDeErro(result.error));
    }
  };

  if (enviado) {
    return (
      <SucessoEnvio titulo="Recebemos seu cadastro" acao={{ rotulo: 'Enviar outro cadastro', onClick: () => setEnviado(false) }}>
        Nosso time vai falar com você pelo WhatsApp para apresentar a parceria.
      </SucessoEnvio>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={formCls}>
      <CampoIsca {...register('website')} />
      <Input id="lead-nome" label="Nome" placeholder="Maria Silva" autoComplete="name" error={errors.name?.message} {...register('name')} />

      <Controller
        control={control}
        name="phone"
        render={({ field }) => (
          <Input
            ref={field.ref}
            name={field.name}
            id="lead-whatsapp"
            label="WhatsApp"
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

      <Input id="lead-email" label="E-mail" placeholder="nome@exemplo.com" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />

      <div className="grid grid-cols-[minmax(0,1fr)_96px] gap-3">
        <Input id="lead-cidade" label="Cidade" placeholder="Belo Horizonte" autoComplete="address-level2" error={errors.city?.message} {...register('city')} />
        <Controller
          control={control}
          name="state"
          render={({ field }) => (
            <Select
              ref={field.ref}
              name={field.name}
              id="lead-estado"
              label="UF"
              placeholder="UF"
              autoComplete="address-level1"
              options={ufOptions}
              error={errors.state?.message}
              value={field.value ?? ''}
              onChange={(event) => field.onChange(event.target.value)}
            />
          )}
        />
      </div>

      <Consentimento id="lead-consent" error={errors.consent?.message} {...register('consent')}>
        Autorizo a Única Promotora a entrar em contato sobre oportunidades de parceria, conforme a <LinkPrivacidade />.
      </Consentimento>

      {/* Sempre habilitado: sem consentimento, o envio mostra o erro acima (ver schemas.ts). */}
      <BotaoEnviar enviando={isSubmitting}>Quero ser parceiro</BotaoEnviar>
      <ErroEnvio mensagem={erroEnvio} />
    </form>
  );
}
