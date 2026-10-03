import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';
import { nomesIcones } from './lib/icones';

// Biblioteca de conteúdo do site. Cada coleção é um arquivo em src/content/<nome>.json
// (uma lista; a ordem do arquivo é a ordem de exibição). O build falha se um item não
// seguir o esquema: campo obrigatório faltando, ícone fora de src/lib/icones.ts ou
// imagem inexistente. Guia completo em src/content/README.md.

/** Slug do item: minúsculas, números e hífens. Também nomeia os arquivos ligados a ele. */
const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'use minúsculas, números e hífens (ex.: banco-bmg)');
const icone = z.enum(nomesIcones);

const bancos = defineCollection({
  loader: file('src/content/bancos.json'),
  schema: ({ image }) =>
    z.object({
      id,
      nome: z.string(),
      /** Silhueta branca (PNG/SVG transparente) em src/assets/bancos/<id>.<ext>. */
      logo: image(),
      /** Altura máxima do logo na grade do hero, em px (padrão 30), para equilibrar o peso visual. */
      logoAltura: z.number().int().positive().optional(),
      descricao: z.string().optional(),
      site: z.string().url().optional(),
      canais: z.array(z.object({ rotulo: z.string(), valor: z.string() })).optional(),
      ouvidoria: z.string().optional(),
      horario: z.string().optional(),
    }),
});

const categoriasProduto = defineCollection({
  loader: file('src/content/categorias-produto.json'),
  schema: z.object({
    id,
    titulo: z.string(),
    icone,
    /** Produto principal: coluna em altura dupla na Home, itens em chips. */
    destaque: z.boolean().optional(),
    descricao: z.string().optional(),
    itens: z.array(z.string()).min(1),
  }),
});

const produtos = defineCollection({
  loader: file('src/content/produtos.json'),
  schema: z.object({
    id,
    titulo: z.string(),
    resumo: z.string(),
    descricao: z.string(),
    icone,
    cor: z.enum(['primary', 'accent', 'secondary']),
    destaques: z.array(z.string()),
  }),
});

const ecossistema = defineCollection({
  loader: file('src/content/ecossistema.json'),
  schema: z.object({
    id,
    /** Etapa da operação do parceiro que a ferramenta cobre. */
    etapa: z.string(),
    nome: z.string(),
    descricao: z.string(),
    icone,
  }),
});

const valores = defineCollection({
  loader: file('src/content/valores.json'),
  schema: z.object({
    id,
    nome: z.string(),
    /** Versão curta, usada na Home. */
    resumo: z.string(),
    /** Texto oficial completo, usado na página /sobre. */
    descricao: z.string(),
    icone,
  }),
});

const shorts = defineCollection({
  loader: file('src/content/shorts.json'),
  schema: ({ image }) =>
    z.object({
      /** Também nomeia o vídeo: public/videos/<id>.mp4 (e, opcional, .webm). */
      id,
      titulo: z.string(),
      capa: image(),
    }),
});

export const collections = {
  bancos,
  'categorias-produto': categoriasProduto,
  produtos,
  ecossistema,
  valores,
  shorts,
};
