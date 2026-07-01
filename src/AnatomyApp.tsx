import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

// ── Particle Shaders ──────────────────────────────────────────────────────────
const vertexShader = `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    vec3 pos = position;

    float dist = distance(pos.xy, uMouse);
    if (dist < 18.0) {
      float force = (1.0 - (dist / 18.0)) * 3.5;
      vec3 dir = normalize(vec3(pos.xy - uMouse, 0.0));
      pos += dir * force;
    }

    pos.x += sin(uTime * 0.7 + position.y * 0.06) * 0.22;
    pos.y += cos(uTime * 0.5 + position.x * 0.06) * 0.22;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * uPixelRatio * (200.0 / -mvPosition.z);
    vAlpha = smoothstep(-50.0, 50.0, pos.y);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    float strength = pow(1.0 - dist * 2.0, 1.2);
    gl_FragColor = vec4(vColor, strength * vAlpha * 0.9);
  }
`;

// ── Particle Face Component ────────────────────────────────────────────────────
const ParticleFace: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 500);
    camera.position.set(0, 0, 90);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const PARTICLE_COUNT = 28000;

    // 1. Create geometry and attributes FIRST
    const currentPositions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * 2.0 * Math.PI;
      const phi = Math.acos(Math.random() * 2.0 - 1.0);
      const r = 16.0 + Math.random() * 2.0;
      currentPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      currentPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 1.25;
      currentPositions[i * 3 + 2] = r * Math.cos(phi) * 0.9;
    }

    const posAttr = new THREE.BufferAttribute(currentPositions, 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', posAttr);

    const sizes = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) sizes[i] = Math.random() * 1.8 + 0.6;
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    const palette = [
      new THREE.Color(0x0f172a), new THREE.Color(0x1e293b),
      new THREE.Color(0x1e3a8a), new THREE.Color(0x3b82f6),
      new THREE.Color(0x4f46e5), new THREE.Color(0x2563eb),
    ];
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    points.rotation.y = Math.PI * 0.15;
    scene.add(points);

    // 2. Load face mesh AFTER geometry is created (so posAttr is in scope)
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load('/LeePerrySmith.glb', (gltf) => {
      let headMesh: THREE.Mesh | null = null;
      gltf.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) headMesh = child as THREE.Mesh;
      });
      if (headMesh) {
        const sampler = new MeshSurfaceSampler(headMesh).build();
        const tempPos = new THREE.Vector3();
        const scale = 15.0;
        const yOffset = -1.1;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          sampler.sample(tempPos);
          currentPositions[i * 3]     = tempPos.x * scale;
          currentPositions[i * 3 + 1] = (tempPos.y + yOffset) * scale;
          currentPositions[i * 3 + 2] = -tempPos.z * scale;
        }
        posAttr.needsUpdate = true;
      }
    }, undefined, (err) => console.warn('Face mesh load failed:', err));

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let frameId: number;
    const startTime = performance.now();

    const animate = () => {
      const elapsed = (performance.now() - startTime) * 0.001;
      material.uniforms.uTime.value = elapsed;

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;
      material.uniforms.uMouse.value.set(mouseRef.current.x * 30.0, mouseRef.current.y * 30.0);

      points.rotation.y = Math.PI * 0.15 + elapsed * 0.04 + mouseRef.current.x * 0.2;
      points.rotation.x = mouseRef.current.y * 0.1;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

// ── Main AnatomyApp ────────────────────────────────────────────────────────────
export const AnatomyApp: React.FC = () => {
  const [time, setTime] = useState('');
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Permanent+Marker&family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const updateTime = () => setTime(new Date().toTimeString().slice(0, 8));
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      document.head.removeChild(link);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      id="anatomy-root"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: '"Outfit", sans-serif',
        position: 'relative',
        background: '#ffd500', // yellow base body background to prevent any playwright alpha checkerboard
      }}
    >
      {/* ── Top Choose a Side Nav Badge ───────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '8px 24px',
          background: '#ffffff',
          border: '3px solid #000000',
          borderRadius: '30px',
          boxShadow: '4px 4px 0px #000000',
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: '22px',
          letterSpacing: '0.08em',
          pointerEvents: 'none',
          userSelect: 'none',
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Left Arrow (Pink) */}
        <span style={{ color: '#ff007f', fontWeight: 'bold', fontSize: '26px' }}>←</span>
        <span style={{ color: '#000000' }}>CHOOSE A SIDE</span>
        {/* Right Arrow (Blue) */}
        <span style={{ color: '#0066ff', fontWeight: 'bold', fontSize: '26px' }}>→</span>
      </div>

      {/* ── Main Split Layout ──────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {/* ════ LEFT PANEL: CREATIVES (ARTISTIC YELLOW) ════════════════════ */}
        <a
          href="/index.html#hero" // Redirects to creative portfolio intro
          onMouseEnter={() => setHoverSide('left')}
          onMouseLeave={() => setHoverSide(null)}
          style={{
            display: 'block',
            flex: '0 0 50%',
            height: '100%',
            backgroundColor: '#ffd500',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'background-color 0.3s',
            isolation: 'isolate',
          }}
        >
          {/* Vertical Checkered Border on Left Edge */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '24px',
              background: 'repeating-conic-gradient(#000000 0% 25%, #ffffff 0% 50%) 50% / 24px 24px',
              zIndex: 10,
              boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
            }}
          />

          {/* Thin dividing line next to checkerboard */}
          <div
            style={{
              position: 'absolute',
              left: '24px',
              top: 0,
              bottom: 0,
              width: '1.5px',
              backgroundColor: '#000000',
              zIndex: 10,
            }}
          />

          {/* ── Background Splatters and Doodles ── */}
          {/* Neon Pink Splatter Top Left */}
          <div
            style={{
              position: 'absolute',
              top: '-5%',
              left: '10%',
              width: '280px',
              height: '240px',
              opacity: 0.85,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <path
                d="M30,20 C50,10 80,15 90,35 C100,55 90,80 70,85 C50,90 20,80 15,60 C10,40 10,30 30,20 Z"
                fill="#ff007f"
              />
              <circle cx="20" cy="15" r="4" fill="#ff007f" />
              <circle cx="85" cy="85" r="5" fill="#ff007f" />
              <circle cx="95" cy="50" r="3" fill="#ff007f" />
            </svg>
          </div>

          {/* Electric Blue Splatter Middle Right */}
          <div
            style={{
              position: 'absolute',
              top: '40%',
              right: '-10%',
              width: '320px',
              height: '280px',
              opacity: 0.8,
              zIndex: 3,
              pointerEvents: 'none',
            }}
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <path
                d="M25,30 C45,15 75,25 85,45 C95,65 80,85 60,90 C40,95 15,80 10,60 C5,40 5,45 25,30 Z"
                fill="#00bfff"
              />
              <circle cx="15" cy="20" r="4" fill="#00bfff" />
              <circle cx="50" cy="95" r="5" fill="#00bfff" />
            </svg>
          </div>

          {/* Neon Green Lightning Bolt Doodle */}
          <div
            style={{
              position: 'absolute',
              top: '25%',
              right: '18%',
              zIndex: 3,
              transform: 'rotate(15deg)',
              pointerEvents: 'none',
            }}
          >
            <svg width="50" height="90" viewBox="0 0 60 100">
              <path
                d="M 35 5 L 10 50 L 30 50 L 20 95 L 50 40 L 30 40 Z"
                fill="#39ff14"
                stroke="#000000"
                strokeWidth="4"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Blue Asterisk Doodle */}
          <div
            style={{
              position: 'absolute',
              top: '32%',
              left: '12%',
              zIndex: 3,
              pointerEvents: 'none',
            }}
          >
            <svg width="70" height="70" viewBox="0 0 80 80">
              <path
                d="M 40 10 L 40 70 M 10 40 L 70 40 M 18 18 L 62 62 M 62 18 L 18 62"
                fill="none"
                stroke="#0066ff"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Green Spiral Doodle */}
          <div
            style={{
              position: 'absolute',
              bottom: '26%',
              left: '8%',
              zIndex: 3,
              pointerEvents: 'none',
            }}
          >
            <svg width="90" height="90" viewBox="0 0 100 100">
              <path
                d="M 50 50 Q 42 38 52 32 Q 68 38 62 58 Q 45 72 30 55 Q 15 28 42 12 Q 80 2 85 50 Q 80 88 30 80 Q 2 55 22 25"
                fill="none"
                stroke="#39ff14"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Blue 'X' Cross Doodle */}
          <div
            style={{
              position: 'absolute',
              top: '48%',
              right: '8%',
              zIndex: 4,
              transform: 'rotate(12deg)',
              pointerEvents: 'none',
            }}
          >
            <svg width="80" height="80" viewBox="0 0 80 80">
              <path
                d="M 15 15 L 65 65 M 65 15 L 15 65"
                fill="none"
                stroke="#0055ff"
                strokeWidth="12"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Crown Doodle (Positioned above Title) */}
          <div
            style={{
              position: 'absolute',
              top: '13%',
              left: '32%',
              zIndex: 4,
              transform: 'rotate(-8deg)',
              pointerEvents: 'none',
            }}
          >
            <svg width="90" height="60" viewBox="0 0 100 70">
              <path
                d="M 15 55 L 20 20 L 40 40 L 50 15 L 60 40 L 80 20 L 85 55 Z"
                fill="none"
                stroke="#000000"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M 12 58 Q 50 50 88 58" fill="none" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
              <circle cx="20" cy="16" r="4.5" fill="#000000" />
              <circle cx="50" cy="11" r="4.5" fill="#000000" />
              <circle cx="80" cy="16" r="4.5" fill="#000000" />
            </svg>
          </div>

          {/* Smiley Face Doodle */}
          <div
            style={{
              position: 'absolute',
              bottom: '6%',
              left: '10%',
              zIndex: 4,
              transform: 'rotate(-5deg)',
              pointerEvents: 'none',
            }}
          >
            <svg width="110" height="110" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="45" fill="#ffd500" stroke="#000000" strokeWidth="6" />
              <ellipse cx="44" cy="48" rx="5" ry="7.5" fill="#000000" />
              <ellipse cx="76" cy="48" rx="5" ry="7.5" fill="#000000" />
              <path d="M 38 68 Q 60 92 82 68" fill="none" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>

          {/* ── Left Content Block (Creatives) ── */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '26%',
              zIndex: 10,
              transform: 'rotate(-3deg)',
              pointerEvents: 'none',
            }}
          >
            <h1
              style={{
                fontFamily: '"Permanent Marker", sans-serif',
                fontSize: 'clamp(56px, 7vw, 88px)',
                color: '#000000',
                margin: 0,
                lineHeight: 1,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              CREATIVES
            </h1>
            <div
              style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.38em',
                color: '#000000',
                marginTop: '6px',
                textAlign: 'center',
                borderTop: '3px solid #000000',
                paddingTop: '6px',
                display: 'inline-block',
                width: '100%',
              }}
            >
              ABOUT DESIGN
            </div>
          </div>

          {/* Skull Bust (Natively facing right, on solid yellow background) */}
          <img
            src="/skull_yellow.png"
            alt="Anatomical skull bust"
            style={{
              position: 'absolute',
              bottom: '-3%',
              right: '-6%',
              height: '92%',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(-16px 10px 32px rgba(0,0,0,0.18))',
              pointerEvents: 'none',
              userSelect: 'none',
              display: 'block',
              zIndex: 2,
              transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          />

          {/* Hover highlight overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              opacity: hoverSide === 'left' ? 1 : 0,
              transition: 'opacity 0.3s',
              zIndex: 5,
            }}
          />
        </a>

        {/* ════ RIGHT PANEL: ENGINEERING (TECHNICAL GRID) ════════════════════ */}
        <a
          href="/index.html#aetheris" // Redirects to engineering projects
          onMouseEnter={() => setHoverSide('right')}
          onMouseLeave={() => setHoverSide(null)}
          style={{
            display: 'block',
            flex: '1',
            height: '100%',
            backgroundColor: '#f6f6f6',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            textDecoration: 'none',
            borderLeft: '3px solid #000000',
            isolation: 'isolate',
          }}
        >
          {/* Precise Tech Grid Background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: 0.08,
              backgroundImage: `
                linear-gradient(to right, #000000 1px, transparent 1px),
                linear-gradient(to bottom, #000000 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              zIndex: 1,
            }}
          />

          {/* ── Technical HUD elements ── */}
          {/* Top-right meta labels */}
          <div
            style={{
              position: 'absolute',
              top: '28px',
              right: '32px',
              textAlign: 'right',
              fontFamily: '"Space Mono", monospace',
              fontSize: '8px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              opacity: 0.6,
              lineHeight: 1.9,
              pointerEvents: 'none',
              zIndex: 10,
              color: '#000000',
            }}
          >
            <div>010010 0011</div>
            <div style={{ fontWeight: 700, color: '#000000' }}>10111 1 0100</div>
          </div>

          {/* Top-right BUILD/SOLVE/SCALE labels */}
          <div
            style={{
              position: 'absolute',
              top: '90px',
              right: '32px',
              textAlign: 'right',
              fontFamily: '"Space Mono", monospace',
              fontSize: '8px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              opacity: 0.55,
              lineHeight: 2.2,
              pointerEvents: 'none',
              zIndex: 10,
              color: '#000000',
            }}
          >
            <div>BUILD</div>
            <div>SOLVE</div>
            <div>OPTIMIZE</div>
            <div>SCALE</div>
          </div>

          {/* Left panel vertical metadata info */}
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              left: '36px',
              fontFamily: '"Space Mono", monospace',
              fontSize: '8px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              opacity: 0.55,
              lineHeight: 2.2,
              pointerEvents: 'none',
              zIndex: 10,
              color: '#000000',
            }}
          >
            <div>—</div>
            <div>LOGIC</div>
            <div>STRUCTURE</div>
            <div>PERFORMANCE</div>
            <div>IMPACT</div>
          </div>

          {/* Crosshair top-left of right panel */}
          <div
            style={{
              position: 'absolute',
              top: '80px',
              left: '40px',
              fontFamily: '"Space Mono", monospace',
              fontSize: '18px',
              opacity: 0.25,
              pointerEvents: 'none',
              zIndex: 10,
              color: '#000000',
            }}
          >
            +
          </div>

          {/* Crosshair center of right panel */}
          <div
            style={{
              position: 'absolute',
              top: '45%',
              left: '32%',
              fontFamily: '"Space Mono", monospace',
              fontSize: '18px',
              opacity: 0.2,
              pointerEvents: 'none',
              zIndex: 10,
              color: '#000000',
            }}
          >
            +
          </div>

          {/* ── Right Content Block (Engineering) ── */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '12%',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            <h1
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: 'clamp(64px, 8.5vw, 104px)',
                lineHeight: 0.9,
                fontWeight: 400,
                letterSpacing: '0.02em',
                color: '#000000',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              ENGINEERING
            </h1>
            <div
              style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                color: '#0066ff',
                marginTop: '10px',
                borderTop: '2px solid #0066ff',
                paddingTop: '6px',
                display: 'inline-block',
              }}
            >
              — ABOUT DEVELOPMENT —
            </div>
          </div>

          {/* 3D Particle Face Canvas Container (Flipped facing left) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '60%',
              height: '100%',
              zIndex: 5,
              transform: 'scaleX(-1)', // Flip canvas horizontally to face left towards the center
            }}
          >
            <ParticleFace />
          </div>

          {/* Hover highlight overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              opacity: hoverSide === 'right' ? 1 : 0,
              transition: 'opacity 0.3s',
              zIndex: 5,
            }}
          />
        </a>
      </div>
    </div>
  );
};

export default AnatomyApp;
