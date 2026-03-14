import { ChatbotIcon } from '../ui/Icons';

/**
 * Floating action button that opens the chatbot.
 * @param {{ onClick: () => void }} props
 */
const ChatbotFab = ({ onClick }) => (
  <div className="fixed bottom-20 md:bottom-6 right-6 z-40">
    <button
      className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center
                 shadow-lg shadow-brand-600/30 hover:bg-brand-700 hover:scale-110
                 active:scale-95 transition-all duration-200"
      onClick={onClick}
      aria-label="Open AI chatbot"
      id="chatbot-fab"
    >
      <ChatbotIcon />
    </button>
  </div>
);

export default ChatbotFab;
