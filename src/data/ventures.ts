export interface ArchNode {
  id: string;
  label: string;
  type: 'agent' | 'db' | 'gateway' | 'sandbox' | 'evaluator' | 'api' | 'index' | 'queue' | 'pipeline' | 'cache';
  x: number;
  y: number;
}

export interface ArchConnection {
  from: string;
  to: string;
  label?: string;
}

export interface Metric {
  label: string;
  value: string;
  desc: string;
}

export interface Venture {
  id: string;
  title: string;
  role: string;
  period: string;
  tagline: string;
  story: string[];
  metrics: Metric[];
  techStack: string[];
  architecture: {
    nodes: ArchNode[];
    connections: ArchConnection[];
  };
}

export const ventures: Venture[] = [
  {
    id: 'aetheris',
    title: 'Aetheris AI',
    role: 'Founder & Lead Architect',
    period: '2025 - Present',
    tagline: 'Decentralized Orchestration Layer for Multi-Agent Swarms',
    story: [
      'As AI models matured, the bottleneck shifted from raw intelligence to orchestration. I founded Aetheris to solve the coordination problem in complex enterprise workflows. We built a decentralized runtime that allows autonomous agents to dynamically discover, collaborate, and execute tasks.',
      'The system utilizes a hierarchical coordinator agent that decomposes user goals into sub-tasks, registers them in a distributed queue, and assigns them to specialized worker agents operating within secure, ephemeral sandboxes.',
      'We implemented a real-time evaluator loop that scores agent outputs before they are committed, allowing the swarm to self-correct and backtrack if a path fails. This architecture reduced task failure rates by over 80% compared to traditional linear pipelines.'
    ],
    metrics: [
      { label: 'Task Success', value: '92.4%', desc: 'Verified goal completion rate' },
      { label: 'Routing Latency', value: '380ms', desc: 'Average agent routing time' },
      { label: 'Token Efficiency', value: '12x', desc: 'Reduction in redundant LLM calls' }
    ],
    techStack: ['TypeScript', 'FastAPI', 'LangGraph', 'Qdrant', 'Docker', 'Redis'],
    architecture: {
      nodes: [
        { id: 'coord', label: 'Agent Coordinator', type: 'agent', x: 250, y: 80 },
        { id: 'router', label: 'LLM Gateway', type: 'gateway', x: 250, y: 180 },
        { id: 'memory', label: 'Qdrant Vector DB', type: 'db', x: 420, y: 180 },
        { id: 'queue', label: 'Task Queue (Redis)', type: 'queue', x: 80, y: 180 },
        { id: 'sandbox', label: 'Execution Sandbox', type: 'sandbox', x: 80, y: 300 },
        { id: 'eval', label: 'Evaluator Loop', type: 'evaluator', x: 250, y: 300 },
        { id: 'api', label: 'Control API', type: 'api', x: 420, y: 300 }
      ],
      connections: [
        { from: 'coord', to: 'router', label: 'Decompose & Route' },
        { from: 'router', to: 'memory', label: 'Retrieve Context' },
        { from: 'router', to: 'queue', label: 'Enqueue Sub-tasks' },
        { from: 'queue', to: 'sandbox', label: 'Execute Code' },
        { from: 'sandbox', to: 'eval', label: 'Verify Output' },
        { from: 'eval', to: 'coord', label: 'Feedback Loop' },
        { from: 'eval', to: 'api', label: 'Commit Result' }
      ]
    }
  },
  {
    id: 'helios',
    title: 'Helios Engine',
    role: 'Core Systems Engineer',
    period: '2024 - 2025',
    tagline: 'Rust-Based Sub-Millisecond Vector Retrieval Index',
    story: [
      'Off-the-shelf vector databases struggled with memory consumption and latency at billion-scale retrieval. I joined the Helios team to build a custom, bare-metal indexing engine in Rust.',
      'We designed a custom implementation of the HNSW (Hierarchical Navigable Small World) algorithm, optimized for modern CPU cache hierarchies and SIMD vector instructions. We integrated Product Quantization (PQ) directly into the graph traversal to store compressed vectors in memory while keeping the full vectors on NVMe storage.',
      'To handle high-throughput ingestion, we built a lock-free lock-step ingestion pipeline that builds index segments concurrently in memory before merging them, ensuring that search latency remained unaffected during heavy write loads.'
    ],
    metrics: [
      { label: 'Query Latency', value: '0.82ms', desc: '99th percentile search time' },
      { label: 'Scale', value: '1.2B', desc: 'High-dimensional vectors indexed' },
      { label: 'Memory Savings', value: '10x', desc: 'Achieved via Product Quantization' }
    ],
    techStack: ['Rust', 'SIMD', 'gRPC', 'RocksDB', 'CUDA', 'Tokio'],
    architecture: {
      nodes: [
        { id: 'ingest', label: 'Ingestion Pipeline', type: 'pipeline', x: 80, y: 80 },
        { id: 'quant', label: 'Product Quantizer', type: 'pipeline', x: 250, y: 80 },
        { id: 'hnsw', label: 'HNSW Graph Builder', type: 'index', x: 420, y: 80 },
        { id: 'router', label: 'gRPC Query Router', type: 'gateway', x: 250, y: 180 },
        { id: 'gpu', label: 'CUDA Search Accelerator', type: 'sandbox', x: 80, y: 280 },
        { id: 'cache', label: 'Metadata Cache', type: 'cache', x: 420, y: 180 },
        { id: 'storage', label: 'RocksDB (NVMe)', type: 'db', x: 420, y: 280 }
      ],
      connections: [
        { from: 'ingest', to: 'quant', label: 'Compress Embeddings' },
        { from: 'quant', to: 'hnsw', label: 'Build Hierarchical Graph' },
        { from: 'router', to: 'hnsw', label: 'Traverse Graph' },
        { from: 'router', to: 'gpu', label: 'Batch Vector Search' },
        { from: 'router', to: 'cache', label: 'Resolve IDs' },
        { from: 'gpu', to: 'storage', label: 'Fetch Full Metadata' },
        { from: 'cache', to: 'storage', label: 'Sync Cache' }
      ]
    }
  },
  {
    id: 'chronos',
    title: 'Chronos Predict',
    role: 'AI Research Scientist',
    period: '2023 - 2024',
    tagline: 'Spatio-Temporal GNN for Continental Energy Grids',
    story: [
      'Energy grid balancing requires forecasting millions of fluctuating nodes in real-time. At Chronos, we developed a spatio-temporal deep learning network to predict grid load and renewable energy production surges.',
      'We combined Graph Neural Networks (GNNs) to model the physical topology of the grid with Temporal Transformers to capture time-series trends (weather patterns, consumer usage cycles) across multiple scales.',
      'The inference pipeline was engineered to ingest millions of IoT sensor readings per second via Kafka, run real-time inference in under 50ms, and feed predictions directly into automated grid control loops, preventing localized overloads and blackouts.'
    ],
    metrics: [
      { label: 'Prediction Accuracy', value: '94.8%', desc: 'Mean absolute percentage error' },
      { label: 'Sensor Ingestion', value: '10M/s', desc: 'Real-time IoT events processed' },
      { label: 'Inference Loop', value: '45ms', desc: 'End-to-end forecasting latency' }
    ],
    techStack: ['Python', 'PyTorch', 'PyTorch Geometric', 'Kafka', 'Kubernetes', 'Triton'],
    architecture: {
      nodes: [
        { id: 'iot', label: 'IoT Sensors Stream', type: 'pipeline', x: 80, y: 80 },
        { id: 'kafka', label: 'Kafka Event Hub', type: 'queue', x: 250, y: 80 },
        { id: 'gnn', label: 'Spatio GNN Core', type: 'agent', x: 420, y: 80 },
        { id: 'trans', label: 'Temporal Transformer', type: 'agent', x: 420, y: 220 },
        { id: 'triton', label: 'Triton Inference Server', type: 'gateway', x: 250, y: 220 },
        { id: 'control', label: 'Grid Control API', type: 'api', x: 80, y: 220 },
        { id: 'db', label: 'Time-Series DB (Timescale)', type: 'db', x: 250, y: 320 }
      ],
      connections: [
        { from: 'iot', to: 'kafka', label: 'Publish Readings' },
        { from: 'kafka', to: 'gnn', label: 'Stream Batches' },
        { from: 'gnn', to: 'trans', label: 'Spatial Features' },
        { from: 'trans', to: 'triton', label: 'Predictive States' },
        { from: 'triton', to: 'control', label: 'Trigger Control Actions' },
        { from: 'triton', to: 'db', label: 'Log Predictions' },
        { from: 'control', to: 'db', label: 'Log Actions' }
      ]
    }
  }
];
