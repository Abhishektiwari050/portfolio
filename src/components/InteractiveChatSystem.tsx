import React, { useState, useEffect, useRef } from 'react';
import { profile } from '../data/resume';

interface ChatProps {
  onExplore: () => void;
  isExploreActivated: boolean;
  onExitChat: () => void;
  onFocus: () => void;
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  options?: { label: string; action: () => void }[];
}

function getClientFallbackReply(message: string) {
  const lower = message.toLowerCase();

  const isOffTopic = !lower.includes('skill') && !lower.includes('stack') && !lower.includes('tech') &&
                     !lower.includes('project') && !lower.includes('work') && !lower.includes('ship') &&
                     !lower.includes('contact') && !lower.includes('email') && !lower.includes('phone') &&
                     !lower.includes('connect') && !lower.includes('hey') && !lower.includes('hi') && 
                     !lower.includes('hello') && !lower.includes('about') && !lower.includes('experience');

  if (isOffTopic) {
    return "[METADATA: CONFIDENCE=100% | AREA=GUARDRAILS]\n[STATUS: SECURITY_REFUSED]\n---\nI only answer questions about Abhishek's professional background, skills, and shipped projects. How can I help you explore his work?";
  }

  if (lower.includes('skill') || lower.includes('stack') || lower.includes('tech')) {
    return "[METADATA: CONFIDENCE=92% | AREA=SKILLS]\n[STATUS: RETRIEVAL_SUCCESS]\n---\nHere is the technical stack:\n- AI Systems: LLM Orchestration, Prompt Design, Vector Embeddings\n- Frameworks: LangGraph, LlamaIndex, CrewAI\n- Architecture: FastAPI, Python, PostgreSQL, RabbitMQ, Docker, Redis";
  }
  if (lower.includes('project') || lower.includes('work') || lower.includes('ship')) {
    return "[METADATA: CONFIDENCE=95% | AREA=PROJECTS]\n[STATUS: RETRIEVAL_SUCCESS]\n---\nAbhishek has built and shipped:\n- B2B Lead Gen scoring platform: Multi-agent lead qualification and scoring\n- VayuWays aviation compliance tool: Hybrid search compliance checker\n- WhatsApp RAG agents: Specialized customer support agents";
  }
  if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('connect')) {
    return `[METADATA: CONFIDENCE=100% | AREA=CONTACT]\n[STATUS: RETRIEVAL_SUCCESS]\n---\nConnection details compiled:\n- Email: ${profile.email}\n- Phone: ${profile.phone}\n- GitHub: github.com/abhishektiwari050\n- LinkedIn: linkedin.com/in/abhishek-tiwari-84841b258`;
  }
  return `[METADATA: CONFIDENCE=90% | AREA=GENERAL]\n[STATUS: RETRIEVAL_SUCCESS]\n---\nHi! I am Abhishek's AI assistant co-pilot. I can answer questions about my skills, shipped projects, work history, and contact details. How can I help you today?`;
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
    <div className="ai-system-response">
      <div className="response-telemetry">
        <span className="telemetry-item"><span className="telemetry-dot" /> {status}</span>
        <span className="telemetry-item">CONFIDENCE: {confidence}</span>
        <span className="telemetry-item">CLASS: {area}</span>
      </div>

      <div className="response-content-panel">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={i} style={{ height: '8px' }} />;

          if (trimmed.startsWith('###') || (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length < 50)) {
            const headerText = trimmed.replace(/[#\*]+/g, '').trim();
            return (
              <h4 key={i} className="response-header">
                ▶ {headerText}
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
                <div key={i} className="response-row">
                  <span className="response-row__key">{key}:</span>
                  <span className="response-row__val">{val}</span>
                </div>
              );
            }

            return (
              <div key={i} className="response-bullet">
                <span className="response-bullet__icon">↳</span>
                <span className="response-bullet__text">{content}</span>
              </div>
            );
          }

          return (
            <p key={i} className="response-para">
              {trimmed}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export function InteractiveChatSystem({ onExplore, isExploreActivated, onExitChat, onFocus }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      { 
        sender: 'ai', 
        text: `[METADATA: CONFIDENCE=100% | AREA=WELCOME]\n[STATUS: ACTIVE]\n---\nAI Agent Copilot online. Ready to retrieve candidate profile details.\nAsk me anything about Abhishek's skills, shipped projects, work history, or click below to start:`,
        options: [
          { label: 'Explore Career Story 🚀', action: () => onExplore() }
        ]
      }
    ]);
  }, [onExplore]);

  const handleSend = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: cleanText }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    const lower = cleanText.toLowerCase();

    if (lower === 'hey' || lower === 'hi' || lower === 'hello') {
      setTimeout(() => {
        setIsTyping(false);
        const reply = `Hey, this is a chatbot system. This is Abhishek Tiwari. You can explore my capabilities through the pages, or you can ask questions directly to me.`;
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'ai', 
            text: reply,
            options: [
              { label: 'Explore Work & Career Story 🚀', action: () => onExplore() }
            ]
          }
        ]);
      }, 800);
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

      const systemPrompt = `You are the AI assistant co-pilot for Abhishek Tiwari's interactive portfolio website.
Your name is AI assistant.
Your job is to answer questions about Abhishek Tiwari's professional background, skills, projects, and contact info.

CRITICAL FORMAT REQUIREMENT:
You MUST start your response with a telemetry metadata block in this exact format:
[METADATA: CONFIDENCE=<percentage>% | AREA=<SKILLS/EXPERIENCE/PROJECTS/CONTACT/GENERAL>]
[STATUS: <SYSTEM_READY/RETRIEVAL_SUCCESS/SECURITY_REFUSED>]
---

Aesthetics/Style:
- Be concise. Keep responses under 3 paragraphs.
- Use clear bullet points (- Key: Value) when explaining multiple items, as the UI will parse this into structured telemetry data cards.
- Maintain a premium, world-class developer tone.

Professional Guardrails:
- You ONLY answer questions related to Abhishek's profile, career, skills, and projects.
- If a user asks an off-topic question, you must set STATUS to SECURITY_REFUSED and decline politely.

Here is the information about Abhishek Tiwari:
Name: Abhishek Tiwari
Title: AI Systems Engineer & LLM Architect
Location: Delhi, India
Email: abhishektiwari53910@gmail.com
Phone: +919717140880
GitHub: github.com/abhishektiwari53
LinkedIn: linkedin.com/in/abhishek-tiwari-84841b258

Key Skills:
- AI Systems & LLM Architectures (RAG pipelines, Vector Databases, Prompt Engineering)
- Agent Frameworks (LangGraph, LlamaIndex, CrewAI, Autogen)
- Scalable Backends (FastAPI, Python, PostgreSQL, RabbitMQ, Redis, Docker)
- Speech & Voice Systems (Text-to-Speech, Speech-to-Text, Voice Agent development)
- Workflow Automations (Custom orchestration pipelines, web scraping, data collection)

Shipped Projects:
1. Agentic B2B Lead Gen scoring platform: Multi-agent lead gen system with customized scoring algorithms, built using FastAPI, PostgreSQL, RabbitMQ, and React.
2. VayuWays aviation compliance tool: Aviation document parser and compliance verifier, utilizing RAG with hybrid search and PDF parsers.
3. WhatsApp RAG agents: Specialized chat assistant with multi-lingual support, built using Meta Cloud API and LangChain.
4. Game engine research: Published research paper on procedural runner chase mechanics.

Work Experience:
- AI Engineer at Vistar (Delhi, India): Led development of multi-agent RAG pipelines, voice assistants, and custom backends, improving client performance metrics.

Answer the user's latest query accurately using the above context.`;

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
    <div className="chat-widget">
      <div className="chat-header">
        <div className="chat-dots">
          <span className="chat-dot chat-dot--red" onClick={onExitChat} style={{ cursor: 'pointer' }} title="Exit Chat" />
          <span className="chat-dot chat-dot--yellow" />
          <span className="chat-dot chat-dot--green" />
        </div>
        <div className="chat-title">
          <span className="chat-status-dot" />
          assistant - {profile.name.toLowerCase().replace(' ', '')}@ai-node
        </div>
        <button 
          type="button" 
          className="chat-header-back-btn" 
          onClick={onExitChat}
        >
          BACK TO START ↩
        </button>
      </div>
      
      <div className="chat-body" ref={containerRef}>
        <div className="chat-body-inner">
          {messages.map((m, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <div className="chat-bubble-container" style={{ display: 'flex', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start', width: '100%' }}>
                {m.sender === 'ai' && (
                  <div className="chat-avatar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8.01" y2="16"></line><line x1="16" y1="16" x2="16.01" y2="16"></line></svg>
                  </div>
                )}
                <div className={`chat-bubble chat-bubble--${m.sender}`}>
                  {m.sender === 'ai' ? (
                    <AIEngineeringResponse text={m.text} />
                  ) : (
                    <span>
                      <span style={{ color: '#00e5ff', marginRight: '4px' }}>guest@portfolio:~$</span>
                      {m.text}
                    </span>
                  )}
                </div>
                {m.sender === 'user' && (
                  <div className="chat-avatar chat-avatar--user" style={{ marginLeft: 8 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                )}
              </div>
              {m.options && (
                <div className="chat-options-row">
                  {m.options.map((opt, i) => (
                    <button 
                      key={i} 
                      type="button"
                      className={`chat-btn ${i === 1 ? 'chat-btn--secondary' : ''}`}
                      onClick={opt.action}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble-container" style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
              <div className="chat-avatar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8.01" y2="16"></line><line x1="16" y1="16" x2="16.01" y2="16"></line></svg>
              </div>
              <div className="chat-bubble chat-bubble--ai typing-indicator">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="chat-input-row">
        <div className="chat-input-row-inner">
          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Message Abhishek..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={onFocus}
              disabled={isExploreActivated}
            />
            <button 
              type="submit" 
              className="chat-send-btn" 
              disabled={isExploreActivated || input.trim() === ''}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </button>
          </div>
          <div className="chat-footer-note">
            Abhishek Tiwari may make mistakes. Verify important info.
          </div>
        </div>
      </form>
    </div>
  );
}
