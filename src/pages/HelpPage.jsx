import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';

const sections = [
  {
    icon: '📖',
    title: 'Learn Stories',
    content:
      'Read engaging stories generated just for you. Tap the "New Story" button for fresh content. Long-press any word to see its translation in your native language. Use the "Listen" button to hear the story narrated.',
  },
  {
    icon: '⌨️',
    title: 'Practice Typing',
    content:
      "Hone your keyboard skills by typing out the stories. You'll get real-time feedback on your speed (WPM) and accuracy. After each session, receive a personalised exercise if you struggled with certain words.",
  },
  {
    icon: '🔊',
    title: 'Practice Pronunciation',
    content:
      'Use "Hear it First" to hear any word or sentence spoken. Then click the microphone and read the story aloud — our AI scores your pronunciation and highlights words you can improve on.',
  },
  {
    icon: '🤖',
    title: 'Meet LiftBot',
    content:
      'Have a question? Click the chat icon in the bottom-right corner. LiftBot is your friendly AI assistant, ready to help with grammar, vocabulary, or how to use the app.',
  },
  {
    icon: '👤',
    title: 'Track Your Progress',
    content:
      'Click the profile icon in the top-right. Set your name, change your English level, see your daily streak, view goal progress, and track WPM & accuracy trends over time.',
  },
];

const HelpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto mt-6 mb-6 animate-fade-in">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          id="help-back-btn"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 font-semibold transition-colors py-2 px-3 -ml-3 rounded-xl hover:bg-slate-100"
        >
          ← Back to Home
        </button>
      </div>

      <Card>
        <h1 className="text-xl font-bold text-slate-800 mb-2">How to Use Your AI English Tutor</h1>
        <p className="text-slate-500 mb-6">
          Your personal guide to mastering English. Here&apos;s a quick tour of the features:
        </p>

        <div className="space-y-6">
          {sections.map((s) => (
            <div key={s.title} className="flex gap-4">
              <div className="text-3xl flex-shrink-0 leading-none mt-1">{s.icon}</div>
              <div>
                <h2 className="text-base font-bold text-slate-700 mb-1">{s.title}</h2>
                <p className="text-slate-500 text-sm leading-relaxed">{s.content}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default HelpPage;
