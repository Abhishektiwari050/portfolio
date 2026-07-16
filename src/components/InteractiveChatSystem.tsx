import React, { useState, useEffect, useRef } from 'react';
import { profile } from '../data/resume';

interface ChatProps {
  onExplore: () => void;
  isExploreActivated: boolean;
  onFocus: () => void;
  isExpanded: boolean;
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  options?: { label: string; action: () => void }[];
  isWelcome?: boolean;
  time?: string;
}

function getClientFallbackReply(message: string) {
  const lower = message.toLowerCase();

  const isOffTopic = !lower.includes('skill') && !lower.includes('stack') && !lower.includes('tech') &&
                     !lower.includes('project') && !lower.includes('work') && !lower.includes('ship') &&
                     !lower.includes('contact') && !lower.includes('email') && !lower.includes('phone') &&
                     !lower.includes('connect') && !lower.includes('hey') && !lower.includes('hi') && 
                     !lower.includes('hello') && !lower.includes('about') && !lower.includes('experience');

  if (isOffTopic) {
    return "[METADATA: CONFIDENCE=100% | AREA=GUARDRAILS]\n[STATUS: SECURITY_REFUSED]\n---\nI only answer questions about my professional background, skills, and shipped projects. How can I help you explore my work today?";
  }

  if (lower.includes('skill') || lower.includes('stack') || lower.includes('tech')) {
    return "[METADATA: CONFIDENCE=95% | AREA=SKILLS]\n[STATUS: RETRIEVAL_SUCCESS]\n---\nMy core technical stack includes:\n- AI Systems: LLM Orchestration, Prompt Design, Vector Embeddings\n- Frameworks: LangGraph, LlamaIndex, CrewAI\n- Architecture: FastAPI, Python, PostgreSQL, RabbitMQ, Docker, Redis";
  }
  if (lower.includes('project') || lower.includes('work') || lower.includes('ship')) {
    return "[METADATA: CONFIDENCE=95% | AREA=PROJECTS]\n[STATUS: RETRIEVAL_SUCCESS]\n---\nSome of my key projects include:\n- B2B Lead Gen scoring platform: Multi-agent lead qualification and scoring\n- VayuWays aviation compliance tool: Hybrid search compliance checker\n- WhatsApp RAG agents: Specialized customer support agents";
  }
  if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('connect')) {
    return `[METADATA: CONFIDENCE=100% | AREA=CONTACT]\n[STATUS: RETRIEVAL_SUCCESS]\n---\nHere are my contact details:\n- Email: ${profile.email}\n- Phone: ${profile.phone}\n- GitHub: github.com/abhishektiwari050\n- LinkedIn: linkedin.com/in/abhishek-tiwari-84841b258`;
  }
  return `[METADATA: CONFIDENCE=90% | AREA=GENERAL]\n[STATUS: RETRIEVAL_SUCCESS]\n---\nHi! I'm Abhishek Tiwari. I'm an AI Engineer. Ask me anything about my skills, projects, work experience, or contact details!`;
}

