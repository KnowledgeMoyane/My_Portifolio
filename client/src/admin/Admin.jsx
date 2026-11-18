import React, { useEffect, useState } from 'react';
import { api, getToken, setToken, uploadFile } from '../api';
import { Mi, isVideo } from '../ui';
import { SITE_GROUPS, ITEM_SCHEMAS } from '../schema';

const inp = 'w-full bg-surface-container-lowest text-on-surface border border-surface-container-highest focus:border-primary-container focus:outline-none p-space-sm rounded font-body-md text-body-md transition-colors';
const lab = 'font-label-code text-label-code text-on-surface-variant uppercase';
const btn = 'inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container font-label-code text-label-code font-bold uppercase rounded transition-all disabled:opacity-60';
const btn2 = 'inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-code text-label-code font-semibold uppercase rounded transition-all';

export default function Admin() {
  const [authed, setAuthed] = useState(null); // null = checking
  useEffect(() => {
    if (!getToken()) return setAuthed(false);
    api('/auth/me').then(() => setAuthed(true)).catch(() => { setToken(null); setAuthed(false); });
  }, []);
  if (authed === null) return <div className="p-margin font-label-code text-on-surface-variant">CHECKING SESSION...</div>;
  return authed ? <Dashboard onLogout={() => { setToken(null); setAuthed(false); }} /> : <Login onDone={() => setAuthed(true)} />;
}

function Login({ onDone }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { const { token } = await api('/auth/login', { method: 'POST', body: { email, password } }); setToken(token); onDone(); }
    catch (x) { setErr(x.message); } finally { setBusy(false); }
  };
  return (
    <div className="flex-1 flex items-center justify-center p-margin-mobile bg-surface-container-lowest">
      <form onSubmit={submit} className="w-full max-w-md bg-surface-container p-space-xl rounded border border-surface-container-highest flex flex-col gap-space-md">
        <span className="font-label-code text-label-code text-primary-container uppercase tracking-widest">// ADMIN ACCESS</span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold uppercase tracking-tight">SIGN IN</h1>
        <div className="flex flex-col gap-space-xs"><label className={lab}>Email</label>
          <input className={inp} type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="flex flex-col gap-space-xs"><label className={lab}>Password</label>
          <input className={inp} type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {err && <div className="p-space-sm bg-error-container text-on-error-container font-label-code text-label-code rounded">{err}</div>}
        <button className={btn} disabled={busy}>{busy ? 'SIGNING IN...' : 'SIGN IN'}</button>
        <a href="/" className="font-label-code text-label-code text-on-surface-variant hover:text-primary-container text-center">← Back to site</a>
      </form>
    </div>
  );
}

const TABS = [['site', 'Site & profile', 'person'], ...Object.entries(ITEM_SCHEMAS).map(([k, v]) => [k, v.label, 'list']), ['messages', 'Messages', 'mail']];

