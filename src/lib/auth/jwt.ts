import { SignJWT, jwtVerify } from 'jose';

const env = (k: string) => (process.env[k] && process.env[k].trim() ? process.env[k]!.trim() : undefined);
const SECRET = env('JWT_SECRET') || 'dev-secret-must-change-please-set-JWT_SECRET';
const EXPIRES_IN = env('JWT_EXPIRES_IN') || '7d';

function parseExpiresInToSeconds(v: string): number {
  // supports formats like '7d', '30m', '3600s' or a plain number of seconds
  if (/^[0-9]+$/.test(v)) return Number(v);
  const m = v.match(/^([0-9]+)([smhd])$/i);
  if (!m) return 7 * 24 * 60 * 60; // default 7 days
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  switch (unit) {
    case 's':
      return n;
    case 'm':
      return n * 60;
    case 'h':
      return n * 60 * 60;
    case 'd':
      return n * 24 * 60 * 60;
    default:
      return 7 * 24 * 60 * 60;
  }
}

export async function signJwt(payload: Record<string, any>) {
  const expSeconds = parseExpiresInToSeconds(EXPIRES_IN);
  const now = Math.floor(Date.now() / 1000);
  const key = new TextEncoder().encode(SECRET);
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + expSeconds)
    .sign(key);
  return jwt;
}

export async function verifyJwt(token: string) {
  try {
    const key = new TextEncoder().encode(SECRET);
    const { payload } = await jwtVerify(token, key);
    return payload as Record<string, any>;
  } catch (err) {
    return null;
  }
}
