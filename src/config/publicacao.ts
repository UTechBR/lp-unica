// Interruptores de publicação de páginas em rascunho.
//
// /produtos (portfólio para o parceiro): conteúdo proposto, aguardando validação do
// comercial. Desligado: a página mostra o aviso de rascunho e as lacunas "a definir",
// fica fora do sitemap e dos buscadores, e a Home não linka para ela. Em produção, o
// .htaccess ainda redireciona /produtos para /#produtos (302).
// Para publicar: trocar para true e remover a regra de /produtos do public/.htaccess.
export const produtosPublicado = false;
