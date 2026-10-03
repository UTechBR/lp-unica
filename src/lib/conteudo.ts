import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';

/**
 * Itens de uma coleção da biblioteca de conteúdo, na ordem do arquivo JSON.
 * Use em páginas e componentes .astro; para ilhas React, passe o resultado por props.
 */
export async function listar<C extends CollectionKey>(colecao: C): Promise<CollectionEntry<C>['data'][]> {
  const itens = await getCollection(colecao);
  return itens.map((item) => item.data);
}
