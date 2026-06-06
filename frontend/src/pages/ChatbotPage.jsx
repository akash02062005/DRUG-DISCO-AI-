import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';

const SUGGESTIONS = [
  'What is ADMET in drug discovery?',
  'Explain Lipinski Rule of Five',
  'What does a high QED score mean?',
  'How does ChemBERTa work?',
  'What is hERG inhibition and why does it matter?',
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content:
        "Hi! I'm MedChat — your biomedical AI assistant powered by Microsoft BioGPT, "
        + 'pretrained on 15M PubMed abstracts. Ask me about drugs, targets, ADMET, '
        + 'or paste a SMILES to discuss it.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    const next = [...messages, { role: 'user', content: msg }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const history = next.slice(0, -1).map(m => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content,
      }));
      const r = await api.chat(msg, history);
      setMessages([...next, { role: 'bot', content: r.reply }]);
    } catch (e) {
      setMessages([...next, { role: 'bot',
        content: '⚠ ' + (e?.response?.data?.detail || e.message) }]);
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>💬 BioGPT Chatbot</h1>
          <p>Powered by <strong>microsoft/BioGPT</strong> · pretrained on 15M PubMed abstracts.</p>
        </div>
        <span className="badge purple">HuggingFace</span>
      </div>

      <div className="panel">
        <div className="chat-window">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
              <div className="avatar">{m.role === 'user' ? '👤' : '🤖'}</div>
              <div className="bubble">{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-msg bot">
              <div className="avatar">🤖</div>
              <div className="bubble"><span className="loader" /> thinking…</div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="chat-input">
          <input
            placeholder="Ask MedChat anything biomedical…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
          />
          <button className="primary" disabled={loading} onClick={() => send()}>Send</button>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SUGGESTIONS.map((s, i) => (
            <span key={i} className="badge info"
              style={{ cursor: 'pointer', padding: '6px 12px' }}
              onClick={() => send(s)}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
