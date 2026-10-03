import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';

/**
 * Itens de uma coleção da biblioteca de conteúdo, na ordem do arquivo JSON.
 * Use em páginas e componentes .astro; para ilhas React, passe o resultado por props
 * depois de `paraIlha` quando houver imagens.
 */
export async function listar<C extends CollectionKey>(colecao: C): Promise<CollectionEntry<C>['data'][]> {
  const itens = await getCollection(colecao);
  return itens.map((item) => item.data);
}

/**
 * Copia os metadados de imagem para um objeto simples. As props de ilhas React são
 * serializadas no HTML, e um SVG importado é um componente (função com src/width/height),
 * que não serializa: a hidratação da ilha inteira falha (no hero, isso desliga também o
 * formulário).
 */
function imagemSimples(imagem: ImageMetadata): ImageMetadata {
  return { src: imagem.src, width: imagem.width, height: imagem.height, format: imagem.format };
}

const ehImagem = (valor: unknown): valor is ImageMetadata =>
  (typeof valor === 'object' || typeof valor === 'function') &&
  valor !== null &&
  'src' in valor &&
  'width' in valor &&
  'height' in valor;

/** Prepara itens de conteúdo para props de ilhas React, simplificando as imagens. */
export function paraIlha<T extends Record<string, unknown>>(itens: T[]): T[] {
  return itens.map(
    (item) =>
      Object.fromEntries(
        Object.entries(item).map(([chave, valor]) => [chave, ehImagem(valor) ? imagemSimples(valor) : valor]),
      ) as T,
  );
}
