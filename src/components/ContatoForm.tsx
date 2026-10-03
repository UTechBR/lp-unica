import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './Input';
import { Select } from './Select';
import { TextArea } from './TextArea';
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
import { MIN_TEXTO, contactFormSchema, contatoAssuntos } from '../utils/schemas';
import type { ContactFormData, ContatoAssunto } from '../utils/schemas';
import { maskPhone } from '../utils/masks';
import { submitContact } from '../services/leadService';
import { LEAD_FORM_HREF } from '../config/navegacao';

const assuntoOptions = contatoAssuntos.map((a) => ({ label: a.rotulo, value: a.valor }));
const ehAssunto = (valor: string | null): valor is ContatoAssunto => contatoAssuntos.some((a) => a.valor === valor);

const avisoCls = 'mb-3 rounded-control bg-surface-muted p-3.5 text-sm text-secondary';
const linkAvisoCls = 'font-semibold underline underline-offset-4 hover:text-primary';

export function ContatoForm() {
  const [enviado, setEnviado] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

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
    defaultValues: { name: '', email: '', phone: '', subject: undefined, message: '', consent: undefined },
  });
  const assunto = watch('subject');

  // Assunto pré-selecionado pela URL (ex.: /contato?assunto=cliente).
  useEffect(() => {
    const doLink = new URLSearchParams(window.location.search).get('assunto');
    if (ehAssunto(doLink)) setValue('subject', doLink);
  }, [setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setErroEnvio(null);
    const result = await submitContact(data);
    if (result.success) {
      setEnviado(true);
      reset();
    } else {
      setErroEnvio(mensagemDeErro(result.error));
    }
  };

  if (enviado) {
    return (
      <SucessoEnvio titulo="Mensagem enviada" acao={{ rotulo: 'Enviar outra mensagem', onClick: () => setEnviado(false) }}>
        Obrigado pelo contato. Nosso time vai responder pelo e-mail ou telefone informado.
      </SucessoEnvio>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={formCls}>
      <CampoIsca {...register('website')} />
      <Controller
        control={control}
        name="subject"
        render={({ field }) => (
          <Select
            ref={field.ref}
            id="contato-assunto"
            label="Assunto"
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

          <Input id="contato-nome" label="Nome completo" placeholder="Maria Silva" autoComplete="name" error={errors.name?.message} {...register('name')} />
          <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
            <Input
              id="contato-email"
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
                  id="contato-telefone"
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
          <TextArea
            id="contato-mensagem"
            label="Mensagem"
            placeholder="Conte como podemos ajudar"
            minChars={MIN_TEXTO}
            maxChars={1000}
            error={errors.message?.message}
            {...register('message')}
          />

          <Consentimento id="contato-consent" error={errors.consent?.message} {...register('consent')}>
            Autorizo a Única Promotora a usar estes dados para responder ao meu contato, conforme a <LinkPrivacidade />.
          </Consentimento>

          <BotaoEnviar enviando={isSubmitting}>Enviar mensagem</BotaoEnviar>
          <ErroEnvio mensagem={erroEnvio} />
        </>
      )}
    </form>
  );
}
