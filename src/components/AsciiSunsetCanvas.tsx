import React, { useEffect, useRef, useState } from 'react';

interface AsciiParams {
  renderMode: string;
  bgMode: string;
  bgBlur: number;
  bgOpacity: number;
  cellSize: number;
  coverage: number;
  invert: boolean;
  styleBlend: string;
  charSet: string;
  customChars: string;
  brightness: number;
  contrast: number;
  edgeEmphasis: number;
  density: number;
  toneCurve: { x: number; y: number }[];
  tint: string;
  tintOpacity: number;
  overlayBlend: string;
  saturation: number;
  grayscale: number;
  blurType: string;
  blurAmount: number;
  pfx: {
    vignette: { enabled: boolean; intensity: number };
    scanLines: { enabled: boolean; intensity: number };
    chromatic: { enabled: boolean; intensity: number };
    bloom: { enabled: boolean; intensity: number };
    filmGrain: { enabled: boolean; intensity: number };
    glitch: { enabled: boolean; intensity: number };
    pixelate: { enabled: boolean; intensity: number };
    halftone: { enabled: boolean; intensity: number };
    filmDust: { enabled: boolean; intensity: number };
  };
  animated: boolean;
  animStyle: string;
  animSpeed: { enabled: boolean; intensity: number };
  animIntensity: { enabled: boolean; intensity: number };
}

const DEFAULT_PARAMS: AsciiParams = {
  renderMode: "dots",
  bgMode: "solid",
  bgBlur: 12,
  bgOpacity: 90,
  cellSize: 10,
  coverage: 100,
  invert: false,
  styleBlend: "source-over",
  charSet: "standard",
  customChars: "",
  brightness: 0,
  contrast: 115,
  edgeEmphasis: 0,
  density: 0,
  toneCurve: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
  tint: "#ff3b1f",
  tintOpacity: 32,
  overlayBlend: "overlay",
  saturation: 100,
  grayscale: 0,
  blurType: "off",
  blurAmount: 35,
  pfx: {
    vignette: { enabled: true, intensity: 55 },
    scanLines: { enabled: false, intensity: 40 },
    chromatic: { enabled: false, intensity: 15 },
    bloom: { enabled: true, intensity: 45 },
    filmGrain: { enabled: false, intensity: 30 },
    glitch: { enabled: false, intensity: 20 },
    pixelate: { enabled: false, intensity: 15 },
    halftone: { enabled: false, intensity: 20 },
    filmDust: { enabled: false, intensity: 20 }
  },
  animated: true,
  animStyle: "pulse",
  animSpeed: { enabled: true, intensity: 100 },
  animIntensity: { enabled: true, intensity: 60 }
};

