import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const hasMoved = useRef(false);

  useEffect(() => {
    // Only show custom cursor on devices that support hover
    const mediaQuery = window.matchMedia('(hover: hover)');
    if (!mediaQuery.matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Set initial centering offsets in GSAP
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let activeTarget: HTMLElement | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!hasMoved.current) {
        hasMoved.current = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }

      // Small dot follows mouse instantly
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.08,
        ease: 'power2.out',
      });

      // If not snapping, ring trails mouse
      if (!activeTarget) {
        gsap.to(ring, {
          x: mouseX,
          y: mouseY,
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 85, 255, 0.02)',
          borderColor: 'rgba(0, 85, 255, 0.3)',
          duration: 0.3,
          ease: 'power3.out',
        });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        'a, button, [role="button"], .tech-tag, .connect-card, .apple-window-dot, .role-badge, .apple-pill-btn, .chatgpt-btn-circle, .chatgpt-btn-blue-pill'
      );
      if (target) {
        activeTarget = target as HTMLElement;
        const rect = activeTarget.getBoundingClientRect();
        const style = window.getComputedStyle(activeTarget);
        const radius = style.borderRadius || '8px';

        // Snap ring to target element bounds with a premium magnetic lock effect
        gsap.to(ring, {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width + 12,
          height: rect.height + 12,
          borderRadius: radius,
          backgroundColor: 'rgba(0, 85, 255, 0.06)',
          borderColor: 'rgba(0, 85, 255, 0.85)',
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        // Hide or scale down the inner dot during magnetic snap
        gsap.to(dot, { scale: 0, duration: 0.15 });
      } else {
        activeTarget = null;
        gsap.to(dot, { scale: 1, duration: 0.2 });
      }
    };

    const handleScroll = () => {
      // Release snap on scroll to prevent cursor sticking to moving elements
      activeTarget = null;
      gsap.to(dot, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} />
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} />
    </>
  );
};
