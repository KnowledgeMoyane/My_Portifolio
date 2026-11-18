import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const {
  SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
  ADMIN_EMAIL, PORT = 5000, CLIENT_ORIGIN, STORAGE_BUCKET = 'portfolio',
} = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY || !ADMIN_EMAIL) {
  console.error('Missing env vars. Copy server/.env.example to server/.env and fill it in.');
  process.exit(1);
}

// service-role client: full DB + storage access (server only, never sent to the browser)
const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
// anon client: only used to check the admin's email + password
const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });

const COLLECTIONS = ['projects', 'skills', 'experience', 'leadership', 'certificates'];
const app = express();
app.set('trust proxy', 1);
app.use(cors(CLIENT_ORIGIN ? { origin: CLIENT_ORIGIN.split(',') } : {}));
app.use(express.json({ limit: '1mb' }));

const wrap = (fn) => (req, res) => fn(req, res).catch((e) => {
  console.error(e);
  res.status(500).json({ error: e.message || 'Server error' });
});

// Admin guard: valid Supabase session AND email === ADMIN_EMAIL
async function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Not signed in' });
  const { data, error } = await db.auth.getUser(token);
  const email = data?.user?.email?.toLowerCase();
  if (error || !email || email !== ADMIN_EMAIL.toLowerCase()) {
    return res.status(403).json({ error: 'Admin access only' });
  }
  next();
}

// ---------- public ----------
app.get('/api/site', wrap(async (_req, res) => {
  const [{ data: s, error: e1 }, { data: items, error: e2 }] = await Promise.all([
    db.from('site_settings').select('data').eq('key', 'site').maybeSingle(),
    db.from('items').select('*').order('position', { ascending: true }),
  ]);
  if (e1 || e2) throw new Error((e1 || e2).message);
  const out = { site: s?.data || {} };
  COLLECTIONS.forEach((c) => (out[c] = []));
  items.forEach((i) => out[i.collection]?.push({ id: i.id, ...i.data }));
  res.json(out);
}));

const messageLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 8, standardHeaders: true, legacyHeaders: false });
app.post('/api/messages', messageLimiter, wrap(async (req, res) => {
  const { name, email, scope, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message are required' });
  const { error } = await db.from('messages').insert({
    name: String(name).slice(0, 200), email: String(email).slice(0, 200),
    scope: String(scope || '').slice(0, 200), message: String(message).slice(0, 5000),
  });
  if (error) throw error;
  res.json({ ok: true });
}));

// ---------- auth ----------
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });
app.post('/api/auth/login', loginLimiter, wrap(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const { data, error } = await authClient.auth.signInWithPassword({ email, password });
  if (error || !data.session) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: data.session.access_token });
}));
app.get('/api/auth/me', requireAdmin, (_req, res) => res.json({ ok: true }));

// ---------- admin: settings ----------
app.put('/api/settings', requireAdmin, wrap(async (req, res) => {
  const { error } = await db.from('site_settings')
    .upsert({ key: 'site', data: req.body || {}, updated_at: new Date().toISOString() });
  if (error) throw error;
  res.json({ ok: true });
}));

// ---------- admin: items ----------
const checkCollection = (req, res, next) =>
  COLLECTIONS.includes(req.params.collection) ? next() : res.status(404).json({ error: 'Unknown collection' });

app.post('/api/items/:collection', requireAdmin, checkCollection, wrap(async (req, res) => {
  const { data: last } = await db.from('items').select('position').eq('collection', req.params.collection)
    .order('position', { ascending: false }).limit(1);
  const position = (last?.[0]?.position ?? -1) + 1;
  const { data, error } = await db.from('items')
    .insert({ collection: req.params.collection, position, data: req.body || {} }).select().single();
  if (error) throw error;
  res.json({ id: data.id, ...data.data });
}));

app.post('/api/items/:collection/reorder', requireAdmin, checkCollection, wrap(async (req, res) => {
  const ids = req.body?.ids || [];
  await Promise.all(ids.map((id, position) =>
    db.from('items').update({ position }).eq('id', id).eq('collection', req.params.collection)));
  res.json({ ok: true });
}));

app.put('/api/items/:collection/:id', requireAdmin, checkCollection, wrap(async (req, res) => {
  const { id: _drop, ...data } = req.body || {};
  const { error } = await db.from('items').update({ data })
    .eq('id', req.params.id).eq('collection', req.params.collection);
  if (error) throw error;
  res.json({ ok: true });
}));

app.delete('/api/items/:collection/:id', requireAdmin, checkCollection, wrap(async (req, res) => {
  const { error } = await db.from('items').delete()
    .eq('id', req.params.id).eq('collection', req.params.collection);
  if (error) throw error;
  res.json({ ok: true });
}));

// ---------- admin: messages ----------
app.get('/api/messages', requireAdmin, wrap(async (_req, res) => {
  const { data, error } = await db.from('messages').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  res.json(data);
}));
app.delete('/api/messages/:id', requireAdmin, wrap(async (req, res) => {
  const { error } = await db.from('messages').delete().eq('id', req.params.id);
  if (error) throw error;
  res.json({ ok: true });
}));

// ---------- admin: uploads to Supabase Storage ----------
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 60 * 1024 * 1024 } });
const ALLOWED = /^(image\/|video\/|application\/pdf)/;
app.post('/api/upload', requireAdmin, upload.single('file'), wrap(async (req, res) => {
  const f = req.file;
  if (!f) return res.status(400).json({ error: 'No file' });
  if (!ALLOWED.test(f.mimetype)) return res.status(400).json({ error: 'Only images, videos and PDFs are allowed' });
  const ext = path.extname(f.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '');
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const { error } = await db.storage.from(STORAGE_BUCKET).upload(name, f.buffer, { contentType: f.mimetype });
  if (error) throw error;
  const { data } = db.storage.from(STORAGE_BUCKET).getPublicUrl(name);
  res.json({ url: data.publicUrl });
}));

// ---------- serve the built React app in production ----------
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '../client/dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (req, res) => req.path.startsWith('/api') ? res.status(404).end() : res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
