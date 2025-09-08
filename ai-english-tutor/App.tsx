
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Story, Dictionary, Language, Section, PracticeRecord, ChatMessage } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { useGoals } from './hooks/useGoals';
import { useProgress } from './hooks/useProgress';
import { initialStory, initialDictionary } from './data/initialData';
import * as geminiService from './services/geminiService';

// Components
import HomeScreen from './components/home/HomeScreen';
import HelpScreen from './components/home/HelpScreen';
import LearnSection from './components/learn/LearnSection';
import TypingPractice from './components/type/TypingPractice';
import PronouncePractice from './components/pronounce/PronouncePractice';
import ProfileModal from './components/profile/ProfileModal';
import OnboardingModal from './components/onboarding/OnboardingModal';
import ChatbotFab from './components/chatbot/ChatbotFab';
import ChatbotModal from './components/chatbot/ChatbotModal';
import Notification from './components/common/Notification';
import PersonalizedExercise from './components/common/PersonalizedExercise';
import { HomeIcon, LearnIcon, TypeIcon, PronounceIcon, ProfileIcon } from './components/common/Icons';

function App() {
  const [stories, setStories] = useLocalStorage<Story[]>('eec_stories', [initialStory]);
  const [dictionary, setDictionary] = useLocalStorage<Dictionary>('eec_dictionary', initialDictionary);
  const [lang, setLang] = useLocalStorage<Language>('eec_lang', 'hi');
  const [onboardingComplete, setOnboardingComplete] = useLocalStorage('eec_onboarding_complete', false);
  const [userName, setUserName] = useLocalStorage('eec_user_name', '');
  const [englishLevel, setEnglishLevel] = useLocalStorage('eec_english_level', 'beginner');
  const [personalizedExercise, setPersonalizedExercise] = useState<string | null>(null);

  const [section, setSection] = useState<Section>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [chatHistory, setChatHistory] = useLocalStorage<ChatMessage[]>('eec_chat_history', []);
  
  const goalsManager = useGoals();
  const { records, addRecord, streak } = useProgress(goalsManager);

  const currentStory = useMemo(() => stories[0] || initialStory, [stories]);

  const fetchNewStory = useCallback(async () => {
    setIsLoading(true);
    setLoadingProgress(0);
    setError(null);
    setPersonalizedExercise(null);

    try {
      setLoadingProgress(25);
      const newStoryContent = await geminiService.generateNewStory(englishLevel);
      if (!newStoryContent.title || !newStoryContent.text) throw new Error("Failed to generate valid story content.");

      setLoadingProgress(50);
      const newTranslations = await geminiService.translateText(newStoryContent.text);

      setLoadingProgress(75);
      const words = Array.from(new Set(newStoryContent.text.toLowerCase().match(/\b\w+\b/g) || []));
      const newDictionaryEntries = await geminiService.translateWords(words);
      
      const newStory: Story = {
        id: `story_${Date.now()}`,
        title: newStoryContent.title,
        text: newStoryContent.text,
        translations: newTranslations
      };

      setStories([newStory]);
      setDictionary(prev => ({
        hi: { ...prev.hi, ...newDictionaryEntries.hi },
        te: { ...prev.te, ...newDictionaryEntries.te },
      }));
      setLoadingProgress(100);

    } catch (e) {
      console.error(e);
      setError("Failed to generate a new story. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [englishLevel, setDictionary, setStories]);
  
  const handleTypingComplete = useCallback(async (summary: Omit<Extract<PracticeRecord, { type: 'typing' }>, 'type' | 'ts'> & { incorrectWords: string[] }) => {
    const record: Extract<PracticeRecord, { type: 'typing' }> = { ...summary, type: 'typing', ts: Date.now(), typedChars: summary.typedChars };
    addRecord(record);
    goalsManager.incrementGoal('type50', summary.typedChars);
    if(summary.incorrectWords.length > 0) {
      const exercise = await geminiService.generatePersonalizedExercise('typing', summary.incorrectWords);
      setPersonalizedExercise(exercise);
    } else {
      setPersonalizedExercise(null);
    }
  }, [addRecord, goalsManager]);

  const handlePronounceComplete = useCallback(async (summary: Omit<Extract<PracticeRecord, { type: 'pronounce' }>, 'type' | 'ts'> & { incorrectWords: string[] }) => {
    const record: Extract<PracticeRecord, { type: 'pronounce' }> = { ...summary, type: 'pronounce', ts: Date.now() };
    addRecord(record);
    goalsManager.incrementGoal('pron10');
    if(summary.incorrectWords.length > 0) {
        const exercise = await geminiService.generatePersonalizedExercise('pronunciation', summary.incorrectWords);
        setPersonalizedExercise(exercise);
    } else {
        setPersonalizedExercise(null);
    }
  }, [addRecord, goalsManager]);
  
  const handleSendMessage = useCallback(async (message: string) => {
    const userMessageHistory: ChatMessage[] = [...chatHistory, { role: 'user', text: message }];
    setChatHistory(userMessageHistory);
    setIsBotTyping(true);

    try {
      const response = await geminiService.getChatbotResponse(userMessageHistory.slice(-10), message);
      setChatHistory([...userMessageHistory, { role: 'bot', text: response }]);
    } catch (e) {
      console.error(e);
      setChatHistory([...userMessageHistory, { role: 'bot', text: "Sorry, I'm having trouble connecting. Please try again." }]);
    } finally {
      setIsBotTyping(false);
    }
  }, [chatHistory, setChatHistory]);

  const completionPercentage = useMemo(() => {
      const total = goalsManager.goals.reduce((acc, g) => acc + g.target, 0);
      const progress = goalsManager.goals.reduce((acc, g) => acc + g.progress, 0);
      return total > 0 ? Math.round((progress / total) * 100) : 0;
  }, [goalsManager.goals]);

  const renderSection = () => {
    switch (section) {
      case 'learn':
        return <LearnSection 
          story={currentStory} 
          lang={lang} 
          dictionary={dictionary} 
          fetchNewStory={fetchNewStory} 
          isLoading={isLoading}
          loadingProgress={loadingProgress}
        />;
      case 'type':
        return <TypingPractice text={currentStory.text} onSessionComplete={handleTypingComplete} />;
      case 'pronounce':
        return <PronouncePractice text={currentStory.text} onSessionComplete={handlePronounceComplete} />;
      case 'help':
        return <HelpScreen setSection={setSection} />;
      case 'home':
      default:
        return <HomeScreen setSection={setSection} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-20 md:pb-0">
      {!onboardingComplete && <OnboardingModal onComplete={() => setOnboardingComplete(true)} setLang={setLang} />}
      
      <Notification message={error} onClose={() => setError(null)} />

      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-30 border-b border-slate-200">
        <div className="container mx-auto px-4 flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSection('home')}>
            <span className="text-2xl">🚀</span>
            <h1 className="text-xl font-bold text-slate-800 m-0">AI English Tutor</h1>
          </div>
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-full">
            {(['learn', 'type', 'pronounce'] as Section[]).map(s => (
              <button key={s} onClick={() => setSection(s)} className={`px-4 py-2 text-sm font-semibold rounded-full flex items-center gap-2 transition ${section === s ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>
                {s === 'learn' && <LearnIcon />}
                {s === 'type' && <TypeIcon />}
                {s === 'pronounce' && <PronounceIcon />}
                <span className="capitalize">{s}</span>
              </button>
            ))}
          </nav>
          <button onClick={() => setProfileOpen(true)} className="flex items-center gap-3 text-slate-600 hover:text-teal-600">
            <span className="hidden sm:inline font-semibold">{userName || 'My Profile'}</span>
            <ProfileIcon />
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {renderSection()}
        {['type', 'pronounce'].includes(section) && (
          <PersonalizedExercise exercise={personalizedExercise} onDismiss={() => setPersonalizedExercise(null)} />
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 md:hidden bg-white/80 backdrop-blur-lg border-t border-slate-200 z-30">
        <div className="flex justify-around">
           {(['home', 'learn', 'type', 'pronounce'] as Section[]).map(s => (
              <button key={s} onClick={() => setSection(s)} className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition ${section === s ? 'text-teal-600' : 'text-slate-500 hover:bg-slate-100'}`}>
                {s === 'home' && <HomeIcon />}
                {s === 'learn' && <LearnIcon />}
                {s === 'type' && <TypeIcon />}
                {s === 'pronounce' && <PronounceIcon />}
                <span className="capitalize">{s}</span>
              </button>
            ))}
        </div>
      </footer>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setProfileOpen(false)} 
        streak={streak} 
        records={records} 
        goals={goalsManager.goals}
        lang={lang}
        setLang={setLang}
        completionPercentage={completionPercentage}
        userName={userName}
        setUserName={setUserName}
        englishLevel={englishLevel}
        setEnglishLevel={setEnglishLevel}
      />
      <ChatbotFab onClick={() => setChatOpen(true)} />
      <ChatbotModal 
        isOpen={isChatOpen}
        onClose={() => setChatOpen(false)}
        chatHistory={chatHistory}
        onSendMessage={handleSendMessage}
        isBotTyping={isBotTyping}
      />
    </div>
  );
}

export default App;
