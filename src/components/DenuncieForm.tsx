import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Upload, X } from 'lucide-react';
import { Input } from './Input';
import { Select } from './Select';
import { TextArea } from './TextArea';
import { denunciaAnexos, denuncieCategories, denuncieFormSchema } from '../utils/schemas';
import type { DenuncieFormData } from '../utils/schemas';
import { maskPhone } from '../utils/masks';
import { submitDenuncia } from '../services/leadService';

const categoryOptions = denuncieCategories.map((category) => ({ label: category, value: category }));

const mensagensErro: Record<string, string> = {
  file_too_large: 'Os anexos passaram do tamanho permitido. Reduza ou remova algum arquivo e tente de novo.',
  too_many_files: `Envie no máximo ${denunciaAnexos.maxArquivos} arquivos.`,
  file_type_not_allowed: 'Um dos anexos tem um tipo de arquivo não aceito.',
  network: 'Não foi possível conectar. Verifique sua internet e tente de novo.',
};
const erroPadrao = 'Não foi possível registrar a denúncia agora. Tente de novo em alguns minutos.';

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
      setProtocolo(result.protocolo);
      reset();
    } else {
      setErroEnvio(mensagensErro[result.error] ?? erroPadrao);
    }
  };

  if (protocolo) {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 size={44} className="text-primary" aria-hidden="true" />
        <h3 className="font-heading text-xl font-semibold text-secondary">Denúncia registrada</h3>
        <p className="text-sm text-secondary-400">Guarde o número do protocolo:</p>
        <p className="rounded-control bg-secondary-50 px-4 py-2 font-heading text-lg font-bold tracking-wide text-secondary">
          {protocolo}
        </p>
        <p className="max-w-sm text-sm text-secondary-400">
          Sua denúncia foi encaminhada à área de compliance e será tratada com sigilo.
        </p>
        <button
          type="button"
          onClick={() => setProtocolo(null)}
          className="mt-2 text-sm font-semibold text-secondary underline underline-offset-4 hover:text-primary"
        >
          Registrar outra denúncia
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <label className="flex cursor-pointer items-center gap-2.5 text-[15px] text-secondary">
        <input type="checkbox" className="h-[18px] w-[18px] shrink-0 accent-secondary" {...register('anonimo')} />
        Quero denunciar sem me identificar
      </label>

      {/* Em modo anônimo os campos somem e não são enviados (ver submitDenuncia). */}
      {anonimo ? (
        <p className="rounded-control bg-secondary-50 px-4 py-3 text-sm text-secondary-400">
          Sua denúncia será registrada sem nome, contato ou endereço IP. Sem um contato, não conseguiremos pedir mais
          detalhes: descreva os fatos da forma mais completa possível.
        </p>
      ) : (
        <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <legend className="sr-only">Identificação</legend>
          <div className="sm:col-span-2">
            <Input id="denuncie-nome" label="Nome" required autoComplete="name" error={errors.name?.message} {...register('name')} />
          </div>
          <Input
            id="denuncie-email"
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
                id="denuncie-telefone"
                label="Telefone"
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
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
            id="denuncie-categoria"
            label="Categoria"
            required
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
        required
        rows={5}
        placeholder="Descreva a denúncia com o máximo de detalhes"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="denuncie-arquivos" className="text-sm font-semibold text-secondary">
          Arquivos <span className="font-normal text-secondary-300">(opcional)</span>
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
          aria-describedby="denuncie-arquivos-ajuda"
          onChange={(event) => {
            const novos = Array.from(event.target.files ?? []);
            setValue('files', [...files, ...novos], { shouldValidate: true });
            event.target.value = ''; // permite escolher o mesmo arquivo de novo depois de remover
          }}
        />
        <p id="denuncie-arquivos-ajuda" className="text-xs text-secondary-400">
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
        {errors.files?.message && (
          <p className="text-xs font-medium text-primary" role="alert">
            {errors.files.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-control bg-brand font-heading text-base font-bold text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar denúncia'}
      </button>

      <p role="status" aria-live="polite" className="text-sm font-medium text-primary empty:hidden">
        {erroEnvio}
      </p>
    </form>
  );
}
