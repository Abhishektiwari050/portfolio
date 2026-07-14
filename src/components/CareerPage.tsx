import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profile, timeline, skillGroups, projects, vistarMetrics } from '../data/resume';
import { AsciiSunsetCanvas } from './AsciiSunsetCanvas';

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = ['IDENTITY', 'EXPERIENCE', 'SKILLS', 'PROJECTS', 'CONNECT'];

// ─── Helper Components ────────────────────────────────────────────────────────
function Tag({ children }: { children: React.ReactNode }) {
  return <span className="tech-tag">{children}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const isLive = status === 'live' || status === 'production';
  const c = isLive ? '#0055ff' : '#515154';
  const bg = isLive ? 'rgba(0, 85, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)';
  const border = isLive ? '1px solid rgba(0, 85, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)';
  return (
    <span className="status-badge" style={{ color: c, background: bg, border }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c, display: 'inline-block', boxShadow: `0 0 6px ${c}` }} />
      {status.toUpperCase()}
    </span>
  );
}

function AnimatedCounter({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState('0');
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const numericMatch = value.match(/[\d.]+/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }
    const target = parseFloat(numericMatch[0]);
    const suffix = value.replace(numericMatch[0], '');
    
    let observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let start = 0;
        const duration = 1200; // 1.2s
        const startTime = performance.now();

        const animate = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const current = start + target * easeProgress;
          
          if (value.includes('.')) {
            setDisplayValue(current.toFixed(1) + suffix);
          } else {
            setDisplayValue(Math.floor(current) + suffix);
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, [value]);

  return <span ref={elementRef}>{displayValue}</span>;
}

function MetricCard({ label, value, desc }: { label: string; value: string; desc: string }) {
  return (
    <div className="metric-card">
      <div className="metric-card__value">
        <AnimatedCounter value={value} />
      </div>
      <div className="metric-card__label">{label}</div>
      <div className="metric-card__desc">{desc}</div>
    </div>
  );
}

function SkillGroup({ category, icon, items }: { category: string; icon: string; items: string[] }) {
  return (
    <div className="skill-group glass-card">
      <div className="skill-group__header">
        <span className="skill-group__icon">{icon}</span>
        <span className="skill-group__cat">{category}</span>
      </div>
      <div className="skill-group__pills">
        {items.map(it => <span key={it} className="skill-pill">{it}</span>)}
      </div>
    </div>
  );
}

function TimelineEntry({ item, index }: { item: typeof timeline[number]; index: number }) {
  return (
    <div className={`tl-entry tl-entry--${item.type} story-reveal`} data-delay={index * 0.12}>
      <div className="tl-entry__dot" />
      <div className="tl-entry__body glass-card">
        <div className="tl-entry__meta">
          <span className="tl-entry__year">{item.year}</span>
          {item.type === 'work' && <span className="tl-entry__type-badge">WORK</span>}
          {item.type === 'education' && <span className="tl-entry__type-badge tl-entry__type-badge--edu">EDUCATION</span>}
        </div>
        <h3 className="tl-entry__title">{item.title}</h3>
        <div className="tl-entry__org">{item.org} · {item.location}</div>
        <ul className="tl-entry__bullets">
          {item.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
        {item.tech && (
          <div className="tl-entry__tech">
            {item.tech.map(t => <Tag key={t}>{t}</Tag>)}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: typeof projects[number] }) {
  return (
    <div className="project-card glass-card">
      <div className="project-card__header">
        <StatusBadge status={project.status} />
        {project.highlight && <span className="project-card__highlight">{project.highlight}</span>}
      </div>
      <div>
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__tagline">{project.tagline}</p>
        <p className="project-card__desc">{project.description}</p>
      </div>
      <div>
        <div className="project-card__metrics">
          {project.metrics.map((m, i) => (
            <div key={i} className="project-metric">
              <span className="project-metric__value">{m.value}</span>
              <span className="project-metric__label">{m.label}</span>
            </div>
          ))}
        </div>
        <div className="project-card__tech">
          {project.tech.map(t => <Tag key={t}>{t}</Tag>)}
        </div>
      </div>
    </div>
  );
}

function ChapterHeading({ index, label, title, sub }: { index: string; label: string; title: string; sub?: string }) {
  return (
    <div className="chapter-heading story-reveal">
      <div className="chapter-heading__index">{index}</div>
      <span className="chapter-heading__label">{label}</span>
      <h2 className="chapter-heading__title">{title}</h2>
      {sub && <p className="chapter-heading__sub">{sub}</p>}
    </div>
  );
}

function PipelineInfographic() {
  return (
    <div className="interactive-architecture glass-card story-reveal" data-delay="0.3">
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700,
        color: 'var(--blue-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem'
      }}>
        SYSTEM ARCHITECTURE: 3-AGENT ANOMALY DETECTION PIPELINE
      </div>
      <div className="arch-flow-diagram">
        <div className="arch-node">
          <span className="arch-node__icon">🤖</span>
          <span className="arch-node__label">Planner Agent</span>
          <span className="arch-node__status">Active</span>
        </div>
        
        <div className="arch-connection-line">
          <div className="arch-connection-pulse" style={{ animationDelay: '0s' }} />
        </div>

        <div className="arch-node">
          <span className="arch-node__icon">🔌</span>
          <span className="arch-node__label">RabbitMQ Hub</span>
          <span className="arch-node__status">Routing</span>
        </div>

        <div className="arch-connection-line">
          <div className="arch-connection-pulse" style={{ animationDelay: '0.7s' }} />
        </div>

        <div className="arch-node">
          <span className="arch-node__icon">⚙️</span>
          <span className="arch-node__label">Executor Node</span>
          <span className="arch-node__status">Evaluating</span>
        </div>

        <div className="arch-connection-line">
          <div className="arch-connection-pulse" style={{ animationDelay: '1.4s' }} />
        </div>

        <div className="arch-node">
          <span className="arch-node__icon">🛡️</span>
          <span className="arch-node__label">Monitor Loop</span>
          <span className="arch-node__status">Guardian</span>
        </div>
      </div>
    </div>
  );
}

function LiquidTelemetryWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = 140;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      offset += 0.04;

      ctx.strokeStyle = 'rgba(0, 85, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      const drawSine = (shift: number, color: string, thickness: number, amplitude: number, speed: number) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 + Math.sin(x * 0.015 + offset * speed + shift) * amplitude * Math.cos(x * 0.002);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      drawSine(0, 'rgba(0, 85, 255, 0.55)', 2.5, 32, 1.2);
      drawSine(Math.PI / 2, 'rgba(0, 0, 0, 0.65)', 1.5, 20, -0.8);
      drawSine(Math.PI, 'rgba(0, 85, 255, 0.2)', 1.0, 40, 0.6);

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="glass-card story-reveal" data-delay="0.25" style={{ padding: '1.8rem', marginBottom: '4rem', overflow: 'hidden' }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700,
        color: 'var(--blue-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.2rem'
      }}>
        LIVE PIPELINE TELEMETRY SIGNAL WAVE
      </div>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '140px' }} />
    </div>
  );
}

