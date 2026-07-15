import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profile } from '../data/resume';
import { StoryCanvas } from './StoryCanvas';
import { InteractiveChatSystem } from './InteractiveChatSystem';
import { WorkPreviewWidgets } from './WorkPreviewWidgets';

gsap.registerPlugin(ScrollTrigger);

const HERO_PADDING_LEFT = '5vw';

interface LandingPageProps {
  onExplore: () => void;
  chatActive: boolean;
  setChatActive: (active: boolean) => void;
  handleChatFocus: () => void;
  handleExitChat: () => void;
}

export function LandingPage({ 
  onExplore, 
  chatActive, 
  setChatActive, 
  handleChatFocus, 
  handleExitChat 
}: LandingPageProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [chatExpanded, setChatExpanded] = useState(false);

  const lenisRef = useRef<Lenis | null>(null);
  const isProgrammaticScrollRef = useRef(false);

  // Sync expanded state with progress
  // Keep compact pill layout during the GSAP grow animation.
  // Only flip to expanded layout when wrapper is almost full-screen (>= 95%).
  useEffect(() => {
    if (transitionProgress >= 0.95 && !chatExpanded) {
      setChatExpanded(true);
    } else if (transitionProgress < 0.05 && chatExpanded) {
      setChatExpanded(false);
    }
  }, [transitionProgress, chatExpanded]);

  const localExitChat = () => {
    isProgrammaticScrollRef.current = true;
    if (lenisRef.current) {
      lenisRef.current.start();
      lenisRef.current.scrollTo(0, {
        duration: 0.8,
        easing: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
        onComplete: () => {
          isProgrammaticScrollRef.current = false;
          setChatActive(false);
        }
      });
    }
  };

  const localChatFocus = () => {
    handleChatFocus();
    isProgrammaticScrollRef.current = true;
    if (lenisRef.current) {
      const pinTrigger = ScrollTrigger.getById('hero-pin');
      if (pinTrigger) {
        lenisRef.current.scrollTo(pinTrigger.start + (pinTrigger.end - pinTrigger.start) * 0.98, {
          duration: 0.8,
          easing: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
          onComplete: () => {
            isProgrammaticScrollRef.current = false;
            setChatActive(true);
          }
        });
      }
    }
  };

  const chatActiveRef = useRef(chatActive);
  useEffect(() => {
    chatActiveRef.current = chatActive;
  }, [chatActive]);

  // Setup main scroll engines
  useEffect(() => {
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
      setScrollVelocity(e.velocity);
    });

    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    // Two-phase cinematic transition
    // GSAP only controls width/height/bottom/borderRadius.
    // CSS keeps transform:translateX(-50%) so math stays clean:
    //   width=60vw  → left edge at 50%-30% = 20vw  (centered pill)
    //   width=100vw → left edge at 50%-50% = 0     (full bleed)
    // No xPercent / left manipulation needed.
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'hero-pin',
        trigger: '#ch-0',
        start: 'top top',
        end: '+=160%',
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setTransitionProgress(self.progress);
          if (self.progress >= 0.99) {
            if (lenisRef.current && !isProgrammaticScrollRef.current)
              lenisRef.current.stop();
          }
          if (!isProgrammaticScrollRef.current) {
            if (self.progress >= 0.95) {
              if (!chatActiveRef.current) setChatActive(true);
            } else {
              if (chatActiveRef.current) setChatActive(false);
            }
          }
        }
      }
    });

    // ── Phase 1 (0 → 60%): hero exits, welcome card scales up & fades, nav fades, pill docks bottom
    tl.to(
      '.hero-title, .role-badges, .hero-desc, .hero-meta, .hero-scroll-hint, .liquid-glass-square-widget, .liquid-glass-circular-widget',
      { opacity: 0, y: -80, stagger: 0.04, ease: 'power2.in' },
      0
    );
    tl.to('.hero-welcome-card', {
      scale: 1.16,
      opacity: 0,
      ease: 'power2.inOut',
    }, 0);
    tl.to('.site-nav', {
      opacity: 0,
      y: -20,
      ease: 'power2.in',
    }, 0);
    tl.to('.chatgpt-input-wrap', {
      width: '100vw',
      maxWidth: '100vw',
      bottom: '0px',
      borderRadius: '24px 24px 0px 0px',
      ease: 'power2.inOut',
    }, 0);

    // ── Phase 2 (50% → 100%): full-width bar slides UP to fill screen
    tl.to('.chatgpt-input-wrap', {
      height: '100vh',
      borderRadius: '0px',
      ease: 'power3.out',
    }, 0.5);

    return () => {
      lenis.destroy();
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [setChatActive]);

  return (
    <div className="landing-page-mount" style={{ width: '100%', minHeight: '220vh', overflowX: 'hidden' }}>
      
      {/* Sticky 3D Particle Face Background (Fades out partially to let the face spin behind blurred glass) */}
      <div 
        style={{ 
          opacity: Math.max(0, 1 - transitionProgress * 1.2), 
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none'
        }}
      >
        <StoryCanvas 
          scrollProgress={scrollProgress} 
          scrollVelocity={scrollVelocity}
          isExploreActivated={transitionProgress >= 0.98}
          transitionProgress={transitionProgress}
          isChatActive={chatActive}
        />
      </div>

      <main className="story-main" style={{ width: '100%' }}>
        
        {/* ─── CHAPTER 0: IDENTITY & CHAT ─────────────────────────────── */}
        <section 
          id="ch-0" 
          className="chapter chapter--hero" 
          style={{ 
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {/* Popping previews of shipped projects */}
          <WorkPreviewWidgets chatActive={chatActive} />
          <div className="chapter__inner chapter__inner--hero" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '100%',
            boxSizing: 'border-box',
            paddingLeft: '20px',
            paddingRight: '20px',
            textAlign: 'center'
          }}>
            <div className="hero-flex-container" style={{ 
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              transform: 'translateY(-20px)',
              transition: 'transform 0.3s ease'
            }}>
              {/* Premium Frosted Glass Text Console Panel */}
              <div className="hero-welcome-card" style={{
                background: 'rgba(255, 255, 255, 0.45)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.55)',
                borderRadius: '24px',
                padding: '24px 32px',
                maxWidth: '560px',
                margin: '0 auto 1.2rem auto',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transformOrigin: 'center center',
              }}>
                <h1 className="hero-title" style={{ display: 'none' }}>Abhishek Tiwari — AI Engineer</h1>

                <div className="role-badges" style={{ justifyContent: 'center', gap: '8px', marginBottom: '0.8rem' }}>
                  <span className="role-badge" style={{ fontSize: '0.62rem', padding: '5px 12px' }}>
                    <span className="role-badge__dot" />
                    AI Engineer
                  </span>
                </div>

                <p className="hero-desc" style={{ 
                  textAlign: 'center', 
                  margin: '0', 
                  maxWidth: '500px',
                  fontSize: '0.94rem',
                  lineHeight: 1.6,
                  color: '#2c3e50',
                  fontWeight: 500
                }}>
                  Building production-ready RAG pipelines, multi-agent systems, and FastAPI backend services. 
                  Delivering intelligent client AI solutions at Vistar.
                </p>
              </div>

              {/* Layout placeholder to reserve space for absolute input wrap */}
              <div style={{ width: '60vw', height: '126px', marginBottom: '1rem', visibility: 'hidden' }} />
            </div>
          </div>

          {/* ── Absolutely Positioned Expanding Chat Input/Desk ──────────────── */}
          <div
            className={`chatgpt-input-wrap ${chatExpanded ? 'expanded' : ''}`}
            style={{
              opacity: 1,
              pointerEvents: 'auto',
            }}
          >
            <InteractiveChatSystem
              onExplore={onExplore}
              isExploreActivated={false}
              onExitChat={() => {
                handleExitChat();
                localExitChat();
              }}
              onFocus={localChatFocus}
              isExpanded={chatExpanded}
            />
          </div>

          <div className="hero-meta" style={{ 
            position: 'absolute',
            bottom: '3vh',
            left: HERO_PADDING_LEFT,
            display: 'flex',
            gap: '2rem',
            margin: '0',
            zIndex: 10
          }}>
            <span className="hero-meta__item">📍 DELHI, INDIA</span>
            <span className="hero-meta__item">✉ {profile.email}</span>
          </div>

          <div className="hero-scroll-hint" style={{
            position: 'absolute',
            bottom: '3vh',
            right: HERO_PADDING_LEFT,
            display: chatActive ? 'none' : 'flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: 'var(--text-muted)',
            zIndex: 10
          }}>
            <div className="hero-scroll-hint__bar" style={{
              width: '30px',
              height: '1px',
              background: 'currentColor',
              opacity: 0.5
            }} />
            <span>SCROLL TO ENTER TERMINAL</span>
          </div>
        </section>
      </main>
    </div>
  );
}
