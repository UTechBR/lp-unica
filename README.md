# Única Promotora — Site Institucional

Site institucional da Única Promotora. Front-end estático (Astro + React) com persistência de formulários via scripts PHP, hospedado na Hostgator. Substitui a versão anterior em WordPress/Elementor — motivos da troca em [`docs/migracao-wordpress.md`](docs/migracao-wordpress.md).

## Stack

| Camada | Tecnologia |
|---|---|
| Build | Astro 5 (MPA — cada rota gera um HTML estático próprio) |
| UI interativa | React 19 + TypeScript, hidratada como islands (`client:load`/`client:visible`/`client:idle`) |
| Estilos | TailwindCSS 3 (tokens customizados em `tailwind.config.mjs`) |
| Roteamento | Baseado em arquivos (`src/pages/*.astro`), sem router client-side |
| Animações | Framer Motion |
| Formulários | React Hook Form + Zod |
| Ícones | Lucide React |
| Persistência | PHP 8 standalone (sem framework) em `public/api/`, grava CSV numa pasta privada `storage/` |
| Lint | oxlint |

Sem backend Node em produção: o build é 100% estático e os `.php` sobem junto na mesma hospedagem (mesma origem, sem CORS).

## Como rodar

```bash
npm install
npm run dev        # frontend em http://localhost:4321
npm run dev:php    # backend PHP local em http://localhost:8001 (outro terminal; necessário pros formulários)
```

O `astro.config.mjs` já proxeia `/api/*` para `localhost:8001` em dev. Sem o servidor PHP rodando, os formulários retornam erro de rede (comportamento esperado, não é bug).

O `dev:php` precisa do PHP 8+ no PATH (no Windows: `winget install PHP.PHP.8.4`). Ele passa os limites de upload por `-d` porque o servidor embutido não lê o `public/api/.user.ini`; sem isso, anexos da denúncia acima de 2 MB falham.

Os formulários enviados em dev gravam em `storage/`, na raiz do projeto (gitignorada e fora de `public/`, então o build não copia dados de teste para o `dist/`).

```bash
npm run build      # build de produção em /dist
npm run preview    # preview do build
npm run lint        # oxlint
```

## Persistência de formulários

Os scripts em `public/api/` gravam tudo numa única pasta privada, `storage/`, resolvida por `pasta_storage()` em `_seguranca.php`:

- **preferida:** um nível acima da raiz pública. Em dev é `lp-unica/storage/`; na Hostgator, `~/storage/`, fora de `public_html`;
- **reserva**, se não der para criar ou escrever: `public/api/storage/`, bloqueada por `.htaccess` (`Require all denied`).

| Formulário | Endpoint | Arquivo em `storage/` |
|---|---|---|
| Seja parceiro (Hero) e Fale conosco | `leads.php` / `contact.php` | `leads.csv` (coluna `origem` distingue a origem; protocolo `LEA-…` / `CON-…`) |
| Ouvidoria | `ouvidoria.php` | `ouvidoria-manifestacoes.csv` (protocolo `OUV-…`) |
| Canal de denúncias | `denuncie.php` | `denuncias.csv` (protocolo `DEN-…`) e anexos em `denuncias-anexos/<protocolo>/` |
| Limite de envios (todos) | `_seguranca.php` | `formularios-limites/` (contadores por hash de IP) |
| Protocolos (todos) | `_seguranca.php` | `protocolos/<PREFIXO>.ultimo` (último número emitido) |

Todo registro gravado recebe um protocolo `PREFIXO-AAAAMMDDHHMMSS` (ex.: `OUV-20261003143205`), gerado por `gerar_protocolo()`: data e hora até o segundo, sem contador. Se dois envios do mesmo tipo caem no mesmo segundo, o segundo espera o próximo segundo. Ouvidoria e Denúncia mostram o protocolo na tela de sucesso; nos leads ele fica só na planilha (última coluna, `protocolo`).

Proteções comuns (`_seguranca.php`): limite de tamanho por campo, campo-isca anti-robô, 5 envios por IP a cada 10 min por formulário, neutralização de fórmulas no CSV e datas no horário de Brasília. Os `_*.php` e qualquer `*.csv` em `public/api/` são bloqueados por `.htaccess`.

### Migração em produção

As versões anteriores gravavam dentro de `public_html/api/` (e os anexos em `~/denuncias-anexos/`). Ao publicar esta versão, mova para `~/storage/`:

- `public_html/api/leads.csv`, `ouvidoria-manifestacoes.csv` e `denuncias.csv` → `~/storage/`
- `~/denuncias-anexos/` → `~/storage/denuncias-anexos/`

As planilhas mais antigas, com outras colunas (`ouvidoria.csv`, `denuncie.csv`), podem ir para `~/storage/` como arquivo histórico. Depois, confira que `https://unicapromotora.com.br/api/leads.csv` responde 403.

## Estrutura de pastas

```
src/
 ├── assets/            # imagens processadas pelo Astro (marca, bancos, pessoas, shorts, campanhas) + fontes
 ├── components/        # componentes React e Astro (flat); form/ tem o padrão dos formulários
 ├── config/            # estrutura e dados fixos: navegacao, rodape, empresa, documentos
 ├── content/           # biblioteca de conteúdo: coleções JSON (bancos, produtos, ecossistema...) + README
 ├── content.config.ts  # esquemas das coleções (validados no build)
 ├── layouts/           # BaseLayout.astro — <head>/SEO, Header/Footer, popups globais
 ├── lib/               # conteudo.ts (listar, paraIlha), icones.ts (registro de ícones)
 ├── pages/             # index, bancos-parceiros, sobre, contato, ouvidoria, denuncie, 404, sitemap.xml.ts
 ├── hooks/             # useScrollPosition, useDisclosure, useScrollSpy, useLockBodyScroll...
 ├── services/          # leadService.ts — envio para public/api/*.php
 ├── types/             # tipos compartilhados e dos itens de conteúdo
 ├── utils/             # masks (telefone), schemas Zod e mensagens de erro, cn()
 └── styles/            # global.css (tokens, base, componentes Tailwind, fontes)

public/
 ├── api/               # endpoints PHP + _seguranca/_csv_writer + .htaccess
 ├── documentos/        # PDFs legais (URL fixa)
 ├── videos/            # vídeos de Única shorts (<id>.mp4)
 ├── .htaccess          # 404 e redirecionamentos 301
 └── ...                # favicon, og-image, robots.txt

storage/                # dados gravados pelos formulários (gitignorada; ver acima)
```

Como incluir ou trocar conteúdo (bancos, produtos, vídeos, documentos): [`src/content/README.md`](src/content/README.md).

Cada componente React só hidrata no cliente quando precisa: sem `client:*` para
seções puramente estáticas (sem framer-motion/interatividade), `client:visible`
para animação/interação que só importa depois que a seção entra na viewport, e
`client:load` só para o essencial acima da dobra (Header, o formulário de
captura do Hero).

## Documentação adicional

- [`docs/migracao-wordpress.md`](docs/migracao-wordpress.md) — motivos técnicos da migração de WordPress/Elementor para esta stack

## Limitações conhecidas

- Persistência em CSV (sem banco de dados): adequado ao volume atual, mas sem consulta/filtro server-side — leitura é manual (planilha) ou via export.
- Endpoints PHP validam formato dos campos, mas não têm autenticação, rate limiting nem CAPTCHA — expostos ao mesmo nível de um formulário de contato comum.
- Sem testes automatizados (unitários ou E2E) no momento.
