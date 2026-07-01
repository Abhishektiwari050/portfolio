import React, { useEffect } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';

export const AnatomyApp: React.FC = () => {
  // Inject Bebas Neue font for the brutalist heading
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div 
      className="min-h-screen w-screen relative overflow-hidden select-none" 
      style={{ backgroundColor: '#f5f5f7', fontFamily: '"Outfit", sans-serif' }}
    >
      {/* ThreeJS Canvas in the foreground (z-index: 10) */}
      <ThreeCanvas viewMode="anatomy" scrollProgress={0} scrollVelocity={0} />

      {/* Center Navigation Bar (Shared across top of the entire screen) */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 top-8 flex items-center gap-6 z-20 text-[11px] font-mono tracking-widest"
        style={{ color: '#1d1d1f' }}
      >
        <a 
          href="/index.html" 
          className="px-3 py-1 border border-black/10 rounded-sm hover:bg-black/5 transition-colors"
          style={{ color: '#1d1d1f' }}
        >
          [ ARCHITECT ]
        </a>
        <span className="opacity-35">// INTRO</span>
        <span className="opacity-35">// WORK</span>
        <span className="text-black font-medium">// ANATOMY</span>
        <span className="opacity-35">// CONTACT</span>
      </div>

      {/* Main Layout Grid (z-index: 5, behind canvas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen w-full relative z-5">
        
        {/* ================= LEFT HALF: ACID YELLOW PANEL ================= */}
        <div 
          className="relative p-8 md:p-16 flex flex-col justify-between overflow-hidden border-r border-black/5"
          style={{ backgroundColor: '#d7ff00', color: '#000000' }}
        >
          {/* Subtle Grid lines */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
            <div className="absolute left-1/4 top-0 bottom-0 w-[1px] bg-black" />
            <div className="absolute left-2/4 top-0 bottom-0 w-[1px] bg-black" />
            <div className="absolute left-3/4 top-0 bottom-0 w-[1px] bg-black" />
            <div className="absolute left-0 right-0 top-1/4 h-[1px] bg-black" />
            <div className="absolute left-0 right-0 top-2/4 h-[1px] bg-black" />
            <div className="absolute left-0 right-0 top-3/4 h-[1px] bg-black" />
          </div>

          {/* Top Left Crosshair */}
          <div className="absolute left-8 top-8 font-light text-2xl opacity-40 select-none pointer-events-none">
            +
          </div>

          {/* Vertical Text Overlay / Left Margin Info */}
          <div className="absolute left-8 top-28 flex flex-col gap-1 text-[10px] font-mono tracking-[0.2em] uppercase opacity-60 leading-relaxed">
            <div>STRUCTURE.</div>
            <div>BONES.</div>
            <div>FUNCTION.</div>
            <div>FORM FOLLOWS</div>
            <div>PURPOSE.</div>
          </div>

          {/* Empty spacer to push content */}
          <div className="h-12" />

          {/* Coordinate Box at Bottom Left */}
          <div className="mt-auto font-mono text-[11px] tracking-widest opacity-70 leading-normal border-l border-black/30 pl-3">
            <div>51.5074° N</div>
            <div>0.1278° W</div>
          </div>
        </div>

        {/* ================= RIGHT HALF: OFF-WHITE PANEL ================= */}
        <div 
          className="relative p-8 md:p-16 flex flex-col justify-between overflow-hidden"
          style={{ backgroundColor: '#f5f5f7', color: '#1d1d1f' }}
        >
          {/* Subtle Grid lines */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
            <div className="absolute left-1/4 top-0 bottom-0 w-[1px] bg-black" />
            <div className="absolute left-2/4 top-0 bottom-0 w-[1px] bg-black" />
            <div className="absolute left-3/4 top-0 bottom-0 w-[1px] bg-black" />
            <div className="absolute left-0 right-0 top-1/4 h-[1px] bg-black" />
            <div className="absolute left-0 right-0 top-2/4 h-[1px] bg-black" />
            <div className="absolute left-0 right-0 top-3/4 h-[1px] bg-black" />
          </div>

          {/* Top Right Header Info */}
          <div className="absolute right-8 top-8 text-right font-mono text-[9px] tracking-[0.2em] leading-normal opacity-65 uppercase">
            <div>BRUTALISM</div>
            <div className="text-black font-semibold">/01</div>
            <div>AESTHETICS</div>
            <div>OF FUNCTION</div>
          </div>

          {/* Center Navigation Bar (now centered globally to prevent clipping) */}

          {/* Middle Content: Brutalist Typography & Graphic */}
          <div className="my-auto max-w-lg pt-16">
            <div className="font-mono text-xs tracking-[0.2em] opacity-45 mb-2">01</div>
            
            <h1 
              className="text-[72px] md:text-[88px] leading-[0.85] font-normal uppercase tracking-tight text-black mb-8"
              style={{ fontFamily: '"Bebas Neue", sans-serif' }}
            >
              BRUTAL<br />ARCHITECTURE
            </h1>

            <div className="font-mono text-[10px] tracking-[0.2em] opacity-50 uppercase mb-8 leading-relaxed">
              <div>RAW.</div>
              <div>FUNCTIONAL.</div>
              <div>TIMELESS.</div>
            </div>

            {/* Concrete Block with Yellow Triangle Graphic */}
            <div className="w-[170px] h-[85px] relative border border-black/15 bg-[#ababab] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
              {/* Noise overlay and concrete texture */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/10 mix-blend-overlay" />
              <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:3px_3px]" />
              {/* Yellow triangle (SVG polygon) */}
              <svg 
                className="absolute right-0 bottom-0 w-[85px] h-[85px] text-[#d7ff00] fill-current" 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
                style={{ color: '#d7ff00' }}
              >
                <polygon points="100,0 100,100 0,100" style={{ color: '#d7ff00' }} />
              </svg>
            </div>
          </div>

          {/* Bottom Right Scroll Indicator */}
          <div className="mt-auto ml-auto flex items-center gap-4 text-[10px] font-mono tracking-[0.25em] opacity-50 uppercase">
            <div className="w-12 h-[1px] bg-black/30" />
            <span>SCROLL</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnatomyApp;
