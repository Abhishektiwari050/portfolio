import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  /** If true, animates immediately instead of on scroll */
  immediate?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  as: Tag = 'div',
  className = '',
  style,
  delay = 0,
  immediate = false,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll('.tr-char');
    if (chars.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: immediate ? undefined : {
        trigger: containerRef.current,
        start: 'top 85%',
        end: 'top 50%',
        toggleActions: 'play none none reverse',
      },
      delay,
    });

    tl.fromTo(
      chars,
      {
        y: 50,
        opacity: 0,
        rotateX: -60,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.7,
        stagger: 0.02,
        ease: 'power3.out',
      }
    );

    return () => {
      tl.kill();
    };
  }, [delay, immediate]);

  // Split text into words, then characters within each word
  const words = text.split(' ');

  return (
    <Tag
      ref={containerRef}
      className={`text-reveal ${className}`}
      style={{ ...style, perspective: '600px' }}
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((char, cIdx) => (
            <span
              key={cIdx}
              className="tr-char"
              style={{
                display: 'inline-block',
                willChange: 'transform, opacity',
              }}
            >
              {char}
            </span>
          ))}
          {wIdx < words.length - 1 && (
            <span className="tr-char" style={{ display: 'inline-block' }}>&nbsp;</span>
          )}
        </span>
      ))}
    </Tag>
  );
};
