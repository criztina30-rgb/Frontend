import { useState, useRef, useEffect, useCallback } from 'react';
import { sendChatMessage } from '../api/chat';

/* ── Helpers ──────────────────────────────────────────────── */
function TypingDots() {
  return (
    <span className="chat__typing-dots" aria-label="Escribiendo…">
      <span /><span /><span />
    </span>
  );
}

function Message({ msg }) {
  const isBot = msg.role === 'assistant';
  return (
    <div className={`chat__msg chat__msg--${isBot ? 'bot' : 'user'}`}>
      {isBot && (
        <div className="chat__avatar" aria-hidden="true">🏍️</div>
      )}
      <div className="chat__bubble">
        {msg.content.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < msg.content.split('\n').length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────── */
export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, loading, open]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', content: trimmed };
    setHistory((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const { data } = await sendChatMessage(trimmed, history);
      const botMsg = { role: 'assistant', content: data.reply };
      setHistory((prev) => [...prev, botMsg]);
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo conectar con MotoBot. Intenta de nuevo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [input, history, loading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setHistory([]);
    setError(null);
    inputRef.current?.focus();
  };

  const suggestions = [
    '¿Qué motos están disponibles?',
    '¿Cuál es la más económica?',
    'Recomiéndame una para ciudad',
  ];

  return (
    <>
      {/* ── FAB trigger ─────────────────────────────────── */}
      <button
        id="chatbot-fab"
        className={`chatbot__fab ${open ? 'chatbot__fab--open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Cerrar MotoBot' : 'Abrir MotoBot'}
        aria-expanded={open}
      >
        <span className="chatbot__fab-icon">{open ? '✕' : '🏍️'}</span>
        {!open && <span className="chatbot__fab-badge" aria-hidden="true">IA</span>}
      </button>

      {/* ── Chat panel ──────────────────────────────────── */}
      <div
        id="chatbot-panel"
        className={`chatbot__panel ${open ? 'chatbot__panel--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="MotoBot - Asistente de motos"
      >
        {/* Header */}
        <div className="chatbot__header">
          <div className="chatbot__header-info">
            <div className="chatbot__header-avatar">🏍️</div>
            <div>
              <p className="chatbot__header-name">MotoBot</p>
              <p className="chatbot__header-status">
                <span className="chatbot__status-dot" />
                Experto en motocicletas
              </p>
            </div>
          </div>
          <div className="chatbot__header-actions">
            {history.length > 0 && (
              <button
                className="chatbot__icon-btn"
                onClick={handleClear}
                title="Limpiar conversación"
                aria-label="Limpiar conversación"
              >
                🗑️
              </button>
            )}
            <button
              className="chatbot__icon-btn"
              onClick={() => setOpen(false)}
              title="Cerrar"
              aria-label="Cerrar chat"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chatbot__messages" role="log" aria-live="polite">
          {/* Welcome message */}
          {history.length === 0 && !loading && (
            <div className="chatbot__welcome">
              <div className="chatbot__welcome-icon">🏍️</div>
              <h3 className="chatbot__welcome-title">¡Hola! Soy MotoBot</h3>
              <p className="chatbot__welcome-sub">
                Tu asistente inteligente para encontrar la moto perfecta en ProyMotos.
              </p>
              <div className="chatbot__suggestions">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className="chatbot__suggestion"
                    onClick={() => {
                      setInput(s);
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {history.map((msg, i) => (
            <Message key={i} msg={msg} />
          ))}

          {loading && (
            <div className="chat__msg chat__msg--bot">
              <div className="chat__avatar">🏍️</div>
              <div className="chat__bubble chat__bubble--loading">
                <TypingDots />
              </div>
            </div>
          )}

          {error && (
            <div className="chatbot__error" role="alert">
              ⚠️ {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="chatbot__input-area">
          <textarea
            id="chatbot-input"
            ref={inputRef}
            className="chatbot__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pregúntame sobre motos…"
            rows={1}
            disabled={loading}
            aria-label="Mensaje para MotoBot"
          />
          <button
            id="chatbot-send"
            className={`chatbot__send ${loading || !input.trim() ? 'chatbot__send--disabled' : ''}`}
            onClick={handleSend}
            disabled={loading || !input.trim()}
            aria-label="Enviar mensaje"
          >
            {loading ? (
              <span className="chatbot__send-spinner" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
