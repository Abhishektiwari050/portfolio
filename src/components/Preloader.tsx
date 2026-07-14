import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'loading' | 'complete' | 'exit'>('loading');

  useEffect(() => {
    // Show the pencil animation for a full loop of 3 seconds, then complete
    const timer1 = setTimeout(() => {
      setPhase('complete');
    }, 3000);
    const timer2 = setTimeout(() => {
      setPhase('exit');
      onComplete();
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  if (phase === 'exit') return null;

  return (
    <div
      className="preloader-container"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: '#f5f5f7', // Clean off-white background
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: phase === 'complete' ? 0 : 1,
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .pencil {
          display: block;
          width: 10em;
          height: 10em;
        }

        .pencil__body1,
        .pencil__body2,
        .pencil__body3,
        .pencil__eraser,
        .pencil__eraser-skew,
        .pencil__point,
        .pencil__rotate,
        .pencil__stroke {
          animation-duration: 3s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .pencil__body1,
        .pencil__body2,
        .pencil__body3 {
          transform: rotate(-90deg);
        }

        .pencil__body1 {
          animation-name: pencilBody1;
        }

        .pencil__body2 {
          animation-name: pencilBody2;
        }

        .pencil__body3 {
          animation-name: pencilBody3;
        }

        .pencil__eraser {
          animation-name: pencilEraser;
          transform: rotate(-90deg) translate(49px,0);
        }

        .pencil__eraser-skew {
          animation-name: pencilEraserSkew;
          animation-timing-function: ease-in-out;
        }

        .pencil__point {
          animation-name: pencilPoint;
          transform: rotate(-90deg) translate(49px,-30px);
        }

        .pencil__rotate {
          animation-name: pencilRotate;
        }

        .pencil__stroke {
          animation-name: pencilStroke;
          transform: translate(100px,100px) rotate(-113deg);
        }

        /* Animations */
        @keyframes pencilBody1 {
          from,
          to {
            stroke-dashoffset: 351.86;
            transform: rotate(-90deg);
          }
          50% {
            stroke-dashoffset: 150.8;
            transform: rotate(-225deg);
          }
        }

        @keyframes pencilBody2 {
          from,
          to {
            stroke-dashoffset: 406.84;
            transform: rotate(-90deg);
          }
          50% {
            stroke-dashoffset: 174.36;
            transform: rotate(-225deg);
          }
        }

        @keyframes pencilBody3 {
          from,
          to {
            stroke-dashoffset: 296.88;
            transform: rotate(-90deg);
          }
          50% {
            stroke-dashoffset: 127.23;
            transform: rotate(-225deg);
          }
        }

        @keyframes pencilEraser {
          from,
          to {
            transform: rotate(-45deg) translate(49px,0);
          }
          50% {
            transform: rotate(0deg) translate(49px,0);
          }
        }

        @keyframes pencilEraserSkew {
          from,
          32.5%,
          67.5%,
          to {
            transform: skewX(0);
          }
          35%,
          65% {
            transform: skewX(-4deg);
          }
          37.5%, 
          62.5% {
            transform: skewX(8deg);
          }
          40%,
          45%,
          50%,
          55%,
          60% {
            transform: skewX(-15deg);
          }
          42.5%,
          47.5%,
          52.5%,
          57.5% {
            transform: skewX(15deg);
          }
        }

        @keyframes pencilPoint {
          from,
          to {
            transform: rotate(-90deg) translate(49px,-30px);
          }
          50% {
            transform: rotate(-225deg) translate(49px,-30px);
          }
        }

        @keyframes pencilRotate {
          from {
            transform: translate(100px,100px) rotate(0);
          }
          to {
            transform: translate(100px,100px) rotate(720deg);
          }
        }

        @keyframes pencilStroke {
          from {
            stroke-dashoffset: 439.82;
            transform: translate(100px,100px) rotate(-113deg);
          }
          50% {
            stroke-dashoffset: 164.93;
            transform: translate(100px,100px) rotate(-113deg);
          }
          75%,
          to {
            stroke-dashoffset: 439.82;
            transform: translate(100px,100px) rotate(112deg);
          }
        }
        
        .loading-text {
          font-family: 'Geist Mono', monospace;
          font-size: 0.65rem;
          font-weight: 700;
          color: #86868b;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-top: 2rem;
          animation: fadePulse 1.5s ease-in-out infinite;
        }
        
        @keyframes fadePulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Drawing Pencil SVG Loader */}
      <svg xmlns="http://www.w3.org/2000/svg" height="200px" width="200px" viewBox="0 0 200 200" className="pencil">
        <defs>
          <clipPath id="pencil-eraser">
            <rect height={30} width={30} ry={5} rx={5} />
          </clipPath>
        </defs>
        <circle transform="rotate(-113,100,100)" strokeLinecap="round" strokeDashoffset="439.82" strokeDasharray="439.82 439.82" strokeWidth={2} stroke="rgba(0, 85, 255, 0.4)" fill="none" r={70} className="pencil__stroke" />
        <g transform="translate(100,100)" className="pencil__rotate">
          <g fill="none">
            <circle transform="rotate(-90)" strokeDashoffset={402} strokeDasharray="402.12 402.12" strokeWidth={30} stroke="hsl(223,90%,50%)" r={64} className="pencil__body1" />
            <circle transform="rotate(-90)" strokeDashoffset={465} strokeDasharray="464.96 464.96" strokeWidth={10} stroke="hsl(223,90%,60%)" r={74} className="pencil__body2" />
            <circle transform="rotate(-90)" strokeDashoffset={339} strokeDasharray="339.29 339.29" strokeWidth={10} stroke="hsl(223,90%,40%)" r={54} className="pencil__body3" />
          </g>
          <g transform="rotate(-90) translate(49,0)" className="pencil__eraser">
            <g className="pencil__eraser-skew">
              <rect height={30} width={30} ry={5} rx={5} fill="hsl(223,90%,70%)" />
              <rect clipPath="url(#pencil-eraser)" height={30} width={5} fill="hsl(223,90%,60%)" />
              <rect height={20} width={30} fill="hsl(223,10%,90%)" />
              <rect height={20} width={15} fill="hsl(223,10%,70%)" />
              <rect height={20} width={5} fill="hsl(223,10%,80%)" />
              <rect height={2} width={30} y={6} fill="hsla(223,10%,10%,0.2)" />
              <rect height={2} width={30} y={13} fill="hsla(223,10%,10%,0.2)" />
            </g>
          </g>
          <g transform="rotate(-90) translate(49,-30)" className="pencil__point">
            <polygon points="15 0,30 30,0 30" fill="hsl(33,90%,70%)" />
            <polygon points="15 0,6 30,0 30" fill="hsl(33,90%,50%)" />
            <polygon points="15 0,20 10,10 10" fill="hsl(223,10%,10%)" />
          </g>
        </g>
      </svg>

      {/* Technical Tag */}
      <div className="loading-text">
        INITIALIZING CORE DESIGN LAYER
      </div>
    </div>
  );
};
