import { list, put } from '@vercel/blob';
import { isAuthenticated, requireSameOrigin } from '../lib/auth.js';

const INDEX_PATH = 'farmacia-sousa/articles/index.json';

async function readArticles() {
  const { blobs } = await list({ prefix: INDEX_PATH, limit: 10 });
  const index = blobs.find((blob) => blob.pathname === INDEX_PATH);
  if (!index) return [];
  const response = await fetch(index.url, { cache: 'no-store' });
  if (!response.ok) throw new Error('Não foi possível ler o índice de artigos.');
  const value = await response.json();
  return Array.isArray(value) ? value : [];
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    try {
      const allArticles = await readArticles();
      if (req.query?.admin === '1') {
        if (!isAuthenticated(req)) return res.status(401).json({ error: 'Sessão inválida.' });
        return res.status(200).json(allArticles.filter((article) => article.published));
      }
      return res.status(200).json(allArticles.filter((article) => article.published));
    } catch (error) {
      console.error(error);
      return res.status(503).json({ error: 'Os artigos ainda não estão disponíveis.' });
    }
  }
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Método não permitido.' });
  if (!requireSameOrigin(req) || !isAuthenticated(req)) return res.status(401).json({ error: 'Sessão inválida.' });
  const articles = req.body;
  if (!Array.isArray(articles) || articles.length > 100) return res.status(400).json({ error: 'Lista de artigos inválida.' });
  const allowed = articles.every((article) => article && typeof article.id === 'string' && /^[a-z0-9-]{1,80}$/.test(article.id) && typeof article.title === 'string' && article.title.length <= 160 && typeof article.excerpt === 'string' && article.excerpt.length <= 300 && typeof article.body === 'string' && article.body.length <= 20000 && typeof article.image === 'string' && /^https:\/\//.test(article.image) && article.published === true);
  if (!allowed) return res.status(400).json({ error: 'Um ou mais artigos têm campos inválidos.' });
  try {
    await put(INDEX_PATH, JSON.stringify(articles), { access: 'public', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 60 });
    return res.status(200).json({ ok: true, count: articles.length });
  } catch (error) {
    console.error(error);
    return res.status(503).json({ error: 'Não foi possível guardar os artigos. Confirme a ligação ao Vercel Blob.' });
  }
}
