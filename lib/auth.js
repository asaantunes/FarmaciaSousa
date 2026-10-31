import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'fs_admin';
const MAX_AGE = 60 * 60 * 8;
function signature(value) { return createHmac('sha256', process.env.ADMIN_SESSION_SECRET || '').update(value).digest('base64url'); }

export function setSession(res, username) {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE;
  const value = `${username}.${expires}`;
  res.setHeader('Set-Cookie', `${COOKIE}=${expires}.${signature(value)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${MAX_AGE}`);
}

export function clearSession(res) { res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`); }

export function isAuthenticated(req) {
  const token = (req.headers.cookie || '').split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!token || !process.env.ADMIN_SESSION_SECRET || !process.env.ADMIN_USERNAME) return false;
  const [expiresText, supplied] = token.split('.');
  const value = `${process.env.ADMIN_USERNAME}.${expiresText}`;
  if (Number(expiresText) < Math.floor(Date.now() / 1000) || !supplied) return false;
  const expected = Buffer.from(signature(value));
  const received = Buffer.from(supplied);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function requireSameOrigin(req) {
  try { return !req.headers.origin || new URL(req.headers.origin).host === req.headers.host; }
  catch { return false; }
}
