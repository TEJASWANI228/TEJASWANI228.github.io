import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Activity, Code2, ExternalLink, Github, Linkedin, Mail, Menu, X, Sparkles, Terminal, GitFork, Star, CalendarDays, ChevronRight } from 'lucide-react';
import { profile, projects, knowledgeNodes, milestones, focusAreas } from './data';
import './styles.css';

const filters = ['All areas', 'AI / ML', 'Languages', 'Backend & Web', 'Core CS'];
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
  const links = [['About', '#about'], ['Knowledge', '#work'], ['GitHub', '#github'], ['Milestones', '#milestones']];
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
      <p className="hero-intro">I’m {profile.name.split(' ')[0]}, an AIML student exploring intelligent systems and building strong computer science foundations.</p>
      <div className="hero-actions"><a className="button button-primary" href="#work">Explore my knowledge <ArrowDownRight size={17} /></a><a className="text-link" href={profile.resume} target="_blank" rel="noreferrer">View resume <ArrowUpRight size={15} /></a></div>
      <div className="hero-footnote"><span className="eyebrow">KNOWLEDGE & INTERESTS</span><span>AI / ML <i>·</i> Python & Java <i>·</i> Backend & DSA</span></div>
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
    <SectionHeading index="01" label="A LITTLE ABOUT ME" title="Curious by nature." accent="Driven to learn." />
    <div className="about-layout"><p className="about-statement reveal">I like understanding how things work — then turning that knowledge into <span>thoughtful solutions.</span></p>
      <div className="about-details reveal"><p>{profile.intro}</p><p>My current focus is deepening my knowledge across machine learning, backend systems, and core computer science fundamentals.</p><div className="focus-list">{focusAreas.map((item, i) => <div className="focus-item" key={item}><span>0{i + 1}</span><span>{item}</span><ArrowUpRight size={14} /></div>)}</div></div>
    </div>
    <div className="about-bottom reveal"><span className="eyebrow">MY APPROACH</span><p>Stay curious. Learn deeply. Make the fundamentals count.</p><Sparkles size={17} /></div>
  </div></section>;
}

