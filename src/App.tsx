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
  onExitChat: () => void;
  onFocus: () => void;
}

function getClientFallbackReply(message: string) {
  const lower = message.toLowerCase();

  // Guardrail check in fallback mode
  const isOffTopic = !lower.includes('skill') && !lower.includes('stack') && !lower.includes('tech') &&
                     !lower.includes('project') && !lower.includes('work') && !lower.includes('ship') &&
                     !lower.includes('contact') && !lower.includes('email') && !lower.includes('phone') &&
                     !lower.includes('connect') && !lower.includes('hey') && !lower.includes('hi') && 
                     !lower.includes('hello') && !lower.includes('about') && !lower.includes('experience');

  if (isOffTopic) {
    return "I only answer questions about my professional background, skills, and shipped projects. How can I help you explore my work?";
  }

  if (lower.includes('skill') || lower.includes('stack') || lower.includes('tech')) {
    return "My skills include LLM engineering (OpenAI, Gemini, Claude, prompt engineering), agent frameworks (LangGraph, LlamaIndex, CrewAI), and backend engineering (FastAPI, Python, PostgreSQL, RabbitMQ).";
  }
  if (lower.includes('project') || lower.includes('work') || lower.includes('ship')) {
    return "I have shipped several production projects: an Agentic B2B Lead Gen scoring platform, the VayuWays aviation compliance tool, and WhatsApp RAG agents.";
  }
  if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('connect')) {
    return `You can contact me directly via email at ${profile.email}, phone at ${profile.phone}, or connect on LinkedIn (${profile.linkedin}).`;
  }
  return "I am Abhishek's AI assistant co-pilot. I can answer questions about my skills, shipped projects, work history, and contact details. How can I help you today?";
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  options?: { label: string; action: () => void }[];
}

