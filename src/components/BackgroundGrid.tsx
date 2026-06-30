import React, { useEffect, useState } from 'react';

export const BackgroundGrid: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [normalizedPos, setNormalizedPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Absolute coordinates for the spotlight
      setMousePos({ x: e.clientX, y: e.clientY });

      // Normalized coordinates for the parallax grids
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      setNormalizedPos({ x: nx, y: ny });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const gridTranslate = {
    transform: `translate3d(${normalizedPos.x * -12}px, ${normalizedPos.y * -12}px, 0)`,
  };

  const subGridTranslate = {
    transform: `translate3d(${normalizedPos.x * -24}px, ${normalizedPos.y * -24}px, 0)`,
  };

  return (
    <>
      {/* Parallax Grid Layers */}
      <div 
        className="grid-overlay" 
        style={{
          ...gridTranslate,
          transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)'
        }} 
      />
      <div 
        className="grid-overlay-sub" 
        style={{
          ...subGridTranslate,
          transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)'
        }} 
      />
      
      {/* 21st.dev Inspired: Interactive Mouse Spotlight */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
          background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 240, 255, 0.04), rgba(99, 102, 241, 0.03), transparent 80%)`,
          transition: 'background 0.05s ease-out'
        }}
      />

      <div className="scanline" />
      
      {/* Soft Ambient Corner Glows */}
      <div className="glow-spot" style={{ top: '-10%', left: '-10%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)' }} />
      <div className="glow-spot" style={{ bottom: '-10%', right: '-10%', background: 'radial-gradient(circle, rgba(0, 240, 255, 0.03) 0%, transparent 70%)' }} />
    </>
  );
};