function AIEngineeringResponse({ text }: { text: string }) {
  const metadataRegex = /\[METADATA:\s*CONFIDENCE=([^\|]+)\s*\|\s*AREA=([^\]]+)\]/i;
  const statusRegex = /\[STATUS:\s*([^\]]+)\]/i;

  const metadataMatch = text.match(metadataRegex);
  const statusMatch = text.match(statusRegex);

  let confidence = "98%";
  let area = "SYSTEM_TELEMETRY";
  let status = "COMPILING_SUCCESS";
  let cleanText = text;

  if (metadataMatch) {
    confidence = metadataMatch[1].trim();
    area = metadataMatch[2].trim().toUpperCase();
    cleanText = cleanText.replace(metadataRegex, '');
  }
  if (statusMatch) {
    status = statusMatch[1].trim().toUpperCase();
    cleanText = cleanText.replace(statusRegex, '');
  }

  cleanText = cleanText.replace(/^\s*-{3,}\s*/, '').trim();
  const lines = cleanText.split('\n');

  return (
    <div className="apple-system-response">
      {/* Liquid Glass Telemetry Console Header */}
      <div className="apple-response-badge">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
          <span style={{ 
            background: status === 'SECURITY_REFUSED' ? 'rgba(255, 59, 48, 0.08)' : 'rgba(0, 85, 255, 0.08)',
            color: status === 'SECURITY_REFUSED' ? '#ff3b30' : '#0055ff',
            border: status === 'SECURITY_REFUSED' ? '1px solid rgba(255,59,48,0.2)' : '1px solid rgba(0,85,255,0.2)',
            padding: '2px 8px',
            borderRadius: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            fontWeight: 800
          }}>
            [ {status} ]
          </span>
          <span style={{ color: '#86868b', fontSize: '0.58rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            {area}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <span style={{ minWidth: '85px', fontSize: '0.58rem', fontFamily: 'var(--font-mono)' }}>CONFIDENCE: {confidence}</span>
          <div style={{ flex: 1, height: '4px', background: 'rgba(0,0,0,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ 
              width: confidence.includes('%') ? confidence : `${confidence}%`, 
              height: '100%', 
              background: '#0055ff', 
              boxShadow: '0 0 4px #0055ff',
              borderRadius: '2px'
            }} />
          </div>
        </div>
      </div>

      <div className="apple-response-content">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={i} style={{ height: '6px' }} />;

          if (trimmed.startsWith('###') || (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length < 50)) {
            const headerText = trimmed.replace(/[#\*]+/g, '').trim();
            return (
              <h4 key={i} className="apple-response-header">
                {headerText}
              </h4>
            );
          }

          if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
            const content = trimmed.replace(/^[-*\d.]+\s*/, '').trim();
            const colonIndex = content.indexOf(':');
            if (colonIndex > 0 && colonIndex < 35) {
              const key = content.substring(0, colonIndex);
              const val = content.substring(colonIndex + 1);
              return (
                <div key={i} className="apple-response-row">
                  <span className="apple-response-row__key">{key}</span>
                  <span className="apple-response-row__val">{val}</span>
                </div>
              );
            }

            return (
              <div key={i} className="apple-response-bullet">
                <span className="apple-response-bullet__icon">•</span>
                <span className="apple-response-bullet__text">{content}</span>
              </div>
            );
          }

          return (
            <p key={i} className="apple-response-para">
              {trimmed}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export function InteractiveChatSystem({ onExplore, isExploreActivated, onFocus, isExpanded }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getBootSequence = (): ChatMessage => {
    return { 
      sender: 'ai', 
      text: "Hi, I'm Abhishek Tiwari AI Engineer.\nI build production-ready AI systems, RAG pipelines, multi-agent architectures, and FastAPI backend services.\nHow can I help you today?",
      isWelcome: true,
      time: '08:26 AM'
    };
  };

  useEffect(() => {
    setMessages([getBootSequence()]);
  }, [onExplore]);

  const handleSend = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    const lower = cleanText.toLowerCase();

    if (lower === 'clear' || lower === 'reset') {
      setMessages([getBootSequence()]);
      setInput('');
      return;
    }

    if (lower === 'explore' || lower === 'run explore') {
      onExplore();
      setInput('');
      return;
    }

    const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: cleanText }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    if (lower === 'hey' || lower === 'hi' || lower === 'hello') {
      setTimeout(() => {
        setIsTyping(false);
        const reply = `[METADATA: CONFIDENCE=100% | AREA=GENERAL]\n[STATUS: RETRIEVAL_SUCCESS]\n---\nHi! I'm Abhishek Tiwari. Ask me anything about my skills, projects, work history, or contact details. Feel free to browse files or ask any questions!`;
        setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      }, 400);
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not found');
      }

      const geminiHistory = newMessages
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

      const systemPrompt = `You are Abhishek Tiwari, the AI Engineer whose interactive portfolio website this is.
You MUST speak in the first person ("I", "me", "my", "we"). Do NOT refer to yourself as an assistant or co-pilot, and do NOT say "Abhishek has built..." or "Abhishek's skills". Instead, say "I have built..." or "my skills".

CRITICAL FORMAT REQUIREMENT:
You MUST start your response with a telemetry metadata block in this exact format:
[METADATA: CONFIDENCE=<percentage>% | AREA=<SKILLS/EXPERIENCE/PROJECTS/CONTACT/GENERAL>]
[STATUS: <SYSTEM_READY/RETRIEVAL_SUCCESS/SECURITY_REFUSED>]
---

Aesthetics/Style:
- Be concise. Keep responses under 3 paragraphs.
- Use clear bullet points (- Key: Value) when explaining multiple items, as the UI will parse this into structured cards.
- Maintain a premium, world-class developer tone.

Professional Guardrails:
- You ONLY answer questions related to your own profile, career, skills, and projects.
- If a user asks an off-topic question, you must set STATUS to SECURITY_REFUSED and decline politely, saying you only answer questions about your own professional work.

Here is the information about me:
Name: Abhishek Tiwari
Title: AI Engineer
Location: Delhi, India
Email: abhishektiwari53910@gmail.com
Phone: +919717140880
GitHub: github.com/abhishektiwari050
LinkedIn: linkedin.com/in/abhishek-tiwari-84841b258

Key Skills:
- LLM Engineering (Prompt engineering, Function calling, Structured outputs, Gemini/Claude/OpenAI APIs)
- Agent Frameworks & AI Systems (LangGraph, LlamaIndex, CrewAI, RAG pipelines, Multi-Agent orchestration)
- Scalable Backends (FastAPI, Python, PostgreSQL, RabbitMQ, Redis, Docker)
- Speech & Voice Systems (Text-to-Speech, Speech-to-Text, Voice Agent development, ElevenLabs)
- Workflow Automations (Custom orchestration pipelines, web scraping, data collection, n8n)

Shipped Projects:
1. Agentic B2B Lead Gen scoring platform: Multi-agent lead gen system with customized scoring algorithms, built using FastAPI, PostgreSQL, RabbitMQ, and React.
2. VayuWays aviation compliance tool: Aviation document parser and compliance verifier, utilizing RAG with hybrid search and PDF parsers.
3. WhatsApp RAG Agent: Dedicated business support chatbot running on Vistar's official business WhatsApp channel.
4. Multi-Agent Vital Anomaly Detector: Isolation forest telemetry parser over CloudAMQP TLS message queues.
`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: geminiHistory,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          }
        })
      });

      setIsTyping(false);

      if (response.ok) {
        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that response. Please try again.";
        setMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
      } else {
        const fallbackText = getClientFallbackReply(cleanText);
        setMessages(prev => [...prev, { sender: 'ai', text: fallbackText }]);
      }
    } catch (e) {
      setIsTyping(false);
      const fallbackText = getClientFallbackReply(cleanText);
      setMessages(prev => [...prev, { sender: 'ai', text: fallbackText }]);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className={`chat-widget ${isExpanded ? 'expanded' : ''}`}>
      {/* Self-contained style overrides for futuristic Liquid Glass look */}
      <style>{`
        .chat-widget {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          height: 100%;
          display: flex;
          flex-direction: column;
          /* Default: content anchors to bottom so footer stays pinned */
          justify-content: flex-end;
          box-sizing: border-box;
        }

        /* When expanded, let content flow from top */
        .chat-widget.expanded {
          justify-content: flex-start !important;
        }

        /* Floating Glass Header */
        .apple-chat-header {
          background: rgba(255, 255, 255, 0.45) !important;
          backdrop-filter: blur(25px) !important;
          -webkit-backdrop-filter: blur(25px) !important;
          border: 1px solid rgba(255, 255, 255, 0.55) !important;
          border-radius: 20px !important;
          margin: 16px 24px 8px 24px !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          height: 56px !important;
          padding: 0 20px !important;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        .chat-widget:not(.expanded) .apple-chat-header {
          height: 0px !important;
          opacity: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          pointer-events: none !important;
          overflow: hidden !important;
        }

        /* Messages container — fills available space only when expanded */
        .apple-chat-body {
          padding: 54px 36px 12px 36px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 20px !important;
          overflow-y: auto !important;
          flex: 1 !important;
          background: transparent !important;
          min-height: 0 !important; /* critical for flex overflow */
        }

        /* Collapsed: body is invisible and takes no space */
        .chat-widget:not(.expanded) .apple-chat-body {
          flex: 0 !important;
          height: 0px !important;
          opacity: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          pointer-events: none !important;
        }

        /* Message bubbles */
        .apple-message-container {
          display: flex !important;
          width: 100% !important;
          margin-bottom: 4px !important;
        }

        /* User Message bubble: Sleek blue liquid glass */
        .apple-chat-bubble--user {
          background: rgba(0, 85, 255, 0.08) !important;
          backdrop-filter: blur(10px) saturate(160%) !important;
          -webkit-backdrop-filter: blur(10px) saturate(160%) !important;
          border: 1px solid rgba(0, 85, 255, 0.2) !important;
          border-radius: 18px 18px 4px 18px !important;
          padding: 10px 16px !important;
          color: #0055ff !important;
          font-family: var(--font-sans) !important;
          font-size: 0.88rem !important;
          font-weight: 600 !important;
          box-shadow: 0 4px 12px rgba(0, 85, 255, 0.02) !important;
          margin-left: auto !important;
          max-width: 75% !important;
          text-align: left !important;
        }

        /* AI Message bubble: High-shine liquid glass pane */
          background: rgba(255, 255, 255, 0.28) !important;
          backdrop-filter: blur(20px) saturate(140%) !important;
          -webkit-backdrop-filter: blur(20px) saturate(140%) !important;
          border: 1px solid rgba(255, 255, 255, 0.45) !important;
          border-radius: 18px 18px 18px 4px !important;
          padding: 12px 18px !important;
          color: #1d1d1f !important;
          font-family: var(--font-sans) !important;
          font-size: 0.88rem !important;
          font-weight: 500 !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02) !important;
          max-width: 82% !important;
        }

        /* Metadata telemetry header inside AI responses */
        .apple-response-badge {
          font-family: var(--font-mono) !important;
          font-size: 0.65rem !important;
          font-weight: 700 !important;
          color: #86868b !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          margin-bottom: 14px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 6px !important;
          width: 100% !important;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
          padding-bottom: 10px !important;
        }

        /* Structured response rows (parsed - Key: Value bullet items) */
        .apple-response-row {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 100%) !important;
          backdrop-filter: blur(10px) saturate(160%) !important;
          border: 1px solid rgba(255, 255, 255, 0.65) !important;
          border-right-color: rgba(255, 255, 255, 0.3) !important;
          border-bottom-color: rgba(255, 255, 255, 0.3) !important;
          border-radius: 14px !important;
          padding: 10px 14px !important;
          margin-top: 8px !important;
          margin-bottom: 8px !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 12px !important;
          box-shadow: 
            inset 0 1px 1px rgba(255, 255, 255, 0.7),
            0 4px 10px rgba(0,0,0,0.01) !important;
        }

        .apple-response-row__key {
          font-family: var(--font-sans) !important;
          font-weight: 700 !important;
          color: #1d1d1f !important;
          font-size: 0.82rem !important;
        }

        .apple-response-row__val {
          font-family: var(--font-sans) !important;
          font-weight: 500 !important;
          color: #0055ff !important;
          font-size: 0.82rem !important;
        }

        /* Structured response bullet lists */
        .apple-response-bullet {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 100%) !important;
          backdrop-filter: blur(10px) saturate(160%) !important;
          border: 1px solid rgba(255, 255, 255, 0.65) !important;
          border-right-color: rgba(255, 255, 255, 0.3) !important;
          border-bottom-color: rgba(255, 255, 255, 0.3) !important;
          border-radius: 14px !important;
          padding: 10px 14px !important;
          margin-top: 8px !important;
          margin-bottom: 8px !important;
          display: flex !important;
          align-items: flex-start !important;
          gap: 8px !important;
          box-shadow: 
            inset 0 1px 1px rgba(255, 255, 255, 0.7),
            0 4px 10px rgba(0,0,0,0.01) !important;
        }

        .apple-response-bullet__icon {
          color: #0055ff !important;
          font-weight: bold !important;
        }

        .apple-response-bullet__text {
          font-family: var(--font-sans) !important;
          font-size: 0.82rem !important;
          line-height: 1.4 !important;
          color: #2c3e50 !important;
          font-weight: 500 !important;
        }

        /* Response paragraph */
        .apple-response-para {
          font-size: 0.86rem !important;
          line-height: 1.55 !important;
          color: #2c3e50 !important;
          font-weight: 500 !important;
          margin-bottom: 12px !important;
        }

        /* Response header */
        .apple-response-header {
          font-size: 0.94rem !important;
          font-weight: 700 !important;
          color: #1d1d1f !important;
          margin: 18px 0 10px 0 !important;
          letter-spacing: -0.01em !important;
        }

        /* Pill options row */
        .apple-options-row {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
          margin-top: 8px !important;
          margin-bottom: 16px !important;
          padding-left: 4px !important;
        }

        .apple-pill-btn {
          background: rgba(255, 255, 255, 0.45) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(255, 255, 255, 0.6) !important;
          border-radius: 20px !important;
          padding: 8px 16px !important;
          font-family: var(--font-sans) !important;
          font-size: 0.76rem !important;
          font-weight: 600 !important;
          color: #0055ff !important;
          cursor: pointer !important;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
          box-shadow: 0 4px 10px rgba(0,0,0,0.01) !important;
        }

        .apple-pill-btn:hover {
          background: rgba(0, 85, 255, 0.08) !important;
          border-color: rgba(0, 85, 255, 0.25) !important;
          transform: translateY(-1px) !important;
        }

        /* Footer layout */
        /* Footer layout */
        .apple-chat-footer {
          padding: 12px 24px 18px 24px !important;
          background: transparent !important;
          border-top: none !important;
          flex-shrink: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        .chatgpt-input-box {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 8px 12px 8px 16px !important;
          border-radius: 22px !important;
          background: rgba(255, 255, 255, 0.62) !important;
          backdrop-filter: blur(20px) saturate(120%) !important;
          -webkit-backdrop-filter: blur(20px) saturate(120%) !important;
          border: 1px solid rgba(255, 255, 255, 0.7) !important;
          box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5), 0 4px 12px rgba(0, 0, 0, 0.02) !important;
          min-height: 46px !important;
          height: 46px !important;
          width: 100% !important;
          box-sizing: border-box !important;
          max-width: 100% !important;
        }

        .chatgpt-input-box:focus-within {
          background: rgba(255, 255, 255, 0.78) !important;
          border-color: rgba(255, 255, 255, 0.9) !important;
          box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5), 0 8px 20px rgba(0, 85, 255, 0.04) !important;
        }

        /* Expanded input: Taller card exactly matching the mockup */
        .chat-widget.expanded .chatgpt-input-box {
          max-width: 760px !important;
          width: 100% !important;
          min-height: 106px !important;
          height: 106px !important;
          border-radius: 28px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
          padding: 16px 20px !important;
          box-sizing: border-box !important;
          background: rgba(255, 255, 255, 0.28) !important;
          border: 1px solid rgba(255, 255, 255, 0.45) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02), inset 0 1px 1px rgba(255, 255, 255, 0.55) !important;
        }

        /* Attachment Button */
        .chatgpt-attachment-btn {
          background: none !important;
          border: none !important;
          cursor: pointer !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 28px !important;
          height: 28px !important;
          color: #86868b !important;
          transition: color 0.2s !important;
          flex-shrink: 0 !important;
        }
        .chatgpt-attachment-btn:hover {
          color: #1d1d1f !important;
        }

        /* Expanded attachment wrapped in white circle */
        .chat-widget.expanded .chatgpt-attachment-btn {
          width: 32px !important;
          height: 32px !important;
          border-radius: 50% !important;
          background: #ffffff !important;
          border: 1px solid rgba(0,0,0,0.04) !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.02) !important;
          color: #86868b !important;
        }

        /* Send Button */
        .chatgpt-send-btn {
          width: 32px !important;
          height: 32px !important;
          border-radius: 50% !important;
          background: #0055ff !important;
          border: none !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: background 0.2s, opacity 0.2s !important;
          padding: 0 !important;
          flex-shrink: 0 !important;
        }
        .chatgpt-send-btn:hover:not(:disabled) {
          background: #0044d4 !important;
        }
        .chatgpt-send-btn:disabled {
          opacity: 0.3 !important;
          cursor: not-allowed !important;
        }

        /* Expanded send button size and shadow */
        .chat-widget.expanded .chatgpt-send-btn {
          width: 36px !important;
          height: 36px !important;
          box-shadow: 0 4px 10px rgba(0, 85, 255, 0.25) !important;
        }

        /* Center Textarea */
        .chatgpt-text-area {
          flex: 1 !important;
          height: 24px !important;
          min-height: 24px !important;
          max-height: 120px !important;
          background: transparent !important;
          border: none !important;
          outline: none !important;
          resize: none !important;
          font-size: 0.92rem !important;
          line-height: 1.4 !important;
          color: #1d1d1f !important;
          font-family: var(--font-sans) !important;
          padding: 0 !important;
        }

        .chatgpt-text-area::placeholder {
          color: #86868b !important;
          opacity: 1 !important;
        }

        /* Hover animation for quick action pills */
        .quick-action-pill:hover {
          transform: translateY(-1.5px) scale(1.02);
          border-color: rgba(0, 85, 255, 0.25) !important;
          background-color: rgba(255, 255, 255, 0.9) !important;
          box-shadow: 0 6px 15px rgba(0, 85, 255, 0.04) !important;
        }


        /* Collapsed specific styles to overlay transparently and match card style */
        .chat-widget:not(.expanded) .chatgpt-input-box {
          background: rgba(255, 255, 255, 0.45) !important;
          border: 1px solid rgba(0, 0, 0, 0.06) !important;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        /* Collapsed: inner widget container is transparent to let outer wrap glass show through */
        .chat-widget:not(.expanded) {
          background: transparent !important;
          border: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          box-shadow: none !important;
        }

        /* Footer note only shows in expanded state */
        .chat-widget:not(.expanded) .apple-footer-note {
          display: none !important;
        }

        .apple-footer-note {
          font-family: var(--font-mono) !important;
          font-size: 0.6rem !important;
          color: rgba(29, 29, 31, 0.35) !important;
          text-align: center !important;
          margin-top: 8px !important;
          letter-spacing: 0.06em !important;
        }
      `}</style>



      {isExpanded && (
        <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 11 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 85, 255, 0.06)',
            border: '1px solid rgba(0, 85, 255, 0.12)',
            borderRadius: '12px',
            padding: '4px 12px',
            fontSize: '0.62rem',
            fontWeight: 700,
            color: '#0055ff',
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#0055ff' }} />
            AI ENGINEER
          </div>
        </div>
      )}

      {/* ── Messages — centered column, scrollable */}
      <div className="apple-chat-body" ref={containerRef}>
        <div style={{ maxWidth: '720px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {isExpanded && <div style={{ height: '48px', flexShrink: 0 }} />}
          {messages.map((m, idx) => {
            if (m.isWelcome) {
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', width: '100%', marginBottom: '4px', gap: '20px' }}>
                  {/* Large 3D Profile Mesh Avatar */}
                  <div style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.45)',
                    border: '3px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.03), inset 0 1px 2px rgba(255,255,255,0.6)',
                    flexShrink: 0
                  }}>
                    <svg width="48" height="48" viewBox="0 0 100 100" fill="none" style={{ transform: 'scaleX(-1) translateX(3px)' }}>
                      {/* Outline head mesh */}
                      <path 
                        d="M50,15 C35,15 25,25 22,40 C21,43 19,45 16,46 C12,47 11,48 11,50 C11,52 14,53 17,54 C19,54 21,56 22,58 C24,63 28,68 35,72 C40,75 48,78 60,78 C75,78 88,68 88,48 C88,28 72,15 50,15 Z" 
                        stroke="#0055ff" 
                        strokeWidth="1.2" 
                        strokeDasharray="2 3" 
                        fill="none" 
                        opacity="0.8"
                      />
                      {/* Nodes inside */}
                      <circle cx="50" cy="30" r="2" fill="#0055ff" opacity="0.9" />
                      <circle cx="38" cy="40" r="1.5" fill="#00ccff" opacity="0.9" />
                      <circle cx="48" cy="48" r="2.2" fill="#0055ff" opacity="0.9" />
                      <circle cx="62" cy="38" r="1.8" fill="#0055ff" opacity="0.8" />
                      <circle cx="68" cy="52" r="2" fill="#00ccff" opacity="0.9" />
                      <circle cx="58" cy="62" r="1.6" fill="#0055ff" opacity="0.8" />
                      <circle cx="42" cy="60" r="2" fill="#0055ff" opacity="0.9" />
                      <circle cx="30" cy="52" r="1.5" fill="#00ccff" opacity="0.7" />
                      <circle cx="76" cy="44" r="1.8" fill="#0055ff" opacity="0.8" />
                      
                      {/* Mesh connection lines */}
                      <line x1="50" y1="30" x2="38" y2="40" stroke="#0055ff" strokeWidth="0.5" opacity="0.4" />
                      <line x1="38" y1="40" x2="48" y2="48" stroke="#00ccff" strokeWidth="0.5" opacity="0.4" />
                      <line x1="48" y1="48" x2="62" y2="38" stroke="#0055ff" strokeWidth="0.5" opacity="0.4" />
                      <line x1="62" y1="38" x2="50" y2="30" stroke="#0055ff" strokeWidth="0.5" opacity="0.4" />
                      <line x1="62" y1="38" x2="68" y2="52" stroke="#0055ff" strokeWidth="0.5" opacity="0.4" />
                      <line x1="68" y1="52" x2="58" y2="62" stroke="#00ccff" strokeWidth="0.5" opacity="0.4" />
                      <line x1="58" y1="62" x2="42" y2="60" stroke="#0055ff" strokeWidth="0.5" opacity="0.4" />
                      <line x1="42" y1="60" x2="48" y2="48" stroke="#0055ff" strokeWidth="0.5" opacity="0.4" />
                      <line x1="42" y1="60" x2="30" y2="52" stroke="#00ccff" strokeWidth="0.5" opacity="0.4" />
                      <line x1="30" y1="52" x2="38" y2="40" stroke="#0055ff" strokeWidth="0.5" opacity="0.4" />
                      <line x1="68" y1="52" x2="76" y2="44" stroke="#0055ff" strokeWidth="0.5" opacity="0.4" />
                      <line x1="76" y1="44" x2="62" y2="38" stroke="#0055ff" strokeWidth="0.5" opacity="0.4" />
                    </svg>
                  </div>
                  {/* Clean White Rounded Bubble */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.28)',
                      backdropFilter: 'blur(20px) saturate(140%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(140%)',
                      border: '1px solid rgba(255, 255, 255, 0.45)',
                      borderRadius: '24px',
                      padding: '20px 24px',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}>
                      <div style={{ fontSize: '0.92rem', color: '#1d1d1f', fontWeight: 500, lineHeight: 1.6, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                        Hi, I'm <span style={{ color: '#0055ff', fontWeight: 700 }}>Abhishek Tiwari</span> AI Engineer.<br />
                        I build production-ready AI systems, RAG pipelines, multi-agent architectures, and FastAPI backend services.<br />
                        How can I help you today?
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div className="apple-message-container" style={{ justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div className={`apple-chat-bubble apple-chat-bubble--${m.sender}`}>
                    {m.sender === 'ai' ? (
                      <AIEngineeringResponse text={m.text} />
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
                {m.options && (
                  <div className="apple-options-row">
                    {m.options.map((opt, i) => (
                      <button key={i} type="button" className="apple-pill-btn" onClick={opt.action}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* ── Center Date Tag & Quick Action Pills (only if no user messages sent yet) ── */}
          {messages.length === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '8px', width: '100%' }}>
              {/* Center Today date tag */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.45)',
                border: '1px solid rgba(0, 0, 0, 0.04)',
                borderRadius: '12px',
                padding: '4px 14px',
                fontSize: '0.68rem',
                color: '#86868b',
                fontWeight: 600,
                fontFamily: 'sans-serif'
              }}>
                Today
              </div>

              {/* Quick Action Pills */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', width: '100%', padding: '0 12px' }}>
                <button
                  type="button"
                  onClick={() => handleSend("Tell me about your projects")}
                  className="quick-action-pill"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    borderRadius: '18px',
                    padding: '8px 16px',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    color: '#1d1d1f',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    transition: 'transform 0.2s, border-color 0.2s, background-color 0.2s'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  Tell me about your projects
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSend("Tech stack & tools")}
                  className="quick-action-pill"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    borderRadius: '18px',
                    padding: '8px 16px',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    color: '#1d1d1f',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    transition: 'transform 0.2s, border-color 0.2s, background-color 0.2s'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                  Tech stack & tools
                </button>

                <button
                  type="button"
                  onClick={() => handleSend("How do you build AI systems?")}
                  className="quick-action-pill"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    borderRadius: '18px',
                    padding: '8px 16px',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    color: '#1d1d1f',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    transition: 'transform 0.2s, border-color 0.2s, background-color 0.2s'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c0 5.523-4.477 10-10 10 5.523 0 10 4.477 10 10 0-5.523 4.477-10 10-10-5.523 0-10-4.477-10-10z"/></svg>
                  How do you build AI systems?
                </button>

                <button
                  type="button"
                  onClick={() => handleSend("Let's talk!")}
                  className="quick-action-pill"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    borderRadius: '18px',
                    padding: '8px 16px',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    color: '#1d1d1f',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    transition: 'transform 0.2s, border-color 0.2s, background-color 0.2s'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  Let's talk!
                </button>
              </div>
            </div>
          )}

          {isTyping && (
            <div className="apple-message-container">
              <div className="speeder-bubble-mini">
                <div className="loader-mini">
                  <span><span /><span /><span /><span /></span>
                  <div className="base-mini"><span /><div className="face-mini" /></div>
                </div>
                <div className="longfazers-mini"><span /><span /><span /></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Input footer — centered column, Gemini-style floating pill */}
      <div className="apple-chat-footer">
        <div style={isExpanded ? { maxWidth: '720px', width: '100%', margin: '0 auto' } : { width: '100%', height: '100%' }}>
          <form
            onSubmit={handleSubmit}
            className="chatgpt-input-box"
            onClick={!isExpanded ? onFocus : undefined}
            style={!isExpanded ? { cursor: 'pointer' } : undefined}
          >
            {isExpanded ? (
              <>
                {/* Top row: text area input */}
                <textarea
                  className="chatgpt-text-area"
                  placeholder="Message Abhishek AI Engineer..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onFocus={onFocus}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (input.trim() !== '' && !isExploreActivated) handleSend(input);
                    }
                  }}
                  disabled={isExploreActivated || !isExpanded}
                />

                {/* Bottom row: Actions & Send */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  {/* Left action: Attachment wrapped in white circle */}
                  <button
                    type="button"
                    className="chatgpt-attachment-btn"
                    title="Add attachment"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      border: '1px solid rgba(0,0,0,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                      color: '#86868b',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  </button>

                  {/* Right actions: Mic & Send */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Microphone Icon Button */}
                    <button
                      type="button"
                      className="chatgpt-mic-btn"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#86868b',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                        marginRight: '8px',
                        flexShrink: 0
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                    </button>

                    {/* Send Button */}
                    <button
                      type="submit"
                      className="chatgpt-send-btn"
                      title="Send message"
                      disabled={!input.trim() || isExploreActivated}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#0055ff',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0, 85, 255, 0.25)',
                        color: '#ffffff',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Attachment Button */}
                <button type="button" className="chatgpt-attachment-btn" title="Add attachment">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </button>

                {/* Collapsed Search Button */}
                <button type="button" className="chatgpt-btn-blue-pill" title="Search web" style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '28px', padding: '0 12px', borderRadius: '14px', background: '#0055ff', color: '#ffffff', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', marginRight: '4px', flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  Search
                </button>

                {/* Input Textarea */}
                <textarea
                  className="chatgpt-text-area"
                  placeholder="Message Liquid Glass..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onFocus={onFocus}
                  disabled={true}
                  style={{ pointerEvents: 'none' }}
                />

                {/* Send Button */}
                <button type="button" className="chatgpt-send-btn" title="Send message" disabled={true}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
