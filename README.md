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
| Carrossel | Swiper.js |
| Persistência | PHP 8 standalone (sem framework) em `public/api/`, grava CSV |
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

Os formulários enviados em dev gravam CSVs (e anexos) reais em `public/api/`, que o `npm run build` copia para `dist/api/`. Apague-os do `dist/` antes de subir, ou eles sobrescrevem as planilhas de produção.

```bash
npm run build      # build de produção em /dist
npm run preview    # preview do build
npm run lint        # oxlint
```

## Persistência de formulários

Cada formulário grava numa planilha CSV própria em `public/api/`, via scripts PHP sem dependências:

| Formulário | Endpoint | Arquivo |
|---|---|---|
| LeadForm (Hero) e ContatoForm | `leads.php` / `contact.php` | `leads.csv` (coluna `origem` distingue a origem) |
| OuvidoriaForm | `ouvidoria.php` | `ouvidoria.csv` |
| DenuncieForm | `denuncie.php` | `denuncie.csv` |

Os `.csv` são gitignorados (dados pessoais reais) e bloqueados por `.htaccess` (`Require all denied`) para não serem acessíveis via URL direta. `_csv_writer.php` também é bloqueado, por ser include interno.

## Estrutura de pastas

```
src/
 ├── assets/            # fontes estáticas (self-hosted, o resto de imagem mora em public/images)
 ├── components/        # Header, Footer, Navbar, Button, LeadForm, ProductsSection... (flat, 1 nível)
 ├── layouts/           # BaseLayout.astro — <head>/SEO, Header/Footer, popups globais
 ├── pages/              # roteamento por arquivo: index/sobre/parceiros/contato/ouvidoria/denuncie/produtos.astro + 404.astro
 ├── hooks/              # useScrollPosition, useDisclosure, useScrollSpy, useLockBodyScroll...
 ├── services/           # leadService.ts — fetch para public/api/*.php
 ├── data/               # conteúdo estático tipado (produtos, sistemas, bancos, footer...)
 ├── types/              # tipos compartilhados
 ├── utils/               # masks (telefone), schemas Zod, cn()
 └── styles/             # global.css (tokens, base, componentes Tailwind, fontes)

public/
 ├── api/                # scripts PHP (leads, contato, ouvidoria, denúncia) + .htaccess
 ├── images/             # imagens do site (logos, banners, ícones de bancos)
 ├── .htaccess           # ErrorDocument 404 -> /404.html
 └── ...                 # favicon, og-image, robots.txt, sitemap.xml
```

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
