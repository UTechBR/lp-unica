# Biblioteca de conteúdo

Tudo o que o site exibe e que alguém pode querer trocar (bancos, produtos, vídeos, textos institucionais, documentos) mora em um lugar previsível, separado dos componentes. Componentes só cuidam da apresentação: para mudar conteúdo, não é preciso abrir um `.tsx`.

## Onde cada coisa fica

| O quê | Onde | Exemplo |
|---|---|---|
| Listas de conteúdo (itens que se repetem) | `src/content/<coleção>.json` | `bancos.json`, `shorts.json` |
| Esquema de cada coleção | `src/content.config.ts` | campos obrigatórios, tipos |
| Imagens usadas no site | `src/assets/<categoria>/` | `src/assets/bancos/banco-bmg.png` |
| Textos únicos e estrutura do site | `src/config/` | `empresa.ts`, `navegacao.ts`, `rodape.ts` |
| Documentos legais (PDF) | `public/documentos/` + `src/config/documentos.ts` | `politica-de-cookies.pdf` |
| Vídeos | `public/videos/<id>.mp4` (+ `.webm` opcional) | `depoimento-1.mp4` |
| Ícones disponíveis para o conteúdo | `src/lib/icones.ts` | `"icone": "Landmark"` |

**Regra para decidir:**

- É uma lista que cresce ou muda? Vai para `src/content/`.
- É um texto ou dado único (missão, telefone, menu)? Vai para `src/config/`.
- É imagem? Vai para `src/assets/`, nunca para `public/`. O Astro só otimiza o que está em `src/assets/`.
- Precisa de URL fixa, que alguém pode guardar ou compartilhar (PDF, vídeo, favicon, `og-image`)? Vai para `public/`.

## Coleções

| Coleção | Arquivo | Onde aparece |
|---|---|---|
| `bancos` | `bancos.json` | Grade do hero e modal de canais (Home), `/bancos-parceiros` |
| `categorias-produto` | `categorias-produto.json` | Seção Produtos (Home); o campo `pagina` alimenta `/produtos` |
| `ecossistema` | `ecossistema.json` | Seção Ecossistema (Home) |
| `valores` | `valores.json` | Seção Sobre (Home e `/sobre`), com o `resumo`; a `descricao` guarda o texto oficial |
| `shorts` | `shorts.json` | Seção Única shorts (Home) |

- **Ordem:** a ordem do arquivo é a ordem de exibição. Na grade do hero os bancos são embaralhados a cada visita, mas em todos os outros lugares vale a ordem do arquivo.
- **Validação:** o build (`npm run build`) falha com uma mensagem clara se um item tiver campo obrigatório faltando, `id` fora do padrão, ícone que não existe ou imagem com caminho errado. Assim nada quebrado chega ao ar.

## Regras de texto

Valem para todo texto do site, e principalmente para produtos e crédito:

- **Descrever, nunca prometer.** Fora: "melhor taxa", "taxas reduzidas", "aprovação facilitada", "liberação rápida", "sem consulta ao SPC/Serasa", "100% digital", a não ser que seja verificável e verdadeiro para todos os bancos.
- **Falar com o parceiro.** O "você" do texto é o correspondente ("você atende", "você oferece"), não quem toma o crédito.
- **Fatos de mercado só se forem estáveis.** "Desconto em folha" define o produto; percentuais (margem consignável, taxas) mudam por regra e ficam de fora.
- **Números só confirmados e, quando possível, calculados** (ex.: "mais de 20 bancos" vem da quantidade em `bancos.json`).

## Nomes de arquivo e `id`

- Use minúsculas, palavras separadas por hífen, sem acento nem espaço: `banco-bmg`, `politica-de-cookies`, `bruno-iacomini`.
- O `id` de um item nomeia os arquivos ligados a ele: o banco `banco-bmg` tem o logo `src/assets/bancos/banco-bmg.png`, e o short `depoimento-1` tem a capa `src/assets/shorts/depoimento-1.jpg` e o vídeo `public/videos/depoimento-1.mp4`.
- Não use sufixos como `-1`, `-final` ou `-novo` para versionar. Para trocar um arquivo, substitua mantendo o nome.

## Como fazer as tarefas comuns

### Incluir um banco

1. Salve o logo em `src/assets/bancos/<id>.png` (ou `.svg`).
2. Acrescente o item em `src/content/bancos.json`:

   ```json
   {
     "id": "banco-exemplo",
     "nome": "Banco Exemplo",
     "logo": "../assets/bancos/banco-exemplo.png",
     "site": "https://www.bancoexemplo.com.br",
     "canais": [{ "rotulo": "SAC", "valor": "0800 000 0000" }],
     "ouvidoria": "0800 000 0001",
     "horario": "Seg a Sex, 8h às 20h."
   }
   ```

3. Se o logo parecer pesado ou leve demais na grade do hero, ajuste `"logoAltura"` (padrão 30, em px).

A frase "mais de N bancos" do hero é calculada pela quantidade de itens, então não precisa de ajuste.

### Incluir um vídeo em Única shorts

1. Salve a capa (vertical, 9:16, mínimo 720px de altura) em `src/assets/shorts/<id>.jpg`.
2. Salve o vídeo em `public/videos/<id>.mp4`, em H.264, que é o formato que roda no iPhone. Se tiver, inclua também `<id>.webm`, que é mais leve.
3. Acrescente `{ "id": "<id>", "titulo": "…", "capa": "../assets/shorts/<id>.jpg" }` em `shorts.json`.

Enquanto o vídeo não estiver na pasta, o card abre o Instagram da Única.

### Usar um ícone novo

O campo `icone` aceita os nomes da [Lucide](https://lucide.dev/icons), mas só os registrados em `src/lib/icones.ts`. Para usar outro, importe-o e acrescente-o à lista nesse arquivo.

### Trocar um documento legal

Substitua o PDF em `public/documentos/` mantendo o nome do arquivo, porque há links para ele fora do site. Um documento novo precisa de três passos:

1. Salvar o arquivo em `public/documentos/`.
2. Registrá-lo em `src/config/documentos.ts`. Ele aparece automaticamente no rodapé.
3. Se substituir um endereço antigo, incluir um `Redirect 301` em `public/.htaccess`.

## Imagens

- **Formato de origem:** JPG para fotos e PNG ou SVG para logos e transparências, na maior resolução disponível. O Astro gera WebP e os tamanhos necessários no build. Não envie versões já reduzidas.
- **Logos de bancos:** silhueta branca sobre fundo transparente. O site aplica o cinza e o grafite por máscara.
- **Imagens no código:**
  - Em componentes `.astro`, use `<Image src={…} widths={[…]} sizes="…" />` de `astro:assets`.
  - Em ilhas React, gere a versão otimizada com `getImage()` na página ou no layout e passe por prop (veja `AnecPopup` em `BaseLayout.astro`).
  - Ao passar itens de conteúdo com imagem para uma ilha React (`client:*`), use `paraIlha(itens)` de `src/lib/conteudo.ts`. Um SVG importado é um componente, não um objeto, e sem essa conversão a ilha inteira deixa de funcionar. No hero, isso derrubaria também o formulário.
  - Logos pequenos podem ser importados direto (`import logo from '../assets/marca/logo-branca.png'` e `logo.src`).

## Fora desta biblioteca

- `public/api/`: back-end PHP do formulário.
- `src/assets/fonts/`: fontes Exo Soft.
- `public/favicon.*`, `public/og-image.jpg`, `public/robots.txt`, `public/sitemap.xml`: arquivos de URL fixa exigidos pelo navegador e pelos buscadores.
