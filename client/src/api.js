const BASE = import.meta.env.VITE_API_URL || '/api';
export const getToken = () => localStorage.getItem('admin_token');
export const setToken = (t) => (t ? localStorage.setItem('admin_token', t) : localStorage.removeItem('admin_token'));

export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  const t = getToken();
  if (t) headers.Authorization = `Bearer ${t}`;
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(BASE + path, { method, headers, body: form || (body ? JSON.stringify(body) : undefined) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(json.error || `Request failed (${res.status})`), { status: res.status });
  return json;
}

export async function uploadFile(file) {
  const form = new FormData();
  form.append('file', file);
  return (await api('/upload', { method: 'POST', form })).url;
}
