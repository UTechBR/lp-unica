import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { CheckCircle2, Send } from 'lucide-react';
import { Input } from './Input';
import { TextArea } from './TextArea';
import { Button } from './Button';
import { ouvidoriaFormSchema } from '../utils/schemas';
import type { OuvidoriaFormData } from '../utils/schemas';
import { maskPhone } from '../utils/masks';
import { submitOuvidoria } from '../services/leadService';

export function OuvidoriaForm() {
  const [isSuccess, setIsSuccess] = useState(false);

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
    const result = await submitOuvidoria(data);
    if (result.success) {
      setIsSuccess(true);
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
        <h3 className="heading-md">Manifestação registrada!</h3>
        <p className="text-secondary-400">
          Sua manifestação foi recebida pela Ouvidoria e será respondida em até 10 dias úteis.
        </p>
        <Button variant="outline" onClick={() => setIsSuccess(false)}>
          Nova manifestação
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Nome" required placeholder="Nome" error={errors.name?.message} {...register('name')} />
        <Input
          label="E-mail"
          required
          type="email"
          placeholder="Email"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        <Input label="Assunto" required placeholder="Assunto" error={errors.subject?.message} {...register('subject')} />
      </div>
      <TextArea label="Mensagem" hint="Opcional" error={errors.message?.message} {...register('message')} />
      <Button type="submit" isLoading={isSubmitting} rightIcon={<Send size={18} aria-hidden="true" />} className="self-start">
        Enviar
      </Button>
    </form>
  );
}