function Dashboard({ onLogout }) {
  const [tab, setTab] = useState('site');
  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-surface">
      <aside className="lg:w-64 bg-surface-container-lowest border-b lg:border-b-0 lg:border-r border-surface-container-highest p-space-md flex lg:flex-col gap-space-xs overflow-x-auto">
        <span className="hidden lg:block font-label-code text-label-code text-primary-container uppercase tracking-widest mb-space-md">// ADMIN</span>
        {TABS.map(([k, l, i]) => (
          <button key={k} onClick={() => setTab(k)} className={`flex items-center gap-space-sm px-space-md py-space-sm rounded font-label-code text-label-code uppercase whitespace-nowrap transition-colors ${tab === k ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>
            <Mi name={i} className="text-[1.1rem]" />{l}
          </button>
        ))}
        <div className="lg:mt-auto flex lg:flex-col gap-space-xs">
          <a href="/" target="_blank" className={btn2}>View site</a>
          <button onClick={onLogout} className={btn2}>Sign out</button>
        </div>
      </aside>
      <section className="flex-1 p-space-md md:p-space-xl max-w-5xl w-full">
        {tab === 'site' && <SiteEditor />}
        {ITEM_SCHEMAS[tab] && <ItemsEditor key={tab} collection={tab} />}
        {tab === 'messages' && <Messages />}
      </section>
    </div>
  );
}

// ---------- generic field ----------
function Field({ type, label, value, onChange }) {
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const pick = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    setBusy(true); setErr('');
    try { onChange(await uploadFile(f)); } catch (x) { setErr(x.message); } finally { setBusy(false); e.target.value = ''; }
  };
  if (type === 'bool') return (
    <label className="flex items-center gap-space-sm cursor-pointer"><input type="checkbox" className="accent-[#cbf231] w-4 h-4" checked={!!value} onChange={(e) => onChange(e.target.checked)} /><span className={lab}>{label}</span></label>
  );
  return (
    <div className="flex flex-col gap-space-xs">
      <label className={lab}>{label}</label>
      {type === 'text' && <input className={inp} value={value || ''} onChange={(e) => onChange(e.target.value)} />}
      {type === 'area' && <textarea className={inp} rows={4} value={value || ''} onChange={(e) => onChange(e.target.value)} />}
      {type === 'list' && <textarea className={inp} rows={4} value={Array.isArray(value) ? value.join('\n') : ''} onChange={(e) => onChange(e.target.value.split('\n'))} onBlur={(e) => onChange(e.target.value.split('\n').map((x) => x.trim()).filter(Boolean))} />}
      {['image', 'media', 'file'].includes(type) && (
        <div className="flex flex-col gap-space-xs">
          <div className="flex gap-space-xs">
            <input className={inp} placeholder="Paste a URL or upload" value={value || ''} onChange={(e) => onChange(e.target.value)} />
            <label className={`${btn2} cursor-pointer shrink-0`}>{busy ? 'UPLOADING...' : 'UPLOAD'}
              <input type="file" hidden onChange={pick} accept={type === 'image' ? 'image/*' : type === 'file' ? 'application/pdf' : 'image/*,video/*'} /></label>
          </div>
          {value && type !== 'file' && (isVideo(value) ? <video src={value} className="h-32 rounded self-start" muted controls /> : <img src={value} className="h-32 rounded self-start object-cover" />)}
          {err && <span className="text-error font-label-code text-label-code">{err}</span>}
        </div>
      )}
    </div>
  );
}

const Banner = ({ m }) => m && <div className={`p-space-sm rounded font-label-code text-label-code ${m.err ? 'bg-error-container text-on-error-container' : 'bg-surface-container-highest text-primary-container border border-primary-container/40'}`}>{m.text}</div>;

// ---------- site settings ----------
function SiteEditor() {
  const [v, setV] = useState(null); const [msg, setMsg] = useState(null); const [busy, setBusy] = useState(false);
  useEffect(() => { api('/site').then((d) => setV(d.site)).catch((e) => setMsg({ err: 1, text: e.message })); }, []);
  if (!v) return <Banner m={msg} /> || null;
  const save = async () => {
    setBusy(true); setMsg(null);
    try { await api('/settings', { method: 'PUT', body: v }); setMsg({ text: 'Saved. The public site is updated.' }); }
    catch (e) { setMsg({ err: 1, text: e.message }); } finally { setBusy(false); }
  };
  return (
    <div className="flex flex-col gap-space-lg">
      <h2 className="font-headline-lg text-headline-lg font-bold uppercase tracking-tight">Site & profile</h2>
      {SITE_GROUPS.map((g, i) => (
        <details key={g.group} open={i === 0} className="bg-surface-container border border-surface-container-highest rounded">
          <summary className="cursor-pointer p-space-md font-label-code text-label-code text-primary-container uppercase tracking-wider">{g.group}</summary>
          <div className="p-space-md pt-0 grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {g.fields.map(([k, t, l]) => (
              <div key={k} className={['area', 'list', 'image', 'file'].includes(t) ? 'md:col-span-2' : ''}>
                <Field type={t} label={l} value={v[k]} onChange={(x) => setV({ ...v, [k]: x })} />
              </div>
            ))}
          </div>
        </details>
      ))}
      <Banner m={msg} />
      <div><button className={btn} disabled={busy} onClick={save}>{busy ? 'SAVING...' : 'SAVE CHANGES'}</button></div>
    </div>
  );
}

// ---------- collections ----------
function ItemsEditor({ collection }) {
  const sc = ITEM_SCHEMAS[collection];
  const [items, setItems] = useState(null); const [edit, setEdit] = useState(null); const [msg, setMsg] = useState(null);
  const load = () => api('/site').then((d) => setItems(d[collection])).catch((e) => setMsg({ err: 1, text: e.message }));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      const { id, ...data } = edit;
      if (id) await api(`/items/${collection}/${id}`, { method: 'PUT', body: data });
      else await api(`/items/${collection}`, { method: 'POST', body: data });
      setEdit(null); setMsg({ text: 'Saved.' }); load();
    } catch (e) { setMsg({ err: 1, text: e.message }); }
  };
  const del = async (it) => {
    if (!confirm(`Delete "${it[sc.titleKey] || 'this item'}"?`)) return;
    try { await api(`/items/${collection}/${it.id}`, { method: 'DELETE' }); load(); } catch (e) { setMsg({ err: 1, text: e.message }); }
  };
  const move = async (i, dir) => {
    const a = [...items]; const j = i + dir; if (j < 0 || j >= a.length) return;
    [a[i], a[j]] = [a[j], a[i]]; setItems(a);
    try { await api(`/items/${collection}/reorder`, { method: 'POST', body: { ids: a.map((x) => x.id) } }); } catch (e) { setMsg({ err: 1, text: e.message }); load(); }
  };

  if (edit) return (
    <div className="flex flex-col gap-space-md">
      <h2 className="font-headline-lg text-headline-lg font-bold uppercase tracking-tight">{edit.id ? 'Edit' : 'Add'} — {sc.label}</h2>
      <div className="bg-surface-container border border-surface-container-highest rounded p-space-md grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {sc.fields.map(([k, t, l]) => (
          <div key={k} className={['area', 'list', 'media', 'image'].includes(t) ? 'md:col-span-2' : ''}>
            <Field type={t} label={l} value={edit[k]} onChange={(x) => setEdit({ ...edit, [k]: x })} />
          </div>
        ))}
      </div>
      <Banner m={msg} />
      <div className="flex gap-space-sm"><button className={btn} onClick={save}>SAVE</button><button className={btn2} onClick={() => { setEdit(null); setMsg(null); }}>CANCEL</button></div>
    </div>
  );

  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-lg text-headline-lg font-bold uppercase tracking-tight">{sc.label}</h2>
        <button className={btn} onClick={() => { setMsg(null); setEdit({}); }}><Mi name="add" className="text-base" />ADD NEW</button>
      </div>
      <Banner m={msg} />
      {!items && <span className="font-label-code text-on-surface-variant">LOADING...</span>}
      {items?.length === 0 && <div className="p-space-lg bg-surface-container border border-dashed border-surface-container-highest rounded text-on-surface-variant font-body-md">Nothing here yet. Use “Add new” to create the first one.</div>}
      {items?.map((it, i) => (
        <div key={it.id} className="flex items-center justify-between gap-space-md bg-surface-container border border-surface-container-highest rounded p-space-md">
          <div className="min-w-0">
            <div className="font-headline-md text-headline-md text-on-surface truncate">{it[sc.titleKey] || '(untitled)'}</div>
            <div className="font-label-code text-label-code text-on-surface-variant truncate">{it.period || it.code || it.role || it.issuer || ''}</div>
          </div>
          <div className="flex gap-space-xs shrink-0">
            <button className={btn2} onClick={() => move(i, -1)} title="Move up"><Mi name="arrow_upward" className="text-base" /></button>
            <button className={btn2} onClick={() => move(i, 1)} title="Move down"><Mi name="arrow_downward" className="text-base" /></button>
            <button className={btn2} onClick={() => { setMsg(null); setEdit(it); }}>EDIT</button>
            <button className={btn2} onClick={() => del(it)}><Mi name="delete" className="text-base text-error" /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Messages() {
  const [m, setM] = useState(null); const [err, setErr] = useState('');
  const load = () => api('/messages').then(setM).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);
  const del = async (id) => { if (confirm('Delete this message?')) { await api(`/messages/${id}`, { method: 'DELETE' }); load(); } };
  return (
    <div className="flex flex-col gap-space-md">
      <h2 className="font-headline-lg text-headline-lg font-bold uppercase tracking-tight">Messages</h2>
      {err && <Banner m={{ err: 1, text: err }} />}
      {m?.length === 0 && <div className="p-space-lg bg-surface-container border border-dashed border-surface-container-highest rounded text-on-surface-variant">No messages yet.</div>}
      {m?.map((x) => (
        <div key={x.id} className="bg-surface-container border border-surface-container-highest rounded p-space-md flex flex-col gap-space-xs">
          <div className="flex items-center justify-between gap-space-md">
            <div><span className="font-headline-md text-headline-md">{x.name}</span> <a className="font-label-code text-label-code text-primary-container" href={`mailto:${x.email}`}>{x.email}</a></div>
            <button className={btn2} onClick={() => del(x.id)}><Mi name="delete" className="text-base text-error" /></button>
          </div>
          <div className="font-label-code text-label-code text-on-surface-variant">{new Date(x.created_at).toLocaleString()} · {x.scope}</div>
          <p className="font-body-md text-on-surface-variant whitespace-pre-wrap">{x.message}</p>
        </div>
      ))}
    </div>
  );
}
