import React, { useState, useEffect, useRef } from 'react';
import { profile } from '../data/resume';

interface ChatProps {
  onExplore: () => void;
  isExploreActivated: boolean;
  onExitChat: () => void;
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

export function InteractiveChatSystem({ onExplore, isExploreActivated, onExitChat, onFocus, isExpanded }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getBootSequence = (): ChatMessage => {
    return { 
      sender: 'ai', 
      text: "Hey, I'm Abhishek. How can I help you today?",
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
          padding: 24px !important;
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
          background: linear-gradient(135deg, rgba(0, 85, 255, 0.12) 0%, rgba(0, 85, 255, 0.03) 100%) !important;
          backdrop-filter: blur(10px) saturate(160%) !important;
          -webkit-backdrop-filter: blur(10px) saturate(160%) !important;
          border: 1px solid rgba(0, 85, 255, 0.3) !important;
          border-right-color: rgba(0, 85, 255, 0.15) !important;
          border-bottom-color: rgba(0, 85, 255, 0.15) !important;
          border-radius: 20px 20px 4px 20px !important;
          padding: 12px 18px !important;
          color: #0055ff !important;
          font-family: var(--font-sans) !important;
          font-size: 0.9rem !important;
          font-weight: 600 !important;
          box-shadow: 
            inset 0 1px 1px rgba(255, 255, 255, 0.4),
            0 4px 15px rgba(0, 85, 255, 0.03) !important;
          margin-left: auto !important;
          max-width: 75% !important;
          text-align: left !important;
        }

        /* AI Message bubble: High-shine liquid glass pane */
        .apple-chat-bubble--ai {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.15) 100%) !important;
          backdrop-filter: blur(14px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(14px) saturate(180%) !important;
          border: 1px solid rgba(255, 255, 255, 0.6) !important;
          border-right-color: rgba(255, 255, 255, 0.3) !important;
          border-bottom-color: rgba(255, 255, 255, 0.3) !important;
          border-radius: 20px 20px 20px 4px !important;
          padding: 18px 22px !important;
          color: #1d1d1f !important;
          font-family: var(--font-sans) !important;
          box-shadow: 
            inset 0 1.5px 1.5px rgba(255, 255, 255, 0.9), /* Edge light */
            inset 0 -1px 3px rgba(0, 0, 0, 0.04),
            0 8px 30px rgba(0, 0, 0, 0.02) !important;
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
          padding: 16px 24px 24px 24px !important;
          background: transparent !important;
          border-top: none !important;
          flex-shrink: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        /* Collapsed: footer sits at the bottom of the card with compact padding */
        .chat-widget:not(.expanded) .apple-chat-footer {
          padding: 12px 20px 20px 20px !important;
          background: transparent !important;
          border-top: none !important;
          flex-shrink: 0 !important;
        }

        /* Unified horizontal single-row input box */
        .chatgpt-input-box {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 8px 12px !important;
          border-radius: 20px !important;
          background: rgba(255, 255, 255, 0.65) !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(0, 0, 0, 0.08) !important;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03), 0 4px 12px rgba(0, 0, 0, 0.02) !important;
          min-height: 48px !important;
          height: auto !important;
          width: 100% !important;
          box-sizing: border-box !important;
          max-width: 100% !important;
        }

        .chatgpt-input-box:focus-within {
          background: rgba(255, 255, 255, 0.85) !important;
          border-color: rgba(0, 85, 255, 0.25) !important;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03), 0 4px 15px rgba(0, 85, 255, 0.05) !important;
        }

        /* Expanded input: Gemini-style floating pill */
        .chat-widget.expanded .chatgpt-input-box {
          max-width: 760px !important;
          width: 100% !important;
          border-radius: 24px !important;
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
          padding: 2px 0 !important;
          box-sizing: border-box !important;
        }

        .chatgpt-text-area::placeholder {
          color: #86868b !important;
          opacity: 0.85 !important;
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

      {/* ── Header bar — only visible when expanded */}
      {isExpanded && (
        <div className="apple-chat-header">
          <div className="apple-window-dots">
            <span className="apple-window-dot apple-window-dot--red" onClick={onExitChat} title="Exit" />
            <span className="apple-window-dot apple-window-dot--grey1" />
            <span className="apple-window-dot apple-window-dot--grey2" />
          </div>
          <div className="apple-chat-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.12em', color: '#1d1d1f', fontWeight: 700, textTransform: 'uppercase' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00cc66', boxShadow: '0 0 6px #00cc66' }} />
            Liquid Glass
          </div>
          <button
            type="button"
            className="apple-header-exit-btn"
            onClick={onExitChat}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#86868b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 700 }}
          >
            Exit
          </button>
        </div>
      )}

      {/* ── Messages — centered column, scrollable */}
      <div className="apple-chat-body" ref={containerRef}>
        <div style={{ maxWidth: '720px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map((m, idx) => {
            if (m.isWelcome) {
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', width: '100%', marginBottom: '4px' }}>
                  {/* Sparkle Icon Circle Avatar */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    marginRight: '12px',
                    flexShrink: 0
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#0055ff">
                      <path d="M12 2c0 5.523-4.477 10-10 10 5.523 0 10 4.477 10 10 0-5.523 4.477-10 10-10-5.523 0-10-4.477-10-10z"/>
                    </svg>
                  </div>
                  {/* Frosted Glass Speech Bubble */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.55)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.75)',
                      borderRadius: '20px',
                      padding: '10px 16px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
                      maxWidth: '85%'
                    }}>
                      <div style={{ fontSize: '0.85rem', color: '#1d1d1f', fontWeight: 500, lineHeight: 1.45, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                        Hey, I'm <strong style={{ color: '#0055ff', fontWeight: 700 }}>Abhishek</strong>.<br />
                        How can I help you today?
                      </div>
                      <div style={{ fontSize: '0.58rem', color: '#86868b', fontWeight: 500, marginTop: '4px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                        {m.time}
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
            {/* Attachment Button */}
            <button type="button" className="chatgpt-attachment-btn" title="Add attachment">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>

            {/* Input Textarea */}
            <textarea
              className="chatgpt-text-area"
              placeholder="Ask me anything..."
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
              style={!isExpanded ? { pointerEvents: 'none' } : undefined}
            />

            {/* Send Button */}
            <button type="submit" className="chatgpt-send-btn" title="Send message" disabled={!input.trim() || isExploreActivated}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
          <div className="apple-footer-note">
            Liquid Glass • Secured Local Assistant Session
          </div>
        </div>
      </div>
    </div>
  );
}
