import { setSession } from '../lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) return res.status(503).json({ error: 'O acesso de administração ainda não está configurado.' });
  const { username, password } = req.body || {};
  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Utilizador ou palavra-passe incorretos.' });
  setSession(res, username);
  return res.status(200).json({ ok: true });
}