function InteractiveChatSystem({ onExplore, isExploreActivated, onExitChat, onFocus }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize chat with Welcome message
  useEffect(() => {
    setMessages([
      { 
        sender: 'ai', 
        text: `Hi! I'm Abhishek's AI. Ask me anything — skills, projects, work history.`,
        options: [
          { label: 'Explore Career Story 🚀', action: () => onExplore() }
        ]
      }
    ]);
  }, [onExplore]);

  const handleSend = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    // Add user message
    const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: cleanText }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    const lower = cleanText.toLowerCase();

    // Standard starting greetings bypass LLM call for instant response
    if (lower === 'hey' || lower === 'hi' || lower === 'hello') {
      setTimeout(() => {
        setIsTyping(false);
        const reply = `Hey, this is a chatbot system. This is Abhishek Tiwari. You can explore my capabilities through the pages, or you can ask questions directly to me.`;
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'ai', 
            text: reply,
            options: [
              { label: 'Explore Work & Career Story 🚀', action: () => onExplore() }
            ]
          }
        ]);
      }, 800);
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not found');
      }

      // Convert history to Gemini format (user/model)
      const geminiHistory = newMessages
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

      const systemPrompt = `You are the AI assistant co-pilot for Abhishek Tiwari's interactive portfolio website.
Your name is AI assistant.
Your job is to answer questions about Abhishek Tiwari's professional background, skills, projects, and contact info in a polite, helpful, and professional manner.

Aesthetics/Style:
- Be concise. Keep responses under 3 paragraphs.
- Use clear bullet points when explaining multiple items.
- Maintain a premium, world-class developer tone.

Professional Guardrails:
- You ONLY answer questions related to Abhishek's profile, career, skills, and projects.
- If a user asks an off-topic question (e.g. general coding questions not related to Abhishek's projects, personal life, or trivia), decline politely and guide them back to exploring Abhishek's portfolio.
  Example: "I only answer questions about Abhishek's professional background, skills, and shipped projects. How can I help you explore his work?"

Here is the information about Abhishek Tiwari:
Name: Abhishek Tiwari
Title: AI Systems Engineer & LLM Architect
Location: Delhi, India
Email: abhishektiwari53910@gmail.com
Phone: +919717140880
GitHub: github.com/abhishektiwari53
LinkedIn: linkedin.com/in/abhishek-tiwari-84841b258

Key Skills:
- AI Systems & LLM Architectures (RAG pipelines, Vector Databases, Prompt Engineering)
- Agent Frameworks (LangGraph, LlamaIndex, CrewAI, Autogen)
- Scalable Backends (FastAPI, Python, PostgreSQL, RabbitMQ, Redis, Docker)
- Speech & Voice Systems (Text-to-Speech, Speech-to-Text, Voice Agent development)
- Workflow Automations (Custom orchestration pipelines, web scraping, data collection)

Shipped Projects:
1. Agentic B2B Lead Gen scoring platform: Multi-agent lead gen system with customized scoring algorithms, built using FastAPI, PostgreSQL, RabbitMQ, and React.
2. VayuWays aviation compliance tool: Aviation document parser and compliance verifier, utilizing RAG with hybrid search and PDF parsers.
3. WhatsApp RAG agents: Specialized chat assistant with multi-lingual support, built using Meta Cloud API and LangChain.
4. Game engine research: Published research paper on procedural runner chase mechanics.

Work Experience:
- AI Engineer at Vistar (Delhi, India): Led development of multi-agent RAG pipelines, voice assistants, and custom backends, improving client performance metrics.

Answer the user's latest query accurately using the above context.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: geminiHistory,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          }
        })
      });

      setIsTyping(false);

      if (response.ok) {
        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that response. Please try again.";
        setMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
      } else {
        const fallbackText = getClientFallbackReply(cleanText);
        setMessages(prev => [...prev, { sender: 'ai', text: fallbackText }]);
      }
    } catch (e) {
      setIsTyping(false);
      const fallbackText = getClientFallbackReply(cleanText);
      setMessages(prev => [...prev, { sender: 'ai', text: fallbackText }]);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <div className="chat-dots">
          <span className="chat-dot chat-dot--red" onClick={onExitChat} style={{ cursor: 'pointer' }} title="Exit Chat" />
          <span className="chat-dot chat-dot--yellow" />
          <span className="chat-dot chat-dot--green" />
        </div>
        <div className="chat-title">
          <span className="chat-status-dot" />
          assistant - {profile.name.toLowerCase().replace(' ', '')}@ai-node
        </div>
        <button 
          type="button" 
          className="chat-header-back-btn" 
          onClick={onExitChat}
        >
          BACK TO START ↩
        </button>
      </div>
      
      <div className="chat-body" ref={containerRef}>
        <div className="chat-body-inner">
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
        </div>
      </div>

      <form onSubmit={handleSubmit} className="chat-input-row">
        <div className="chat-input-row-inner">
          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Message Abhishek..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={onFocus}
              disabled={isExploreActivated}
            />
            <button 
              type="submit" 
              className="chat-send-btn" 
              disabled={isExploreActivated || input.trim() === ''}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </button>
          </div>
          <div className="chat-footer-note">
            Abhishek Tiwari may make mistakes. Verify important info.
          </div>
        </div>
      </form>
    </div>
  );
}

const CHAPTERS = ['IDENTITY', 'EXPERIENCE', 'SKILLS', 'PROJECTS', 'CONNECT'];

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

// ─── Main App Component ──────────────────────────────────────────────────────
export function App() {
  const [isLoaded, setIsLoaded]                 = useState(false);
  const [scrollProgress, setScrollProgress]         = useState(0);
  const [scrollVelocity, setScrollVelocity]         = useState(0);
  const [isExploreActivated, setIsExploreActivated] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [isTransitioning, setIsTransitioning]       = useState(false);
  const [chatActive, setChatActive]                 = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle');

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
  
  const exploreActiveRef = useRef(isExploreActivated);
  const transitioningRef = useRef(isTransitioning);
  const chatActiveRef = useRef(chatActive);
  useEffect(() => { exploreActiveRef.current = isExploreActivated; }, [isExploreActivated]);
  useEffect(() => { transitioningRef.current = isTransitioning; }, [isTransitioning]);
  useEffect(() => { chatActiveRef.current = chatActive; }, [chatActive]);
  
  const horizontalRef = useRef<HTMLDivElement>(null);
  const lenisRefRef   = useRef<any>(null);
  const scrollProgressRef = useRef(0);
  const isProgrammaticScrollRef = useRef(false);

  const handleExitChat = () => {
    isProgrammaticScrollRef.current = true;
    setChatActive(false);
  };

  const handleChatFocus = () => {
    if (!chatActiveRef.current) {
      isProgrammaticScrollRef.current = true;
      setChatActive(true);
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (targetId === '#ch-0') {
      e.preventDefault();
      if (isTransitioning) return;
      
      // Go back to Identity mode
      setIsExploreActivated(false);
      setChatActive(false);
      
      // Re-show ch-0 and scroll to top
      setTimeout(() => {
        if (lenisRefRef.current) {
          lenisRefRef.current.scrollTo(0, { immediate: true });
        }
        ScrollTrigger.refresh();
      }, 50);
    } else {
      // If it's another chapter, scroll to it via Lenis
      e.preventDefault();
      const el = document.querySelector(targetId);
      if (el && lenisRefRef.current) {
        lenisRefRef.current.scrollTo(el, {
          duration: 1.2,
          easing: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
        });
      }
    }
  };

  // Programmatic scroll toggle on chat active
  useEffect(() => {
    const st = ScrollTrigger.getById('hero-pin');
    if (!st) return;

    if (chatActive) {
      if (isProgrammaticScrollRef.current) {
        if (lenisRefRef.current) {
          lenisRefRef.current.start();
          lenisRefRef.current.scrollTo(st.start + (st.end - st.start) * 0.98, {
            duration: 0.8,
            easing: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
            onComplete: () => {
              isProgrammaticScrollRef.current = false;
              if (lenisRefRef.current && !isExploreActivated && !isTransitioning) {
                lenisRefRef.current.stop();
              }
            }
          });
        }
      }
    } else {
      if (isProgrammaticScrollRef.current) {
        if (lenisRefRef.current) {
          lenisRefRef.current.start();
          lenisRefRef.current.scrollTo(0, {
            duration: 0.8,
            easing: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
            onComplete: () => {
              isProgrammaticScrollRef.current = false;
            }
          });
        }
      }
    }
  }, [chatActive, isExploreActivated, isTransitioning]);

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
      if (lenisRefRef.current && !exploreActiveRef.current && !transitioningRef.current) {
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
      if (lenisRefRef.current && !exploreActiveRef.current && !transitioningRef.current) {
        const deltaY = e.touches[0].clientY - touchStartY;
        if (deltaY > 0) {
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
  }, []);

  // ── Hero Zoom ScrollTrigger Pin ─────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || isExploreActivated) return;

    // Pin Hero section to scrub terminal maximize and particle morph
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'hero-pin',
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

          // Sync chatActive state with scroll progress (only if not programmatic)
          if (!isProgrammaticScrollRef.current) {
            if (self.progress >= 0.95) {
              if (!chatActiveRef.current) {
                setChatActive(true);
              }
            } else {
              if (chatActiveRef.current && !isExploreActivated && !isTransitioning) {
                setChatActive(false);
              }
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

  // ── Cinematic Transition Trigger (Curtain Roll-up on AI Page) ──
  const triggerExploreTransition = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // 0. Kill hero-pin ScrollTrigger and instantly clear any GSAP inline
    //    transforms on the chat widget so it doesn't bleed into career section
    const heroPinST = ScrollTrigger.getById('hero-pin');
    if (heroPinST) heroPinST.kill();
    gsap.set('.chat-widget', { clearProps: 'all' });
    gsap.set('.terminal-wrapper', { clearProps: 'all' });

    // 1. Push down the AI page (#ch-0)
    gsap.to('#ch-0', {
      y: '6vh',
      duration: 0.35,
      ease: 'power2.out',
      onComplete: () => {
        // 2. Once pushed down, roll up #ch-0 and scroll to Chapter 1 simultaneously
        setIsExploreActivated(true);
        
        setTimeout(() => {
          if (lenisRefRef.current) {
            lenisRefRef.current.resize();
            lenisRefRef.current.start();
            lenisRefRef.current.scrollTo('#ch-1', {
              duration: 1.0,
              easing: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
            });
          }
        }, 50);

        gsap.to('#ch-0', {
          y: '-100vh',
          duration: 1.0,
          ease: 'power3.inOut',
          onComplete: () => {
            setIsTransitioning(false);
            // Collapse hero to zero height so nothing is scrollable above ch-1
            gsap.set('#ch-0', {
              height: 0,
              minHeight: 0,
              padding: 0,
              overflow: 'hidden',
              y: 0,
            });
            // Snap scroll back to top — career section is now at scrollY=0
            if (lenisRefRef.current) {
              lenisRefRef.current.scrollTo(0, { immediate: true });
            }
            ScrollTrigger.refresh();
          }
        });
      }
    });
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
        isChatActive={chatActive}
      />
      <CustomCursor />
      
      {/* Scroll Progress Indicator */}
      <div className="scroll-progress-container" style={{ opacity: isExploreActivated ? 1 : 0 }}>
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress * 100}%` }} />
      </div>

      <ChapterDots 
        progress={scrollProgress} 
        isExploreActivated={isExploreActivated} 
        onNavClick={handleNavClick}
      />

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

      {isLoaded && (
        <main className="story-main">

          {/* ─── CHAPTER 0: IDENTITY / HERO ──────────────────────────────── */}
          <section 
            id="ch-0" 
            className={`chapter chapter--hero ${isExploreActivated || isTransitioning ? 'explore-active' : ''}`} 
            style={{ 
              height: isExploreActivated ? '0px' : '100vh',
              minHeight: isExploreActivated ? '0px' : undefined,
              overflow: isExploreActivated ? 'hidden' : 'visible',
              display: (isExploreActivated && !isTransitioning) ? 'none' : 'flex',
              padding: isExploreActivated ? '0px' : undefined
            }}
          >
            <div className="chapter__inner chapter__inner--hero" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-start',
              width: '100%',
              boxSizing: 'border-box',
              paddingLeft: window.innerWidth <= 768 ? '20px' : HERO_PADDING_LEFT,
              paddingRight: window.innerWidth <= 768 ? '20px' : '0',
            }}>
              <div className="hero-text-col" style={{ 
                maxWidth: window.innerWidth <= 768 ? '100%' : (isExploreActivated ? '50vw' : '640px'),
                width: window.innerWidth <= 768 ? '100%' : undefined,
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

                <div className="role-badges story-reveal" data-delay="0.25">
                  <span className="role-badge">
                    <span className="role-badge__dot" />
                    AI Systems Engineer
                  </span>
                  <span className="role-badge">
                    <span className="role-badge__dot" />
                    LLM Architect
                  </span>
                </div>

                <p className="hero-desc story-reveal" data-delay="0.4">
                  Building production-ready RAG pipelines, multi-agent systems, and FastAPI backend services. 
                  Delivering intelligent client AI solutions at Vistar.
                </p>

                {/* Interactive developer entrance portal chat system in place of CTA buttons */}
                <div className="terminal-wrapper" style={{ marginTop: '1.2rem' }}>
                  <InteractiveChatSystem 
                    onExplore={triggerExploreTransition} 
                    isExploreActivated={isExploreActivated || isTransitioning} 
                    onExitChat={handleExitChat}
                    onFocus={handleChatFocus}
                  />
                </div>
              </div>
            </div>

            {/* Anchored bottom footer for metadata */}
            <div className="hero-meta story-reveal" data-delay="0.7" style={{ 
              position: 'absolute',
              bottom: '3vh',
              left: HERO_PADDING_LEFT,
              display: 'flex',
              gap: '2rem',
              margin: '0',
              zIndex: 10
            }}>
              <span className="hero-meta__item">📍 DELHI, INDIA</span>
              <span className="hero-meta__item">✉ abhishektiwari53910@gmail.com</span>
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
