import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Activity, Code2, ExternalLink, Github, Linkedin, Mail, Menu, X, Sparkles, Terminal, GitFork, Star, CalendarDays, ChevronRight } from 'lucide-react';
import { profile, projects, milestones, focusAreas } from './data';
import './styles.css';

const filters = ['All work', 'AI / ML', 'Web development'];
const isConfigured = (value = '') => value && !value.includes('YOUR_');
const shortDate = (value) => value ? new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { nodes.forEach((node) => node.classList.add('is-visible')); return; }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [['About', '#about'], ['Work', '#work'], ['GitHub', '#github'], ['Milestones', '#milestones']];
  return <header className="site-header">
    <a className="brand" href="#top" aria-label="Back to top"><span className="brand-mark">TY</span><span className="brand-name">TEJASWANI YADAV<span className="brand-dot">.</span></span></a>
    <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
      {links.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
      <a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>Let’s talk <ArrowUpRight size={14} /></a>
    </nav>
    <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
  </header>;
}

function Hero() {
  const orbRef = useRef(null);
  const onPointerMove = (event) => {
    if (!orbRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    orbRef.current.style.setProperty('--tilt-x', `${-y * 9}deg`);
    orbRef.current.style.setProperty('--tilt-y', `${x * 12}deg`);
  };
  const reset = () => { if (orbRef.current) { orbRef.current.style.setProperty('--tilt-x', '0deg'); orbRef.current.style.setProperty('--tilt-y', '0deg'); } };
  return <section className="hero" id="top" onPointerMove={onPointerMove} onPointerLeave={reset}>
    <div className="hero-grid" aria-hidden="true" />
    <div className="hero-copy">
      <div className="eyebrow hero-eyebrow"><span className="status-dot" /> AVAILABLE FOR COLLABORATION <span className="eyebrow-divider">/</span> INDIA</div>
      <h1>Building at the<br />intersection of <span className="gradient-text">AI</span><br />and software<span className="period">.</span></h1>
      <p className="hero-intro">I’m {profile.name.split(' ')[0]}, an AIML student exploring intelligent systems and building useful digital experiences.</p>
      <div className="hero-actions"><a className="button button-primary" href="#work">Explore my work <ArrowDownRight size={17} /></a><a className="text-link" href={profile.resume} target="_blank" rel="noreferrer">View resume <ArrowUpRight size={15} /></a></div>
      <div className="hero-footnote"><span className="eyebrow">CURRENTLY EXPLORING</span><span>AI systems <i>·</i> Backend <i>·</i> DSA</span></div>
    </div>
    <div className="hero-art" aria-label="Abstract glowing blue and violet 3D form" role="img">
      <div className="orb-stage" ref={orbRef}>
        <div className="orb-halo halo-one" /><div className="orb-halo halo-two" />
        <div className="orb-core"><div className="orb-sheen" /><div className="orb-ridge ridge-one" /><div className="orb-ridge ridge-two" /><div className="orb-glint" /></div>
        <div className="orbit orbit-a"><span /></div><div className="orbit orbit-b"><span /></div>
        <span className="orb-label orb-label-top">FIG. 01 <i>—</i> CURIOSITY</span><span className="orb-label orb-label-bottom">LEARNING IN MOTION <ArrowUpRight size={12} /></span>
      </div>
      <div className="hero-coordinate">23°15′N&nbsp; / &nbsp;77°24′E<br /><span>MADE WITH INTENTION</span></div>
    </div>
    <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><span className="scroll-line"><i /></span></a>
    <span className="hero-index">PORTFOLIO / 2026</span>
  </section>;
}

function SectionHeading({ index, label, title, accent }) {
  return <div className="section-heading reveal"><div className="section-kicker"><span>{index}</span><span className="kicker-line" /><span>{label}</span></div><h2>{title}{accent && <> <span className="gradient-text">{accent}</span></>}</h2></div>;
}

function About() {
  return <section className="section about-section" id="about"><div className="section-inner">
    <SectionHeading index="01" label="A LITTLE ABOUT ME" title="Curious by nature." accent="Driven to build." />
    <div className="about-layout"><p className="about-statement reveal">I like understanding how things work — then turning that understanding into <span>something useful.</span></p>
      <div className="about-details reveal"><p>{profile.intro}</p><p>My current focus is strengthening my computer science fundamentals while learning to build software that is practical, clear, and thoughtfully designed.</p><div className="focus-list">{focusAreas.map((item, i) => <div className="focus-item" key={item}><span>0{i + 1}</span><span>{item}</span><ArrowUpRight size={14} /></div>)}</div></div>
    </div>
    <div className="about-bottom reveal"><span className="eyebrow">MY APPROACH</span><p>Stay curious. Build consistently. Make the details matter.</p><Sparkles size={17} /></div>
  </div></section>;
}

function ProjectVisual({ project }) {
  return <div className={`project-visual ${project.visual}`} aria-hidden="true">
    {project.visual === 'visual-health' && <><div className="health-ring ring-1"/><div className="health-ring ring-2"/><div className="health-cross">+</div><div className="visual-caption">CARE / CONNECTED</div></>}
    {project.visual === 'visual-trace' && <><div className="trace-grid"/><div className="trace-node node-1"/><div className="trace-node node-2"/><div className="trace-node node-3"/><div className="trace-link link-1"/><div className="trace-link link-2"/><div className="trace-label">SIGNAL → PATTERN → INSIGHT</div></>}
    {project.visual === 'visual-travel' && <><div className="travel-sun"/><div className="travel-hill hill-1"/><div className="travel-hill hill-2"/><div className="travel-path"/><div className="visual-caption">COLLECT MOMENTS</div></>}
    <span className="visual-number">{project.number}</span>
  </div>;
}

function ProjectModal({ project, onClose }) {
  useEffect(() => { if (!project) return; const old = document.body.style.overflow; document.body.style.overflow = 'hidden'; const onKey = (e) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', onKey); return () => { document.body.style.overflow = old; window.removeEventListener('keydown', onKey); }; }, [project, onClose]);
  if (!project) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={onClose} aria-label="Close project details"><X /></button><div className="modal-kicker">PROJECT / {project.number}</div><h2 id="modal-title">{project.title}<span className="period">.</span></h2><p className="modal-type">{project.type}</p><p className="modal-detail">{project.detail}</p><div className="stack-list">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="modal-actions">{project.repo ? <a className="button button-primary" href={project.repo} target="_blank" rel="noreferrer">View repository <Github size={16}/></a> : <span className="muted-note">Repository link not configured yet</span>}{project.demo && <a className="text-link" href={project.demo} target="_blank" rel="noreferrer">Live demo <ExternalLink size={14}/></a>}</div></div></div>;
}

function Work() {
  const [filter, setFilter] = useState('All work');
  const [selected, setSelected] = useState(null);
  const filtered = useMemo(() => filter === 'All work' ? projects : projects.filter((p) => p.category === filter), [filter]);
  useEffect(() => {
    const nodes = document.querySelectorAll('.project-card.reveal');
    nodes.forEach((node) => node.classList.add('is-visible'));
  }, [filter]);
  return <section className="section work-section" id="work"><div className="section-inner">
    <SectionHeading index="02" label="SELECTED WORK" title="Ideas, meet" accent="execution." />
    <div className="work-intro reveal"><p>A few things I’ve explored, designed, or built.<br /><span>More experiments are always in progress.</span></p><div className="project-filters" role="group" aria-label="Filter projects">{filters.map((item) => <button key={item} className={filter === item ? 'filter-active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
    <div className="project-grid">{filtered.map((project, index) => <article className={`project-card reveal ${index === 0 ? 'project-featured' : ''}`} key={project.id} style={{'--reveal-delay': `${index * 90}ms`}}>
      <button className="project-card-button" onClick={() => setSelected(project)} aria-label={`Open details for ${project.title}`}><ProjectVisual project={project}/><div className="project-card-content"><div className="project-meta"><span>{project.type}</span><span>{project.number}</span></div><div className="project-title-row"><h3>{project.title}</h3><span className="round-arrow"><ArrowUpRight size={18}/></span></div><p>{project.description}</p><div className="project-tags">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div></div></button>
    </article>)}</div>
    <div className="work-note reveal"><span className="note-star">✳</span><p>Every project is a chance to learn something new. The details and links here are editable in <code>src/data.js</code>.</p><a href={isConfigured(profile.github) ? `https://github.com/${profile.github}?tab=repositories` : '#github'}>{isConfigured(profile.github) ? 'Browse all repositories' : 'Explore GitHub'} <ArrowRight size={15}/></a></div>
    <ProjectModal project={selected} onClose={() => setSelected(null)} />
  </div></section>;
}

function GithubSection() {
  const [data, setData] = useState({ status: 'idle', user: null, repos: [], events: [], error: '' });
  const username = profile.github;
  useEffect(() => {
    if (!isConfigured(username)) { setData((old) => ({ ...old, status: 'unconfigured' })); return; }
    const controller = new AbortController();
    const get = async (url) => { const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } }); if (!response.ok) throw new Error(response.status === 403 ? 'GitHub rate limit reached. Try again in a little while.' : `GitHub returned ${response.status}. Check the username and try again.`); return response.json(); };
    setData((old) => ({ ...old, status: 'loading', error: '' }));
    Promise.all([get(`https://api.github.com/users/${encodeURIComponent(username)}`), get(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6&type=owner`), get(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=6`)]).then(([user, repos, events]) => setData({ status: 'ready', user, repos, events, error: '' })).catch((error) => { if (error.name !== 'AbortError') setData((old) => ({ ...old, status: 'error', error: error.message })); });
    return () => controller.abort();
  }, [username]);
  const refresh = () => { setData({ status: 'idle', user: null, repos: [], events: [], error: '' }); if (isConfigured(username)) { const url = `https://api.github.com/users/${encodeURIComponent(username)}`; fetch(url).then(r => { if (!r.ok) throw new Error('Could not refresh GitHub profile.'); return r.json(); }).then(user => setData(old => ({...old, status: 'loading', user}))).catch(() => setData(old => ({...old, status: 'error', error: 'Could not refresh GitHub profile.'}))); } };
  return <section className="section github-section" id="github"><div className="section-inner">
    <SectionHeading index="03" label="OPEN SOURCE / IN PUBLIC" title="A work in" accent="progress." />
    <div className="github-topline reveal"><p>Development is a process, not a highlight reel.<br /><span>Here’s what’s happening on GitHub.</span></p><a className="text-link" href={isConfigured(username) ? `https://github.com/${username}` : 'https://github.com/'} target="_blank" rel="noreferrer">Open GitHub <ArrowUpRight size={15}/></a></div>
    {!isConfigured(username) ? <div className="github-setup reveal"><div className="setup-icon"><Github size={23}/></div><div><span className="eyebrow">CONNECT YOUR PROFILE</span><h3>Your GitHub activity will appear here.</h3><p>Set your username in <code>src/data.js</code>. This section will then load public repositories, stars, forks, and recent public events directly from GitHub.</p></div><div className="setup-status"><span className="status-dot status-muted"/> WAITING FOR USERNAME</div></div> : <>
      <div className="github-stats reveal">{[{label:'PUBLIC REPOSITORIES',value:data.status === 'ready' ? data.user.public_repos : '—',icon:<Code2/>},{label:'FOLLOWERS',value:data.status === 'ready' ? data.user.followers : '—',icon:<Activity/>},{label:'FOLLOWING',value:data.status === 'ready' ? data.user.following : '—',icon:<Github/>}].map((stat) => <div className="stat-card" key={stat.label}><div className="stat-icon">{stat.icon}</div><span className="eyebrow">{stat.label}</span><strong>{stat.value}</strong></div>)}</div>
      {data.status === 'loading' && <div className="github-state"><span className="loading-pulse"/> Loading public GitHub activity…</div>}
      {data.status === 'error' && <div className="github-state error-state"><p>{data.error}</p><button className="text-link" onClick={() => window.location.reload()}>Try again <ArrowRight size={14}/></button></div>}
      {data.status === 'ready' && <><div className="github-content"><div className="repo-column"><div className="subsection-heading"><span className="eyebrow">RECENTLY UPDATED REPOSITORIES</span><span>{data.repos.length} SHOWN</span></div>{data.repos.length ? data.repos.map(repo => <a className="repo-row" key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer"><div className="repo-main"><Github size={16}/><div><h4>{repo.name}</h4><p>{repo.description || 'No description added yet.'}</p><div className="repo-meta">{repo.language && <span><i className="language-dot"/> {repo.language}</span>}<span><Star size={12}/> {repo.stargazers_count}</span><span><GitFork size={12}/> {repo.forks_count}</span></div></div></div><ArrowUpRight size={15}/></a>) : <p className="empty-state">No public repositories were returned.</p>}</div><div className="events-column"><div className="subsection-heading"><span className="eyebrow">RECENT PUBLIC EVENTS</span><span>LIVE DATA</span></div>{data.events.length ? data.events.slice(0, 5).map(event => <div className="event-row" key={event.id}><span className="event-line"/><div><span className="event-type">{event.type.replace('Event', '').replace(/([A-Z])/g, ' $1').trim()}</span><a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noreferrer">{event.repo.name}</a><span className="event-date"><CalendarDays size={11}/> {shortDate(event.created_at)}</span></div></div>) : <p className="empty-state">No recent public events available.</p>}</div></div><p className="github-footnote"><span className="status-dot"/> Live public data from the GitHub API <span>·</span> Subject to GitHub API limits</p></>}
    </>}
  </div></section>;
}

function Milestones() {
  return <section className="section milestones-section" id="milestones"><div className="section-inner"><SectionHeading index="04" label="MILESTONES" title="Progress over" accent="perfection."/><div className="milestone-layout"><p className="milestone-aside reveal">Small steps add up.<br /><span>A snapshot of the journey so far.</span></p><div className="timeline">{milestones.map((item, i) => <article className="timeline-item reveal" key={item.label} style={{'--reveal-delay': `${i * 100}ms`}}><div className="timeline-marker"><span/></div><div className="timeline-year">{item.year}</div><div className="timeline-content"><h3>{item.label}</h3><p>{item.description}</p></div><ChevronRight size={16} className="timeline-chevron"/></article>)}</div></div></div></section>;
}

function Contact() {
  const emailReady = isConfigured(profile.email) && profile.email.includes('@');
  return <footer className="contact-section" id="contact"><div className="contact-glow"/><div className="section-inner contact-inner"><div className="section-kicker reveal"><span>05</span><span className="kicker-line"/><span>WHAT'S NEXT?</span></div><div className="contact-main reveal"><h2>Have something<br />interesting to <span className="gradient-text">build?</span></h2><p>I’m always interested in learning, collaborating, and making useful things with thoughtful people.</p><a className="button button-primary contact-cta" href={emailReady ? `mailto:${profile.email}` : 'mailto:?subject=Let%27s%20build%20something'}>Let’s make it happen <ArrowUpRight size={17}/></a></div><div className="contact-bottom"><a className="brand footer-brand" href="#top"><span className="brand-mark">TY</span><span className="brand-name">TEJASWANI YADAV<span className="brand-dot">.</span></span></a><div className="social-links"><a href={isConfigured(profile.github) ? `https://github.com/${profile.github}` : 'https://github.com/'} target="_blank" rel="noreferrer"><Github size={15}/> GitHub <ArrowUpRight size={12}/></a><a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={15}/> LinkedIn <ArrowUpRight size={12}/></a><a href={emailReady ? `mailto:${profile.email}` : 'mailto:?subject=Hello'}><Mail size={15}/> Email <ArrowUpRight size={12}/></a></div><span className="copyright">© {new Date().getFullYear()} · MADE WITH CURIOSITY</span></div></div></footer>;
}

function App() {
  useReveal();
  return <><div className="ambient ambient-one"/><div className="ambient ambient-two"/><Header/><main><Hero/><About/><Work/><GithubSection/><Milestones/><Contact/></main><a href="#top" className="back-top" aria-label="Back to top"><ArrowDown size={15}/></a></>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
