import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/contact.js';

function response() {
  return {
    statusCode: 200,
    setHeader() {},
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

const validBody = {
  nome: 'Pessoa de teste',
  email: 'teste@example.com',
  mensagem: 'Mensagem de teste.',
  consentimento: true,
  website: ''
};
const request = (body = validBody) => ({ method: 'POST', headers: { origin: 'https://farmaciasousa.vercel.app', host: 'farmaciasousa.vercel.app' }, body });

test('rejeita dados inválidos antes de tentar enviar', async () => {
  const res = response();
  await handler(request({ ...validBody, email: 'inválido' }), res);
  assert.equal(res.statusCode, 400);
});

test('informa quando faltam as variáveis de envio', async () => {
  const previous = { ...process.env };
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_TO_EMAIL;
  delete process.env.CONTACT_FROM_EMAIL;
  try {
    const res = response();
    await handler(request(), res);
    assert.equal(res.statusCode, 503);
  } finally { Object.assign(process.env, previous); }
});

test('envia para o destinatário configurado e usa o visitante como reply-to', async () => {
  const previous = { ...process.env };
  const oldFetch = globalThis.fetch;
  process.env.RESEND_API_KEY = 'test-key';
  process.env.CONTACT_TO_EMAIL = 'destino@example.com';
  process.env.CONTACT_FROM_EMAIL = 'Farmácia Sousa <onboarding@resend.dev>';
  let sent;
  globalThis.fetch = async (_url, options) => {
    sent = JSON.parse(options.body);
    return { ok: true, json: async () => ({ id: 'test-id' }) };
  };
  try {
    const res = response();
    await handler(request(), res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(sent.to, ['destino@example.com']);
    assert.equal(sent.reply_to, 'teste@example.com');
    assert.match(sent.text, /Mensagem de teste/);
  } finally { globalThis.fetch = oldFetch; Object.assign(process.env, previous); }
});

test('não confirma envio quando o serviço rejeita a mensagem', async () => {
  const previous = { ...process.env };
  const oldFetch = globalThis.fetch;
  process.env.RESEND_API_KEY = 'test-key';
  process.env.CONTACT_TO_EMAIL = 'destino@example.com';
  process.env.CONTACT_FROM_EMAIL = 'Farmácia Sousa <onboarding@resend.dev>';
  globalThis.fetch = async () => ({ ok: false, status: 403 });
  try {
    const res = response();
    await handler(request(), res);
    assert.equal(res.statusCode, 502);
    assert.equal(res.body.ok, undefined);
  } finally { globalThis.fetch = oldFetch; Object.assign(process.env, previous); }
});
