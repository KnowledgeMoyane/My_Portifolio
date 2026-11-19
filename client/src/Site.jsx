import React, { useEffect, useState } from 'react';
import { api } from './api';
import { Lines, Mi, SocialIcon, isVideo, parseSocials, embedUrl } from './ui';

const NAV = [['about', 'About'], ['projects', 'Projects'], ['skills', 'Skills'], ['experience', 'Experience'],
  ['leadership', 'Leadership'], ['certificates', 'Certificates'], ['contact', 'Contact']];

const SectionHead = ({ eyebrow, title, sub, right }) => (
  <div className={`flex flex-col ${right ? 'md:flex-row md:items-end justify-between gap-space-md pb-space-lg border-b border-surface-container-highest' : 'gap-space-xs'}`}>
    <div className="flex flex-col gap-space-xs">
      <span className="font-label-code text-label-code text-primary-container uppercase tracking-widest">{eyebrow}</span>
      <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface uppercase tracking-tight"><Lines text={title} /></h2>
      {sub && <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">{sub}</p>}
    </div>
    {right}
  </div>
);

export default function Site() {
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');
  const [active, setActive] = useState('about');
  const [now, setNow] = useState(new Date());

  useEffect(() => { api('/site').then(setD).catch((e) => setErr(e.message)); }, []);
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => {
    if (!d) return;
    const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' });
    NAV.forEach(([id]) => { const el = document.getElementById(id); el && obs.observe(el); });
    return () => obs.disconnect();
  }, [d]);

  if (err) return <div className="p-margin font-label-code text-error">Could not load the site: {err}</div>;
  if (!d) return <div className="p-margin font-label-code text-on-surface-variant animate-pulse">LOADING...</div>;

  const s = d.site;
  document.title = s.full_name ? `${s.full_name} | Portfolio` : 'Portfolio';
  const socials = parseSocials(s.socials);
  const gh = socials.find((x) => x.type === 'github');
  const li = socials.find((x) => x.type === 'linkedin');
  const clock = now.toLocaleTimeString('en-GB', { timeZone: s.timezone || 'Africa/Johannesburg', hour12: false });
  const featured = d.projects.filter((p) => p.featured);
  const others = d.projects.filter((p) => !p.featured);

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-surface-container-highest">
        <div className="h-20 w-full px-margin-mobile md:px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            {s.photo_url && <img alt="Profile" className="w-8 h-8 rounded-full object-cover ring-1 ring-surface-container-highest" src={s.photo_url} />}
            <div className="flex flex-col">
              <span className="font-label-code text-label-code text-on-surface tracking-wider font-semibold uppercase">{s.short_name}</span>
              <span className="font-label-caps text-label-caps text-surface-tint tracking-widest uppercase flex items-center gap-space-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container inline-block animate-pulse"></span>{s.status_text}
              </span>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-space-lg">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} className={`font-label-caps text-label-caps uppercase tracking-wider transition-colors py-space-xs ${active === id
                ? "text-on-surface font-semibold relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary-container"
                : 'text-on-surface-variant hover:text-on-surface'}`}>{label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-space-md">
            <div className="hidden sm:flex items-center gap-space-sm">
              {gh && <a className="p-space-xs text-on-surface-variant hover:text-primary-container hover:bg-surface-container-high rounded transition-all" href={gh.url} rel="noreferrer" target="_blank"><Mi name="terminal" className="text-[1.25rem]" /></a>}
              {li && <a className="p-space-xs text-on-surface-variant hover:text-primary-container hover:bg-surface-container-high rounded transition-all" href={li.url} rel="noreferrer" target="_blank"><Mi name="share" className="text-[1.25rem]" /></a>}
            </div>
            <a href="#contact" className="inline-flex items-center gap-space-xs bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container font-label-code text-label-code font-semibold px-space-md py-space-sm rounded transition-all shadow-[0_0_12px_rgba(203,242,49,0.25)] hover:shadow-[0_0_16px_rgba(203,242,49,0.4)]">
              <span>{s.header_cta}</span><Mi name="arrow_outward" className="text-[1rem]" />
            </a>
          </div>
        </div>
      </header>

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full text-on-surface">

          {/* HERO */}
          <section className="relative w-full px-margin-mobile md:px-margin pt-space-xl pb-space-xl overflow-hidden bg-surface-container-lowest">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
            <div className="relative z-10 flex flex-col gap-space-xl">
              <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-md border-b border-surface-container-highest">
                <div className="inline-flex items-center gap-space-xs px-space-sm py-1 bg-surface-container-low rounded">
                  <span className="w-2 h-2 rounded-full bg-primary-container inline-block animate-ping"></span>
                  <span className="font-label-code text-label-code text-surface-tint uppercase tracking-wider">{s.hero_badge}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
                <div className="lg:col-span-7 flex flex-col gap-space-lg">
                  <div className="flex flex-col gap-space-sm">
                    <span className="font-label-code text-label-code text-on-surface-variant uppercase tracking-widest">{s.hero_eyebrow}</span>
                    <h1 className="font-display-hero text-headline-xl-mobile md:text-display-hero text-on-surface uppercase tracking-tighter leading-[0.92]">
                      {s.hero_1} <br />
                      <span className="text-primary-container bg-surface-container-high px-space-xs inline-block">{s.hero_highlight}</span><br />
                      {s.hero_3} <br />{s.hero_4}
                    </h1>
                  </div>
                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">{s.hero_intro}</p>
                  <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                    <a href="#projects" className="inline-flex items-center justify-center gap-space-sm px-space-lg py-space-sm bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container font-label-code text-label-code font-bold uppercase rounded shadow-[0_0_20px_rgba(203,242,49,0.3)] transition-all group">
                      <span>{s.explore_label}</span>
                      <Mi name="south_east" className="text-base group-hover:translate-x-1 group-hover:translate-y-0.5 transition-transform" />
                    </a>
                    {s.cv_url && (
                      <a href={s.cv_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-space-sm px-space-lg py-space-sm bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-code text-label-code font-semibold uppercase rounded transition-all">
                        <Mi name="download" className="text-base" /><span>{s.cv_label}</span>
                      </a>
                    )}
                    <div className="flex items-center gap-space-xs pl-space-xs">
                      {[gh, li].filter(Boolean).map((x) => (
                        <a key={x.type} href={x.url} target="_blank" rel="noreferrer" title={x.label} className="p-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary-container rounded transition-colors flex items-center justify-center"><SocialIcon type={x.type} /></a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 flex flex-col gap-space-md bg-surface-container-low p-space-md md:p-space-lg rounded border border-surface-container-highest relative overflow-hidden group">
                  <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-highest">
                    <div className="flex items-center gap-space-xs"><span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span></div>
                  </div>
                  <div className="relative w-full aspect-square rounded overflow-hidden border border-surface-container-highest bg-surface-container-lowest">
                    {s.photo_url && <img alt={s.full_name} className="w-full h-full object-cover grayscale-[15%] contrast-110 group-hover:scale-105 transition-transform duration-500" src={s.photo_url} />}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-80 pointer-events-none"></div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="font-label-code text-[11px] text-on-surface bg-surface-container-lowest/80 backdrop-blur-md px-2 py-0.5 rounded border border-surface-container-highest">{s.node_label}</span>
                      <span className="font-label-caps text-label-caps text-primary-container bg-surface-container-lowest/90 backdrop-blur-md px-2 py-0.5 rounded border border-primary-container/40 uppercase tracking-wider">{s.availability_badge}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-space-xs pt-space-xs">
                    <div className="flex items-baseline justify-between">
                      <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold uppercase tracking-tight">{s.full_name}</h2>
                      <span className="font-label-code text-label-code text-surface-tint">{s.age_label}</span>
                    </div>
                    <p className="font-label-code text-label-code text-primary-container font-semibold uppercase tracking-wider">{s.role_title}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{s.degree_line}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-space-xs pt-space-xs border-t border-surface-container-highest text-on-surface-variant font-label-code text-label-code">
                    <div className="flex items-center gap-1"><span className="text-primary-container">»</span><span>{s.focus_1}</span></div>
                    <div className="flex items-center gap-1 justify-end"><span className="text-surface-tint">»</span><span>{s.focus_2}</span></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-space-md border-t border-surface-container-highest">
                <a href="#about" className="inline-flex items-center gap-space-xs font-label-code text-label-code text-on-surface-variant hover:text-primary-container transition-colors uppercase tracking-widest">
                  <Mi name="arrow_downward" className="text-base animate-bounce" /><span>{s.scroll_label}</span>
                </a>
                <div className="flex items-center gap-space-md font-label-code text-label-code text-on-surface-variant">
                  <span>{s.academic_focus}</span><span className="hidden sm:inline">|</span><span className="hidden sm:inline">{s.graduation}</span>
                </div>
              </div>
            </div>
          </section>

          {/* ABOUT */}
          <section id="about" className="w-full px-margin-mobile md:px-margin py-space-xl bg-surface-container-low border-b border-surface-container-highest">
            <div className="flex flex-col gap-space-xl">
              <SectionHead eyebrow={s.about_eyebrow} title={s.about_title} />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                <div className="lg:col-span-7 flex flex-col justify-between gap-space-lg bg-surface-container p-space-xl rounded border border-surface-container-highest">
                  <div className="space-y-space-md">
                    <span className="font-label-caps text-label-caps text-surface-tint uppercase tracking-widest">{s.about_uni_label}</span>
                    <p className="font-headline-md text-headline-md text-on-surface font-normal leading-snug">
                      {s.about_lead_before} <span className="text-primary-container font-semibold">{s.about_lead_highlight}</span>{s.about_lead_after}
                    </p>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{s.about_body}</p>
                  </div>
                  {s.quote && (
                    <div className="p-space-md bg-surface-container-lowest border-l-2 border-primary-container rounded">
                      <p className="font-body-lg text-body-lg text-on-surface italic">"{s.quote}"</p>
                      <span className="font-label-code text-label-code text-on-surface-variant uppercase mt-1 block">{s.quote_author}</span>
                    </div>
                  )}
                </div>
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-space-md">
                  <div className="bg-surface-container p-space-lg rounded border border-surface-container-highest flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-highest">
                      <span className="font-label-caps text-label-caps text-on-surface-variant">{s.edu_label}</span>
                      <Mi name="school" className="text-primary-container" />
                    </div>
                    <div className="py-space-md">
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">{s.edu_title}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{s.edu_campus}</p>
                    </div>
                  </div>
                  <div className="bg-surface-container p-space-lg rounded border border-surface-container-highest flex flex-col justify-between gap-space-md">
                    <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-highest">
                      <span className="font-label-caps text-label-caps text-on-surface-variant">{s.network_label}</span>
                      <span className="font-label-code text-label-code text-surface-tint uppercase">{s.network_tag}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-xs pt-1">
                      {socials.map((x) => (
                        <a key={x.url} href={x.type === 'email' && !x.url.startsWith('mailto:') ? `mailto:${x.url}` : x.url} target="_blank" rel="noreferrer"
                          className="flex items-center gap-space-xs p-2 rounded bg-surface-container-lowest border border-surface-container-highest hover:border-primary-container/40 hover:bg-surface-container-high text-on-surface hover:text-primary-container transition-all group">
                          <SocialIcon type={x.type} className="w-4 h-4 fill-current text-primary-container group-hover:scale-105 transition-transform flex-shrink-0" />
                          <span className="font-label-code text-[11px] uppercase tracking-wider truncate">{x.label}</span>
                        </a>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-space-xs font-label-code text-label-code text-surface-tint border-t border-surface-container-highest">
                      <span className="text-[10px] uppercase text-on-surface-variant">{s.network_footer}</span>
                      <span className="text-primary-container text-[11px] font-semibold">{socials.length} ACTIVE CHANNELS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PROJECTS */}
          <section id="projects" className="w-full px-margin-mobile md:px-margin py-space-xl bg-surface">
            <div className="flex flex-col gap-space-xl">
              <SectionHead eyebrow={s.projects_eyebrow} title={s.projects_title} sub={s.projects_sub}
                right={<div className="flex items-center gap-space-sm font-label-code text-label-code">
                  <span className="px-space-sm py-1 bg-surface-container-highest rounded text-on-surface font-semibold">{s.projects_badge1}</span>
                  <span className="text-surface-tint">{s.projects_badge2}</span></div>} />
              {featured.map((p) => (
                <div key={p.id} className="bg-surface-container-low rounded border border-surface-container-highest overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-5 p-space-xl flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-surface-container-highest bg-surface-container">
                      <div className="flex flex-col gap-space-md">
                        <div className="flex items-center justify-between">
                          <span className="font-label-code text-label-code text-primary-container">{p.code}</span>
                          {p.status && <span className="px-space-xs py-0.5 bg-primary-container/10 text-primary-container font-label-caps text-label-caps rounded">{p.status}</span>}
                        </div>
                        <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold uppercase tracking-tight">{p.title}</h3>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">{p.subtitle}</p>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{p.description}</p>
                        <div className="flex flex-wrap gap-1.5 pt-space-xs">
                          {(p.tech || []).map((t) => <span key={t} className="px-2 py-1 bg-surface-container-highest text-on-surface text-label-code font-label-code rounded">{t}</span>)}
                        </div>
                      </div>
                      {p.link_url && (
                        <div className="pt-space-lg flex items-center justify-between border-t border-surface-container-highest mt-space-lg">
                          <a href={p.link_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-space-xs font-label-code text-label-code text-on-surface hover:text-primary-container uppercase font-semibold transition-colors">
                            <span>{p.link_label}</span><Mi name="arrow_outward" className="text-base" />
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="lg:col-span-7 p-space-lg md:p-space-xl bg-surface-container-lowest flex flex-col justify-between">
                      <Media p={p} />
                    </div>
                  </div>
                </div>
              ))}
              {others.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
                  {others.map((p) => (
                    <div key={p.id} className="bg-surface-container-low p-space-xl rounded border border-surface-container-highest flex flex-col justify-between gap-space-lg">
                      <div className="flex flex-col gap-space-md">
                        <div className="flex items-center justify-between">
                          <span className="font-label-code text-label-code text-primary-container">{p.code}</span>
                          <span className="font-label-caps text-label-caps text-on-surface-variant">{p.status}</span>
                        </div>
                        <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold uppercase tracking-tight">{p.title}</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{p.description}</p>
                        <div className="flex flex-wrap gap-1.5 pt-space-xs">
                          {(p.tech || []).map((t) => <span key={t} className="px-2 py-1 bg-surface-container text-on-surface text-label-code font-label-code rounded">{t}</span>)}
                        </div>
                      </div>
                      <Media p={p} compact />
                      {p.link_url && (
                        <div className="flex items-center justify-between pt-space-md border-t border-surface-container-highest">
                          <a href={p.link_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-space-xs font-label-code text-label-code text-on-surface hover:text-primary-container uppercase font-semibold transition-colors">
                            <span>{p.link_label}</span><Mi name="arrow_outward" className="text-base" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* SKILLS */}
          <section id="skills" className="w-full px-margin-mobile md:px-margin py-space-xl bg-surface-container-lowest border-y border-surface-container-highest">
            <div className="flex flex-col gap-space-xl">
              <SectionHead eyebrow={s.skills_eyebrow} title={s.skills_title} sub={s.skills_sub} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                {d.skills.map((c) => (
                  <div key={c.id} className="bg-surface-container-low p-space-lg rounded border border-surface-container-highest flex flex-col justify-between gap-space-md">
                    <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-highest">
                      <span className="font-label-code text-label-code text-primary-container">{c.title}</span>
                      <Mi name={c.icon || 'code'} className="text-base text-on-surface-variant" />
                    </div>
                    <div className="space-y-space-sm">
                      {(c.items || []).map((it) => (
                        <div key={it} className="flex items-center gap-space-xs font-label-code text-label-code py-1 text-on-surface">
                          <span className="text-primary-container font-semibold">»</span><span>{it}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* EXPERIENCE + LEADERSHIP */}
          <Timeline id="experience" bg="bg-surface" items={d.experience} head={{ eyebrow: s.experience_eyebrow, title: s.experience_title, sub: s.experience_sub }} />
          <Timeline id="leadership" bg="bg-surface-container-lowest border-t border-surface-container-highest" items={d.leadership} head={{ eyebrow: s.leadership_eyebrow, title: s.leadership_title, sub: s.leadership_sub }} />

          {/* CERTIFICATES */}
          <section id="certificates" className="w-full px-margin-mobile md:px-margin py-space-xl bg-surface border-t border-surface-container-highest">
            <div className="flex flex-col gap-space-xl">
              <SectionHead eyebrow={s.certificates_eyebrow} title={s.certificates_title} sub={s.certificates_sub}
                right={<div className="flex items-center gap-space-sm font-label-code text-label-code">
                  <span className="px-space-sm py-1 bg-surface-container-highest rounded text-on-surface font-semibold">{d.certificates.length} CREDENTIALS LOGGED</span>
                  <span className="text-surface-tint">VERIFIED</span></div>} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
                {d.certificates.map((c) => (
                  <div key={c.id} className="bg-surface-container-low p-space-xl rounded border border-surface-container-highest flex flex-col justify-between gap-space-lg group">
                    <div className="flex flex-col gap-space-md">
                      <div className="relative w-full aspect-video rounded overflow-hidden border border-surface-container-highest bg-surface-container-lowest group-hover:border-primary-container/40 transition-colors">
                        {c.image_url && <img alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={c.image_url} />}
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                          <span className="font-label-code text-[11px] text-on-surface bg-surface-container-lowest/90 backdrop-blur-md px-2 py-0.5 rounded border border-surface-container-highest">{c.cert_id}</span>
                          <span className="font-label-caps text-label-caps text-primary-container bg-surface-container-lowest/90 backdrop-blur-md px-2 py-0.5 rounded border border-primary-container/40 uppercase tracking-wider">{c.tag}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-space-xs">
                        <span className="font-label-code text-label-code text-primary-container font-semibold">{c.period}</span>
                        <span className="px-space-xs py-0.5 bg-primary-container/10 text-primary-container font-label-caps text-label-caps rounded border border-primary-container/40">{c.badge}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="font-headline-md text-headline-md text-on-surface font-bold uppercase tracking-tight">{c.title}</h3>
                        <span className="font-label-code text-label-code text-surface-tint">{c.issuer}</span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{c.description}</p>
                      <div className="flex flex-wrap gap-1.5 pt-space-xs">
                        {(c.tags || []).map((t) => <span key={t} className="px-2 py-1 bg-surface-container text-on-surface text-label-code font-label-code rounded">{t}</span>)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-space-md border-t border-surface-container-highest">
                      <div className="flex items-center gap-space-xs text-on-surface-variant font-label-code text-label-code">
                        <Mi name="verified" className="text-base text-primary-container" /><span>{c.footer}</span>
                      </div>
                      <span className="font-label-caps text-label-caps text-surface-tint uppercase">{c.auth_label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Contact s={s} />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-surface-container-lowest border-t border-surface-container-highest">
        <div className="w-full px-margin-mobile md:px-margin pt-space-xl pb-space-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-space-xl">
            <div className="lg:col-span-8 flex flex-col justify-between">
              <span className="font-label-code text-label-code text-surface-tint tracking-widest uppercase mb-space-sm">{s.footer_eyebrow}</span>
              <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface tracking-tight uppercase max-w-3xl">{s.footer_title}</h2>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-end gap-space-md border-t lg:border-t-0 lg:border-l border-surface-container-highest pt-space-lg lg:pt-0 lg:pl-space-xl">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">CONTACT NO:</span>
                <a className="font-headline-md text-headline-md text-on-surface hover:text-primary-container transition-colors" href={`tel:${(s.phone || '').replace(/\s/g, '')}`}>{s.phone}</a>
              </div>
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">GEOGRAPHIC BASE</span>
                <span className="font-body-md text-body-md text-on-surface">{s.geographic_base}</span>
              </div>
            </div>
          </div>
          <div className="border-t border-surface-container-highest pt-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
            <div className="flex flex-wrap items-center gap-space-md">
              <span className="font-label-code text-label-code text-on-surface-variant">{s.footer_left_1}</span>
              <span className="text-surface-container-highest">/</span>
              <span className="font-label-code text-label-code text-on-surface-variant">{s.footer_left_2}</span>
            </div>
            <div className="flex items-center gap-space-lg">
              <div className="flex items-center gap-space-xs font-label-code text-label-code text-on-surface-variant">
                <span className="w-2 h-2 rounded-full bg-primary-container"></span><span>LIVE // {clock}</span>
              </div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">{s.copyright}</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function Media({ p, compact }) {
  const url = p.media_url;
  const embed = embedUrl(url);
  return (
    <div className={`relative w-full ${compact ? 'aspect-video min-h-[200px]' : 'h-full min-h-[360px]'} bg-surface-container-lowest rounded overflow-hidden flex flex-col justify-between border border-surface-container-highest group`}>
      {url && (embed
        ? <iframe className="absolute inset-0 w-full h-full z-[5]" src={embed} title={p.title}
            allow="autoplay; accelerometer; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
        : isVideo(url)
          ? <video className="w-full h-full object-cover absolute inset-0 opacity-80 group-hover:opacity-95 transition-opacity duration-300" src={url} autoPlay loop muted playsInline controls />
          : <img alt={p.title} className="w-full h-full object-cover absolute inset-0 opacity-80 group-hover:opacity-95 transition-opacity duration-300" src={url} />)}
      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-surface-container-lowest/70 pointer-events-none"></div>
      <div className="relative z-10 flex items-center justify-between p-space-md border-b border-surface-container-highest/60 bg-surface-container-lowest/60 backdrop-blur-md pointer-events-none">
        <div className="flex items-center gap-space-xs min-w-0">
          <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
          <span className="font-label-code text-label-code text-primary-container uppercase tracking-wider font-semibold">{(embed || isVideo(url)) ? (compact ? 'LIVE // DEMO REEL' : 'REC // PROD DEMO') : 'PREVIEW'}</span>
          <span className="text-surface-container-highest font-label-code">/</span>
          <span className="font-label-code text-label-code text-on-surface truncate">{p.media_caption || p.title}</span>
        </div>
      </div>
      {!url && <div className="relative z-10 flex items-center justify-center my-auto text-on-surface-variant"><Mi name="image" className="text-[2rem]" /></div>}
      <div></div>
    </div>
  );
}

function Timeline({ id, bg, items, head }) {
  return (
    <section id={id} className={`w-full px-margin-mobile md:px-margin py-space-xl ${bg}`}>
      <div className="flex flex-col gap-space-xl">
        <SectionHead eyebrow={head.eyebrow} title={head.title} sub={head.sub} />
        <div className="flex flex-col space-y-0">
          {items.map((e, i) => (
            <div key={e.id} className={`py-space-lg ${i < items.length - 1 ? 'border-b border-surface-container-highest' : ''} hover:bg-surface-container-low transition-colors px-space-sm rounded`}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-start">
                <div className="md:col-span-3 flex flex-col">
                  <span className={`font-label-code text-label-code ${e.active ? 'text-primary-container font-semibold' : 'text-on-surface-variant'}`}>{e.period}</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-1">{e.role}</span>
                </div>
                <div className="md:col-span-6 flex flex-col gap-space-xs">
                  <div className="flex flex-col">
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">{e.org}</h3>
                    <span className="font-label-code text-label-code text-surface-tint">{e.location}</span>
                  </div>
                  <ul className="font-body-md text-body-md text-on-surface-variant space-y-1 pt-space-xs list-none">
                    {(e.bullets || []).map((b) => (
                      <li key={b} className="flex items-start gap-space-xs"><span className="text-primary-container mt-1">»</span><span>{b}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-3 flex md:justify-end">
                  {e.badge && <span className={`px-space-sm py-1 font-label-code text-label-code rounded ${e.active ? 'bg-surface-container-high text-primary-container font-semibold border border-primary-container/40' : 'bg-surface-container text-on-surface-variant border border-surface-container-highest'}`}>{e.badge}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ s }) {
  const [f, setF] = useState({ name: '', email: '', scope: (s.scope_options || [])[0] || '', message: '' });
  const [state, setState] = useState('idle');
  const [err, setErr] = useState('');
  const inp = 'bg-surface-container-lowest text-on-surface border border-surface-container-highest focus:border-primary-container focus:outline-none p-space-sm rounded font-body-md text-body-md transition-colors placeholder:text-on-surface-variant/40';
  const lab = 'font-label-code text-label-code text-on-surface-variant uppercase';
  const send = async (e) => {
    e.preventDefault(); setState('sending'); setErr('');
    try { await api('/messages', { method: 'POST', body: f }); setState('done'); setF({ ...f, name: '', email: '', message: '' }); }
    catch (x) { setErr(x.message); setState('error'); }
  };
  return (
    <section id="contact" className="w-full px-margin-mobile md:px-margin py-space-xl bg-surface-container-low border-t border-surface-container-highest">
      <div className="flex flex-col gap-space-xl">
        <SectionHead eyebrow={s.contact_eyebrow} title={s.contact_title} sub={s.contact_sub} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-7 bg-surface-container p-space-xl rounded border border-surface-container-highest">
            <form className="flex flex-col gap-space-md" onSubmit={send}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-space-xs"><label className={lab}>01 // CALLSIGN / YOUR NAME *</label>
                  <input className={inp} required placeholder="e.g. Alex Ndlovu" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
                <div className="flex flex-col gap-space-xs"><label className={lab}>02 // RETURN TRANSMISSION / EMAIL *</label>
                  <input className={inp} required type="email" placeholder="alex@domain.co.za" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
              </div>
              <div className="flex flex-col gap-space-xs"><label className={lab}>03 // ENGAGEMENT SCOPE</label>
                <select className={inp} value={f.scope} onChange={(e) => setF({ ...f, scope: e.target.value })}>
                  {(s.scope_options || []).map((o) => <option key={o}>{o}</option>)}
                </select></div>
              <div className="flex flex-col gap-space-xs"><label className={lab}>04 // DISPATCH PAYLOAD / MESSAGE *</label>
                <textarea className={inp} required rows={4} placeholder="Outline specifications, stack requirements, or role synopsis..." value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></div>
              {state === 'done' && <div className="p-space-sm bg-surface-container-highest text-primary-container font-label-code text-label-code rounded border border-primary-container/40">{s.success_message}</div>}
              {state === 'error' && <div className="p-space-sm bg-error-container text-on-error-container font-label-code text-label-code rounded">{err}</div>}
              <div className="flex items-center justify-between pt-space-xs">
                <button disabled={state === 'sending'} type="submit" className="inline-flex items-center justify-center gap-space-sm px-space-lg py-space-sm bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container font-label-code text-label-code font-bold uppercase rounded transition-all shadow-[0_0_16px_rgba(203,242,49,0.25)] disabled:opacity-60">
                  <span>{state === 'sending' ? 'SENDING...' : 'SEND DIRECT DISPATCH'}</span><Mi name="send" className="text-base" />
                </button>
                <span className="font-label-code text-label-code text-on-surface-variant">256-BIT ENCRYPTED</span>
              </div>
            </form>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-between gap-space-lg">
            <div className="bg-surface-container p-space-xl rounded border border-surface-container-highest flex flex-col gap-space-md">
              <span className="font-label-caps text-label-caps text-surface-tint uppercase tracking-widest">{s.contact_eyebrow}</span>
              <div className="space-y-space-sm">
                <div><span className="font-label-code text-label-code text-on-surface-variant uppercase block">COORDINATES</span>
                  <p className="font-headline-md text-headline-md text-on-surface font-semibold">{s.location_name}</p>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{s.coordinates}</span></div>
                <div className="pt-space-xs border-t border-surface-container-highest"><span className="font-label-code text-label-code text-on-surface-variant uppercase block">DIRECT EMAIL</span>
                  <a className="font-headline-md text-headline-md text-primary-container hover:underline break-all" href={`mailto:${s.email}`}>{s.email}</a></div>
                <div className="pt-space-xs border-t border-surface-container-highest"><span className="font-label-code text-label-code text-on-surface-variant uppercase block">TIMEZONE</span>
                  <p className="font-body-md text-body-md text-on-surface">{s.timezone_text}</p></div>
              </div>
            </div>
            <div className="bg-surface-container p-space-md rounded border border-surface-container-highest flex items-center justify-between">
              <div className="flex items-center gap-space-sm"><span className="w-3 h-3 rounded-full bg-primary-container animate-pulse"></span>
                <span className="font-label-code text-label-code text-on-surface">{s.open_status}</span></div>
              {parseSocials(s.socials).find((x) => x.type === 'linkedin') && (
                <a className="font-label-code text-label-code text-surface-tint hover:underline uppercase" href={parseSocials(s.socials).find((x) => x.type === 'linkedin').url} rel="noreferrer" target="_blank">CONNECT VIA LINKEDIN →</a>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
