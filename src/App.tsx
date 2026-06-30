import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Preloader } from './components/Preloader';
import { ThreeCanvas } from './components/ThreeCanvas';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { ventures } from './data/ventures';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);

  const lenisRef = useRef<any>(null);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', (e: any) => {
      setScrollProgress(e.progress);
      setScrollVelocity(Math.abs(e.velocity));
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Initial check for hash on load
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash) as HTMLElement;
      if (target) {
        setTimeout(() => {
          lenis.scrollTo(target);
        }, 100);
      }
    }

    // Refresh GSAP ScrollTrigger after rendering
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Preloader — masks everything until ready */}
      <Preloader onComplete={() => setIsLoaded(true)} />

      {/* 3D particle background */}
      <ThreeCanvas 
        scrollProgress={scrollProgress} 
        scrollVelocity={scrollVelocity} 
        viewMode="portfolio"
      />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Fixed top Navbar */}
      <Navbar />

      {/* Atmosphere layers */}
      <div className="grid-overlay" />
      <div className="noise-overlay" />
      <div className="scanline" />

      {/* ── Content (renders after preloader completes) ── */}
      {isLoaded && (
        <main className="content-main">
          {/* Intro Section */}
          <section id="hero" className="hero-section">
            <div className="hero-content">
              <span className="hero-tag gsap-fade-in">[ SYS_INIT: ONLINE ]</span>
              <h1 className="hero-title gsap-fade-in">
                ENGINEERING<br />
                INTELLIGENT<br />
                SYSTEMS.
              </h1>
              <p className="hero-subtitle gsap-fade-in">
                AI Systems Architect & Founder. Building multi-agent
                orchestration runtimes, GPU-accelerated vector search
                engines, and planetary-scale predictive networks.
              </p>
              <div className="hero-scroll-indicator gsap-fade-in">
                <span className="scroll-bar"></span>
                <span className="scroll-text">SCROLL TO EXPLORE</span>
              </div>
            </div>
          </section>

          {/* Project Sections */}
          {ventures.map((venture) => (
            <React.Fragment key={venture.id}>
              <div className="section-divider" />
              <section 
                id={venture.id} 
                className="project-section"
              >
                <div className="project-grid">
                  {/* Left Column: Text Content */}
                  <div className="project-text-col gsap-fade-in">
                    <span className="project-meta-tag">
                      {venture.period} &nbsp;•&nbsp; {venture.role}
                    </span>
                    <h2 className="project-title">{venture.title}</h2>
                    <p className="project-tagline">{venture.tagline}</p>
                    <p className="project-description">{venture.story[0]}</p>
                    
                    <div className="tech-stack">
                      {venture.techStack.map((tag) => (
                        <span key={tag} className="tech-tag">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Metrics Panel */}
                  <div className="project-metrics-col gsap-fade-in">
                    <div className="metrics-panel">
                      {venture.metrics.map((metric, mIdx) => (
                        <div key={mIdx} className="metric-item">
                          <span className="metric-label">{metric.label}</span>
                          <div className="metric-value">{metric.value}</div>
                          <p className="metric-desc">{metric.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </React.Fragment>
          ))}

          {/* Connect Section */}
          <section id="connect" className="connect-section">
            <div className="project-grid">
              <div className="project-text-col gsap-fade-in">
                <span className="project-meta-tag">// CONTACT</span>
                <h2 className="project-title">CONNECT.</h2>
                <p className="project-description">
                  Interested in building high-performance AI runtimes or scaling agentic infrastructures? Let's discuss system architecture.
                </p>
                
                <div className="connect-links">
                  <a href="mailto:abhishek@example.com" className="connect-link">
                    <span className="connect-link-label">EMAIL</span> abhishek@example.com
                  </a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="connect-link">
                    <span className="connect-link-label">GITHUB</span> github.com/architect
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="connect-link">
                    <span className="connect-link-label">LINKEDIN</span> linkedin.com/in/architect
                  </a>
                </div>
              </div>
            </div>
          </section>
          
          {/* Footer spacer */}
          <div style={{ height: '10vh' }} />
        </main>
      )}
    </>
  );
}

export default App;
