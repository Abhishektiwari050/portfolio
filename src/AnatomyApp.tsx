import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';

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

// ── ThreeSkull 3D Loader Component ─────────────────────────────────────────────
const ThreeSkull: React.FC<{ mouseCoords: { x: number; y: number } }> = ({ mouseCoords }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef(mouseCoords);
  const skullGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    mouseRef.current = mouseCoords;
  }, [mouseCoords]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 500);
    camera.position.set(0, 0, 72);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.18);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3.0);
    // Position light from left/top/front to match mockup shadows
    dirLight1.position.set(-60, 40, 50);
    scene.add(dirLight1);

    const boneMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.95,
      metalness: 0.0,
    });

    const skullGroup = new THREE.Group();
    scene.add(skullGroup);
    skullGroupRef.current = skullGroup;

    const tdsLoader = new TDSLoader();
    tdsLoader.load('/Skelet_N031209.3ds', (object) => {
      object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.material = boneMaterial;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          // Keep sub01 (skull), sub02 (upper spine), and Skelet01 (mid spine) visible to match mockup
          if (mesh.name !== 'sub01' && mesh.name !== 'sub02' && mesh.name !== 'Skelet01') {
            mesh.visible = false;
          }
        }
      });

      // Align skeleton upright
      object.rotation.x = -Math.PI / 2;
      object.rotation.z = Math.PI;

      // Compute bounding box to center skull bust
      const box = new THREE.Box3().setFromObject(object);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);

      // Focus on skull & neck (approx 26% of full skeleton)
      const targetBustHeight = 44.0;
      const bustHeight = size.y * 0.26;
      const scale = targetBustHeight / bustHeight;
      object.scale.set(scale, scale, scale);

      // Center it
      const bustCenterY = box.max.y - (bustHeight / 2);
      const translationY = -bustCenterY * scale;

      object.position.set(
        -center.x * scale,
        translationY - 14.0, // lower significantly to fit the bottom half of the panel
        -center.z * scale
      );

      skullGroup.add(object);

      // Flipped facing right (so we rotate Y by -90 degrees, and tilt X up slightly)
      skullGroup.rotation.y = -Math.PI / 2;
      skullGroup.rotation.x = -0.22;
    }, undefined, (error) => {
      console.error('Failed to load 3D skeleton in ThreeSkull:', error);
    });

    let frameId: number;
    const animate = () => {
      if (skullGroupRef.current) {
        const targetRotY = -Math.PI / 2 + mouseRef.current.x * 0.22;
        const targetRotX = -0.22 + mouseRef.current.y * 0.18;
        
        skullGroupRef.current.rotation.y += (targetRotY - skullGroupRef.current.rotation.y) * 0.08;
        skullGroupRef.current.rotation.x += (targetRotX - skullGroupRef.current.rotation.x) * 0.08;
      }

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
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      scene.clear();
      boneMaterial.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', pointerEvents: 'none' }} />;
};

