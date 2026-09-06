import { createServerFn } from '@tanstack/react-start';
import { getSql } from '@/lib/db';
import { setCookie, getCookie } from '@tanstack/react-start/server';
import bcrypt from 'bcryptjs';
import { signJwt, verifyJwt } from './auth/jwt';

const COOKIE_NAME = 'tuition_session';

export const login = createServerFn({ method: 'POST' })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      const rows = await sql`SELECT * FROM users WHERE email = ${data.email} LIMIT 1`;
      const user = rows[0] as any | undefined;
      if (!user) return { success: false, error: 'Invalid credentials' };
      if (!user.is_active) return { success: false, error: 'Account disabled' };

      // password_hash may be stored via pgcrypto crypt(); bcryptjs.compare handles bcrypt strings
      const valid = await bcrypt.compare(data.password, String(user.password_hash));
      if (!valid) return { success: false, error: 'Invalid credentials' };

      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        instituteId: user.institute_id || null,
        name: user.name || null,
      };
      const token = await signJwt(payload);

      // cookie attrs
      const secure = process.env.NODE_ENV === 'production';
      const maxAge = (() => {
        const v = process.env.JWT_EXPIRES_IN || '7d';
        // parse quickly - if ends with d, convert
        const m = v.match(/^([0-9]+)([smhd])$/i);
        if (!m) return 7 * 24 * 60 * 60;
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
      })();

      // set httpOnly cookie via TanStack server helper
      try {
        setCookie(COOKIE_NAME, token, {
          path: '/',
          httpOnly: true,
          secure,
          sameSite: 'strict',
          maxAge,
        });
      } catch (err) {
        console.error('[auth.login] setCookie failed', err);
      }

      // Never return password_hash
      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        instituteId: user.institute_id || null,
      };

      return { success: true, user: safeUser };
    } catch (err) {
      console.error('[login] error', err);
      return { success: false, error: String(err) };
    }
  });

export const logout = createServerFn({ method: 'POST' })
  .handler(async () => {
    try {
      // clear cookie
      try {
        setCookie(COOKIE_NAME, '', { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 0 });
      } catch (err) {
        console.error('[auth.logout] setCookie failed', err);
      }
      return { success: true };
    } catch (err) {
      console.error('[logout] error', err);
      return { success: false, error: String(err) };
    }
  });

export const getCurrentUser = createServerFn({ method: 'GET' })
  .handler(async () => {
    try {
      const token = getCookie(COOKIE_NAME) || null;
      if (!token) return { success: true, user: null };
      const payload = await verifyJwt(token);
      if (!payload) return { success: true, user: null };

      const sql = await getSql();
      const rows = await sql`SELECT id, name, email, phone, role, institute_id FROM users WHERE id = ${payload.userId} LIMIT 1`;
      const user = rows[0] as any | undefined;
      if (!user) return { success: true, user: null };
      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        instituteId: user.institute_id || null,
      };
      return { success: true, user: safeUser };
    } catch (err) {
      console.error('[getCurrentUser] error', err);
      return { success: true, user: null };
    }
  });
