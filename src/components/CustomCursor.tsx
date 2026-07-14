import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const hasMoved = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover)');
    if (!mediaQuery.matches) return;

    document.documentElement.style.cursor = 'none';

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Centre both elements on their hotspot
    gsap.set(dot,  { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    let activeTarget: HTMLElement | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      if (!hasMoved.current) {
        hasMoved.current = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }

      // Logo snaps to cursor instantly
      gsap.to(dot, { x, y, duration: 0.06, ease: 'power2.out' });

      // Ring trails behind
      if (!activeTarget) {
        gsap.to(ring, {
          x, y,
          width: 52, height: 52,
          borderRadius: '50%',
          backgroundColor: 'rgba(10, 10, 10, 0.04)',
          borderColor:     'rgba(10, 10, 10, 0.18)',
          duration: 0.35,
          ease: 'power3.out',
        });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        'a, button, [role="button"], .tech-tag, .connect-card, .apple-window-dot, ' +
        '.role-badge, .apple-pill-btn, .chatgpt-btn-circle, .chatgpt-btn-blue-pill'
      );
      if (target) {
        activeTarget = target as HTMLElement;
        const rect  = activeTarget.getBoundingClientRect();
        const radius = window.getComputedStyle(activeTarget).borderRadius || '8px';
        gsap.to(ring, {
          x: rect.left + rect.width  / 2,
          y: rect.top  + rect.height / 2,
          width:  rect.width  + 14,
          height: rect.height + 14,
          borderRadius: radius,
          backgroundColor: 'rgba(10, 10, 10, 0.06)',
          borderColor:     'rgba(10, 10, 10, 0.65)',
          duration: 0.22,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(dot, { scale: 1.18, duration: 0.2, ease: 'back.out(2)' });
      } else {
        activeTarget = null;
        gsap.to(dot, { scale: 1, duration: 0.2 });
      }
    };

    const onLeave  = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const onEnter  = () => { if (hasMoved.current) gsap.to([dot, ring], { opacity: 1, duration: 0.2 }); };
    const onScroll = () => { activeTarget = null; gsap.to(dot, { scale: 1, duration: 0.2 }); };

    window.addEventListener('mousemove',    handleMouseMove);
    document.addEventListener('mouseover',  handleMouseOver);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    window.addEventListener('scroll',       onScroll);

    return () => {
      document.documentElement.style.cursor = '';
      window.removeEventListener('mousemove',    handleMouseMove);
      document.removeEventListener('mouseover',  handleMouseOver);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('scroll',       onScroll);
    };
  }, []);

  return (
    <>
      {/* Real AT logo — rendered from the actual SVG file */}
      <div
        ref={dotRef}
        style={{
          position:        'fixed',
          top: 0, left: 0,
          zIndex:          99999,
          pointerEvents:   'none',
          opacity:         0,
          willChange:      'transform',
          transformOrigin: 'center center',
          width:  38,
          height: 38,
        }}
      >
        <img
          src="/at-logo.svg"
          alt=""
          width={38}
          height={38}
          style={{
            display:       'block',
            mixBlendMode:  'multiply',   /* white SVG background → transparent */
            filter:        'drop-shadow(0 1px 4px rgba(0,0,0,0.35))',
            userSelect:    'none',
            pointerEvents: 'none',
            borderRadius:  0,
          }}
        />
      </div>

      {/* Trailing magnetic ring — neutral dark, no purple */}
      <div
        ref={ringRef}
        style={{
          position:        'fixed',
          top: 0, left: 0,
          width:  52, height: 52,
          borderRadius:    '50%',
          border:          '1px solid rgba(0, 0, 0, 0.15)',
          backgroundColor: 'transparent',
          zIndex:          99998,
          pointerEvents:   'none',
          opacity:         0,
          willChange:      'transform',
        }}
      />
    </>
  );
};
