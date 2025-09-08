import React from 'react';
import { Section } from '../../types';

interface HomeScreenProps {
  setSection: (section: Section) => void;
}

const HomeButton: React.FC<{ icon: string; title: string; description: string; onClick: () => void }> = ({ icon, title, description, onClick }) => (
  <button
    className="bg-white border border-slate-200 text-slate-800 text-2xl p-6 text-left flex items-center gap-5 rounded-2xl transition-all duration-200 ease-in-out hover:border-teal-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 w-full"
    onClick={onClick}
  >
    <span className="text-4xl leading-none">{icon}</span>
    <div>
      {title}
      <div className="text-base font-normal text-slate-500">{description}</div>
    </div>
  </button>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ setSection }) => {
  return (
    <div className="flex flex-col gap-5 max-w-xl mx-auto mt-16 mb-5">
      <HomeButton icon="📖" title="Learn" description="Read AI-generated stories and learn new words." onClick={() => setSection('learn')} />
      <HomeButton icon="⌨️" title="Type" description="Practice your typing speed with stories." onClick={() => setSection('type')} />
      <HomeButton icon="🔊" title="Pronounce" description="Practice reading stories aloud." onClick={() => setSection('pronounce')} />
      <HomeButton icon="❓" title="Help" description="How to use this app." onClick={() => setSection('help')} />
    </div>
  );
};

export default HomeScreen;