import { ChatbotIcon } from '../ui/Icons';

/**
 * Floating action button that opens the chatbot.
 * @param {{ onClick: () => void }} props
 */
const ChatbotFab = ({ onClick }) => (
  <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-40">
    <button
      className="w-14 h-14 md:w-16 md:h-16 bg-brand-600 text-white rounded-full flex items-center justify-center
                 shadow-xl shadow-brand-600/40 hover:bg-brand-700 hover:-translate-y-1 hover:shadow-2xl
                 active:scale-95 transition-all duration-300"
      onClick={onClick}
      aria-label="Open AI chatbot"
      id="chatbot-fab"
    >
      <ChatbotIcon />
    </button>
  </div>
);

export default ChatbotFab;
