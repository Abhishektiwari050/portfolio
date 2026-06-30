import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

// Custom shaders for the particle system
const vertexShader = `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  uniform float uMouseInfluence;
  uniform float uScrollVelocity;
  uniform float uOffsetX;
  
  attribute float aSize;
  attribute vec3 aColor;
  
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    vColor = aColor;
    
    // Base position
    vec3 pos = position;
    
    // 3D Mouse Interaction in world space
    // Since the cloud is offset to uOffsetX, mouse coordinates need to align
    vec3 worldPos = pos;
    worldPos.x += uOffsetX;
    
    // Mouse coords mapped to 3D plane
    vec3 mouse3D = vec3(uMouse.x * 60.0 + uOffsetX, uMouse.y * 60.0, 0.0);
    float dist = distance(worldPos, mouse3D);
    
    if (dist < 32.0 && uMouseInfluence > 0.1) {
      float force = (1.0 - (dist / 32.0)) * 4.5 * uMouseInfluence;
      vec3 dir = normalize(worldPos - mouse3D);
      // Push particles away
      pos += dir * force;
    }
    
    // Scroll velocity turbulence
    if (abs(uScrollVelocity) > 0.05) {
      float scrollForce = abs(uScrollVelocity) * 0.18;
      pos.x += sin(pos.y * 0.15 + uTime * 5.0) * scrollForce;
      pos.z += cos(pos.x * 0.15 + uTime * 5.0) * scrollForce;
    }
    
    // Subtle breathing animation
    pos.x += sin(uTime * 0.8 + position.y * 0.05) * 0.35;
    pos.y += cos(uTime * 0.6 + position.x * 0.05) * 0.35;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Adjust size based on distance and pixel ratio
    gl_PointSize = aSize * uPixelRatio * (280.0 / -mvPosition.z);
    
    // Soft fade out at the edges
    vAlpha = smoothstep(-70.0, 70.0, pos.y);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    // Make particles perfectly circular
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    
    // Soft particle edge
    float strength = 1.0 - (dist * 2.0);
    strength = pow(strength, 1.2);
    
    gl_FragColor = vec4(vColor, strength * vAlpha * 0.85);
  }
`;

