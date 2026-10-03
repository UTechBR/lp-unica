import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { CheckCircle2, Send, ShieldAlert, Upload } from 'lucide-react';
import { Input } from './Input';
import { Select } from './Select';
import { TextArea } from './TextArea';
import { Button } from './Button';
import { denuncieCategories, denuncieFormSchema } from '../utils/schemas';
import type { DenuncieFormData } from '../utils/schemas';
import { maskPhone } from '../utils/masks';
import { submitDenuncia } from '../services/leadService';

const categoryOptions = denuncieCategories.map((category) => ({ label: category, value: category }));

export function DenuncieForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DenuncieFormData>({
    resolver: zodResolver(denuncieFormSchema),
    defaultValues: { name: '', email: '', phone: '', category: undefined, description: '' },
  });

  const onSubmit = async (data: DenuncieFormData) => {
    const result = await submitDenuncia(data);
    if (result.success) {
      setIsSuccess(true);
      setFileName(null);
      reset();
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 rounded-surface bg-white p-8 text-center shadow-card"
      >
        <CheckCircle2 size={48} className="text-primary" />
        <h3 className="heading-md">Denúncia registrada com sigilo</h3>
        <p className="text-secondary-400">
          Sua denúncia foi encaminhada ao Comitê de Compliance e será apurada com total confidencialidade.
        </p>
        <Button variant="outline" onClick={() => setIsSuccess(false)}>
          Registrar nova denúncia
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="flex items-start gap-3 rounded-surface bg-primary/5 p-4 text-sm text-secondary-400">
        <ShieldAlert size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
        Se você testemunhou ou foi vítima de algum tipo de fraude, não deixe de denunciar. Faça uma descrição
        detalhada dos fatos e, se possível, envie documentos, fotos e outras evidências.
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input label="Nome" required placeholder="Nome" error={errors.name?.message} {...register('name')} />
        <Input
          label="E-mail"
          required
          type="email"
          placeholder="Email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <Input
              label="Telefone"
              required
              inputMode="tel"
              placeholder="Telefone"
              error={errors.phone?.message}
              value={field.value}
              onChange={(event) => field.onChange(maskPhone(event.target.value))}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <Select
            label="Tipo de Fraude"
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
        label="Mensagem"
        required
        rows={4}
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
          className="flex cursor-pointer items-center gap-2 rounded-control border border-dashed border-surface-borderMuted px-4 py-3 text-sm text-secondary-400 hover:border-primary hover:text-primary"
        >
          <Upload size={16} aria-hidden="true" />
          {fileName ?? 'Anexar documentos, fotos ou outras evidências'}
        </label>
        <input
          id="denuncie-arquivos"
          type="file"
          multiple
          className="sr-only"
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
        />
      </div>

      <Button type="submit" isLoading={isSubmitting} rightIcon={<Send size={18} aria-hidden="true" />} className="self-start">
        Enviar
      </Button>
    </form>
  );
}
