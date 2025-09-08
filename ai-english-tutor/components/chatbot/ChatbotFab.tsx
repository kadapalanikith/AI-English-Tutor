import React from 'react';
import { ChatbotIcon } from '../common/Icons';

interface ChatbotFabProps {
  onClick: () => void;
}

const ChatbotFab: React.FC<ChatbotFabProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-40">
      <button 
        className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-teal-700 transition-transform transform hover:scale-105" 
        onClick={onClick} 
        aria-label="Open chatbot"
      >
        <ChatbotIcon />
      </button>
    </div>
  );
};

export default ChatbotFab;