interface ThreeCanvasProps {
  viewMode: 'home' | 'anatomy';
  scrollProgress: number;
  scrollVelocity: number;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  viewMode,
  scrollProgress,
  scrollVelocity,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewModeRef = useRef(viewMode);
  const scrollRef = useRef(scrollProgress);
  const velocityRef = useRef(scrollVelocity);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    velocityRef.current = scrollVelocity;
  }, [scrollVelocity]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── 1. Setup Scene, Camera & Renderer ──
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 130);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // ── Lights ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight1.position.set(30, 40, 40);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x3b82f6, 0.35); // Cool blue fill light
    dirLight2.position.set(-30, -20, -10);
    scene.add(dirLight2);

    // ── Particle Shapes Generation ──
    const PARTICLE_COUNT = 36000;
    const shapes: Float32Array[] = [];

    // Shape 1: Human Face (Placeholder until loaded)
    const faceData = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * 2.0 * Math.PI;
      const phi = Math.acos(Math.random() * 2.0 - 1.0);
      const r = 18.0 + Math.random() * 2.5;
      faceData[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      faceData[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 1.3;
      faceData[i * 3 + 2] = r * Math.cos(phi) * 0.95;
    }
    shapes.push(faceData);

    // Shape 2: Quantum Brain (Detailed Neocortex & Cerebellum lobes)
    const engineData = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let x = 0, y = 0, z = 0;
      if (i < PARTICLE_COUNT * 0.8) {
        // Cerebrum - two distinct hemispheres
        const hemisphere = i % 2 === 0 ? 1.0 : -1.0;
        const theta = Math.random() * Math.PI;
        const phi = Math.random() * Math.PI * 2.0;
        
        const brainRadiusX = 22.0;
        const brainRadiusY = 16.0;
        const brainRadiusZ = 16.0;
        
        x = brainRadiusX * Math.sin(theta) * Math.cos(phi) * 0.95 + (hemisphere * 0.8);
        y = brainRadiusY * Math.sin(theta) * Math.sin(phi) + 3.0;
        z = brainRadiusZ * Math.cos(theta) * 0.85;
        
        // Add sulci/gyri fold wrinkles
        const wrinkle = Math.sin(x * 0.8) * Math.cos(y * 0.8) * Math.sin(z * 0.8) * 1.1;
        x += wrinkle * Math.sin(phi);
        y += wrinkle * Math.cos(theta);
        z += wrinkle * Math.cos(phi);
      } else {
        // Cerebellum & Brainstem (lower back area)
        const theta = Math.random() * Math.PI;
        const phi = Math.random() * Math.PI * 2.0;
        const r = 6.0 + Math.random() * 3.5;
        x = r * Math.sin(theta) * Math.cos(phi) * 1.1;
        y = r * Math.sin(theta) * Math.sin(phi) - 12.0;
        z = r * Math.cos(theta) * 0.8 - 6.0;
      }
      engineData[i * 3]     = x;
      engineData[i * 3 + 1] = y;
      engineData[i * 3 + 2] = z;
    }
    shapes.push(engineData);

    // Shape 3: Chronos Predict (Double Helix Cylinder)
    const helixData = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const height = (i / PARTICLE_COUNT) * 80.0 - 40.0;
      const strand = i % 2 === 0 ? 0 : Math.PI;
      const angle = (height * 0.25) + strand;
      const radius = 16.0;
      const noise = (Math.random() - 0.5) * 1.8;
      
      helixData[i * 3]     = (radius + noise) * Math.cos(angle);
      helixData[i * 3 + 1] = height;
      helixData[i * 3 + 2] = (radius + noise) * Math.sin(angle);
    }
    shapes.push(helixData);

    // Shape 4: Connect (Symmetrical Hub)
    const hubData = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * 2.0 * Math.PI;
      const phi = Math.acos(Math.random() * 2.0 - 1.0);
      const r = 24.0 + (i % 4) * 4.0;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      hubData[i * 3]     = x;
      hubData[i * 3 + 1] = y;
      hubData[i * 3 + 2] = z;
    }
    shapes.push(hubData);

    // Initialize DRACOLoader with CDN decoder path
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    // Load detailed face geometry from LeePerrySmith GLTF
    gltfLoader.load('/LeePerrySmith.glb', (gltf) => {
      let headMesh: THREE.Mesh | null = null;
      gltf.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          headMesh = child as THREE.Mesh;
        }
      });

      if (headMesh) {
        const sampler = new MeshSurfaceSampler(headMesh).build();
        const tempPos = new THREE.Vector3();
        const scannedFacePositions = new Float32Array(PARTICLE_COUNT * 3);

        const scale = 16.5;
        const yOffset = -1.1;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          sampler.sample(tempPos);
          scannedFacePositions[i * 3]     = tempPos.x * scale;
          scannedFacePositions[i * 3 + 1] = (tempPos.y + yOffset) * scale;
          scannedFacePositions[i * 3 + 2] = -tempPos.z * scale;
        }

        shapes[0] = scannedFacePositions;
      }
    }, undefined, (error) => {
      console.error('Failed to load 3D scanned head model:', error);
    });


    // Enable local clipping on the renderer
    renderer.localClippingEnabled = true;

    // Define clipping planes to cut off the skeleton's skull and only keep the neck/spine
    const localPlaneSource = new THREE.Plane(new THREE.Vector3(0, -1, 0), -0.005); // Clips everything above the neck in local space
    const localPlane = new THREE.Plane();

    // Beautiful plaster/bone material (pure matte white)
    const boneMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0.0,
    });

    // Clipped material for the spine
    const spineMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0.0,
      clippingPlanes: [localPlane],
      clipShadows: true,
    });

    // Add a high-contrast directional light specifically for the skull to create deep shadows
    const skullLight = new THREE.DirectionalLight(0xffffff, 2.2);
    skullLight.position.set(-80, 50, 60);
    scene.add(skullLight);

    // ── 2. Solid Skeleton (For Anatomy Mode) ──
    const skeletonGroup = new THREE.Group();
    skeletonGroup.visible = false;
    skeletonGroup.scale.set(0.001, 0.001, 0.001); // Start hidden/scaled out
    scene.add(skeletonGroup);

    // 1. Load 3D Spine/Neck Model (using skeleton.glb with clipping)
    gltfLoader.load('/skeleton.glb', (gltf) => {
      const model = gltf.scene;
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.material = spineMaterial;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
      
      // Focus on the top 22% of the skeleton (head & neck) and push the rest off-screen
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      
      const headNeckRatio = 0.22;
      const headNeckHeightInModel = size.y * headNeckRatio;
      const targetHeightInScene = 52.0;
      
      const scale = targetHeightInScene / headNeckHeightInModel;
      model.scale.set(scale, scale, scale);
      
      const headTopY = box.max.y * scale;
      const translationY = 22.0 - headTopY;
      
      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.set(-center.x * scale, translationY, -center.z * scale);
      model.rotation.y = Math.PI;
      skeletonGroup.add(model);
    }, undefined, (error) => {
      console.error('Failed to load 3D skeleton model:', error);
    });

    // 2. Load 3D Skull Model (using the highly detailed, realistic skull.glb)
    gltfLoader.load('/skull.glb', (gltf) => {
      const model = gltf.scene;
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.material = boneMaterial;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
      
      // Scale and position the skull on top of the clipped neck
      const skullScale = 18.2; // Adjusted to match the neck size perfectly
      model.scale.set(skullScale, skullScale, skullScale);
      model.position.set(0, 11.2, 0.6); // Positioned on top of the cervical vertebrae
      model.rotation.y = Math.PI; // Face the camera initially
      skeletonGroup.add(model);
    }, undefined, (error) => {
      console.error('Failed to load 3D skull model:', error);
    });


    // ── 3. Geometry with custom attributes ──
    const geometry = new THREE.BufferGeometry();
    const currentPositions = new Float32Array(shapes[0]);
    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

    // Size variation
    const sizes = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      sizes[i] = Math.random() * 2.2 + 0.8;
    }
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    // Colors: Slate and Indigo
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const palette = [
      new THREE.Color(0x0f172a),
      new THREE.Color(0x1e293b),
      new THREE.Color(0x1e3a8a),
      new THREE.Color(0x3b82f6),
      new THREE.Color(0x4f46e5),
      new THREE.Color(0x2563eb),
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    // ── Shader Material ──
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseInfluence: { value: 1.0 },
        uScrollVelocity: { value: 0 },
        uOffsetX: { value: 86.0 },
      },
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const pointCloud = new THREE.Points(geometry, material);
    pointCloud.position.x = 86.0;
    scene.add(pointCloud);

    // ── Mouse Listeners ──
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ── Animation Loop ──
    let frameId: number;
    let startTime = performance.now();

    const animate = () => {
      const elapsed = (performance.now() - startTime) * 0.001;
      material.uniforms.uTime.value = elapsed;

      material.uniforms.uScrollVelocity.value = velocityRef.current;

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;
      material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

      const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      const mode = viewModeRef.current;
      const scroll = scrollRef.current;
      const sectionCount = shapes.length - 1;

      let srcIdx = 0;
      let tgtIdx = 0;
      let mix = 0;

      if (mode === 'anatomy') {
        srcIdx = 0;
        tgtIdx = 0;
        mix = 0;

        // Position particle face on the right (x = 45.0)
        const targetX = 45.0;
        pointCloud.position.x += (targetX - pointCloud.position.x) * 0.08;
        material.uniforms.uOffsetX.value = pointCloud.position.x;

        // Fade and scale in skeleton on the left (x = -45.0)
        skeletonGroup.visible = true;
        const targetScale = 1.25;
        skeletonGroup.scale.x += (targetScale - skeletonGroup.scale.x) * 0.08;
        skeletonGroup.scale.y += (targetScale - skeletonGroup.scale.y) * 0.08;
        skeletonGroup.scale.z += (targetScale - skeletonGroup.scale.z) * 0.08;
        
        skeletonGroup.position.x += (-45.0 - skeletonGroup.position.x) * 0.08;
        skeletonGroup.position.y += (-6.0 - skeletonGroup.position.y) * 0.08;

        const rotationY = elapsed * 0.06 + mouseRef.current.x * 0.25;
        const rotationX = Math.sin(elapsed * 0.08) * 0.015 + mouseRef.current.y * 0.12;

        // Face left
        pointCloud.rotation.y = -Math.PI / 2 + rotationY;
        pointCloud.rotation.x = rotationX;

        // Face right
        skeletonGroup.rotation.y = Math.PI * 1.5 + rotationY;
        skeletonGroup.rotation.x = rotationX;

        // Update clipping plane in world space based on the group's matrixWorld
        skeletonGroup.updateMatrixWorld(true);
        localPlane.copy(localPlaneSource).applyMatrix4(skeletonGroup.matrixWorld);
      } else {
        const rawIdx = scroll * sectionCount;
        srcIdx = Math.min(Math.floor(rawIdx), sectionCount);
        tgtIdx = Math.min(srcIdx + 1, sectionCount);
        mix = rawIdx - srcIdx;

        const targetX = scroll < 0.05 ? 86.0 : 98.0;
        pointCloud.position.x += (targetX - pointCloud.position.x) * 0.08;
        material.uniforms.uOffsetX.value = pointCloud.position.x;

        const targetScale = 0.0001;
        skeletonGroup.scale.x += (targetScale - skeletonGroup.scale.x) * 0.08;
        skeletonGroup.scale.y += (targetScale - skeletonGroup.scale.y) * 0.08;
        skeletonGroup.scale.z += (targetScale - skeletonGroup.scale.z) * 0.08;
        
        if (skeletonGroup.scale.x < 0.01) {
          skeletonGroup.visible = false;
        }

        const rotationY = elapsed * 0.12 + mouseRef.current.x * 0.38;
        const rotationX = Math.sin(elapsed * 0.1) * 0.02 + mouseRef.current.y * 0.15;

        pointCloud.rotation.y = rotationY;
        pointCloud.rotation.x = rotationX;
      }

      // Morphing LERP
      const srcShape = shapes[srcIdx];
      const tgtShape = shapes[tgtIdx];
      const lerpSpeed = 0.06;
      for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
        const target = srcShape[i] + (tgtShape[i] - srcShape[i]) * mix;
        posArray[i] += (target - posArray[i]) * lerpSpeed;
      }
      posAttr.needsUpdate = true;

      camera.position.z = 130 + Math.sin(elapsed * 0.2) * 3;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    // Trigger initial frame
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      cancelAnimationFrame(frameId);
      scene.clear();
      geometry.dispose();
      material.dispose();
      boneMaterial.dispose();
    };
  }, []);

  return <div ref={containerRef} className="three-container" />;
};
