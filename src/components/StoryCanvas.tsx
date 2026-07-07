import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

// ─── Vertex Shader (GPU Morphing across 5 states) ──────────────────────────────
const vertexShader = `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2  uMouse;
  uniform float uMouseInfluence;
  uniform float uScrollVelocity;
  uniform float uChapterMix; // 0.0 to 4.0
  
  attribute float aSize;
  attribute vec3  aColor;
  attribute float aMorphT;
  
  attribute vec3  aPos0;      // Face Model
  attribute vec3  aPos1;      // "AI" Letters
  attribute vec3  aPos2;      // Neural Network Layers
  attribute vec3  aPos3;      // Binary Matrix
  attribute vec3  aPos4;      // Computer Circuit Board
  
  varying vec3  vColor;
  varying float vAlpha;

  vec3 getMorphedPosition() {
    float mixVal = clamp(uChapterMix, 0.0, 4.0);
    if (mixVal < 1.0) {
      return mix(aPos0, aPos1, mixVal);
    } else if (mixVal < 2.0) {
      return mix(aPos1, aPos2, mixVal - 1.0);
    } else if (mixVal < 3.0) {
      return mix(aPos2, aPos3, mixVal - 2.0);
    } else {
      return mix(aPos3, aPos4, mixVal - 3.0);
    }
  }
  
  void main() {
    vColor = aColor;
    
    vec3 pos = getMorphedPosition();
    
    // Mouse repulsion
    vec3 mouse3D = vec3(uMouse.x * 55.0, uMouse.y * 55.0, 0.0);
    float dist    = distance(pos, mouse3D);
    if (dist < 28.0 && uMouseInfluence > 0.1) {
      float force = (1.0 - dist / 28.0) * 4.0 * uMouseInfluence;
      vec3  dir   = normalize(pos - mouse3D);
      pos += dir * force;
    }
    
    // Scroll turbulence
    float scrollV = clamp(abs(uScrollVelocity), 0.0, 10.0);
    if (scrollV > 0.05) {
      float sf = scrollV * 0.035;
      pos.x += sin(pos.y * 0.12 + uTime * 2.0) * sf;
      pos.z += cos(pos.x * 0.12 + uTime * 2.0) * sf;
    }
    
    // Binary matrix flow (active in matrix stream state)
    float mixVal = clamp(uChapterMix, 0.0, 4.0);
    if (mixVal >= 2.0 && mixVal <= 4.0) {
      float flowSpeed = 12.0;
      float yOffset = -mod(uTime * flowSpeed + aMorphT * 100.0, 80.0) + 40.0;
      float mixWeight = 1.0 - abs(mixVal - 3.0); // peak at binary state (3.0)
      if (mixWeight > 0.0) {
        pos.y += yOffset * mixWeight * 0.45;
      }
    }
    
    // Gentle floating breathe animation
    pos.x += sin(uTime * 0.7 + aMorphT * 6.28) * 0.28;
    pos.y += cos(uTime * 0.5 + aMorphT * 6.28) * 0.28;
    pos.z += sin(uTime * 0.9 + aMorphT * 3.14) * 0.18;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position     = projectionMatrix * mvPosition;
    gl_PointSize    = aSize * uPixelRatio * (280.0 / -mvPosition.z);
    
    vAlpha = smoothstep(-90.0, 90.0, pos.y);
  }
`;

const fragmentShader = `
  varying vec3  vColor;
  varying float vAlpha;
  
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    float s = pow(1.0 - d * 2.0, 1.4);
    gl_FragColor = vec4(vColor, s * vAlpha * 0.85);
  }
`;

export interface StoryCanvasProps {
  scrollProgress: number;
  scrollVelocity: number;
  isExploreActivated: boolean;
  transitionProgress: number;
  isChatActive: boolean;
}

const N = 40_000;