function ProjectModal({ project, onClose }) {
  useEffect(() => { if (!project) return; const old = document.body.style.overflow; document.body.style.overflow = 'hidden'; const onKey = (e) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', onKey); return () => { document.body.style.overflow = old; window.removeEventListener('keydown', onKey); }; }, [project, onClose]);
  if (!project) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={onClose} aria-label="Close details"><X /></button><div className="modal-kicker">KNOWLEDGE NODE / {project.number}</div><h2 id="modal-title">{project.title}<span className="period">.</span></h2><p className="modal-type">{project.type}</p><p className="modal-detail">{project.detail}</p><div className="stack-list">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div></div></div>;
}

function Work() {
  const [filter, setFilter] = useState('All areas');
  const [activeId, setActiveId] = useState(knowledgeNodes[0].id);
  const [modalNode, setModalNode] = useState(null);

  const visibleNodes = useMemo(
    () => filter === 'All areas' ? knowledgeNodes : knowledgeNodes.filter((n) => n.category === filter),
    [filter]
  );

  useEffect(() => {
    if (!visibleNodes.some((n) => n.id === activeId) && visibleNodes.length > 0) {
      setActiveId(visibleNodes[0].id);
    }
  }, [visibleNodes, activeId]);

  const activeNode = useMemo(
    () => knowledgeNodes.find((n) => n.id === activeId) || knowledgeNodes[0],
    [activeId]
  );

  const edges = useMemo(() => {
    const list = [];
    const seen = new Set();
    knowledgeNodes.forEach((node) => {
      (node.connections || []).forEach((targetId) => {
        const key = [node.id, targetId].sort().join('--');
        if (!seen.has(key)) {
          const target = knowledgeNodes.find((n) => n.id === targetId);
          if (target) {
            seen.add(key);
            list.push({
              key,
              from: node,
              to: target,
              isActive: node.id === activeNode.id || target.id === activeNode.id,
            });
          }
        }
      });
    });
    return list;
  }, [activeNode]);

  const cycleNext = () => {
    const idx = visibleNodes.findIndex((n) => n.id === activeNode.id);
    const next = visibleNodes[(idx + 1) % visibleNodes.length] || knowledgeNodes[0];
    setActiveId(next.id);
  };

  const tiltX = ((50 - activeNode.y) / 50) * 7;
  const tiltY = ((activeNode.x - 50) / 50) * 9;

  return <section className="section work-section" id="work"><div className="section-inner">
    <SectionHeading index="02" label="INTERESTS & KNOWLEDGE GRAPH" title="Click any circle to" accent="explore." />
    <div className="work-intro reveal">
      <p>Interactive knowledge constellation — click any glowing node in the graph to move across what I know and study.<br /><span>Artificial Intelligence · Python · Supervised Learning · Java · DSA · C++ · Node.js · SQL · Graph Analytics</span></p>
      <div className="project-filters" role="group" aria-label="Filter knowledge areas">
        {filters.map((item) => <button key={item} className={filter === item ? 'filter-active' : ''} onClick={() => setFilter(item)}>{item}</button>)}
      </div>
    </div>

    <article className="project-card project-featured constellation-card is-visible">
      <div
        className="project-visual visual-trace constellation-stage"
        style={{
          '--focus-x': `${activeNode.x}%`,
          '--focus-y': `${activeNode.y}%`,
          '--grid-tilt-x': `${13 + tiltX}deg`,
          '--grid-tilt-y': `${tiltY}deg`,
        }}
      >
        <div className="trace-grid constellation-grid" />
        <div className="constellation-spotlight" />

        <svg className="constellation-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {edges.map((edge) => (
            <line
              key={edge.key}
              x1={edge.from.x}
              y1={edge.from.y}
              x2={edge.to.x}
              y2={edge.to.y}
              className={`constellation-line ${edge.isActive ? 'line-active' : ''}`}
            />
          ))}
        </svg>

        <div
          className="constellation-tracker"
          style={{ left: `${activeNode.x}%`, top: `${activeNode.y}%` }}
          aria-hidden="true"
        >
          <span className="tracker-ring ring-outer" />
          <span className="tracker-ring ring-inner" />
        </div>

        {knowledgeNodes.map((node) => {
          const isSelected = node.id === activeNode.id;
          const isConnected = (activeNode.connections || []).includes(node.id);
          const isFilteredOut = filter !== 'All areas' && node.category !== filter;
          return (
            <button
              key={node.id}
              type="button"
              className={`constellation-node ${isSelected ? 'is-selected' : ''} ${isConnected ? 'is-connected' : ''} ${isFilteredOut ? 'is-dimmed' : ''}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => setActiveId(node.id)}
              aria-pressed={isSelected}
              aria-label={`Select ${node.label}`}
            >
              <span className="node-dot" />
              <span className="node-caption">{node.label}</span>
            </button>
          );
        })}

        <div className="trace-label constellation-status">
          CLICK A CIRCLE TO MOVE <i>·</i> ACTIVE: {activeNode.label.toUpperCase()}
        </div>
        <span className="visual-number">{activeNode.number} / 0{knowledgeNodes.length}</span>
      </div>

      <div className="project-card-content constellation-details">
        <div className="project-meta">
          <span>{activeNode.type}</span>
          <span>NODE {activeNode.number}</span>
        </div>
        <div className="project-title-row">
          <h3>{activeNode.title}</h3>
          <div className="constellation-actions">
            <button type="button" className="node-step-btn" onClick={cycleNext} title="Move to next circle">
              Next circle <ArrowRight size={14} />
            </button>
            <button
              type="button"
              className="round-arrow"
              onClick={() => setModalNode(activeNode)}
              aria-label={`Open full details for ${activeNode.title}`}
              title="Read full details"
            >
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
        <p className="constellation-desc">{activeNode.description}</p>
        <p className="constellation-subdetail">{activeNode.detail}</p>
        <div className="project-tags">
          {activeNode.stack.map((tag) => <span key={tag}>{tag}</span>)}
        </div>

        <div className="constellation-pills" role="tablist" aria-label="Quick select knowledge node">
          {knowledgeNodes.map((node) => (
            <button
              key={node.id}
              type="button"
              className={`node-pill ${node.id === activeNode.id ? 'pill-active' : ''}`}
              onClick={() => setActiveId(node.id)}
            >
              <span className="pill-num">{node.number}</span>
              <span>{node.label}</span>
            </button>
          ))}
        </div>
      </div>
    </article>

    <div className="work-note reveal"><span className="note-star">✳</span><p><strong>Selected Projects:</strong> Kept intentionally empty for now ({projects.length} listed) while new builds are in progress. Explore my code and learning repositories on GitHub.</p><a href={isConfigured(profile.github) ? `https://github.com/${profile.github}?tab=repositories` : '#github'}>Explore GitHub <ArrowRight size={15}/></a></div>
    <ProjectModal project={modalNode} onClose={() => setModalNode(null)} />
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
