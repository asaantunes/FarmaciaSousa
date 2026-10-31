import { put } from '@vercel/blob';
import { randomUUID } from 'node:crypto';
import { isAuthenticated, requireSameOrigin } from '../lib/auth.js';

const TYPES = new Map([['image/jpeg', 'jpg'], ['image/png', 'png'], ['image/webp', 'webp']]);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  if (!requireSameOrigin(req) || !isAuthenticated(req)) return res.status(401).json({ error: 'Sessão inválida.' });
  const { data, type } = req.body || {};
  if (!TYPES.has(type) || typeof data !== 'string' || data.length > 4_250_000) return res.status(400).json({ error: 'Escolha uma imagem JPG, PNG ou WebP com menos de 3 MB.' });
  let bytes;
  try { bytes = Buffer.from(data, 'base64'); } catch { return res.status(400).json({ error: 'Ficheiro inválido.' }); }
  if (!bytes.length || bytes.length > 3 * 1024 * 1024) return res.status(400).json({ error: 'A imagem deve ter menos de 3 MB.' });
  try {
    const blob = await put(`farmacia-sousa/articles/images/${randomUUID()}.${TYPES.get(type)}`, bytes, { access: 'public', contentType: type, addRandomSuffix: false, cacheControlMaxAge: 31536000 });
    return res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error(error);
    return res.status(503).json({ error: 'Não foi possível carregar a imagem. Confirme a ligação ao Vercel Blob.' });
  }
}
