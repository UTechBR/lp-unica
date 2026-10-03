import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './Input';
import { Select } from './Select';
import { TextArea } from './TextArea';
import { AvisoPrivacidade, BotaoEnviar, ErroEnvio, LinkPrivacidade, SucessoEnvio, mensagemDeErro } from './form/Envio';
import { formCls } from './form/estilos';
import { ouvidoriaFormSchema, ouvidoriaTipos } from '../utils/schemas';
import type { OuvidoriaFormData } from '../utils/schemas';
import { maskPhone } from '../utils/masks';
import { submitOuvidoria } from '../services/leadService';

const tipoOptions = ouvidoriaTipos.map((tipo) => ({ label: tipo, value: tipo }));
const NAO_SE_APLICA = 'Não se aplica';

/** `bancos`: nomes vindos de src/content/bancos.json (passados pela página). */
export function OuvidoriaForm({ bancos }: { bancos: string[] }) {
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const bancoOptions = [...bancos, NAO_SE_APLICA].map((nome) => ({ label: nome, value: nome }));

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OuvidoriaFormData>({
    resolver: zodResolver(ouvidoriaFormSchema),
    defaultValues: { name: '', email: '', phone: '', tipo: undefined, banco: '', message: '' },
  });

  const onSubmit = async (data: OuvidoriaFormData) => {
    setErroEnvio(null);
    const result = await submitOuvidoria({ ...data, banco: data.banco === NAO_SE_APLICA ? '' : data.banco });
    if (result.success) {
      setProtocolo(result.protocolo ?? '');
      reset();
    } else {
      setErroEnvio(mensagemDeErro(result.error));
    }
  };

  if (protocolo !== null) {
    return (
      <SucessoEnvio
        titulo="Manifestação registrada"
        destaque={protocolo || undefined}
        acao={{ rotulo: 'Registrar nova manifestação', onClick: () => setProtocolo(null) }}
      >
        {protocolo && <p className="mb-2">Guarde o número do protocolo acima.</p>}
        {/* TODO(compliance): confirmar o prazo de resposta (mesmo texto do passo 3 em ouvidoria.astro). */}
        Sua manifestação foi recebida pela Ouvidoria e será respondida em até 10 dias úteis.
      </SucessoEnvio>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={formCls}>
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input id="ouvidoria-nome" label="Nome" autoComplete="name" error={errors.name?.message} {...register('name')} />
        </div>
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
      </div>

      <Controller
        control={control}
        name="tipo"
        render={({ field }) => (
          <Select
            ref={field.ref}
            id="ouvidoria-tipo"
            label="Tipo de manifestação"
            placeholder="Selecione"
            options={tipoOptions}
            error={errors.tipo?.message}
            value={field.value ?? ''}
            onChange={(event) => field.onChange(event.target.value)}
          />
        )}
      />

      <Controller
        control={control}
        name="banco"
        render={({ field }) => (
          <Select
            ref={field.ref}
            id="ouvidoria-banco"
            label="Banco relacionado"
            optional
            placeholder="Selecione, se houver"
            options={bancoOptions}
            error={errors.banco?.message}
            value={field.value ?? ''}
            onChange={(event) => field.onChange(event.target.value)}
          />
        )}
      />

      <TextArea
        id="ouvidoria-mensagem"
        label="Mensagem"
        rows={5}
        placeholder="Conte o que aconteceu, com datas e números de protocolos anteriores, se tiver"
        error={errors.message?.message}
        {...register('message')}
      />

      <AvisoPrivacidade>
        Os dados informados são usados para analisar e responder à sua manifestação, conforme a <LinkPrivacidade />.
      </AvisoPrivacidade>

      <BotaoEnviar enviando={isSubmitting}>Enviar manifestação</BotaoEnviar>
      <ErroEnvio mensagem={erroEnvio} />
    </form>
  );
}
