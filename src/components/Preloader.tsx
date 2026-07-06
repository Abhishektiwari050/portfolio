import React, { useEffect, useState, useCallback } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'complete' | 'exit'>('loading');

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Simulate realistic loading with variable speed
      const increment = current < 30 
        ? Math.random() * 6 + 3 
        : current < 70 
          ? Math.random() * 4 + 1 
          : Math.random() * 2 + 0.5;
      
      current = Math.min(current + increment, 100);
      setProgress(current);
      
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => setPhase('complete'), 200);
        setTimeout(() => {
          setPhase('exit');
          handleComplete();
        }, 1000);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [handleComplete]);

  if (phase === 'exit') return null;

  const displayNum = Math.floor(progress);

  return (
    <div
      className="preloader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: '#030406',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: phase === 'complete' ? 0 : 1,
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity',
      }}
    >
      {/* Faint grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundSize: '40px 40px',
        backgroundImage: 
          'linear-gradient(to right, rgba(0, 240, 255, 0.015) 1px, transparent 1px),' +
          'linear-gradient(to bottom, rgba(0, 240, 255, 0.015) 1px, transparent 1px)',
        pointerEvents: 'none',
      }} />

      {/* Corner brackets */}
      {[
        { top: '24px', left: '24px', borderTop: '1px solid', borderLeft: '1px solid' },
        { top: '24px', right: '24px', borderTop: '1px solid', borderRight: '1px solid' },
        { bottom: '24px', left: '24px', borderBottom: '1px solid', borderLeft: '1px solid' },
        { bottom: '24px', right: '24px', borderBottom: '1px solid', borderRight: '1px solid' },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: '20px',
          height: '20px',
          ...pos,
          borderColor: 'rgba(0, 240, 255, 0.2)',
        } as React.CSSProperties} />
      ))}

      {/* Large counter */}
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 'clamp(4rem, 12vw, 8rem)',
        fontWeight: 800,
        letterSpacing: '-0.06em',
        color: '#f3f4f6',
        lineHeight: 1,
        marginBottom: '2.5rem',
        position: 'relative',
      }}>
        <span style={{ opacity: displayNum < 100 ? 0.15 : 1, transition: 'opacity 0.3s' }}>
          {displayNum < 10 ? '0' : ''}
        </span>
        {displayNum < 100 && displayNum >= 10 ? '' : ''}
        {displayNum}
        <span style={{
          position: 'absolute',
          right: '-2rem',
          top: '0.2em',
          fontSize: '0.15em',
          fontFamily: "'Geist Mono', monospace",
          fontWeight: 400,
          color: '#0055ff',
          letterSpacing: '0',
        }}>%</span>
      </div>

      {/* Progress bar */}
      <div style={{
        width: 'min(240px, 60vw)',
        height: '1px',
        background: 'rgba(255,255,255,0.06)',
        position: 'relative',
        marginBottom: '2rem',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #0055ff, #0033aa)',
          transition: 'width 0.08s linear',
          boxShadow: '0 0 12px rgba(0, 85, 255, 0.4)',
        }} />
      </div>

      {/* Status lines */}
      <div style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: '0.65rem',
        color: '#4b5563',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span style={{ 
          color: progress > 30 ? '#8a93a6' : '#4b5563',
          transition: 'color 0.5s',
        }}>
          {progress < 30 ? 'LOADING ASSETS' 
            : progress < 60 ? 'INITIALIZING WebGL' 
            : progress < 90 ? 'COMPILING SHADERS' 
            : 'SYSTEMS ONLINE'}
        </span>
        <span style={{
          color: '#0055ff',
          opacity: progress >= 100 ? 1 : 0.4,
          transition: 'opacity 0.3s',
          fontSize: '0.6rem',
        }}>
          {progress >= 100 ? '● READY' : '○ STANDBY'}
        </span>
      </div>
    </div>
  );
};
