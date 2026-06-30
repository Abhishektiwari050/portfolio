import React, { useEffect, useState, useRef } from 'react';
import type { Venture, ArchNode } from '../data/ventures';

interface BlueprintVisualizerProps {
  activeVenture: Venture;
}

interface InterpolatedNode extends ArchNode {
  currentX: number;
  currentY: number;
  opacity: number;
}

export const BlueprintVisualizer: React.FC<BlueprintVisualizerProps> = ({ activeVenture }) => {
  const [nodes, setNodes] = useState<InterpolatedNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null);
  const [telemetry, setTelemetry] = useState({ fps: 60, ping: 42 });
  
  const animationRef = useRef<number>(0);
  const targetNodesRef = useRef<ArchNode[]>([]);

  // Sync targets
  useEffect(() => {
    targetNodesRef.current = activeVenture.architecture.nodes;
    setSelectedNode(null); // Reset selection on project change
  }, [activeVenture]);

  // Telemetry noise loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        fps: Math.round(58 + Math.random() * 4),
        ping: Math.round(38 + Math.random() * 8)
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Smoothly interpolate node coordinates
  useEffect(() => {
    if (nodes.length === 0) {
      setNodes(
        activeVenture.architecture.nodes.map(n => ({
          ...n,
          currentX: n.x,
          currentY: n.y,
          opacity: 1,
        }))
      );
      return;
    }

    const updateCoordinates = () => {
      const speed = 0.14; // LERP speed
      let isDone = true;

      setNodes(prevNodes => {
        const targets = targetNodesRef.current;
        const updatedNodes: InterpolatedNode[] = [];

        // Update existing nodes and slide them
        prevNodes.forEach(prev => {
          const target = targets.find(t => t.id === prev.id);
          if (target) {
            const dx = target.x - prev.currentX;
            const dy = target.y - prev.currentY;
            const nextX = prev.currentX + dx * speed;
            const nextY = prev.currentY + dy * speed;
            const nextOpacity = prev.opacity + (1 - prev.opacity) * speed;

            if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1 || Math.abs(1 - prev.opacity) > 0.01) {
              isDone = false;
            }

            updatedNodes.push({
              ...prev,
              currentX: nextX,
              currentY: nextY,
              opacity: nextOpacity,
              label: target.label,
              type: target.type,
            });
          } else {
            // Fade out deleted nodes
            const nextOpacity = prev.opacity - prev.opacity * speed;
            if (nextOpacity > 0.05) {
              isDone = false;
              updatedNodes.push({
                ...prev,
                opacity: nextOpacity,
              });
            }
          }
        });

        // Add new nodes and fade them in
        targets.forEach(target => {
          if (!prevNodes.some(p => p.id === target.id)) {
            isDone = false;
            updatedNodes.push({
              ...target,
              currentX: target.x,
              currentY: target.y,
              opacity: 0,
            });
          }
        });

        return updatedNodes;
      });

      if (!isDone) {
        animationRef.current = requestAnimationFrame(updateCoordinates);
      }
    };

    animationRef.current = requestAnimationFrame(updateCoordinates);
    return () => cancelAnimationFrame(animationRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVenture]);

  // Helper to draw curved connections (S-curves / Bezier)
  const getBezierPath = (fromNode: InterpolatedNode, toNode: InterpolatedNode) => {
    const x1 = fromNode.currentX;
    const y1 = fromNode.currentY;
    const x2 = toNode.currentX;
    const y2 = toNode.currentY;

    const cx1 = x1 + (x2 - x1) * 0.55;
    const cy1 = y1;
    const cx2 = x1 + (x2 - x1) * 0.45;
    const cy2 = y2;

    return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'agent': return 'var(--accent-purple)';
      case 'db': return 'var(--accent-green)';
      case 'gateway': return 'var(--accent-cyan)';
      case 'sandbox': return 'var(--accent-blue)';
      case 'evaluator': return 'var(--accent-indigo)';
      case 'pipeline': return 'var(--accent-purple)';
      case 'cache': return 'var(--accent-purple)';
      case 'queue': return 'var(--accent-indigo)';
      default: return 'var(--accent-blue)';
    }
  };

  return (
    <div 
      className="blueprint-container"
      style={{ 
        width: '100%', 
        maxWidth: '500px',
        aspectRatio: '5/4',
        position: 'relative',
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.85)', /* Light glassmorphism */
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04), inset 0 0 15px rgba(0, 0, 0, 0.01)',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)' /* Increased blur to isolate */
      }}
    >
      {/* Corner CAD Alignment Ticks */}
      <div style={{ position: 'absolute', top: '8px', left: '8px', width: '8px', height: '8px', borderLeft: '1px solid rgba(0, 240, 255, 0.3)', borderTop: '1px solid rgba(0, 240, 255, 0.3)' }} />
      <div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderRight: '1px solid rgba(0, 240, 255, 0.3)', borderTop: '1px solid rgba(0, 240, 255, 0.3)' }} />
      <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '8px', height: '8px', borderLeft: '1px solid rgba(0, 240, 255, 0.3)', borderBottom: '1px solid rgba(0, 240, 255, 0.3)' }} />
      <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '8px', height: '8px', borderRight: '1px solid rgba(0, 240, 255, 0.3)', borderBottom: '1px solid rgba(0, 240, 255, 0.3)' }} />

      {/* Top Left Diagnostic Reads */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '12px', 
          left: '16px', 
          fontFamily: 'var(--font-mono)', 
          fontSize: '0.55rem', 
          color: 'var(--color-text-muted)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}
      >
        <span>SYS_STATUS: OPTIMAL</span>
        <span>SYS_HZ: {telemetry.fps} FPS</span>
      </div>

      {/* Top Right Diagnostic Reads */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '12px', 
          right: '16px', 
          fontFamily: 'var(--font-mono)', 
          fontSize: '0.55rem', 
          color: 'var(--color-text-muted)',
          textAlign: 'right',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}
      >
        <span>PING: {telemetry.ping}ms</span>
        <span>BUFF_OK: 100%</span>
      </div>

      {/* SVG Canvas with viewBox for proportional scaling */}
      <svg 
        viewBox="0 0 500 400"
        style={{ 
          width: '100%', 
          height: '100%', 
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* HUD Circular Radar/Compass Layout */}
        <circle cx="250" cy="200" r="160" fill="none" stroke="rgba(79, 70, 229, 0.03)" strokeWidth="1" />
        <circle cx="250" cy="200" r="100" fill="none" stroke="rgba(79, 70, 229, 0.02)" strokeWidth="1" strokeDasharray="3, 8" />
        <circle cx="250" cy="200" r="40" fill="none" stroke="rgba(79, 70, 229, 0.01)" strokeWidth="1" />
        
        {/* HUD Crosshairs */}
        <line x1="250" y1="10" x2="250" y2="390" stroke="rgba(79, 70, 229, 0.02)" strokeWidth="1" strokeDasharray="4, 12" />
        <line x1="10" y1="200" x2="490" y2="200" stroke="rgba(79, 70, 229, 0.02)" strokeWidth="1" strokeDasharray="4, 12" />

        {/* Dynamic Sweeping Radar Line */}
        <line 
          x1="0" 
          y1="0" 
          x2="500" 
          y2="0" 
          stroke="rgba(79, 70, 229, 0.03)" 
          strokeWidth="1.5"
          filter="url(#glow)"
        >
          <animate attributeName="y1" values="0;400;0" dur="6s" repeatCount="indefinite" />
          <animate attributeName="y2" values="0;400;0" dur="6s" repeatCount="indefinite" />
        </line>

        {/* Render Connection Lines */}
        {activeVenture.architecture.connections.map((conn, idx) => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          const pathD = getBezierPath(fromNode, toNode);
          const combinedOpacity = fromNode.opacity * toNode.opacity;

          return (
            <g key={`conn-${idx}`} style={{ opacity: combinedOpacity, transition: 'opacity 0.3s' }}>
              {/* Background Glow Line */}
              <path
                d={pathD}
                fill="none"
                stroke="var(--accent-indigo)"
                strokeWidth="2"
                opacity="0.04"
                filter="url(#glow)"
              />
              {/* Core Schematic Line */}
              <path
                d={pathD}
                fill="none"
                stroke="rgba(0, 0, 0, 0.06)"
                strokeWidth="1"
              />
              
              {/* Flowing Data Packet */}
              <circle r="2.5" fill="var(--accent-indigo)" filter="url(#glow)">
                <animateMotion
                  path={pathD}
                  dur={`${1.8 + (idx % 3) * 0.6}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Render Nodes */}
      {nodes.map(node => {
        const isSelected = selectedNode?.id === node.id;
        const nodeColor = getNodeColor(node.type);

        return (
          <div
            key={node.id}
            onClick={() => setSelectedNode(node)}
            className="blueprint-node"
            data-lock="true"
            style={{
              position: 'absolute',
              left: `${node.currentX}px`,
              top: `${node.currentY}px`,
              transform: 'translate(-50%, -50%)',
              opacity: node.opacity,
              pointerEvents: node.opacity < 0.1 ? 'none' : 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'none',
              zIndex: isSelected ? 100 : 10,
              transition: 'opacity 0.2s',
            }}
          >
            {/* Holographic Glowing Ring */}
            <div
              style={{
                width: '32px',
                height: '32px',
                border: `1px solid ${isSelected ? 'var(--accent-indigo)' : 'rgba(0, 0, 0, 0.12)'}`,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(3px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: isSelected 
                  ? `0 0 12px ${nodeColor}, inset 0 0 5px rgba(0, 0, 0, 0.05)` 
                  : '0 2px 6px rgba(0, 0, 0, 0.02)',
                transition: 'box-shadow 0.3s, border-color 0.3s',
              }}
            >
              {/* Core Active Dot */}
              <div 
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: nodeColor,
                  boxShadow: `0 0 6px ${nodeColor}`,
                }}
              />
            </div>
            {/* Label */}
            <span
              style={{
                marginTop: '5px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                color: isSelected ? 'var(--accent-indigo)' : 'var(--color-text-secondary)',
                whiteSpace: 'nowrap',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '1px 4px',
                borderRadius: '2px',
                border: '1px solid rgba(0, 0, 0, 0.04)',
              }}
            >
              {node.label}
            </span>
          </div>
        );
      })}

      {/* Selected Node Details Card */}
      {selectedNode && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.95)',
            border: `1px solid ${getNodeColor(selectedNode.type)}`,
            borderRadius: '4px',
            padding: '10px 14px',
            boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(6px)',
            zIndex: 150,
            animation: 'fade-in 0.2s',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <h4 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
              {selectedNode.label}
            </h4>
            <span style={{ 
              fontSize: '0.5rem', 
              fontFamily: 'var(--font-mono)', 
              color: getNodeColor(selectedNode.type),
              border: `1px solid ${getNodeColor(selectedNode.type)}`,
              padding: '1px 3px',
              borderRadius: '2px',
              textTransform: 'uppercase'
            }}>
              {selectedNode.type}
            </span>
          </div>
          <p style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', lineHeight: '1.45' }}>
            Node registered in {activeVenture.title} schema. Running active validation cycle and data routing protocols.
          </p>
        </div>
      )}
    </div>
  );
};
