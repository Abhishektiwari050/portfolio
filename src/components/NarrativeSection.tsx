import React from 'react';
import { ventures } from '../data/ventures';
import type { Venture } from '../data/ventures';

interface NarrativeSectionProps {
  activeVentureId: string;
}

export const NarrativeSection: React.FC<NarrativeSectionProps> = ({ activeVentureId }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem', width: '100%' }}>
      
      {/* Hero / System Init Section */}
      <section 
        id="intro" 
        style={{ 
          minHeight: '75vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          opacity: activeVentureId === 'intro' ? 1 : 0.45,
          transition: 'opacity 0.5s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <span className="code-text" style={{ fontSize: '0.75rem', border: '1px solid rgba(0, 240, 255, 0.2)', padding: '3px 8px', borderRadius: '3px' }}>
            INIT_STAGE_01
          </span>
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
            AUTH: SUCCESS
          </span>
        </div>
        
        <h1 
          style={{ 
            fontSize: '4.5rem', 
            fontWeight: 800, 
            lineHeight: '1.15', 
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.4) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          ENGINEERING <br />
          INTELLIGENT <br />
          SYSTEMS.
        </h1>
        
        <p 
          style={{ 
            fontSize: '1.1rem', 
            color: 'var(--color-text-secondary)', 
            lineHeight: '1.65',
            maxWidth: '520px',
            marginBottom: '3.5rem',
            fontWeight: 300
          }}
        >
          Personal log of an AI Systems Architect and Founder. Focused on multi-agent execution runtimes, GPU-accelerated vector indexing, and planetary-scale predictive networks.
        </p>
        
        <div>
          <span 
            className="code-text" 
            style={{ 
              animation: 'pulse-glow 2s infinite', 
              border: '1px solid var(--accent-cyan)', 
              padding: '8px 16px', 
              borderRadius: '4px',
              fontSize: '0.75rem',
              letterSpacing: '0.1em'
            }}
          >
            SYS_SCROLL_TO_DECRYPT
          </span>
        </div>
      </section>

      {/* Venture Bento Cards */}
      {ventures.map((venture: Venture) => {
        const isActive = activeVentureId === venture.id;

        return (
          <section
            key={venture.id}
            id={venture.id}
            style={{
              scrollMarginTop: '15vh',
              opacity: isActive ? 1 : 0.45,
              transform: isActive ? 'scale(1.01)' : 'scale(0.99)',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              width: '100%',
            }}
          >
            {/* Bento Grid Container */}
            <div className={`bento-card ${isActive ? 'active' : ''}`}>
              {/* Bento Row 1: Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(0, 240, 255, 0.08)', paddingBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="code-text" style={{ fontSize: '0.7rem' }}>{venture.period}</span>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--accent-cyan)' }} />
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
                      {venture.role}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-primary)', marginTop: '4px' }}>
                    {venture.title}
                  </h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-indigo)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '2px 6px', borderRadius: '2px', textTransform: 'uppercase' }}>
                    CH_{venture.id.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Tagline */}
              <p style={{ fontSize: '1.05rem', color: 'var(--accent-cyan)', fontWeight: 500, marginTop: '-8px' }}>
                {venture.tagline}
              </p>

              {/* Bento Row 2: Asymmetrical Split Grid (Story & Metrics) */}
              <div className="bento-inner-grid">
                {/* Left Side: Narrative Story */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {venture.story.map((paragraph, idx) => (
                    <p key={idx} style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', fontWeight: 300 }}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Right Side: Vertical Metric Panels */}
                <div 
                  style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    background: 'rgba(5, 6, 8, 0.4)',
                    border: '1px solid rgba(0, 240, 255, 0.05)',
                    borderRadius: '6px',
                    padding: '16px',
                    height: 'fit-content'
                  }}
                >
                  {venture.metrics.map((metric, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '2px',
                        borderBottom: idx < venture.metrics.length - 1 ? '1px solid rgba(0, 240, 255, 0.05)' : 'none',
                        paddingBottom: idx < venture.metrics.length - 1 ? '10px' : '0',
                        paddingTop: idx > 0 ? '4px' : '0'
                      }}
                    >
                      <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>
                        {metric.value}
                      </span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {metric.label}
                      </span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', lineHeight: '1.3' }}>
                        {metric.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bento Row 3: Tech Stack Badges */}
              <div style={{ borderTop: '1px solid rgba(0, 240, 255, 0.08)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  CORE_SCHEMATIC_TECH
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {venture.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        color: 'var(--color-text-primary)',
                        background: 'rgba(0, 240, 255, 0.03)',
                        border: '1px solid rgba(0, 240, 255, 0.08)',
                        padding: '3px 8px',
                        borderRadius: '3px',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </section>
        );
      })}

      {/* Outro / Connect Section */}
      <section 
        id="connect" 
        style={{ 
          minHeight: '70vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          opacity: activeVentureId === 'connect' ? 1 : 0.45,
          transition: 'opacity 0.5s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <span className="code-text" style={{ fontSize: '0.75rem', border: '1px solid rgba(0, 240, 255, 0.2)', padding: '3px 8px', borderRadius: '3px' }}>
            STAGE_FIN
          </span>
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
            HANDSHAKE: OPEN
          </span>
        </div>
        
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em', lineHeight: '1.15' }}>
          SECURE CONNECTION <br />
          WITH THE ARCHITECT.
        </h2>
        
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '3rem', maxWidth: '480px', fontWeight: 300 }}>
          Direct pathways are open for technical collaborations, venture advisory, or custom system designs.
        </p>
        
        {/* Glassmorphic Contact Card */}
        <div
          style={{
            background: 'rgba(11, 13, 18, 0.3)',
            border: '1px solid rgba(0, 240, 255, 0.08)',
            borderRadius: '6px',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            maxWidth: '440px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div>
            <span style={{ color: 'var(--color-text-muted)' }}>ADDR: </span>
            <a href="mailto:hello@example.com" data-lock="true" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', borderBottom: '1px dashed var(--accent-cyan)' }}>
              hello@example.com
            </a>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-muted)' }}>GITH: </span>
            <a href="https://github.com" target="_blank" rel="noreferrer" data-lock="true" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', borderBottom: '1px dashed var(--accent-cyan)' }}>
              github.com/architect
            </a>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-muted)' }}>LINK: </span>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" data-lock="true" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', borderBottom: '1px dashed var(--accent-cyan)' }}>
              linkedin.com/in/architect
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
