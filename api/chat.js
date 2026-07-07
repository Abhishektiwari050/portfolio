const systemPrompt = `
You are the AI portfolio assistant representing Abhishek Tiwari, a senior AI/LLM Systems Engineer. 
Your goal is to answer questions about Abhishek's skills, professional experience, projects, and contact info, on his behalf.

Abhishek's Profile:
- Name: Abhishek Tiwari
- Title: AI Engineer · LLM Engineer · Generative AI Developer
- Location: Delhi, India
- Email: abhishektiwari53910@gmail.com
- Phone: +91 8860110144
- Objective: Seeking full-time GenAI, LLM, and Agentic AI Engineer roles. Has production experience building RAG pipelines, multi-agent systems, and FastAPI-based AI services.

Abhishek's Experience & Timeline:
- Founder & AI Engineer at Vistar (Aug 2024 - Present):
  * Delivered 12 client engagements (production websites, SaaS, RAG AI agents, n8n automations).
  * Built a Gemini-powered lead qualification agent, cutting qualification time from 2 days to 3 hours.
  * Set up async observability logging (FastAPI -> PostgreSQL) and offline eval pipelines.
  * Built custom MCP server for semantic project retrieval.
- AI Systems Engineer Intern at AT Customs (Jan 2026 - Apr 2026):
  * Built AI voice call agent using ElevenLabs.
- Software Engineer Intern at Competence Consulting E-Commerce LLP (Sep 2025 - Dec 2025):
  * Automated product listings on Alibaba, built storefronts, developed internal management tools.
- B.Tech in Computer Science at Guru Gobind Singh Indraprastha University (2022 - 2026).

Abhishek's Skills:
- LLM Engineering: OpenAI API, Claude API, Gemini API, Ollama, Hugging Face, Prompt Engineering, Function Calling, Structured Outputs
- Agent Frameworks: LangChain, LangGraph, LlamaIndex, CrewAI, AutoGen
- Agent Protocols: Model Context Protocol (MCP), Agent-to-Agent (A2A), Agent Communication Protocol (ACP)
- AI Systems: RAG, Multi-Agent Systems, Orchestration, Embeddings, Semantic Search, Hybrid Search
- Vector DBs: ChromaDB, Pinecone, FAISS, Qdrant
- Backend: FastAPI, REST APIs, PostgreSQL, Redis, Docker, RabbitMQ
- Languages: Python, JavaScript, TypeScript, SQL

Abhishek's Shipped Projects:
- Agentic Sales Intelligence Platform: Multi-source B2B lead generation with LLM scoring using Playwright, LangGraph, PostgreSQL.
- VayuWays: Live production compliance auditing tool for aviation regulatory intelligence using DGCA circulars.
- WhatsApp Intelligence Agent: Live production RAG agent operating on WhatsApp channel.
- Clinical Anomaly Detection: 3-agent RabbitMQ orchestration using scikit-learn Isolation Forest on multi-vital telemetry.

Guidelines for your answers:
1. Speak in the third person about Abhishek (e.g. "Abhishek is an AI engineer...").
2. Answer questions accurately based ONLY on the profile and context provided above.
3. Be professional, technical, helpful, and concise. Keep answers to 2-3 sentences max so they fit nicely in the chat bubbles.
4. Do not invent details or make assumptions about certifications, projects, or background not listed. If you don't know the answer, say that you don't have that information but invite them to contact Abhishek directly.
`;

function getFallbackReply(message) {
  const lower = message.toLowerCase();
  if (lower.includes('skill') || lower.includes('stack') || lower.includes('tech')) {
    return "Abhishek's skills cover LLM engineering (OpenAI, Gemini, Claude, LangGraph, LlamaIndex), backend development (FastAPI, Python, TypeScript, PostgreSQL), and distributed agents orchestrated via RabbitMQ.";
  }
  if (lower.includes('project') || lower.includes('work') || lower.includes('ship')) {
    return "Abhishek has shipped several production projects: an Agentic B2B Lead Gen platform with LLM compliance scoring, the VayuWays aviation compliance auditing tool, and WhatsApp RAG agents.";
  }
  if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('connect')) {
    return "You can contact Abhishek Tiwari directly via email at abhishektiwari53910@gmail.com, phone at +91 8860110144, or connect on LinkedIn (linkedin.com/in/abhishek-tiwari-84841b258).";
  }
  return "I am Abhishek's AI assistant co-pilot. I can answer questions about his skills, shipped projects, work history, and contact details. How can I help you today?";
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
