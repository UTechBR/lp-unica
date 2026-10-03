import type { CollectionEntry } from 'astro:content';

// Tipos dos itens da biblioteca de conteúdo, gerados a partir dos esquemas em
// src/content.config.ts. Use estes em componentes que recebem conteúdo por props.
export type Banco = CollectionEntry<'bancos'>['data'];
export type CategoriaProduto = CollectionEntry<'categorias-produto'>['data'];
export type Produto = CollectionEntry<'produtos'>['data'];
export type FerramentaEcossistema = CollectionEntry<'ecossistema'>['data'];
export type Valor = CollectionEntry<'valores'>['data'];
export type Short = CollectionEntry<'shorts'>['data'];
