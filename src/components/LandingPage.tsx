import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StoryCanvas } from './StoryCanvas';
import { InteractiveChatSystem } from './InteractiveChatSystem';

gsap.registerPlugin(ScrollTrigger);

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
  handleExitChat: _handleExitChat 
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

  const handleCollapsedClick = () => {
    isProgrammaticScrollRef.current = true;
    if (lenisRef.current) {
      const pinTrigger = ScrollTrigger.getById('hero-pin');
      if (pinTrigger) {
        lenisRef.current.scrollTo(pinTrigger.start + (pinTrigger.end - pinTrigger.start) * 0.98, {
          duration: 1.2,
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

    // ── Image 1 to Image 2 simple cross-fade scroll transition
    tl.to(
      '.hero-welcome-card, .chatgpt-input-wrap-collapsed',
      { opacity: 0, ease: 'power2.out' },
      0
    );

    tl.fromTo(
      '.chatgpt-input-wrap-expanded',
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, ease: 'power2.inOut' },
      0
    );

    tl.fromTo(
      '.role-badge-bottom',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, ease: 'power2.inOut' },
      0
    );

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
          opacity: 1, 
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
              transition: 'transform 0.3s ease'
            }}>
              {/* Premium Frosted Glass Text Console Panel */}
              <div className="hero-welcome-card" style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(30px) saturate(120%)',
                WebkitBackdropFilter: 'blur(30px) saturate(120%)',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                borderRadius: '28px',
                padding: '32px 40px',
                maxWidth: '520px',
                margin: '0 auto 1.2rem auto',
                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transformOrigin: 'center center',
                visibility: transitionProgress >= 0.9 ? 'hidden' : 'visible'
              }}>
                <h1 className="hero-title" style={{ display: 'none' }}>Abhishek Tiwari — AI Engineer</h1>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(0, 85, 255, 0.08)',
                  border: '1px solid rgba(0, 85, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '4px 12px',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: '#0055ff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '1rem'
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0055ff' }} />
                  AI Engineer
                </div>

                <p className="hero-desc" style={{ 
                  textAlign: 'center', 
                  margin: '0', 
                  maxWidth: '450px',
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
              <div style={{ width: '60vw', height: '120px', marginBottom: '1rem', visibility: 'hidden' }} />
            </div>
          </div>

          {/* ── Collapsed Input Bar (Layout A - Image 1 Style) ──────────────── */}
          <div
            className="chatgpt-input-wrap-collapsed"
            onClick={handleCollapsedClick}
            style={{
              position: 'absolute',
              bottom: '4vh',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60vw',
              maxWidth: '900px',
              minWidth: '320px',
              height: '120px',
              borderRadius: '28px',
              zIndex: 10,
              background: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(30px) saturate(120%)',
              WebkitBackdropFilter: 'blur(30px) saturate(120%)',
              border: '1px solid rgba(255,255,255,0.65)',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px 20px',
              boxSizing: 'border-box',
              cursor: 'pointer'
            }}
          >
            {/* Top row: Message placeholder */}
            <div style={{ width: '100%', fontSize: '0.94rem', color: '#86868b', textAlign: 'left', pointerEvents: 'none', userSelect: 'none', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 500 }}>
              Message Liquid Glass...
            </div>

            {/* Bottom row: Actions & Send */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              {/* Left actions: Clip & Search */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Attachment Button */}
                <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', color: '#86868b' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </button>
                {/* Collapsed Search Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', height: '32px', padding: '0 14px', borderRadius: '16px', background: '#0055ff', color: '#ffffff', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0, boxShadow: '0 2px 8px rgba(0, 85, 255, 0.15)' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  Search
                </div>
              </div>

              {/* Right action: Send Button */}
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0055ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(0, 85, 255, 0.15)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              </div>
            </div>
          </div>

          {/* ── Expanded Floating Chatbot Card (Layout B - Image 2 Style) ─────────── */}
          <div
            className="chatgpt-input-wrap-expanded"
            style={{
              position: 'absolute',
              bottom: '18vh',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60vw',
              maxWidth: '680px',
              minWidth: '320px',
              height: '440px',
              borderRadius: '28px',
              zIndex: 10,
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(30px) saturate(120%)',
              WebkitBackdropFilter: 'blur(30px) saturate(120%)',
              border: '1px solid rgba(255, 255, 255, 0.65)',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxSizing: 'border-box'
            }}
          >
            <InteractiveChatSystem
              onExplore={onExplore}
              isExploreActivated={false}
              onFocus={localChatFocus}
              isExpanded={true}
            />
          </div>

          {/* ── Centered Role Badge at the Bottom (Layout B) ────────────────── */}
          <div className="role-badge-bottom" style={{
            position: 'absolute',
            bottom: '4vh',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.45)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            borderRadius: '16px',
            padding: '5px 12px',
            fontSize: '0.62rem',
            fontWeight: 700,
            color: '#0055ff',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            zIndex: 9,
            pointerEvents: 'none'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0055ff' }} />
            AI Engineer
          </div>


        </section>
      </main>
    </div>
  );
}
