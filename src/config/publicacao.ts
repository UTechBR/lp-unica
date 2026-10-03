// Interruptores de publicação de páginas em rascunho.
//
// /portfolio (portfólio para o parceiro): conteúdo proposto, aguardando validação do
// comercial. Desligado: a página mostra o aviso de rascunho e as lacunas "a definir",
// fica fora do sitemap e dos buscadores, e a Home não linka para ela. Em produção, o
// .htaccess ainda redireciona /portfolio para /#produtos (302).
// Para publicar: trocar para true e remover a regra de /portfolio do public/.htaccess.
export const portfolioPublicado = false;