export function AsciiSunsetCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [params, setParams] = useState<AsciiParams>(DEFAULT_PARAMS);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);

  // Generate a procedural sunset image on an offscreen canvas
  const proceduralSunsetRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 400);
      skyGrad.addColorStop(0, '#100b26'); // Deep night purple
      skyGrad.addColorStop(0.4, '#ff3b1f'); // Vibrant sunset red
      skyGrad.addColorStop(0.7, '#ff8a00'); // Orange
      skyGrad.addColorStop(0.9, '#ffe600'); // Yellow horizon
      skyGrad.addColorStop(1, '#ffc837'); // Warm sunset yellow
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 640, 400);

      // Draw glowing sun
      const sunGrad = ctx.createRadialGradient(320, 260, 10, 320, 260, 120);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.2, '#ffe600');
      sunGrad.addColorStop(0.5, 'rgba(255, 59, 31, 0.8)');
      sunGrad.addColorStop(1, 'rgba(255, 59, 31, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(320, 260, 120, 0, Math.PI * 2);
      ctx.fill();

      // Sea horizon shadow / details
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 300, 640, 100);

      // Mountains silhouette
      ctx.fillStyle = '#100b26';
      ctx.beginPath();
      ctx.moveTo(0, 310);
      ctx.quadraticCurveTo(160, 270, 320, 305);
      ctx.quadraticCurveTo(480, 280, 640, 315);
      ctx.lineTo(640, 400);
      ctx.lineTo(0, 400);
      ctx.closePath();
      ctx.fill();

      // Ocean reflection reflection ripples
      ctx.fillStyle = 'rgba(255, 230, 0, 0.4)';
      for (let y = 320; y < 390; y += 8) {
        const width = (y - 300) * 1.5;
        ctx.fillRect(320 - width/2, y, width, 2);
      }
    }
    proceduralSunsetRef.current = canvas;
    setImageLoaded(true);
  }, []);

  // Main Render Loop
  useEffect(() => {
    if (!imageLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animFrameId: number;
    let startTime = Date.now();

    const render = () => {
      const time = (Date.now() - startTime) / 1000;
      const width = canvas.width;
      const height = canvas.height;

      // Create offscreen canvas for source operations
      const srcCanvas = document.createElement('canvas');
      srcCanvas.width = width;
      srcCanvas.height = height;
      const srcCtx = srcCanvas.getContext('2d');
      if (!srcCtx) return;

      // Draw source image (uploaded image or procedural sunset)
      if (uploadedImage) {
        srcCtx.drawImage(uploadedImage, 0, 0, width, height);
      } else if (proceduralSunsetRef.current) {
        srcCtx.drawImage(proceduralSunsetRef.current, 0, 0, width, height);
      }

      // Clear main canvas with solid background
      ctx.fillStyle = '#121212';
      ctx.fillRect(0, 0, width, height);

      // Draw blurred copy if bgMode is active
      if (params.bgMode === 'solid') {
        ctx.fillStyle = `rgba(18, 18, 18, ${params.bgOpacity / 100})`;
        ctx.fillRect(0, 0, width, height);
      }

      // Read image data for cell grid processing
      const imgData = srcCtx.getImageData(0, 0, width, height);
      const data = imgData.data;

      const cellSize = params.cellSize;
      const cols = Math.floor(width / cellSize);
      const rows = Math.floor(height / cellSize);

      // Animation calculations
      let animOffset = 0;
      if (params.animated) {
        const speed = params.animSpeed.intensity / 100;
        const intensity = params.animIntensity.intensity / 100;
        if (params.animStyle === 'pulse') {
          animOffset = Math.sin(time * Math.PI * 2 * speed) * intensity * 0.4;
        } else if (params.animStyle === 'shimmer') {
          animOffset = (Math.random() - 0.5) * intensity * 0.2;
        }
      }

      // 2D grid cell rendering
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Coverage check
          if (params.coverage < 100 && Math.random() * 100 > params.coverage) {
            continue;
          }

          const startX = c * cellSize;
          const startY = r * cellSize;

          // Compute average color/luminance of cell
          let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
          let count = 0;
          
          for (let dy = 0; dy < cellSize; dy += 2) {
            for (let dx = 0; dx < cellSize; dx += 2) {
              const pxX = startX + dx;
              const pxY = startY + dy;
              if (pxX < width && pxY < height) {
                const idx = (pxY * width + pxX) * 4;
                sumR += data[idx];
                sumG += data[idx + 1];
                sumB += data[idx + 2];
                sumA += data[idx + 3];
                count++;
              }
            }
          }

          if (count === 0) continue;

          let avgR = sumR / count;
          let avgG = sumG / count;
          let avgB = sumB / count;

          // 1. Brightness & Contrast adjustments
          const contrastF = (259 * (params.contrast + 255)) / (255 * (259 - params.contrast));
          avgR = contrastF * (avgR - 128) + 128 + params.brightness;
          avgG = contrastF * (avgG - 128) + 128 + params.brightness;
          avgB = contrastF * (avgB - 128) + 128 + params.brightness;

          // 2. Saturation
          const lumaVal = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;
          const satFactor = params.saturation / 100;
          avgR = lumaVal + (avgR - lumaVal) * satFactor;
          avgG = lumaVal + (avgG - lumaVal) * satFactor;
          avgB = lumaVal + (avgB - lumaVal) * satFactor;

          // Clamp colors
          avgR = Math.max(0, Math.min(255, avgR));
          avgG = Math.max(0, Math.min(255, avgG));
          avgB = Math.max(0, Math.min(255, avgB));

          // Grayscale blend
          if (params.grayscale > 0) {
            const grayBlend = params.grayscale / 100;
            avgR = avgR * (1 - grayBlend) + lumaVal * grayBlend;
            avgG = avgG * (1 - grayBlend) + lumaVal * grayBlend;
            avgB = avgB * (1 - grayBlend) + lumaVal * grayBlend;
          }

          // Point luma calculation
          let luma = (0.299 * avgR + 0.587 * avgG + 0.114 * avgB) / 255;
          if (params.invert) luma = 1.0 - luma;

          // Apply animated offset
          luma = Math.max(0, Math.min(1, luma + animOffset));

          // Color tint overlay (red sunset overlay)
          if (params.tintOpacity > 0) {
            const tintRGB = hexToRgb(params.tint);
            if (tintRGB) {
              const alpha = params.tintOpacity / 100;
              // Overlay blend logic
              avgR = overlayBlendChannel(avgR, tintRGB.r, alpha);
              avgG = overlayBlendChannel(avgG, tintRGB.g, alpha);
              avgB = overlayBlendChannel(avgB, tintRGB.b, alpha);
            }
          }

          // Draw the shapes based on renderMode
          ctx.save();
          ctx.fillStyle = `rgb(${Math.round(avgR)}, ${Math.round(avgG)}, ${Math.round(avgB)})`;
          ctx.strokeStyle = `rgb(${Math.round(avgR)}, ${Math.round(avgG)}, ${Math.round(avgB)})`;
          
          const centerX = startX + cellSize / 2;
          const centerY = startY + cellSize / 2;

          if (params.renderMode === 'dots') {
            const maxRadius = (cellSize / 2) * 1.1;
            const radius = maxRadius * luma;
            if (radius > 0.5) {
              ctx.beginPath();
              ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (params.renderMode === 'pixel' || params.renderMode === 'mosaic') {
            const size = cellSize * luma;
            ctx.fillRect(centerX - size / 2, centerY - size / 2, size, size);
          } else if (params.renderMode === 'cross') {
            const size = (cellSize / 2) * luma;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(centerX - size, centerY);
            ctx.lineTo(centerX + size, centerY);
            ctx.moveTo(centerX, centerY - size);
            ctx.lineTo(centerX, centerY + size);
            ctx.stroke();
          } else {
            // Default square
            ctx.fillRect(startX + 1, startY + 1, cellSize - 2, cellSize - 2);
          }
          ctx.restore();
        }
      }

      // 3. Post Effects Pipeline

      // Vignette
      if (params.pfx.vignette.enabled) {
        const intensity = params.pfx.vignette.intensity / 100;
        const grad = ctx.createRadialGradient(width/2, height/2, width/4, width/2, height/2, width * 0.7);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, `rgba(0, 0, 0, ${0.8 * intensity})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Bloom Effect (simple canvas overlay glow)
      if (params.pfx.bloom.enabled) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = (params.pfx.bloom.intensity / 100) * 0.35;
        ctx.drawImage(canvas, 4, 0);
        ctx.drawImage(canvas, -4, 0);
        ctx.drawImage(canvas, 0, 4);
        ctx.drawImage(canvas, 0, -4);
        ctx.restore();
      }

      if (params.animated) {
        animFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [imageLoaded, params, uploadedImage]);

  // Helper: Hex string to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Helper: Overlay blending channel
  const overlayBlendChannel = (base: number, mix: number, alpha: number) => {
    const b = base / 255;
    const m = mix / 255;
    let res = 0;
    if (b < 0.5) {
      res = 2 * b * m;
    } else {
      res = 1 - 2 * (1 - b) * (1 - m);
    }
    const finalVal = b * (1 - alpha) + res * alpha;
    return finalVal * 255;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUploadedImage(img);
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="ascii-lab glass-card" ref={containerRef} style={{
      padding: '24px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      marginTop: '3rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div className="ascii-lab__header" style={{ width: '100%', textAlign: 'center' }}>
        <h3 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: '1.25rem',
          color: '#ffffff',
          letterSpacing: '-0.02em',
          margin: '0 0 4px 0'
        }}>
          procedural sunset ascii lab.
        </h3>
        <p style={{
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.5)',
          margin: 0
        }}>
          Recreated real-time raster pipeline for the 21st.dev Sunset ASCII effect.
        </p>
      </div>

      <div className="ascii-lab__viewport" style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: '#121212',
        aspectRatio: '16/10',
        width: '100%',
        maxWidth: '640px'
      }}>
        <canvas 
          ref={canvasRef} 
          width={640} 
          height={400} 
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      <div className="ascii-lab__controls" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}>
        <div className="control-group" style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setParams(prev => ({ ...prev, renderMode: prev.renderMode === 'dots' ? 'pixel' : prev.renderMode === 'pixel' ? 'cross' : 'dots' }))}
            className="chat-btn" 
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            Shape: {params.renderMode.toUpperCase()}
          </button>
          
          <button 
            onClick={() => setParams(prev => ({ ...prev, animated: !prev.animated }))}
            className="chat-btn" 
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem',
              background: params.animated ? 'rgba(0, 85, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)',
              border: params.animated ? '1px solid rgba(0, 85, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            {params.animated ? '❚❚ Pause' : '▶ Play'}
          </button>
        </div>

        <label style={{
          padding: '6px 12px',
          fontSize: '0.75rem',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '8px',
          color: '#ffffff',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>⌥ Drop Custom Photo</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            style={{ display: 'none' }}
          />
        </label>

        {uploadedImage && (
          <button 
            onClick={() => setUploadedImage(null)}
            className="chat-btn" 
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem',
              background: 'rgba(255, 59, 31, 0.15)',
              border: '1px solid rgba(255, 59, 31, 0.3)',
              borderRadius: '8px',
              color: '#ff3b1f',
              cursor: 'pointer'
            }}
          >
            Reset to Sunset
          </button>
        )}
      </div>
    </div>
  );
}
