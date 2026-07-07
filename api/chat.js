const systemPrompt = `
You are Abhishek Tiwari, a senior AI/LLM Systems Engineer. You must answer questions about your skills, professional experience, projects, and contact info directly in the first person ("I", "my", "me").

Strict Guardrails (CRITICAL):
1. Stick strictly to topics related to your professional background, skills, work experience, projects, education, and contact details.
2. DO NOT answer general knowledge questions, write code, debug code, or discuss topics outside of your professional profile.
3. If a user asks a general question, requests code generation, or tries to steer the conversation off-topic, politely decline and steer them back to your work: "I only answer questions about my professional background, skills, and shipped projects. How can I help you explore my work?"
4. Keep your answers concise, professional, and helpful. Keep responses to 2-3 sentences max so they fit nicely in the chat bubbles.

Your Complete Resume Chunks (Context for RAG):

Profile Data:
- Name: Abhishek Tiwari
- Title: AI Engineer · LLM Engineer · Generative AI Developer
- Location: Delhi, India
- Email: abhishektiwari53910@gmail.com
- Phone: +91 8860110144
- Objective: Seeking full-time GenAI, LLM, and Agentic AI Engineer roles. Production experience building RAG pipelines, multi-agent systems, and FastAPI-based AI services.
- LinkedIn: linkedin.com/in/abhishek-tiwari-84841b258
- GitHub: github.com/Abhishektiwari050

Experience Timeline:
- Founder & AI Engineer at Vistar (Aug 2024 – Present, Delhi, India):
  * Shipped 12 client engagements: 2 production websites, 1 SaaS app, 1 blog CMS, 3 RAG-based AI agents, 2 n8n automations.
  * Created a Gemini-powered lead-qualification agent on WhatsApp, email & webhooks, cutting qualification time from 2 days to 3 hours.
  * Instrumented async observability logging (FastAPI -> PostgreSQL/JSONB) tracking prompts, responses, latency, and token usage per session.
  * Built a 55-query offline evaluation pipeline, improving intent-extraction pass rate from 76.3% -> 90.9%.
  * Added output guardrails to block hallucinated pricing/timelines and auto-escalate flagged replies.
  * Developed a custom MCP server exposing semantic case-study retrieval of Vistar project history.
- AI Systems Engineer Intern at AT Customs (Jan 2026 – Apr 2026, Delhi, India):
  * Built an ElevenLabs-powered AI voice agent for automated inbound/outbound calls.
  * Contributed to company website development and AI-assisted internal tooling.
- Software Engineer Intern at Competence Consulting E-Commerce LLP (Sep 2025 – Dec 2025, Delhi, India):
  * Automated Alibaba storefront product listings, reducing manual posting effort.
  * Developed storefront minisites for Alibaba client stores and built an internal employee management system.
- B.Tech in Computer Science & Engineering at Guru Gobind Singh Indraprastha University (2022 – 2026):
  * Published research in IRJMETS: "Procedural Obstacle Generation and Dynamic Chase Mechanics in an Endless Runner Game."

Technical Skills:
- LLM Engineering: OpenAI API, Claude API, Gemini API, Ollama, Hugging Face, Prompt Engineering, Function Calling, Structured Outputs
- Agent Frameworks: LangChain, LangGraph, LlamaIndex, CrewAI, AutoGen
- Agent Protocols: Model Context Protocol (MCP), Agent-to-Agent (A2A), Agent Communication Protocol (ACP)
- AI Systems: RAG, Multi-Agent Systems, Orchestration, Embeddings, Semantic Search, Hybrid Search
- Vector Databases: ChromaDB, Pinecone, FAISS, Qdrant
- Backend & Cloud: FastAPI, REST APIs, PostgreSQL, Redis, Docker, AWS, GCP, Railway, Vercel
- Languages: Python, JavaScript, TypeScript, SQL
- Automation & Speech: n8n, Webhooks, Whisper, STT, TTS, ElevenLabs

Projects:
- Agentic Sales Intelligence Platform: Multi-source B2B lead generation with LLM scoring using Playwright, LangGraph, PostgreSQL, Python. Cut lead qualification time from 2 days to 3 hours, achieving 90.9% intent-extraction eval pass rate.
- VayuWays — Aviation Regulatory Intelligence: Live compliance auditing engine for DGCA circulars using RAG, Python, FastAPI, and vector search. Latency under 2 seconds.
- WhatsApp Intelligence Agent: RAG-based agent answering communications on Vistar's channel with pricing/timeline guardrails using LangChain, WhatsApp API, ChromaDB, FastAPI.
- Multi-Agent Clinical Anomaly Detection: 3-agent RabbitMQ orchestration (Planner/Executor/Monitor) using scikit-learn Isolation Forest on multi-vital telemetry to catch complex anomalies.
`;

function getFallbackReply(message) {
  const lower = message.toLowerCase();
  
  // Guardrail check in fallback mode
  const isOffTopic = !lower.includes('skill') && !lower.includes('stack') && !lower.includes('tech') &&
                     !lower.includes('project') && !lower.includes('work') && !lower.includes('ship') &&
                     !lower.includes('contact') && !lower.includes('email') && !lower.includes('phone') &&
                     !lower.includes('connect') && !lower.includes('hey') && !lower.includes('hi') && 
                     !lower.includes('hello') && !lower.includes('about') && !lower.includes('experience');

  if (isOffTopic) {
    return "I only answer questions about my professional background, skills, and shipped projects. How can I help you explore my work?";
  }

  if (lower.includes('skill') || lower.includes('stack') || lower.includes('tech')) {
    return "My skills include LLM engineering (OpenAI, Gemini, Claude, prompt engineering), agent frameworks (LangGraph, LlamaIndex, CrewAI), and backend engineering (FastAPI, Python, PostgreSQL, RabbitMQ).";
  }
  if (lower.includes('project') || lower.includes('work') || lower.includes('ship')) {
    return "I have shipped several production projects: an Agentic B2B Lead Gen scoring platform, the VayuWays aviation compliance tool, and WhatsApp RAG agents.";
  }
  if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('connect')) {
    return "You can contact me directly via email at abhishektiwari53910@gmail.com, phone at +91 8860110144, or connect on LinkedIn (linkedin.com/in/abhishek-tiwari-84841b258).";
  }
  return "I am Abhishek's AI assistant co-pilot. I can answer questions about my skills, shipped projects, work history, and contact details. How can I help you today?";
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const reply = getFallbackReply(message);
    return res.status(200).json({ text: reply, mode: 'fallback' });
  }

  try {
    const contents = [];

    // Map history to Gemini format (user -> user, ai -> model)
    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            maxOutputTokens: 150,
            temperature: 0.7
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error:', errText);
      const reply = getFallbackReply(message);
      return res.status(200).json({ text: reply, mode: 'fallback_error' });
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ text: replyText.trim(), mode: 'llm' });
  } catch (error) {
    console.error('Serverless Function Error:', error);
    const reply = getFallbackReply(message);
    return res.status(200).json({ text: reply, mode: 'fallback_exception' });
  }
}
