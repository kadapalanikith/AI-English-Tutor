import React, { useState, useLayoutEffect, useRef } from 'react';
import { ChatMessage } from '../../types';
import { CloseIcon } from '../common/Icons';

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isBotTyping: boolean;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose, chatHistory, onSendMessage, isBotTyping }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory, isBotTyping, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end p-4" onClick={onClose}>
            <div className="bg-slate-50 rounded-2xl w-full max-w-lg h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800 m-0">LiftBot Assistant</h3>
                     <button className="text-slate-500 hover:text-teal-600" onClick={onClose} aria-label="Close chat">
                       <CloseIcon />
                    </button>
                </header>
                <main className="flex-grow overflow-y-auto p-4 flex flex-col gap-3">
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`max-w-[80%] p-3 rounded-2xl leading-normal ${msg.role === 'user' ? 'bg-teal-600 text-white self-end rounded-br-md' : 'bg-slate-200 text-slate-800 self-start rounded-bl-md'}`}>
                            {msg.text}
                        </div>
                    ))}
                    {isBotTyping && <div className="bg-slate-200 text-slate-800 self-start rounded-bl-md p-3 rounded-2xl">Typing...</div>}
                    <div ref={messagesEndRef} />
                </main>
                <footer className="p-4 border-t border-slate-200">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            className="flex-grow px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-teal-300 focus:border-teal-400 outline-none"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask an English question..."
                        />
                        <button type="submit" className="px-5 py-2.5 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition disabled:bg-slate-400" disabled={isBotTyping}>Send</button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default ChatbotModal;