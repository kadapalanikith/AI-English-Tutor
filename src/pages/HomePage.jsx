import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: '📖',
    title: 'Learn',
    description: 'Read AI-generated stories and learn new words.',
    path: '/learn',
    color: 'from-teal-500 to-teal-600',
    id: 'home-learn-btn',
  },
  {
    icon: '⌨️',
    title: 'Type',
    description: 'Practice your typing speed with stories.',
    path: '/type',
    color: 'from-blue-500 to-blue-600',
    id: 'home-type-btn',
  },
  {
    icon: '🔊',
    title: 'Pronounce',
    description: 'Practice reading stories aloud and get AI feedback.',
    path: '/pronounce',
    color: 'from-purple-500 to-purple-600',
    id: 'home-pronounce-btn',
  },
  {
    icon: '❓',
    title: 'Help',
    description: 'Learn how to use all the features of this app.',
    path: '/help',
    color: 'from-orange-500 to-orange-600',
    id: 'home-help-btn',
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto mt-10">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-1">What do you want to practise?</h1>
        <p className="text-slate-500">Choose a mode to get started with AI-powered learning.</p>
      </div>

      {features.map((f) => (
        <button
          key={f.path}
          id={f.id}
          onClick={() => navigate(f.path)}
          className="group bg-white border border-slate-200 p-5 text-left flex items-center gap-5 rounded-2xl
                     transition-all duration-300 hover:border-brand-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 w-full"
        >
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-3xl flex-shrink-0 shadow-md`}>
            {f.icon}
          </div>
          <div>
            <div className="text-lg font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{f.title}</div>
            <div className="text-sm font-normal text-slate-500 mt-0.5">{f.description}</div>
          </div>
          <div className="ml-auto text-slate-300 group-hover:text-brand-400 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      ))}
    </div>
  );
};

export default HomePage;
