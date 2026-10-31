import { clearSession, isAuthenticated, requireSameOrigin } from '../lib/auth.js';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  if (!requireSameOrigin(req) || !isAuthenticated(req)) return res.status(401).json({ error: 'Sessão inválida.' });
  clearSession(res);
  return res.status(200).json({ ok: true });
}
