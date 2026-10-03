import type { APIRoute } from 'astro';
import { produtosPublicado } from '../config/publicacao';

// Sitemap gerado no build a partir das páginas reais de src/pages: página nova entra
// sozinha, página removida sai sozinha. Ficam de fora a 404 e as listadas em FORA.
const SITE = 'https://unicapromotora.com.br';
const FORA = new Set(['/404', ...(produtosPublicado ? [] : ['/produtos'])]);

const paginas = Object.keys(import.meta.glob('./**/*.astro'))
  .map((arquivo) => arquivo.replace(/^\.\//, '/').replace(/\.astro$/, '').replace(/\/index$/, '/'))
  .filter((rota) => !rota.includes('[') && !FORA.has(rota))
  .sort();

export const GET: APIRoute = () => {
  // Com barra final, igual ao canonical: o build gera /pagina/index.html e o Apache
  // redireciona /pagina para /pagina/.
  const urls = paginas.map((rota) => `  <url><loc>${SITE}${rota === '/' ? '/' : `${rota}/`}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
