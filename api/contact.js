import { requireSameOrigin } from '../lib/auth.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  if (!requireSameOrigin(req)) return res.status(403).json({ error: 'Origem inválida.' });

  const { nome, email, mensagem, consentimento, website } = req.body || {};
  if (website) return res.status(200).json({ ok: true }); // Campo de proteção contra formulários automáticos.
  if (typeof nome !== 'string' || !nome.trim() || nome.length > 100 ||
      typeof email !== 'string' || email.length > 254 || !EMAIL_PATTERN.test(email.trim()) ||
      typeof mensagem !== 'string' || !mensagem.trim() || mensagem.length > 3000 ||
      consentimento !== true) {
    return res.status(400).json({ error: 'Preencha os campos e autorize a resposta ao seu contacto.' });
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    return res.status(503).json({ error: 'O envio direto ainda não está configurado.' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        reply_to: email.trim(),
        subject: 'Mensagem através do site da Farmácia Sousa',
        text: `Nome: ${nome.trim()}\nEmail: ${email.trim()}\n\nMensagem:\n${mensagem.trim()}`
      })
    });
    if (!response.ok) {
      console.error('Falha no envio de contacto:', response.status);
      return res.status(502).json({ error: 'Não foi possível enviar a mensagem. Tente novamente.' });
    }
    const result = await response.json();
    if (!result.id) return res.status(502).json({ error: 'O serviço de email não confirmou o envio.' });
    return res.status(200).json({ ok: true });
  } catch {
    console.error('Serviço de email indisponível.');
    return res.status(502).json({ error: 'Não foi possível enviar a mensagem. Tente novamente.' });
  }
}
