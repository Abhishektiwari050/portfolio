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
          {/* Mockup Left Side Image */}
          <img
            src="/creatives_side.png"
            alt="Creatives design showcase"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              pointerEvents: 'none',
              userSelect: 'none',
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