// ── Main AnatomyApp ────────────────────────────────────────────────────────────
export const AnatomyApp: React.FC = () => {
  const [time, setTime] = useState('');
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
        background: '#ffd500', // yellow base body background
      }}
    >
      {/* Inline Styles for animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        .hover-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      {/* SVG Hand-Drawn Wobbly Filters */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none', visibility: 'hidden' }}>
        <defs>
          <filter id="wobbly">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="splatter-rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

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
          href="/index.html?side=creative" // Redirects to creative portfolio intro
          onMouseEnter={() => setHoverSide('left')}
          onMouseLeave={() => {
            setHoverSide(null);
            setMousePos({ x: 0, y: 0 });
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            setMousePos({ x, y });
          }}
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
              left: '-2px',
              top: '-2%',
              bottom: '-2%',
              width: '28px',
              background: 'repeating-conic-gradient(#000000 0% 25%, #ffffff 0% 50%) 50% / 28px 28px',
              zIndex: 10,
              boxShadow: '3px 0 8px rgba(0,0,0,0.15)',
              transform: 'rotate(-0.3deg)',
              transformOrigin: 'top left',
            }}
          />

          {/* Thin dividing line next to checkerboard */}
          <div
            style={{
              position: 'absolute',
              left: '26px',
              top: 0,
              bottom: 0,
              width: '1.5px',
              backgroundColor: '#000000',
              zIndex: 10,
            }}
          />

          {/* Halftone Dot Pattern Overlay in Bottom Left */}
          <div
            style={{
              position: 'absolute',
              bottom: '-4%',
              left: '2%',
              width: '320px',
              height: '320px',
              backgroundImage: 'radial-gradient(rgba(0,0,0,0.16) 18%, transparent 18%)',
              backgroundSize: '12px 12px',
              maskImage: 'radial-gradient(circle at bottom left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
              WebkitMaskImage: 'radial-gradient(circle at bottom left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />

          {/* ── Background Splatters and Doodles ── */}
          {/* Neon Pink Splatter Top Left */}
          <div
            style={{
              position: 'absolute',
              top: '-6%',
              left: '6%',
              width: '380px',
              height: '300px',
              opacity: 0.9,
              zIndex: 1,
              pointerEvents: 'none',
              filter: 'url(#splatter-rough)',
            }}
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <path
                d="M10,25 C30,5 70,8 90,22 C105,35 95,65 80,78 C65,90 25,85 15,65 C5,45 2,35 10,25 Z"
                fill="#ff007f"
              />
              <circle cx="15" cy="12" r="5" fill="#ff007f" />
              <circle cx="85" cy="85" r="7" fill="#ff007f" />
              <circle cx="95" cy="45" r="4" fill="#ff007f" />
            </svg>
          </div>

          {/* Green Paint Splashes Bottom Left */}
          <div
            style={{
              position: 'absolute',
              bottom: '15%',
              left: '4%',
              width: '220px',
              height: '180px',
              opacity: 0.85,
              zIndex: 1,
              pointerEvents: 'none',
              filter: 'url(#splatter-rough)',
            }}
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <path d="M20,30 C45,15 75,25 85,55 C95,85 70,95 40,80 C15,65 5,45 20,30 Z" fill="#39ff14" />
            </svg>
          </div>

          {/* Electric Blue Splatter Middle Right */}
          <div
            style={{
              position: 'absolute',
              top: '40%',
              right: '-8%',
              width: '340px',
              height: '300px',
              opacity: 0.85,
              zIndex: 1,
              pointerEvents: 'none',
              filter: 'url(#splatter-rough)',
            }}
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <path d="M30,30 C55,10 85,20 90,50 C95,80 75,95 55,90 C35,85 15,65 20,45 Z" fill="#00bfff" />
              <circle cx="12" cy="22" r="5" fill="#00bfff" />
              <circle cx="45" cy="95" r="6" fill="#00bfff" />
            </svg>
          </div>

          {/* Brush strokes behind the skull (Bottom Right/Center) */}
          <div
            style={{
              position: 'absolute',
              bottom: '2%',
              right: '5%',
              width: '420px',
              height: '240px',
              opacity: 0.9,
              zIndex: 1,
              pointerEvents: 'none',
              filter: 'url(#splatter-rough)',
            }}
          >
            <svg viewBox="0 0 200 100" width="100%" height="100%">
              <path d="M10,80 Q70,20 180,60" stroke="#ff007f" strokeWidth="24" fill="none" strokeLinecap="round" />
              <path d="M30,95 Q100,40 190,85" stroke="#39ff14" strokeWidth="16" fill="none" strokeLinecap="round" />
              <path d="M50,98 Q120,60 195,95" stroke="#ffaa00" strokeWidth="12" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          {/* Neon Green Lightning Bolt Doodle */}
          <div
            style={{
              position: 'absolute',
              top: '28%',
              right: '12%',
              zIndex: 3,
              pointerEvents: 'none',
              transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 15}px) rotate(15deg)`,
              transition: 'transform 0.15s ease-out',
              filter: 'url(#wobbly)',
            }}
          >
            <svg width="50" height="90" viewBox="0 0 60 100">
              <path
                d="M 35 5 L 10 50 L 30 50 L 20 95 L 50 40 L 30 40 Z"
                fill="#39ff14"
                stroke="#000000"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Blue Asterisk Doodle */}
          <div
            style={{
              position: 'absolute',
              top: '42%',
              left: '8%',
              zIndex: 3,
              pointerEvents: 'none',
              transform: `translate(${mousePos.x * -14}px, ${mousePos.y * 10}px)`,
              transition: 'transform 0.15s ease-out',
              filter: 'url(#wobbly)',
            }}
          >
            <svg width="70" height="70" viewBox="0 0 80 80">
              <path
                d="M 40 10 L 40 70 M 10 40 L 70 40 M 18 18 L 62 62 M 62 18 L 18 62"
                fill="none"
                stroke="#0066ff"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Green Spiral Doodle */}
          <div
            style={{
              position: 'absolute',
              top: '56%',
              left: '4%',
              zIndex: 3,
              pointerEvents: 'none',
              transform: `translate(${mousePos.x * -6}px, ${mousePos.y * -6}px)`,
              transition: 'transform 0.15s ease-out',
              filter: 'url(#wobbly)',
            }}
          >
            <svg width="90" height="90" viewBox="0 0 100 100">
              <path
                d="M 50 50 Q 42 38 52 32 Q 68 38 62 58 Q 45 72 30 55 Q 15 28 42 12 Q 80 2 85 50 Q 80 88 30 80 Q 2 55 22 25"
                fill="none"
                stroke="#39ff14"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Blue 'X' Cross Doodle */}
          <div
            style={{
              position: 'absolute',
              top: '48%',
              left: '32%',
              zIndex: 4,
              pointerEvents: 'none',
              transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 8}px) rotate(12deg)`,
              transition: 'transform 0.15s ease-out',
              filter: 'url(#wobbly)',
            }}
          >
            <svg width="80" height="80" viewBox="0 0 80 80">
              <path
                d="M 15 15 L 65 65 M 65 15 L 15 65"
                fill="none"
                stroke="#0055ff"
                strokeWidth="13"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Crown Doodle (Positioned above Title) */}
          <div
            style={{
              position: 'absolute',
              top: '12%',
              left: '20%',
              zIndex: 4,
              pointerEvents: 'none',
              transform: `translate(${mousePos.x * 12}px, ${mousePos.y * -8}px) rotate(-8deg)`,
              transition: 'transform 0.15s ease-out',
              filter: 'url(#wobbly)',
            }}
          >
            <svg
              width="90"
              height="65"
              viewBox="0 0 100 70"
              className="hover-float"
            >
              <path
                d="M 15 55 L 20 20 L 40 40 L 50 15 L 60 40 L 80 20 L 85 55 Z"
                fill="none"
                stroke="#000000"
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M 12 58 Q 50 50 88 58" fill="none" stroke="#000000" strokeWidth="5.5" strokeLinecap="round" />
              <circle cx="20" cy="16" r="5" fill="#000000" />
              <circle cx="50" cy="11" r="5" fill="#000000" />
              <circle cx="80" cy="16" r="5" fill="#000000" />
            </svg>
          </div>

          {/* Smiley Face Doodle */}
          <div
            style={{
              position: 'absolute',
              bottom: '8%',
              left: '11%',
              zIndex: 4,
              pointerEvents: 'none',
              transform: `translate(${mousePos.x * -10}px, ${mousePos.y * 12}px) rotate(-5deg)`,
              transition: 'transform 0.15s ease-out',
              filter: 'url(#wobbly)',
            }}
          >
            <svg
              width="110"
              height="110"
              viewBox="0 0 120 120"
            >
              <circle cx="60" cy="60" r="45" fill="#ffd500" stroke="#000000" strokeWidth="6.5" />
              <ellipse cx="44" cy="48" rx="5.5" ry="8" fill="#000000" />
              <ellipse cx="76" cy="48" rx="5.5" ry="8" fill="#000000" />
              <path d="M 38 68 Q 60 92 82 68" fill="none" stroke="#000000" strokeWidth="6.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* ── Left Content Block (Creatives) ── */}
          <div
            style={{
              position: 'absolute',
              top: '24%',
              left: '16%',
              zIndex: 10,
              transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px) rotate(-3deg)`,
              transition: 'transform 0.15s ease-out',
              pointerEvents: 'none',
            }}
          >
            <h1
              style={{
                fontFamily: '"Permanent Marker", sans-serif',
                fontSize: 'clamp(56px, 7vw, 86px)',
                color: '#000000',
                margin: 0,
                lineHeight: 1,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              CREATIVES
            </h1>
            {/* Custom Underline Brush line */}
            <svg width="100%" height="15" viewBox="0 0 300 15" style={{ filter: 'url(#wobbly)', display: 'block', marginTop: '2px' }}>
              <path d="M 5 6 C 80 8, 220 3, 295 9" fill="none" stroke="#000000" strokeWidth="6.5" strokeLinecap="round" />
            </svg>
            <div
              style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.38em',
                color: '#000000',
                marginTop: '8px',
                textAlign: 'center',
                borderTop: '3.5px solid #000000',
                paddingTop: '6px',
                display: 'inline-block',
                width: '100%',
                filter: 'url(#wobbly)',
              }}
            >
              ABOUT DESIGN
            </div>
          </div>

          {/* 3D WebGL Skull Canvas */}
          <div
            style={{
              position: 'absolute',
              bottom: '-12%',
              left: '8%',
              width: '76%',
              height: '106%',
              zIndex: 2,
              pointerEvents: 'none',
              transform: `translate(${mousePos.x * 16}px, ${mousePos.y * 12}px)`,
              transition: 'transform 0.2s ease-out',
            }}
          >
            <ThreeSkull mouseCoords={mousePos} />
          </div>

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
          href="/index.html?side=development" // Redirects to engineering projects
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
