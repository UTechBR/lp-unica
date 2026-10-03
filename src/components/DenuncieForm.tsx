import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X } from 'lucide-react';
import { Input } from './Input';
import { Select } from './Select';
import { TextArea } from './TextArea';
import {
  AvisoPrivacidade,
  BotaoEnviar,
  ErroEnvio,
  LinkPrivacidade,
  SucessoEnvio,
  mensagemDeErro,
} from './form/Envio';
import { ajudaCls, campoWrapCls, erroCls, formCls, opcionalCls, rotuloCls } from './form/estilos';
import { MIN_TEXTO, denunciaAnexos, denuncieCategories, denuncieFormSchema } from '../utils/schemas';
import type { DenuncieFormData } from '../utils/schemas';
import { maskPhone } from '../utils/masks';
import { submitDenuncia } from '../services/leadService';

const categoryOptions = denuncieCategories.map((category) => ({ label: category, value: category }));
const accept = denunciaAnexos.extensoes.map((ext) => `.${ext}`).join(',');

export function DenuncieForm() {
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DenuncieFormData>({
    resolver: zodResolver(denuncieFormSchema),
    defaultValues: { anonimo: false, name: '', email: '', phone: '', category: undefined, description: '', files: [] },
  });
  const anonimo = watch('anonimo');
  const files = watch('files');

  const onSubmit = async (data: DenuncieFormData) => {
    setErroEnvio(null);
    const result = await submitDenuncia(data);
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
        titulo="Denúncia registrada"
        destaque={protocolo || undefined}
        acao={{ rotulo: 'Registrar outra denúncia', onClick: () => setProtocolo(null) }}
      >
        {protocolo && <p className="mb-2">Guarde o número do protocolo acima.</p>}
        Sua denúncia foi encaminhada à área de compliance e será tratada com sigilo.
      </SucessoEnvio>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={formCls}>

      <label className="mb-3 flex cursor-pointer items-center gap-2.5 text-[15px] text-secondary">
        <input type="checkbox" className="h-[18px] w-[18px] shrink-0 accent-secondary" {...register('anonimo')} />
        Quero denunciar sem me identificar
      </label>

      {/* Em modo anônimo os campos somem e não são enviados (ver submitDenuncia). */}
      {anonimo ? (
        <p className="mb-3 rounded-control bg-secondary-50 px-4 py-3 text-sm text-secondary-400">
          Sua denúncia será registrada sem nome, contato ou endereço IP. Sem um contato, não conseguiremos pedir mais
          detalhes: descreva os fatos da forma mais completa possível.
        </p>
      ) : (
        <fieldset className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
          <legend className="sr-only">Identificação</legend>
          <div className="sm:col-span-2">
            <Input id="denuncie-nome" label="Nome" placeholder="Maria Silva" autoComplete="name" error={errors.name?.message} {...register('name')} />
          </div>
          <Input
            id="denuncie-email"
            label="E-mail"
            placeholder="nome@exemplo.com"
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
                id="denuncie-telefone"
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
        </fieldset>
      )}

      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <Select
            ref={field.ref}
            id="denuncie-categoria"
            label="Categoria"
            placeholder="Selecione"
            options={categoryOptions}
            error={errors.category?.message}
            value={field.value ?? ''}
            onChange={(event) => field.onChange(event.target.value)}
          />
        )}
      />

      <TextArea
        id="denuncie-mensagem"
        label="Mensagem"
        placeholder="Descreva os fatos com o máximo de detalhes: o que, quando, onde e quem"
        minChars={MIN_TEXTO}
        maxChars={3000}
        error={errors.description?.message}
        {...register('description')}
      />

      <div className={campoWrapCls}>
        <label htmlFor="denuncie-arquivos" className={rotuloCls}>
          Arquivos <span className={opcionalCls}>(opcional)</span>
        </label>
        <label
          htmlFor="denuncie-arquivos"
          className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-control border border-dashed border-surface-borderMuted px-3.5 py-3 text-sm text-secondary-400 hover:border-secondary-300"
        >
          <Upload size={16} className="shrink-0" aria-hidden="true" />
          Anexar documentos, fotos, áudios ou vídeos
        </label>
        <input
          id="denuncie-arquivos"
          type="file"
          multiple
          accept={accept}
          className="sr-only"
          aria-invalid={errors.files ? true : undefined}
          aria-describedby="denuncie-arquivos-ajuda denuncie-arquivos-error"
          onChange={(event) => {
            const novos = Array.from(event.target.files ?? []);
            setValue('files', [...files, ...novos], { shouldValidate: true });
            event.target.value = ''; // permite escolher o mesmo arquivo de novo depois de remover
          }}
        />
        <p id="denuncie-arquivos-ajuda" className={ajudaCls}>
          Até {denunciaAnexos.maxArquivos} arquivos, {denunciaAnexos.maxBytesArquivo / 1024 / 1024} MB cada.
        </p>
        {files.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-2 rounded-control bg-secondary-50 px-3 py-2 text-sm text-secondary"
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      'files',
                      files.filter((_, i) => i !== index),
                      { shouldValidate: true },
                    )
                  }
                  aria-label={`Remover ${file.name}`}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-secondary-400 hover:bg-secondary-100 hover:text-secondary"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <span id="denuncie-arquivos-error" className={erroCls} aria-live="polite">
          {errors.files?.message}
        </span>
      </div>

      <AvisoPrivacidade>
        Os dados informados são usados apenas para apurar a denúncia, conforme a <LinkPrivacidade />.
      </AvisoPrivacidade>

      <BotaoEnviar enviando={isSubmitting}>Enviar denúncia</BotaoEnviar>
      <ErroEnvio mensagem={erroEnvio} />
    </form>
  );
}
