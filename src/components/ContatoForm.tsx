import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { CheckCircle2, Send } from 'lucide-react';
import { Input } from './Input';
import { TextArea } from './TextArea';
import { Button } from './Button';
import { contactFormSchema } from '../utils/schemas';
import type { ContactFormData } from '../utils/schemas';
import { maskPhone } from '../utils/masks';
import { submitContact } from '../services/leadService';

export function ContatoForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
  });

  const onSubmit = async (data: ContactFormData) => {
    const result = await submitContact(data);
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
        <h3 className="heading-md">Mensagem enviada!</h3>
        <p className="text-secondary-400">Obrigado por entrar em contato. Responderemos o mais breve possível.</p>
        <Button variant="outline" onClick={() => setIsSuccess(false)}>
          Enviar outra mensagem
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Nome completo" required error={errors.name?.message} {...register('name')} />
        <Input label="E-mail" required type="email" error={errors.email?.message} {...register('email')} />
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
              placeholder="(00) 00000-0000"
              error={errors.phone?.message}
              value={field.value}
              onChange={(event) => field.onChange(maskPhone(event.target.value))}
            />
          )}
        />
        <Input label="Assunto" required error={errors.subject?.message} {...register('subject')} />
      </div>
      <TextArea label="Mensagem" required error={errors.message?.message} {...register('message')} />
      <Button type="submit" isLoading={isSubmitting} rightIcon={<Send size={18} aria-hidden="true" />} className="self-start">
        Enviar mensagem
      </Button>
    </form>
  );
}
