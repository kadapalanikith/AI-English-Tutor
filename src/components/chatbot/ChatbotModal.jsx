import { useState, useLayoutEffect, useRef } from 'react';
import { CloseIcon, SendIcon } from '../ui/Icons';

/**
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   chatHistory: import('../../types').ChatMessage[];
 *   onSendMessage: (msg: string) => void;
 *   isBotTyping: boolean;
 * }} props
 */
const ChatbotModal = ({ isOpen, onClose, chatHistory, onSendMessage, isBotTyping }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useLayoutEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isBotTyping, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isBotTyping) return;
    onSendMessage(trimmed);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex justify-center items-end sm:items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="LiftBot chat"
    >
      {/* Panel */}
      <div
        className="bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl sm:rounded-3xl w-full max-w-lg h-[80vh] sm:h-[75vh] flex flex-col shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="p-4 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm">
              🤖
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-none">LiftBot Assistant</h2>
              <p className="text-xs text-brand-600 font-medium">AI English Tutor</p>
            </div>
          </div>
          <button
            className="text-slate-400 hover:text-slate-600 transition-colors rounded-lg p-1"
            onClick={onClose}
            aria-label="Close chat"
          >
            <CloseIcon />
          </button>
        </header>

        {/* Messages */}
        <main className="flex-grow overflow-y-auto p-4 flex flex-col gap-3">
          {chatHistory.length === 0 && (
            <div className="text-center text-slate-400 text-sm mt-8">
              <div className="text-4xl mb-3">👋</div>
              <p>
                Hi! I&apos;m LiftBot. Ask me anything about English grammar, vocabulary, or how to
                use this app!
              </p>
            </div>
          )}
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[80%] p-3 rounded-2xl leading-normal text-sm ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white self-end rounded-br-md'
                  : 'bg-white border border-slate-200 text-slate-800 self-start rounded-bl-md shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {isBotTyping && (
            <div className="bg-white border border-slate-200 self-start rounded-bl-md p-3 rounded-2xl shadow-sm flex gap-1 items-center">
              <span
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Input */}
        <footer className="p-4 border-t border-slate-200">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              id="chatbot-input"
              type="text"
              className="flex-grow px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800
                         placeholder:text-slate-400 focus:ring-2 focus:ring-brand-300 focus:border-brand-400 outline-none
                         transition-shadow text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask an English question…"
              autoComplete="off"
              aria-label="Chat message"
            />
            <button
              type="submit"
              className="btn-primary rounded-xl px-4"
              disabled={isBotTyping || !input.trim()}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default ChatbotModal;
