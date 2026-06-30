import React, { useEffect, useState, useRef } from 'react';

interface TerminalConsoleProps {
  activeVentureId: string;
}

const LOG_TEMPLATES: Record<string, string[]> = {
  intro: [
    'SYS: Booting Core Decryptor...',
    'SYS: Loading WebGL rendering pipelines...',
    'SYS: Initializing CatmullRom spline path...',
    'SYS: Calibrating CAD coordinate reticle...',
    'SYS: Parallax grids aligned and active.',
    'SYS: System ready. Scroll to decrypt chronicles.'
  ],
  aetheris: [
    'AETH: Spawning Agent Coordinator...',
    'AETH: Querying Qdrant for semantic task context...',
    'AETH: Coordinator decomposed user goal into 4 sub-tasks.',
    'AETH: Pushing tasks to Redis execution queue...',
    'AETH: Worker-3 starting ephemeral sandbox execution...',
    'AETH: Running output validation inside Evaluator Loop...',
    'AETH: Task verification score: 0.98. Committing result.'
  ],
  helios: [
    'HELIOS: Initializing lock-free parallel ingestion...',
    'HELIOS: Compressing embeddings via Product Quantization (PQ)...',
    'HELIOS: Building HNSW graph segments (SIMD-accelerated)...',
    'HELIOS: Merging segment-3 into main NVMe index...',
    'HELIOS: gRPC query received. Query vector dimensions: 1536.',
    'HELIOS: CUDA-accelerated batch search initiated...',
    'HELIOS: Query resolved. Latency: 0.82ms. Recall@10: 98.4%'
  ],
  chronos: [
    'CHRONOS: Subscribing to IoT sensor streams (Kafka)...',
    'CHRONOS: Ingesting 10.4M telemetry events/sec...',
    'CHRONOS: Extracting grid topology via Spatio-Temporal GNN...',
    'CHRONOS: Evaluating time-series trends with Temporal Transformer...',
    'CHRONOS: Forwarding predictions to Triton Inference Server...',
    'CHRONOS: Grid overload threshold: NORMAL. Triggering APIs.',
    'CHRONOS: Inference complete. Latency: 45ms.'
  ],
  connect: [
    'SYNAPSE: Initializing communication channels...',
    'SYNAPSE: Establishing link with Aetheris (Agent Swarm)...',
    'SYNAPSE: Establishing link with Helios (Vector Search)...',
    'SYNAPSE: Establishing link with Chronos (Grid Forecast)...',
    'SYNAPSE: Synaptic hub fully integrated.',
    'SYNAPSE: Connection secure. Awaiting handshake...'
  ]
};

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({ activeVentureId }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const templateIdxRef = useRef(0);
  const activeIdRef = useRef(activeVentureId);

  // Sync ref
  useEffect(() => {
    activeIdRef.current = activeVentureId;
    templateIdxRef.current = 0;
    // Load initial boot logs immediately on section change
    const initialLogs = LOG_TEMPLATES[activeVentureId] || LOG_TEMPLATES.intro;
    setLogs(initialLogs.slice(0, 3));
  }, [activeVentureId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentId = activeIdRef.current;
      const templates = LOG_TEMPLATES[currentId] || LOG_TEMPLATES.intro;
      
      // Get next log line
      const nextLog = templates[templateIdxRef.current % templates.length];
      templateIdxRef.current += 1;

      // Format with timestamp
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      const formattedLog = `[${timeStr}] ${nextLog}`;

      setLogs(prev => {
        const nextLogs = [...prev, formattedLog];
        if (nextLogs.length > 5) {
          nextLogs.shift(); // Keep only last 5 lines
        }
        return nextLogs;
      });
    }, 1800); // Add a log line every 1.8s

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        width: '380px',
        background: 'rgba(255, 255, 255, 0.85)',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        padding: '12px 16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04), inset 0 0 10px rgba(0, 0, 0, 0.01)',
        backdropFilter: 'blur(16px)',
        zIndex: 100,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        letterSpacing: '-0.01em',
        lineHeight: '1.5',
      }}
    >
      {/* Terminal Title Bar */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          paddingBottom: '6px',
          marginBottom: '8px',
          color: 'var(--color-text-secondary)',
          textTransform: 'uppercase',
          fontSize: '0.55rem',
          letterSpacing: '0.08em'
        }}
      >
        <span>&gt;_ Agent_Console_Stream</span>
        <span style={{ color: 'var(--accent-indigo)' }}>Online</span>
      </div>

      {/* Log Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minHeight: '80px' }}>
        {logs.map((log, idx) => (
          <div 
            key={idx} 
            style={{ 
              color: log.includes('SYS:') || log.includes('SYNAPSE:') ? 'var(--color-text-secondary)' : 'var(--accent-indigo)',
              opacity: 0.4 + (idx / logs.length) * 0.6,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {log}
          </div>
        ))}
        {/* Blinking prompt line */}
        <div style={{ color: 'var(--accent-indigo)' }}>
          <span>$ </span>
          <span style={{ animation: 'blink 1s step-start infinite' }}>_</span>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};
