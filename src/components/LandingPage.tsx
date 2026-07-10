import { profile } from '../data/resume';
import { StoryCanvas } from './StoryCanvas';
import { InteractiveChatSystem } from './InteractiveChatSystem';

const HERO_PADDING_LEFT = '5vw';

interface LandingPageProps {
  onExplore: () => void;
  chatActive: boolean;
  setChatActive: (active: boolean) => void;
  handleChatFocus: () => void;
  handleExitChat: () => void;
}

export function LandingPage({ onExplore, chatActive, handleChatFocus, handleExitChat }: LandingPageProps) {
  return (
    <div className="landing-page-mount">
      <StoryCanvas 
        scrollProgress={0} 
        scrollVelocity={0}
        isExploreActivated={false}
        transitionProgress={0}
        isChatActive={chatActive}
      />
      
      <main className="story-main" style={{ height: '100vh', overflow: 'hidden' }}>
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
            justifyContent: 'flex-start',
            width: '100%',
            boxSizing: 'border-box',
            paddingLeft: window.innerWidth <= 768 ? '20px' : HERO_PADDING_LEFT,
            paddingRight: window.innerWidth <= 768 ? '20px' : '0',
          }}>
            <div className="hero-text-col" style={{ 
              maxWidth: window.innerWidth <= 768 ? '100%' : '640px',
              width: window.innerWidth <= 768 ? '100%' : undefined,
              margin: '0',
            }}>
              <div className="hero-eyebrow">
                <span className="hero-eyebrow__dot" />
                <span>AI Systems & LLM Architect</span>
              </div>

              <h1 className="hero-title">
                <span className="hero-word">ABHISHEK</span>
                <span className="hero-word" style={{ display: 'block' }}>TIWARI.</span>
              </h1>

              <div className="role-badges">
                <span className="role-badge">
                  <span className="role-badge__dot" />
                  AI Systems Engineer
                </span>
                <span className="role-badge">
                  <span className="role-badge__dot" />
                  LLM Architect
                </span>
              </div>

              <p className="hero-desc">
                Building production-ready RAG pipelines, multi-agent systems, and FastAPI backend services. 
                Delivering intelligent client AI solutions at Vistar.
              </p>

              <div className="terminal-wrapper" style={{ marginTop: '1.2rem' }}>
                <InteractiveChatSystem 
                  onExplore={onExplore} 
                  isExploreActivated={false} 
                  onExitChat={handleExitChat}
                  onFocus={handleChatFocus}
                />
              </div>
            </div>
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
        </section>
      </main>
    </div>
  );
}
