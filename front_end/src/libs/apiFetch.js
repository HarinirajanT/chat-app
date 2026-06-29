import { API_BASE, isDemoMode } from './config';
import { demoFetch } from './demoApi';

export async function apiFetch(path, options = {}) {
  if (isDemoMode) {
    const data = await demoFetch(path, options);
    return { ok: true, json: async () => data };
  }

  const url = `${API_BASE}${path}`;
  return fetch(url, options);
}