function ChapterDots({ progress, isExploreActivated, onNavClick }: { progress: number; isExploreActivated: boolean; onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void }) {
  if (!isExploreActivated) return null;
  const active = Math.min(Math.floor(progress * CHAPTERS.length), CHAPTERS.length - 1);
  return (
    <div style={{
      position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)',
      display: 'flex', flexDirection: 'column', gap: 12, zIndex: 500,
    }}>
      {CHAPTERS.map((ch, i) => (
        <a 
          key={ch} 
          href={`#ch-${i}`} 
          title={ch} 
          onClick={(e) => onNavClick(e, `#ch-${i}`)}
          style={{
            width: i === active ? 10 : 6,
            height: i === active ? 10 : 6,
            borderRadius: '50%',
            background: i === active ? 'var(--blue-primary)' : 'rgba(0,0,0,0.15)',
            display: 'block',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: i === active ? '0 0 10px rgba(0, 85, 255, 0.5)' : 'none',
          }} 
        />
      ))}
    </div>
  );
}

// ─── Main CareerPage Component ───────────────────────────────────────────────
interface CareerPageProps {
  onBack: () => void;
  currentHash: string;
}

export function CareerPage({ onBack, currentHash }: CareerPageProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle');

  const horizontalRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<any>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 4000);
    }, 1200);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (targetId === '#ch-0') {
      onBack();
    } else {
      const el = document.querySelector(targetId);
      if (el && lenisRef.current) {
        lenisRef.current.scrollTo(el, {
          duration: 1.2,
          easing: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
        });
      }
    }
  };

  // Scroll and GSAP initialization
  useEffect(() => {
    // Reset window scroll position to 0 immediately on mount to prevent trigger miscalculations
    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;

    // 1. Initialize Lenis scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', (e: any) => {
      setScrollProgress(e.progress);
    });

    const raf = (t: number) => {
      lenis.raf(t);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // 2. Initialize Scroll Reveals
    const elements = document.querySelectorAll('.story-reveal');
    const revealTriggers: ScrollTrigger[] = [];
    elements.forEach((el) => {
      const delay = parseFloat((el as HTMLElement).dataset.delay ?? '0');
      
      const tl = gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power3.out',
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
      revealTriggers.push(tl.scrollTrigger!);
    });

    // 3. Apple-style horizontal scroll pinning for Projects
    const horizontalContainer = horizontalRef.current;
    let projectsTrigger: ScrollTrigger | null = null;
    if (horizontalContainer) {
      const scrollWidth = horizontalContainer.scrollWidth;
      const amountToScroll = scrollWidth - window.innerWidth + 100;
      
      const tl = gsap.to(horizontalContainer, {
        x: -amountToScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: '#ch-3',
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${amountToScroll}`,
          invalidateOnRefresh: true,
        }
      });
      projectsTrigger = tl.scrollTrigger!;
    }

    // 4. Handle direct linking section parameters on mount
    const match = currentHash.match(/section=([^&?]+)/);
    const sectionId = match ? match[1] : null;
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el && lenis) {
          lenis.scrollTo(el, { immediate: true });
        }
      }, 200);
    }

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      lenis.destroy();
      revealTriggers.forEach(t => t.kill());
      if (projectsTrigger) projectsTrigger.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [currentHash]);

  return (
    <div className="career-page-mount" style={{ width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Scroll Progress Indicator */}
      <div className="scroll-progress-container" style={{ opacity: 1 }}>
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress * 100}%` }} />
      </div>

      <ChapterDots 
        progress={scrollProgress} 
        isExploreActivated={true} 
        onNavClick={handleNavClick}
      />

      {/* ── Fixed Site Navigation ── */}
      <header className="site-nav" style={{ 
        opacity: 1, 
        pointerEvents: 'auto',
        transition: 'opacity 0.8s ease'
      }}>
        <a 
          href="#ch-0" 
          className="site-nav__brand"
          onClick={(e) => handleNavClick(e, '#ch-0')}
        >
          [ ABHISHEK TIWARI ]
        </a>
        <nav className="site-nav__links">
          {CHAPTERS.map((ch, i) => (
            <a 
              key={ch} 
              href={`#ch-${i}`} 
              className="site-nav__link"
              onClick={(e) => handleNavClick(e, `#ch-${i}`)}
            >
              {ch}
            </a>
          ))}
          <a href="https://github.com/Abhishektiwari050" target="_blank" rel="noopener noreferrer" className="site-nav__link site-nav__link--cta">GITHUB ↗</a>
        </nav>
      </header>

      <main className="story-main">
        {/* ─── CHAPTER 1: EXPERIENCE ───────────────────────────────────── */}
        <section id="ch-1" className="chapter chapter--experience">
          <div className="chapter__inner">
            <ChapterHeading
              index="01"
              label="// EVOLUTION"
              title="CAREER NARRATIVE."
              sub="A timeline of building high-performance architectures and production systems."
            />

            {/* Vistar Impact Infographic */}
            <div className="impact-strip glass-card story-reveal" data-delay="0.2">
              <div className="impact-strip__label">Vistar Client Impact Metrics</div>
              <div className="impact-strip__metrics">
                {vistarMetrics.map((m, i) => (
                  <MetricCard key={i} label={m.label} value={m.value} desc={m.desc} />
                ))}
              </div>
            </div>

            {/* Multi-Agent Telemetry Infographic */}
            <PipelineInfographic />

            <div className="timeline">
              {timeline.map((item, i) => (
                <TimelineEntry key={i} item={item} index={i} />
              ))}
            </div>

            {/* Live Canvas wave animation for data flow telemetry */}
            <LiquidTelemetryWave />
          </div>
        </section>

        {/* ─── CHAPTER 2: SKILLS ───────────────────────────────────────── */}
        <section id="ch-2" className="chapter chapter--skills">
          <div className="chapter__inner">
            <ChapterHeading
              index="02"
              label="// STACK"
              title="TECHNICAL ENGINE."
              sub="Languages, frameworks, and protocols powering agentic intelligence."
            />

            {/* Circular Radar Infographic (Apple style motion layout) */}
            <div className="skills-infographic story-reveal" data-delay="0.2">
              <div className="skills-radar-rings">
                <div className="skills-radar-labels">
                  {['Agent Systems', 'LLM Architectures', 'Vector DBs', 'Scalable Backends', 'Speech/Voice Systems', 'Workflow Automations'].map((s, i) => (
                    <div key={s} className="radar-label" style={{
                      '--angle': `${(i / 6) * 360}deg`,
                    } as React.CSSProperties}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="skill-groups">
              {skillGroups.map((sg, i) => (
                <div key={sg.category} className="story-reveal" data-delay={i * 0.07}>
                  <SkillGroup {...sg} />
                </div>
              ))}
            </div>

            {/* Languages Performance metrics */}
            <div className="lang-bars glass-card story-reveal" data-delay="0.5">
              <h3 className="lang-bars__title">CORE LANGUAGE STACK</h3>
              {[
                { lang: 'Python', pct: 95, color: 'linear-gradient(90deg, #0055ff, #0022aa)' },
                { lang: 'TypeScript / JavaScript', pct: 85, color: 'linear-gradient(90deg, #0055ff, #0033cc)' },
                { lang: 'SQL', pct: 80, color: 'linear-gradient(90deg, #0055ff, #001144)' },
              ].map(({ lang, pct, color }) => (
                <div key={lang} className="lang-bar">
                  <div className="lang-bar__name">{lang}</div>
                  <div className="lang-bar__track">
                    <div className="lang-bar__fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <div className="lang-bar__pct">{pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CHAPTER 3: PINNED PROJECTS (Apple Pinned Side Scroll) ─── */}
        <section id="ch-3" className="chapter chapter--projects horizontal-scroll-container">
          <div className="chapter__inner" style={{ padding: 0, maxWidth: 'none' }}>
            <div style={{ padding: '0 2rem', maxWidth: '1140px', margin: '0 auto' }}>
              <ChapterHeading
                index="03"
                label="// PROJECTS"
                title="SHIPPED WORK."
                sub="Explore production and agentic platforms (scroll down to slide)."
              />
            </div>

            <div className="horizontal-scroll-wrapper" ref={horizontalRef}>
              {projects.map((p) => (
                <div className="project-slide" key={p.id}>
                  <ProjectCard project={p} />
                </div>
              ))}

              {/* Research publication as last slide */}
              <div className="project-slide publication-slide">
                <div className="publication glass-card">
                  <span className="publication__label">RESEARCH PUBLICATION</span>
                  <h3 className="publication__title">
                    Procedural Obstacle Generation and Dynamic Chase Mechanics in an Endless Runner Game
                  </h3>
                  <p className="publication__desc">
                    Published research in IRJMETS examining procedural generation algorithms, state machine architectures, 
                    and adaptive chase mechanics within real-time 3D game loops.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CHAPTER 4: CONNECT ──────────────────────────────────────── */}
        <section id="ch-4" className="chapter chapter--connect">
          <div className="chapter__inner">
            <ChapterHeading
              index="04"
              label="// NETWORK"
              title="GET IN TOUCH."
              sub="Let's build scalable intelligence. Seeking Full-Time AI & LLM Engineer roles."
            />

            <div className="connect-split-layout">
              {/* Left Column: Glass Connection Cards */}
              <div className="connect-info-col story-reveal" data-delay="0.2">
                <a href={`mailto:${profile.email}`} className="connect-card glass-card">
                  <span className="connect-card__icon">✉</span>
                  <span className="connect-card__label">EMAIL DIRECT</span>
                  <span className="connect-card__value">{profile.email}</span>
                </a>
                <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer" className="connect-card glass-card">
                  <span className="connect-card__icon">⌥</span>
                  <span className="connect-card__label">GITHUB CODE</span>
                  <span className="connect-card__value">{profile.github}</span>
                </a>
                <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="connect-card glass-card">
                  <span className="connect-card__icon">◈</span>
                  <span className="connect-card__label">LINKEDIN PROFILE</span>
                  <span className="connect-card__value">abhishek-tiwari-84841b258</span>
                </a>
                <div className="connect-card glass-card">
                  <span className="connect-card__icon">☎</span>
                  <span className="connect-card__label">PHONE CALL</span>
                  <span className="connect-card__value">{profile.phone}</span>
                </div>
              </div>

              {/* Right Column: Premium Contact Form */}
              <div className="connect-form-col story-reveal" data-delay="0.35">
                <form onSubmit={handleFormSubmit} className="contact-form glass-card">
                  <div className="contact-form__header">
                    <h3>SEND A MESSAGE</h3>
                    <p>Have an idea or need system architecture design? Drop a message directly.</p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-name">NAME</label>
                    <input 
                      type="text" 
                      id="form-name" 
                      required 
                      placeholder="Your name" 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-email">EMAIL</label>
                    <input 
                      type="email" 
                      id="form-email" 
                      required 
                      placeholder="your.email@domain.com" 
                      value={formData.email} 
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-message">MESSAGE</label>
                    <textarea 
                      id="form-message" 
                      required 
                      rows={4} 
                      placeholder="Tell me about your project, timeline, and goals..." 
                      value={formData.message} 
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn-primary form-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'SENDING...' : 'DISPATCH MESSAGE'}
                  </button>
                  {submitStatus === 'success' && (
                    <div className="form-status form-status--success">
                      ✓ Message sent! Abhishek will reach back shortly.
                    </div>
                  )}
                </form>
              </div>
            </div>

            <AsciiSunsetCanvas />

            <div className="footer-sign story-reveal" data-delay="0.5">
              <div className="footer-sign__name">{profile.name}</div>
              <div className="footer-sign__role">{profile.title}</div>
              <div className="footer-sign__copy">© 2026 · Delhi, India · Engineered using Three.js + React + GSAP</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
