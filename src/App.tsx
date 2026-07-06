import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Preloader } from './components/Preloader';
import { StoryCanvas } from './components/StoryCanvas';
import { CustomCursor } from './components/CustomCursor';
import { profile, timeline, skillGroups, projects, vistarMetrics } from './data/resume';

gsap.registerPlugin(ScrollTrigger);

const HERO_PADDING_LEFT = '5vw';

// ─── Reusable UI Components ──────────────────────────────────────────────────
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="tech-tag">
      {children}
    </span>
  );
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

function MetricCard({ label, value, desc }: { label: string; value: string; desc: string }) {
  return (
    <div className="metric-card">
      <div className="metric-card__value">{value}</div>
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

// ─── Interactive Systems Architecture Diagram (Infographic) ─────
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

// ─── Interactive Live Canvas wave component (Motion Graphic) ─────
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

      // Draw active grid lines in the background
      ctx.strokeStyle = 'rgba(0, 85, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      // Draw three phase-shifted sine waves (representing live telemetry wave)
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

// ─── Interactive Chat System ──────────────────────────────────────────
interface ChatProps {
  onExplore: () => void;
  isExploreActivated: boolean;
  transitionProgress: number;
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  options?: { label: string; action: () => void }[];
}

function InteractiveChatSystem({ onExplore, isExploreActivated, transitionProgress }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [chatActive, setChatActive] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize chat with Welcome
  useEffect(() => {
    setMessages([
      { sender: 'ai', text: 'Welcome' }
    ]);
  }, []);

  const handleSend = (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: cleanText }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = cleanText.toLowerCase();
      let reply = '';

      if (lower === 'hey' || lower === 'hi' || lower === 'hello') {
        reply = `Hey, this is a chatbot system. This is ${profile.name}. You can explore my capabilities through the pages, or you can ask questions directly to me.`;
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'ai', 
            text: reply,
            options: [
              { label: 'Chat with AI Assistant', action: () => setChatActive(true) },
              { label: 'Explore Work & Career Story', action: () => onExplore() }
            ]
          }
        ]);
      } else {
        // Chatbot conversation replies
        if (lower.includes('skill') || lower.includes('stack') || lower.includes('tech')) {
          reply = `Here is my system engine stack:\n• Languages: Python, TypeScript, SQL\n• AI/LLM: OpenAI, Claude, Gemini APIs, LangGraph, LlamaIndex\n• Backend/DB: FastAPI, PostgreSQL, Vector DBs, RabbitMQ`;
        } else if (lower.includes('project') || lower.includes('work') || lower.includes('ship')) {
          reply = `Some of my shipped work:\n• Agentic Sales Intel: B2B lead generation & LLM compliance scoring\n• VayuWays: DGCA regulatory compliance tool\n• WhatsApp Intelligence Agent: Whatsapp automation`;
        } else if (lower.includes('contact') || lower.includes('email') || lower.includes('phone')) {
          reply = `Connect with me directly at:\n• Email: ${profile.email}\n• LinkedIn: ${profile.linkedin}\n• Phone: ${profile.phone}`;
        } else {
          reply = `I can answer questions about my "skills", "projects", and "contact" info, or you can click "Explore" to scroll through the full resume story.`;
        }
        setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      }
    }, 800);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatActive && input.trim().toLowerCase() !== 'hey') {
      handleSend('Hey');
      return;
    }
    handleSend(input);
  };

  const showHeyOption = messages.length === 1 && !isTyping;

  return (
    <div className="chat-widget" style={{
      display: (isExploreActivated && transitionProgress >= 0.95) ? 'none' : 'block',
      opacity: isExploreActivated ? 0 : 1,
      transition: 'opacity 0.8s ease'
    }}>
      <div className="chat-header">
        <div className="chat-dots">
          <span className="chat-dot chat-dot--red" />
          <span className="chat-dot chat-dot--yellow" />
          <span className="chat-dot chat-dot--green" />
        </div>
        <div className="chat-title">
          <span className="chat-status-dot" />
          assistant - {profile.name.toLowerCase().replace(' ', '')}@ai-node
        </div>
      </div>
      
      <div className="chat-body" ref={containerRef}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <div className="chat-bubble-container" style={{ display: 'flex', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start', width: '100%' }}>
              {m.sender === 'ai' && (
                <div className="chat-avatar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8.01" y2="16"></line><line x1="16" y1="16" x2="16.01" y2="16"></line></svg>
                </div>
              )}
              <div className={`chat-bubble chat-bubble--${m.sender}`}>
                {m.text}
              </div>
              {m.sender === 'user' && (
                <div className="chat-avatar chat-avatar--user" style={{ marginLeft: 8 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
              )}
            </div>
            {m.options && (
              <div className="chat-options-row">
                {m.options.map((opt, i) => (
                  <button 
                    key={i} 
                    type="button"
                    className={`chat-btn ${i === 1 ? 'chat-btn--secondary' : ''}`}
                    onClick={opt.action}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="chat-bubble-container" style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
            <div className="chat-avatar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8.01" y2="16"></line><line x1="16" y1="16" x2="16.01" y2="16"></line></svg>
            </div>
            <div className="chat-bubble chat-bubble--ai typing-indicator">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        {showHeyOption && (
          <div className="chat-options-row">
            <button type="button" className="chat-btn" onClick={() => handleSend('Hey')}>
              Click to send "Hey"
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-input-row">
        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder={chatActive ? "Type a message..." : "Type 'Hey' to connect..."}
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isExploreActivated}
          />
        </div>
        <button 
          type="submit" 
          className="chat-send-btn" 
          disabled={isExploreActivated || (!chatActive && input.trim().toLowerCase() !== 'hey' && input.trim() !== '')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>
    </div>
  );
}

const CHAPTERS = ['IDENTITY', 'EXPERIENCE', 'SKILLS', 'PROJECTS', 'CONNECT'];

function ChapterDots({ progress, isExploreActivated }: { progress: number; isExploreActivated: boolean }) {
  if (!isExploreActivated) return null;
  const active = Math.min(Math.floor(progress * CHAPTERS.length), CHAPTERS.length - 1);
  return (
    <div style={{
      position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)',
      display: 'flex', flexDirection: 'column', gap: 12, zIndex: 500,
    }}>
      {CHAPTERS.map((ch, i) => (
        <a key={ch} href={`#ch-${i}`} title={ch} style={{
          width: i === active ? 10 : 6,
          height: i === active ? 10 : 6,
          borderRadius: '50%',
          background: i === active ? 'var(--blue-primary)' : 'rgba(0,0,0,0.15)',
          display: 'block',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: i === active ? '0 0 10px rgba(0, 85, 255, 0.5)' : 'none',
        }} />
      ))}
    </div>
  );
}

// ─── Main App Component ──────────────────────────────────────────────────────
export function App() {
  const [isLoaded, setIsLoaded]                 = useState(false);
  const [scrollProgress, setScrollProgress]         = useState(0);
  const [scrollVelocity, setScrollVelocity]         = useState(0);
  const [isExploreActivated, setIsExploreActivated] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [isTransitioning, setIsTransitioning]       = useState(false);
  
  const horizontalRef = useRef<HTMLDivElement>(null);
  const lenisRefRef   = useRef<any>(null);
  const scrollProgressRef = useRef(0);

  // Synchronize body class for canvas layering
  useEffect(() => {
    document.body.classList.toggle('explore-active', isExploreActivated);
    return () => {
      document.body.classList.remove('explore-active');
    };
  }, [isExploreActivated]);

  // ── Smooth Scroll Initializer ──────────────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });
    lenisRefRef.current = lenis;

    lenis.on('scroll', (e: any) => {
      setScrollProgress(e.progress);
      scrollProgressRef.current = e.progress;
      setScrollVelocity(Math.abs(e.velocity));
    });

    const handleWheel = (e: WheelEvent) => {
      if (lenisRefRef.current && !isExploreActivated && !isTransitioning) {
        // Unlock scroll when scrolling back up
        if (e.deltaY < 0) {
          lenisRefRef.current.start();
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (lenisRefRef.current && !isExploreActivated && !isTransitioning) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        // Unlock scroll when swiping down (scrolling up)
        if (deltaY < 0) {
          lenisRefRef.current.start();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isExploreActivated, isTransitioning]);

  // ── Hero Zoom ScrollTrigger Pin ─────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;

    // Pin Hero section to scrub terminal maximize and particle morph
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#ch-0',
        start: 'top top',
        end: '+=120%', // Pin for 120% of viewport height
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true, // Recalculate offset functions on window resize
        onUpdate: (self) => {
          setTransitionProgress(self.progress);
          
          // Lock scrolling once terminal is fully maximized
          if (self.progress >= 0.99) {
            if (lenisRefRef.current && !isExploreActivated && !isTransitioning) {
              lenisRefRef.current.stop();
            }
          }
        }
      }
    });

    // 1. Fade out Hero details as we scroll down
    tl.to('.hero-eyebrow, .hero-title, .hero-desc, .hero-meta, .hero-scroll-hint', {
      opacity: 0,
      y: -30,
      stagger: 0.05,
      ease: 'none'
    }, 0);

    // 2. Maximize chat window to fullscreen (fits borders exactly to viewport)
    tl.to('.chat-widget', {
      x: () => {
        const el = document.querySelector('.chat-widget');
        return el ? -el.getBoundingClientRect().left : 0;
      },
      y: () => {
        const el = document.querySelector('.chat-widget');
        return el ? -el.getBoundingClientRect().top : 0;
      },
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      borderRadius: '0px',
      margin: '0px',
      ease: 'none'
    }, 0);

    return () => {
      tl.kill();
    };
  }, [isLoaded, isExploreActivated, isTransitioning]);

  // ── Cinematic Transition Trigger (Button click/command line explore option) ─
  const triggerExploreTransition = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (lenisRefRef.current) {
      lenisRefRef.current.start(); // Ensure scroll is unlocked
      lenisRefRef.current.scrollTo(window.innerHeight * 1.25, {
        duration: 2.5,
        easing: (t: number) => t * (2 - t),
        onComplete: () => {
          setIsExploreActivated(true);
          setIsTransitioning(false);
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 100);
        }
      });
    }
  };

  // ── GSAP Reveal & Horizontal Scrolling Animations ──────────────────────────
  useEffect(() => {
    if (!isLoaded || !isExploreActivated) return;

    // Standard story section reveals
    const elements = document.querySelectorAll('.story-reveal');
    elements.forEach((el) => {
      const delay = parseFloat((el as HTMLElement).dataset.delay ?? '0');
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', delay,
          scrollTrigger: { 
            trigger: el, 
            start: 'top 88%', 
            toggleActions: 'play none none none' 
          },
        }
      );
    });

    // Apple-style horizontal scroll pinning for Projects
    const horizontalContainer = horizontalRef.current;
    if (horizontalContainer) {
      const scrollWidth = horizontalContainer.scrollWidth;
      const amountToScroll = scrollWidth - window.innerWidth + 100;
      
      gsap.to(horizontalContainer, {
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
    }

    // Recalculate ScrollTrigger offsets once the new elements are mounted
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isLoaded, isExploreActivated]);

  return (
    <>
      <Preloader onComplete={() => setIsLoaded(true)} />
      
      <StoryCanvas 
        scrollProgress={scrollProgress} 
        scrollVelocity={scrollVelocity}
        isExploreActivated={isExploreActivated || isTransitioning}
        transitionProgress={transitionProgress}
      />
      <CustomCursor />
      
      {/* Scroll Progress Indicator */}
      <div className="scroll-progress-container" style={{ opacity: isExploreActivated ? 1 : 0 }}>
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress * 100}%` }} />
      </div>

      <ChapterDots progress={scrollProgress} isExploreActivated={isExploreActivated} />

      {/* Aesthetic Liquid Background Blur Overlays */}
      <div className="aurora-container">
        <div className="aurora-blob aurora-blob--1" />
        <div className="aurora-blob aurora-blob--2" />
        <div className="aurora-blob aurora-blob--3" />
      </div>
      <div className="grid-overlay" />
      <div className="noise-overlay" />

      {/* ── Fixed Site Navigation ── */}
      <header className="site-nav" style={{ 
        opacity: isExploreActivated ? 1 : 0, 
        pointerEvents: isExploreActivated ? 'auto' : 'none',
        transition: 'opacity 0.8s ease'
      }}>
        <a href="#ch-0" className="site-nav__brand">[ ABHISHEK TIWARI ]</a>
        <nav className="site-nav__links">
          {CHAPTERS.map((ch, i) => (
            <a key={ch} href={`#ch-${i}`} className="site-nav__link">{ch}</a>
          ))}
          <a href="https://github.com/Abhishektiwari050" target="_blank" rel="noopener noreferrer" className="site-nav__link site-nav__link--cta">GITHUB ↗</a>
        </nav>
      </header>

      {isLoaded && (
        <main className="story-main">

          {/* ─── CHAPTER 0: IDENTITY / HERO ──────────────────────────────── */}
          <section id="ch-0" className={`chapter chapter--hero ${isExploreActivated || isTransitioning ? 'explore-active' : ''}`} style={{ height: '100vh' }}>
            <div className="chapter__inner chapter__inner--hero" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-start',
              width: '100%',
              paddingLeft: HERO_PADDING_LEFT
            }}>
              <div className="hero-text-col" style={{ 
                maxWidth: isExploreActivated ? '50vw' : '640px',
                margin: '0',
                transition: 'all 1.0s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                <div className="hero-eyebrow story-reveal">
                  <span className="hero-eyebrow__dot" />
                  <span>AI Systems & LLM Architect</span>
                </div>

                <h1 className="hero-title">
                  <span className="hero-word">ABHISHEK</span>
                  <span className="hero-word" style={{ display: 'block' }}>TIWARI.</span>
                </h1>

                <p className="hero-desc story-reveal" data-delay="0.4">
                  Building production-ready RAG pipelines, multi-agent systems, and FastAPI backend services. 
                  Delivering intelligent client AI solutions at Vistar.
                </p>

                <div className="hero-cta story-reveal" data-delay="0.55" style={{ display: isExploreActivated ? 'flex' : 'none' }}>
                  <a href="#ch-1" className="btn-primary">DISCOVER STORY ↓</a>
                  <a href="mailto:abhishektiwari53910@gmail.com" className="btn-ghost">GET IN TOUCH</a>
                </div>

                {/* Interactive developer entrance portal chat system */}
                <div className="terminal-wrapper">
                  <InteractiveChatSystem 
                    onExplore={triggerExploreTransition} 
                    isExploreActivated={isExploreActivated || isTransitioning} 
                    transitionProgress={transitionProgress}
                  />
                </div>

                <div className="hero-meta story-reveal" data-delay="0.7">
                  <span className="hero-meta__item">📍 DELHI, INDIA</span>
                  <span className="hero-meta__item">✉ abhishektiwari53910@gmail.com</span>
                </div>
              </div>
            </div>

            <div className="hero-scroll-hint" style={{ display: isExploreActivated ? 'flex' : 'none' }}>
              <div className="hero-scroll-hint__bar" />
              <span>SCROLL TO ENTER</span>
            </div>
          </section>

          {/* Render remaining story timeline sections */}
          <>
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

                  <div className="connect-grid story-reveal" data-delay="0.2">
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

                  <div className="footer-sign story-reveal" data-delay="0.5">
                    <div className="footer-sign__name">{profile.name}</div>
                    <div className="footer-sign__role">{profile.title}</div>
                    <div className="footer-sign__copy">© 2026 · Delhi, India · Engineered using Three.js + React + GSAP</div>
                  </div>
                </div>
              </section>
            </>

        </main>
      )}
    </>
  );
}

export default App;
