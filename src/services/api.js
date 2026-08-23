import { supabase } from '../lib/supabase.js';

export const api = {
  async get(path) {
    if (path === '/health') return { ok: true, mode: 'supabase' };
    throw new Error(`GET ${path} is not mapped yet.`);
  },
  async post(path, body) {
    throw new Error(`POST ${path} is not mapped yet.`);
  },
};

export { supabase };
