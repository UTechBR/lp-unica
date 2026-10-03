import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './Input';
import { TextArea } from './TextArea';
import {
  AvisoObrigatorios,
  AvisoPrivacidade,
  BotaoEnviar,
  ErroEnvio,
  LinkPrivacidade,
  SucessoEnvio,
  mensagemDeErro,
} from './form/Envio';
import { formCls } from './form/estilos';
import { ouvidoriaFormSchema } from '../utils/schemas';
import type { OuvidoriaFormData } from '../utils/schemas';
import { maskPhone } from '../utils/masks';
import { submitOuvidoria } from '../services/leadService';

export function OuvidoriaForm() {
  const [enviado, setEnviado] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OuvidoriaFormData>({
    resolver: zodResolver(ouvidoriaFormSchema),
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
  });

  const onSubmit = async (data: OuvidoriaFormData) => {
    setErroEnvio(null);
    const result = await submitOuvidoria(data);
    if (result.success) {
      setEnviado(true);
      reset();
    } else {
      setErroEnvio(mensagemDeErro(result.error));
    }
  };

  if (enviado) {
    return (
      <SucessoEnvio titulo="Manifestação registrada" acao={{ rotulo: 'Registrar nova manifestação', onClick: () => setEnviado(false) }}>
        Sua manifestação foi recebida pela Ouvidoria e será respondida em até 10 dias úteis.
      </SucessoEnvio>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={formCls}>
      <AvisoObrigatorios />
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
        <Input id="ouvidoria-nome" label="Nome" autoComplete="name" error={errors.name?.message} {...register('name')} />
        <Input
          id="ouvidoria-email"
          label="E-mail"
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
              ref={field.ref}
              id="ouvidoria-telefone"
              label="Telefone"
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
        <Input id="ouvidoria-assunto" label="Assunto" error={errors.subject?.message} {...register('subject')} />
      </div>
      <TextArea id="ouvidoria-mensagem" label="Mensagem" optional error={errors.message?.message} {...register('message')} />

      <AvisoPrivacidade>
        Os dados informados são usados para analisar e responder à sua manifestação, conforme a <LinkPrivacidade />.
      </AvisoPrivacidade>

      <BotaoEnviar enviando={isSubmitting}>Enviar manifestação</BotaoEnviar>
      <ErroEnvio mensagem={erroEnvio} />
    </form>
  );
}