// FaceSphere placeholder before head model GLB loads
function buildFaceSphere(): Float32Array {
  const a = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const theta = Math.random() * 2 * Math.PI;
    const phi   = Math.acos(Math.random() * 2 - 1);
    const r     = 20 + Math.random() * 2;
    a[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    a[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 1.25;
    a[i * 3 + 2] = r * Math.cos(phi) * 0.9;
  }
  return a;
}

// Spells the letters "A" and "I"
function buildAISpelling(): Float32Array {
  const a = new Float32Array(N * 3);
  
  const aLeftLegStart = [-20, -18, 0];
  const aLeftLegEnd   = [-10, 18, 0];
  
  const aRightLegStart = [-10, 18, 0];
  const aRightLegEnd   = [0, -18, 0];
  
  const aCrossbarStart = [-15, -3, 0];
  const aCrossbarEnd   = [-5, -3, 0];

  const iStemStart     = [15, -18, 0];
  const iStemEnd       = [15, 18, 0];
  
  const iTopBarStart   = [8, 18, 0];
  const iTopBarEnd     = [22, 18, 0];
  
  const iBotBarStart   = [8, -18, 0];
  const iBotBarEnd     = [22, -18, 0];

  const lerpPoint = (start: number[], end: number[], t: number): [number, number, number] => {
    return [
      start[0] + (end[0] - start[0]) * t,
      start[1] + (end[1] - start[1]) * t,
      start[2] + (end[2] - start[2]) * t,
    ];
  };

  for (let i = 0; i < N; i++) {
    let pt: [number, number, number] = [0, 0, 0];
    const segment = i % 6;
    const t = Math.random();
    const noise = 1.6;

    if (segment === 0) {
      pt = lerpPoint(aLeftLegStart, aLeftLegEnd, t);
    } else if (segment === 1) {
      pt = lerpPoint(aRightLegStart, aRightLegEnd, t);
    } else if (segment === 2) {
      pt = lerpPoint(aCrossbarStart, aCrossbarEnd, t);
    } else if (segment === 3) {
      pt = lerpPoint(iStemStart, iStemEnd, t);
    } else if (segment === 4) {
      pt = lerpPoint(iTopBarStart, iTopBarEnd, t);
    } else {
      pt = lerpPoint(iBotBarStart, iBotBarEnd, t);
    }

    a[i * 3]     = pt[0] + (Math.random() - 0.5) * noise;
    a[i * 3 + 1] = pt[1] + (Math.random() - 0.5) * noise;
    a[i * 3 + 2] = pt[2] + (Math.random() - 0.5) * noise * 0.5;
  }

  return a;
}

// AI Neural Network Layout
function buildNeuralNetwork(): Float32Array {
  const a = new Float32Array(N * 3);
  const layers = 3;
  const nodesPerLayer = 18;
  
  const zCoords = [-24, 0, 24];
  const layerNodes: [number, number, number][][] = Array.from({ length: layers }, (_, lIdx) => {
    return Array.from({ length: nodesPerLayer }, (_, nIdx) => {
      const angle = (nIdx / nodesPerLayer) * Math.PI * 2;
      const r = 18 + (lIdx === 1 ? -4 : 2);
      return [r * Math.cos(angle), r * Math.sin(angle) * 0.8, zCoords[lIdx]];
    });
  });

  for (let i = 0; i < N; i++) {
    if (i < N * 0.4) {
      const layer = i % layers;
      const node = Math.floor(Math.random() * nodesPerLayer);
      const [nx, ny, nz] = layerNodes[layer][node];
      const noise = 3.0;
      a[i * 3]     = nx + (Math.random() - 0.5) * noise;
      a[i * 3 + 1] = ny + (Math.random() - 0.5) * noise;
      a[i * 3 + 2] = nz + (Math.random() - 0.5) * noise;
    } else if (i < N * 0.8) {
      const l1 = Math.floor(Math.random() * (layers - 1));
      const l2 = l1 + 1;
      const n1 = Math.floor(Math.random() * nodesPerLayer);
      const n2 = Math.floor(Math.random() * nodesPerLayer);
      
      const [x1, y1, z1] = layerNodes[l1][n1];
      const [x2, y2, z2] = layerNodes[l2][n2];
      const t = Math.random();
      
      a[i * 3]     = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 1.0;
      a[i * 3 + 1] = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 1.0;
      a[i * 3 + 2] = z1 + (z2 - z1) * t;
    } else {
      const r = 25 + Math.random() * 8;
      const t = Math.random() * Math.PI * 2;
      a[i * 3]     = r * Math.cos(t);
      a[i * 3 + 1] = (Math.random() - 0.5) * 35;
      a[i * 3 + 2] = r * Math.sin(t) * 0.5;
    }
  }
  return a;
}

// Binary Code Matrix Stream
function buildBinaryMatrix(): Float32Array {
  const a = new Float32Array(N * 3);
  const cols = 28;
  const colX = Array.from({ length: cols }, (_, i) => (i - cols / 2) * 2.8);

  for (let i = 0; i < N; i++) {
    const col = i % cols;
    a[i * 3]     = colX[col] + (Math.random() - 0.5) * 0.8;
    a[i * 3 + 1] = (Math.random() - 0.5) * 45;
    a[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }
  return a;
}

// Computer Circuit Board
function buildCircuitBoard(): Float32Array {
  const a = new Float32Array(N * 3);
  const paths = 8;
  const chipSize = 14.0;
  
  for (let i = 0; i < N; i++) {
    if (i < N * 0.45) {
      a[i * 3]     = (Math.random() - 0.5) * chipSize * 2.0;
      a[i * 3 + 1] = (Math.random() - 0.5) * chipSize * 2.0;
      a[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    } else if (i < N * 0.85) {
      const pathIdx = i % paths;
      const angle = (pathIdx / paths) * Math.PI * 2;
      const startR = chipSize;
      const endR = 32.0;
      const t = Math.random();
      const r = startR + (endR - startR) * t;
      
      a[i * 3]     = r * Math.cos(angle) + (Math.random() - 0.5) * 0.8;
      a[i * 3 + 1] = r * Math.sin(angle) + (Math.random() - 0.5) * 0.8;
      a[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
    } else {
      const r = 34.0 + (Math.random() - 0.5) * 4.0;
      const t = Math.random() * Math.PI * 2;
      a[i * 3]     = r * Math.cos(t);
      a[i * 3 + 1] = r * Math.sin(t);
      a[i * 3 + 2] = 0;
    }
  }
  return a;
}

const PALETTES: THREE.Color[][] = [
  // 0: Face
  [0x0055ff, 0x000000, 0x0077ff, 0x0022aa, 0x0099ff].map(h => new THREE.Color(h)),
  // 1: AI Letters
  [0x0077ff, 0x00d4ff, 0x0055ff, 0x0099ff, 0x38bdf8].map(h => new THREE.Color(h)),
  // 2: Network
  [0x0055ff, 0x000000, 0x001144, 0x0099ff, 0x002288].map(h => new THREE.Color(h)),
  // 3: Matrix
  [0x0033aa, 0x000000, 0x0077ff, 0x0055ff, 0x001144].map(h => new THREE.Color(h)),
  // 4: Circuit Board
  [0x0099ff, 0x000000, 0x0055ff, 0x0033cc, 0x0077ff].map(h => new THREE.Color(h)),
];

export const StoryCanvas: React.FC<StoryCanvasProps> = ({ 
  scrollProgress, 
  scrollVelocity, 
  isExploreActivated, 
  transitionProgress,
  isChatActive
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef    = useRef(scrollProgress);
  const velocityRef  = useRef(scrollVelocity);
  const exploreRef    = useRef(isExploreActivated);
  const transitionRef = useRef(transitionProgress);
  const chatActiveRef = useRef(isChatActive);
  const mouseRef     = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => { scrollRef.current = scrollProgress; },   [scrollProgress]);
  useEffect(() => { velocityRef.current = scrollVelocity; }, [scrollVelocity]);
  useEffect(() => { exploreRef.current = isExploreActivated; }, [isExploreActivated]);
  useEffect(() => { transitionRef.current = transitionProgress; }, [transitionProgress]);
  useEffect(() => { chatActiveRef.current = isChatActive; }, [isChatActive]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 130);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const shapes: Float32Array[] = [
      buildFaceSphere(),
      buildAISpelling(),
      buildNeuralNetwork(),
      buildBinaryMatrix(),
      buildCircuitBoard(),
    ];

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    geometry.setAttribute('aPos0',    new THREE.BufferAttribute(shapes[0], 3));
    geometry.setAttribute('aPos1',    new THREE.BufferAttribute(shapes[1], 3));
    geometry.setAttribute('aPos2',    new THREE.BufferAttribute(shapes[2], 3));
    geometry.setAttribute('aPos3',    new THREE.BufferAttribute(shapes[3], 3));
    geometry.setAttribute('aPos4',    new THREE.BufferAttribute(shapes[4], 3));

    // Load real detailed head mesh for shape[0]
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    const gltfLoader  = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load('/LeePerrySmith.glb', (gltf) => {
      let headMesh: THREE.Mesh | null = null;
      gltf.scene.traverse(c => { if ((c as THREE.Mesh).isMesh) headMesh = c as THREE.Mesh; });
      if (headMesh) {
        const sampler = new MeshSurfaceSampler(headMesh!).build();
        const tmp     = new THREE.Vector3();
        const data    = new Float32Array(N * 3);
        const scale   = 13.5;
        for (let i = 0; i < N; i++) {
          sampler.sample(tmp);
          data[i * 3]     = tmp.x * scale;
          data[i * 3 + 1] = (tmp.y - 1.1) * scale;
          data[i * 3 + 2] = -tmp.z * scale;
        }
        shapes[0] = data;
        geometry.setAttribute('aPos0', new THREE.BufferAttribute(shapes[0], 3));
      }
    }, undefined, () => {});

    const sizes = new Float32Array(N);
    const phases = new Float32Array(N);
    const colors = new Float32Array(N * 3);
    const palette = PALETTES[0];

    for (let i = 0; i < N; i++) {
      sizes[i]  = Math.random() * 2.6 + 0.8;
      phases[i] = Math.random();
      const c   = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    
    geometry.setAttribute('aSize',   new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aMorphT', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('aColor',  new THREE.BufferAttribute(colors, 3));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime:           { value: 0 },
        uPixelRatio:     { value: Math.min(window.devicePixelRatio, 2) },
        uMouse:          { value: new THREE.Vector2() },
        uMouseInfluence: { value: 1.0 },
        uScrollVelocity: { value: 0 },
        uChapterMix:     { value: 0 },
      },
      transparent: true,
      blending:    THREE.NormalBlending,
      depthWrite:  false,
    });

    const cloud = new THREE.Points(geometry, material);
    scene.add(cloud);

    let currentChapter = -1;
    let currentRawIdx = 0.0;
    function updateColors(srcPal: THREE.Color[], tgtPal: THREE.Color[], mix: number) {
      const colAttr = geometry.getAttribute('aColor') as THREE.BufferAttribute;
      const arr = colAttr.array as Float32Array;
      for (let i = 0; i < N; i++) {
        const si = Math.floor(phases[i] * srcPal.length);
        const ti = Math.floor(phases[i] * tgtPal.length);
        const sc = srcPal[si % srcPal.length];
        const tc = tgtPal[ti % tgtPal.length];
        arr[i * 3]     = sc.r + (tc.r - sc.r) * mix;
        arr[i * 3 + 1] = sc.g + (tc.g - sc.g) * mix;
        arr[i * 3 + 2] = sc.b + (tc.b - sc.b) * mix;
      }
      colAttr.needsUpdate = true;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX / window.innerWidth)  * 2 - 1;
      mouseRef.current.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    let raf: number;
    let t0 = performance.now();

    const animate = () => {
      const elapsed = (performance.now() - t0) * 0.001;
      material.uniforms.uTime.value           = elapsed;
      material.uniforms.uScrollVelocity.value = velocityRef.current;

      const m = mouseRef.current;
      m.x += (m.tx - m.x) * 0.08;
      m.y += (m.ty - m.y) * 0.08;
      material.uniforms.uMouse.value.set(m.x, m.y);

      let targetRawIdx = 0.0;
      let targetZ = 130;
      let targetX = 54;

      const exploreActive = exploreRef.current;
      const tProg = transitionRef.current;
      const scroll = scrollRef.current;
      const chatActive = chatActiveRef.current;

      if (exploreActive) {
        // Scrolled past Chapter 0 (curtain rolled up)
        const startScroll = 0.08;
        const normalizedScroll = Math.min(1.0, Math.max(0.0, (scroll - startScroll) / (1.0 - startScroll)));
        targetRawIdx = 2.0 + normalizedScroll * 2.0; // 2.0 (Neural Net) to 4.0 (Circuit Board)
        
        targetZ = 130;
        targetX = targetRawIdx >= 3.6 ? 0 : 12;
        cloud.scale.setScalar(1.0);
      } else {
        // Still on Hero / Chat screen (curtain not rolled up yet)
        targetRawIdx = chatActive ? 1.0 : 0.0; // Morph to AI letters only if chat system is up/conversing!
        
        if (tProg > 0) {
          // Center and zoom inside terminal wrapper
          const t = Math.min(1.0, tProg / 0.8);
          targetZ = 130 - t * 85;
          targetX = 54 - t * 54;
          cloud.scale.setScalar(0.8 - t * 0.3);
        } else {
          targetZ = 130;
          targetX = 54;
          cloud.scale.setScalar(0.8);
        }
      }

      currentRawIdx += (targetRawIdx - currentRawIdx) * 0.08;

      const CHAPTERS    = 5;
      const srcIdx      = Math.min(Math.floor(currentRawIdx), CHAPTERS - 2);
      const tgtIdx      = srcIdx + 1;
      const mix         = currentRawIdx - srcIdx;

      material.uniforms.uChapterMix.value = currentRawIdx;

      if (srcIdx !== currentChapter) {
        currentChapter = srcIdx;
      }
      updateColors(PALETTES[srcIdx], PALETTES[tgtIdx], mix);

      if (!exploreActive) {
        if (tProg >= 0.98) {
          targetX = 0;
          cloud.scale.setScalar(1.0);
        } else {
          targetX = srcIdx === 0 ? 54 : (srcIdx < 3 ? 12 : 0);
          cloud.scale.setScalar(srcIdx === 0 ? 0.8 : 1.0);
        }
      }
      cloud.position.x += (targetX - cloud.position.x) * 0.05;

      cloud.rotation.y  = elapsed * 0.06 + m.x * 0.3;
      cloud.rotation.x  = Math.sin(elapsed * 0.05) * 0.03 + m.y * 0.15;
      
      const targetCamZ = exploreActive ? targetZ : 130 + Math.sin(elapsed * 0.12) * 3;
      camera.position.z += (targetCamZ - camera.position.z) * 0.08;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="three-container" />;
};

export default StoryCanvas;
