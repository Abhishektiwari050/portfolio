import { useState, useEffect } from 'react';

interface WorkPreviewProps {
  chatActive: boolean;
}

export function WorkPreviewWidgets({ chatActive }: WorkPreviewProps) {
  const [topLeftIndex, setTopLeftIndex] = useState(0);
  const [bottomRightIndex, setBottomRightIndex] = useState(0);

  // Cycle Top Left every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTopLeftIndex(prev => (prev + 1) % 2);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Cycle Bottom Right every 6 seconds, offset by 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setBottomRightIndex(prev => (prev + 1) % 2);
      }, 6000);
      return () => clearInterval(interval);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div style={{ opacity: chatActive ? 0 : 1, pointerEvents: chatActive ? 'none' : 'auto', transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)', zIndex: 8 }}>
      
      {/* ─── TOP LEFT WIDGET: SQUARE CONSOLE ─────────────────────────── */}
      <div 
        className="liquid-glass-square-widget"
        style={{
          position: 'absolute',
          top: '11vh',
          left: '5vw',
          width: '250px',
          height: '250px',
          borderRadius: '20px',
          boxSizing: 'border-box',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.12) 100%)',
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          borderRightColor: 'rgba(255, 255, 255, 0.3)',
          borderBottomColor: 'rgba(255, 255, 255, 0.3)',
          boxShadow: 'inset 0 1.5px 1px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(0, 0, 0, 0.04), 0 10px 30px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
          animation: 'floatSquare 6s ease-in-out infinite'
        }}
      >
        <style>{`
          @keyframes floatSquare {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(-0.5deg); }
          }
          @keyframes floatCircle {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(8px) rotate(0.5deg); }
          }
          @keyframes pulseScale {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.03); opacity: 1; }
          }
        `}</style>

        {/* Image Frame Wrapper */}
        <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', borderRadius: '14px', overflow: 'hidden', background: 'rgba(0,0,0,0.03)' }}>
          {topLeftIndex === 0 ? (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <img 
                src="/project_lead_gen.png" 
                alt="B2B Lead Gen AI" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
                padding: '16px 12px 10px 12px',
                color: '#ffffff',
                fontFamily: 'var(--font-sans)',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800 }}>Lead Gen AI</div>
                <div style={{ fontSize: '0.52rem', opacity: 0.8, fontFamily: 'var(--font-mono)' }}>// B2B QUALIFICATION</div>
              </div>
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <img 
                src="/project_whatsapp.png" 
                alt="WhatsApp RAG Agent" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
                padding: '16px 12px 10px 12px',
                color: '#ffffff',
                fontFamily: 'var(--font-sans)',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800 }}>WhatsApp RAG</div>
                <div style={{ fontSize: '0.52rem', opacity: 0.8, fontFamily: 'var(--font-mono)' }}>// DEDICATED SUPPORT</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── BOTTOM RIGHT WIDGET: CIRCULAR CONSOLE ─────────────────────── */}
      <div 
        className="liquid-glass-circular-widget"
        style={{
          position: 'absolute',
          bottom: '10vh',
          right: '5vw',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          boxSizing: 'border-box',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.12) 100%)',
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          borderRightColor: 'rgba(255, 255, 255, 0.3)',
          borderBottomColor: 'rgba(255, 255, 255, 0.3)',
          boxShadow: 'inset 0 1.5px 1px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(0, 0, 0, 0.04), 0 10px 30px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
          animation: 'floatCircle 6s ease-in-out infinite'
        }}
      >
        {/* Image Circular Wrapper */}
        <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: 'rgba(0,0,0,0.03)' }}>
          {bottomRightIndex === 0 ? (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <img 
                src="/project_aviation.png" 
                alt="VayuWays Aviation Compliance" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
                padding: '24px 16px 20px 16px',
                color: '#ffffff',
                fontFamily: 'var(--font-sans)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800 }}>VayuWays</div>
                <div style={{ fontSize: '0.52rem', opacity: 0.8, fontFamily: 'var(--font-mono)' }}>// AVIATION COMPLIANCE</div>
              </div>
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <img 
                src="/project_anomaly.png" 
                alt="Vital Anomaly Detector" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
                padding: '24px 16px 20px 16px',
                color: '#ffffff',
                fontFamily: 'var(--font-sans)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800 }}>Anomaly Detector</div>
                <div style={{ fontSize: '0.52rem', opacity: 0.8, fontFamily: 'var(--font-mono)' }}>// CLOUD TELEMETRY</div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
