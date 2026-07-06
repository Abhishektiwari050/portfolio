// Real resume data for Abhishek Tiwari
export interface Metric {
  label: string;
  value: string;
  desc: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  org: string;
  location: string;
  type: 'work' | 'education' | 'project';
  bullets: string[];
  tech?: string[];
  link?: string;
}

export interface SkillGroup {
  category: string;
  icon: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  status: 'live' | 'production' | 'personal';
  description: string;
  metrics: Metric[];
  tech: string[];
  highlight?: string;
}

export const profile = {
  name: 'Abhishek Tiwari',
  title: 'AI Engineer · LLM Engineer · Generative AI Developer',
  location: 'Delhi, India',
  phone: '+91 8860110144',
  email: 'abhishektiwari53910@gmail.com',
  linkedin: 'linkedin.com/in/abhishek-tiwari-84841b258',
  github: 'github.com/Abhishektiwari050',
  objective: 'AI/LLM Engineer with production experience building RAG pipelines, multi-agent systems, and FastAPI-based AI services — seeking full-time GenAI, LLM, and Agentic AI Engineer roles.',
};

export const timeline: TimelineItem[] = [
  {
    year: 'Aug 2024 – Present',
    title: 'Founder & AI Engineer',
    org: 'Vistar',
    location: 'Delhi, India',
    type: 'work',
    bullets: [
      'Delivered 12 client engagements: 2 production websites, 1 SaaS app, 1 blog CMS, 3 RAG-based AI agents, 2 n8n automations.',
      'Built a Gemini-powered lead-qualification agent across WhatsApp, email & website webhooks — replacing a 5-person manual workflow, cutting qualification time from 2 days → 3 hours.',
      'Instrumented async observability logging (FastAPI → PostgreSQL/JSONB) tracking prompts, responses, latency, and token usage per session.',
      'Built 55-query offline eval pipeline improving intent-extraction pass rate from 76.3% → 90.9% through targeted system-prompt fixes.',
      'Output guardrail blocks hallucinated pricing/timelines, auto-escalates flagged responses to human review.',
      'Wrote a custom MCP server exposing semantic case-study retrieval, grounding agent responses in real Vistar project history.',
    ],
    tech: ['FastAPI', 'LangGraph', 'LangChain', 'PostgreSQL', 'MCP', 'Gemini', 'n8n', 'WhatsApp API'],
  },
  {
    year: 'Jan 2026 – Apr 2026',
    title: 'AI Systems Engineer Intern',
    org: 'AT Customs',
    location: 'Delhi, India',
    type: 'work',
    bullets: [
      'Built an AI-powered voice call agent using ElevenLabs for automated outbound/inbound call handling.',
      'Contributed to company website development and AI-assisted internal tooling.',
    ],
    tech: ['ElevenLabs', 'Python', 'FastAPI'],
  },
  {
    year: 'Sep 2025 – Dec 2025',
    title: 'Software Engineer Intern',
    org: 'Competence Consulting E-Commerce LLP',
    location: 'Delhi, India',
    type: 'work',
    bullets: [
      'Automated product listing workflows for Alibaba storefronts, reducing manual posting effort.',
      'Built minisite storefronts for client Alibaba stores.',
      'Developed an internal employee management system.',
    ],
    tech: ['Python', 'JavaScript', 'Automation', 'SQL'],
  },
  {
    year: '2022 – 2026',
    title: 'B.Tech Computer Science & Engineering',
    org: 'Guru Gobind Singh Indraprastha University',
    location: 'Delhi, India',
    type: 'education',
    bullets: [
      'Relevant Coursework: Machine Learning, Data Structures & Algorithms, Distributed Systems, DBMS.',
      'Published research in IRJMETS: Procedural Obstacle Generation and Dynamic Chase Mechanics in an Endless Runner Game.',
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    category: 'LLM Engineering',
    icon: '🧠',
    items: ['OpenAI API', 'Claude API', 'Gemini API', 'Ollama', 'Hugging Face', 'Prompt Engineering', 'Function Calling', 'Structured Outputs'],
  },
  {
    category: 'Agent Frameworks',
    icon: '🤖',
    items: ['LangChain', 'LangGraph', 'LlamaIndex', 'CrewAI', 'AutoGen'],
  },
  {
    category: 'Agent Protocols',
    icon: '🔌',
    items: ['Model Context Protocol (MCP)', 'Agent-to-Agent (A2A)', 'Agent Communication Protocol (ACP)'],
  },
  {
    category: 'AI Systems',
    icon: '⚙️',
    items: ['RAG', 'Multi-Agent Systems', 'Orchestration', 'Embeddings', 'Semantic Search', 'Hybrid Search'],
  },
  {
    category: 'Vector Databases',
    icon: '🗄️',
    items: ['ChromaDB', 'Pinecone', 'FAISS', 'Qdrant'],
  },
  {
    category: 'Backend & Cloud',
    icon: '☁️',
    items: ['FastAPI', 'REST APIs', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'GCP', 'Railway', 'Vercel'],
  },
  {
    category: 'Languages',
    icon: '💻',
    items: ['Python', 'JavaScript', 'TypeScript', 'SQL'],
  },
  {
    category: 'Automation & Speech',
    icon: '🎙️',
    items: ['n8n', 'Webhooks', 'Whisper', 'STT', 'TTS', 'ElevenLabs'],
  },
];

export const projects: Project[] = [
  {
    id: 'sales-intel',
    title: 'Agentic Sales Intelligence Platform',
    tagline: 'Multi-source B2B lead generation with LLM scoring',
    status: 'live',
    description: 'Multi-source lead generation and qualification system combining Playwright automation, SMTP verification, and LLM-based scoring across Indian B2B data sources (JustDial, IndiaMART, MCA records).',
    metrics: [
      { label: 'Data Sources', value: '3+', desc: 'JustDial, IndiaMART, MCA' },
      { label: 'Qualification Time', value: '3 hrs', desc: 'Down from 2 days manually' },
      { label: 'Pass Rate', value: '90.9%', desc: 'Intent-extraction accuracy' },
    ],
    tech: ['Playwright', 'FastAPI', 'LangGraph', 'PostgreSQL', 'SMTP', 'Python'],
    highlight: 'Live Production',
  },
  {
    id: 'vayuways',
    title: 'VayuWays — Aviation Regulatory Intelligence',
    tagline: 'NotebookLM-based DGCA compliance tool',
    status: 'production',
    description: 'Live, production. NotebookLM-based regulatory intelligence tool for DGCA compliance and liaison workflows.',
    metrics: [
      { label: 'Regulation Docs', value: '100+', desc: 'DGCA circulars indexed' },
      { label: 'Response Time', value: '<2s', desc: 'RAG retrieval latency' },
      { label: 'Status', value: 'Live', desc: 'Production deployed' },
    ],
    tech: ['NotebookLM', 'RAG', 'Python', 'FastAPI', 'Vector Search'],
  },
  {
    id: 'clinical-anomaly',
    title: 'Multi-Agent Clinical Anomaly Detection',
    tagline: '3-agent orchestration over RabbitMQ with Isolation Forest',
    status: 'personal',
    description: '3-agent orchestration system (Planner/Executor/Monitor) coordinating over RabbitMQ (CloudAMQP, TLS) with a defined message contract. Trained multivariate Isolation Forest on synthetic multi-vital telemetry to catch anomalies undetectable by single-threshold monitoring.',
    metrics: [
      { label: 'Agents', value: '3', desc: 'Planner + Executor + Monitor' },
      { label: 'Message Broker', value: 'RabbitMQ', desc: 'CloudAMQP with TLS' },
      { label: 'Anomaly Detection', value: 'Multi-vital', desc: 'vs single-threshold methods' },
    ],
    tech: ['FastAPI', 'RabbitMQ', 'scikit-learn', 'Isolation Forest', 'Python', 'Render'],
  },
  {
    id: 'vistar-wa',
    title: 'Vistar WhatsApp Intelligence Agent',
    tagline: 'RAG-based agent on WhatsApp answering on Vistar\'s behalf',
    status: 'production',
    description: 'Live, production. RAG-based agent operating on Vistar\'s own WhatsApp channel, retrieving over internal company data to respond to inbound business communications on Vistar\'s behalf.',
    metrics: [
      { label: 'Channel', value: 'WhatsApp', desc: 'Production comms channel' },
      { label: 'Knowledge Base', value: 'Internal', desc: 'Vistar project history' },
      { label: 'Guardrails', value: 'Active', desc: 'Hallucination blocked' },
    ],
    tech: ['LangChain', 'WhatsApp API', 'ChromaDB', 'FastAPI', 'PostgreSQL'],
    highlight: 'Live Production',
  },
];

export const vistarMetrics = [
  { label: 'Client Engagements', value: '12', desc: 'Delivered in production' },
  { label: 'Eval Pass Rate', value: '90.9%', desc: 'Intent extraction accuracy' },
  { label: 'Time Saved', value: '13x', desc: 'Lead qualification: 2d → 3h' },
  { label: 'Query Eval Pipeline', value: '55 Qs', desc: 'Hand-curated ground truth' },
];
