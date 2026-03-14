import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

import RootLayout from './layouts/RootLayout';
import Notification from './components/ui/Notification';
import OnboardingModal from './components/onboarding/OnboardingModal';
import ProfileModal from './components/profile/ProfileModal';
import ChatbotFab from './components/chatbot/ChatbotFab';
import ChatbotModal from './components/chatbot/ChatbotModal';

import useLocalStorage from './hooks/useLocalStorage';
import { useGoals } from './hooks/useGoals';
import { useProgress } from './hooks/useProgress';
import { initialStory, initialDictionary } from './data/initialData';
import * as geminiService from './services/geminiService';
import { playSuccessSound } from './utils/audio';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/ui/PageTransition';

// ── Lazy-loaded pages ──────────────────────────────────────────────────────────
const HomePage = lazy(() => import('./pages/HomePage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const TypePage = lazy(() => import('./pages/TypePage'));
const PronouncePage = lazy(() => import('./pages/PronouncePage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const HelpPage = lazy(() => import('./pages/HelpPage'));

// ── Simple page loader ─────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex items-center justify-center py-24">
    <div className="flex gap-2">
      {[0, 150, 300].map((delay) => (
        <div
          key={`loader-${delay}`}
          className="w-3 h-3 bg-brand-500 rounded-full animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  </div>
);

// ──────────────────────────────────────────────────────────────────────────────
function App() {
  // ── Persistent state ──
  const [stories, setStories] = useLocalStorage('eec_stories', [initialStory]);
  const [dictionary, setDictionary] = useLocalStorage('eec_dictionary', initialDictionary);
  const [lang, setLang] = useLocalStorage('eec_lang', 'hi');
  const [onboardingComplete, setOnboardingComplete] = useLocalStorage(
    'eec_onboarding_complete',
    false,
  );
  const [userName, setUserName] = useLocalStorage('eec_user_name', '');
  const [englishLevel, setEnglishLevel] = useLocalStorage('eec_english_level', 'beginner');
  const [chatHistory, setChatHistory] = useLocalStorage('eec_chat_history', []);

  // ── Ephemeral state ──
  const [personalizedExercise, setPersonalizedExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);

  // ── Hooks ──
  const goalsManager = useGoals();
  const { records, addRecord, streak } = useProgress(goalsManager);

  const currentStory = useMemo(() => stories[0] || initialStory, [stories]);

  // ── Scroll to top on navigation ──
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // ── Story generation ──
  const fetchNewStory = useCallback(
    async (topic = 'Indian epics, the Ramayana or Mahabharata') => {
      setIsLoading(true);
      setLoadingProgress(0);
      setError(null);
      setPersonalizedExercise(null);

      try {
        setLoadingProgress(25);
        const newStoryContent = await geminiService.generateNewStory(englishLevel, topic);
        if (!newStoryContent.title || !newStoryContent.text)
          throw new Error('Invalid story content returned from API.');

        setLoadingProgress(50);
        const newTranslations = await geminiService.translateText(newStoryContent.text);

        setLoadingProgress(75);
        const words = Array.from(
          new Set(newStoryContent.text.toLowerCase().match(/\b\w+\b/g) || []),
        );
        const newDictionaryEntries = await geminiService.translateWords(words);

        const newStory = {
          id: `story_${Date.now()}`,
          title: newStoryContent.title,
          text: newStoryContent.text,
          translations: newTranslations,
        };

        setStories([newStory]);
        setDictionary((prev) => ({
          hi: { ...prev.hi, ...newDictionaryEntries.hi },
          te: { ...prev.te, ...newDictionaryEntries.te },
        }));
        setLoadingProgress(100);
      } catch (e) {
        console.error('[App] fetchNewStory error:', e);
        setError('Failed to generate a new story. Please check your API key and try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [englishLevel, setDictionary, setStories],
  );

  // ── Session complete handlers ──
  const handleTypingComplete = useCallback(
    async (summary) => {
      if (summary.accuracy >= 80) playSuccessSound();
      addRecord({ ...summary, type: 'typing', ts: Date.now() });
      goalsManager.incrementGoal('type50', summary.typedChars);
      if (summary.incorrectWords.length > 0) {
        const exercise = await geminiService.generatePersonalizedExercise(
          'typing',
          summary.incorrectWords,
        );
        setPersonalizedExercise(exercise);
      } else {
        setPersonalizedExercise(null);
      }
    },
    [addRecord, goalsManager],
  );

  const handlePronounceComplete = useCallback(
    async (summary) => {
      if (summary.score >= 75) playSuccessSound();
      addRecord({ ...summary, type: 'pronounce', ts: Date.now() });
      goalsManager.incrementGoal('pron10');
      if (summary.incorrectWords.length > 0) {
        const exercise = await geminiService.generatePersonalizedExercise(
          'pronunciation',
          summary.incorrectWords,
        );
        setPersonalizedExercise(exercise);
      } else {
        setPersonalizedExercise(null);
      }
    },
    [addRecord, goalsManager],
  );

  // ── Chatbot ──
  const handleSendMessage = useCallback(
    async (message) => {
      const userHistory = [...chatHistory, { role: 'user', text: message }];
      setChatHistory(userHistory);
      setIsBotTyping(true);
      try {
        const response = await geminiService.getChatbotResponse(userHistory.slice(-10), message);
        setChatHistory([...userHistory, { role: 'bot', text: response }]);
      } catch (e) {
        console.error('[App] chatbot error:', e);
        setChatHistory([
          ...userHistory,
          { role: 'bot', text: "Sorry, I'm having trouble connecting. Please try again." },
        ]);
      } finally {
        setIsBotTyping(false);
      }
    },
    [chatHistory, setChatHistory],
  );

  // ── Goal completion percentage ──
  const completionPercentage = useMemo(() => {
    const total = goalsManager.goals.reduce((acc, g) => acc + g.target, 0);
    const progress = goalsManager.goals.reduce((acc, g) => acc + g.progress, 0);
    return total > 0 ? Math.round((progress / total) * 100) : 0;
  }, [goalsManager.goals]);

  const clearExercise = useCallback(() => setPersonalizedExercise(null), []);

  // ── Common page props ──
  const storyPageProps = { story: currentStory, personalizedExercise, clearExercise };

  return (
    <>
      {/* Onboarding */}
      {!onboardingComplete && (
        <OnboardingModal onComplete={() => setOnboardingComplete(true)} setLang={setLang} />
      )}

      {/* Global error toast */}
      <Notification message={error} onClose={() => setError(null)} />

      {/* App shell */}
      <RootLayout userName={userName} lang={lang} onProfileOpen={() => setProfileOpen(true)}>
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <HomePage lang={lang} />
                  </PageTransition>
                }
              />
              <Route
                path="/learn"
                element={
                  <PageTransition>
                    <LearnPage
                      {...storyPageProps}
                      lang={lang}
                      dictionary={dictionary}
                      fetchNewStory={fetchNewStory}
                      isLoading={isLoading}
                      loadingProgress={loadingProgress}
                    />
                  </PageTransition>
                }
              />
              <Route
                path="/type"
                element={
                  <PageTransition>
                    <TypePage {...storyPageProps} onSessionComplete={handleTypingComplete} />
                  </PageTransition>
                }
              />
              <Route
                path="/pronounce"
                element={
                  <PageTransition>
                    <PronouncePage
                      {...storyPageProps}
                      onSessionComplete={handlePronounceComplete}
                    />
                  </PageTransition>
                }
              />
              <Route
                path="/help"
                element={
                  <PageTransition>
                    <HelpPage />
                  </PageTransition>
                }
              />
              <Route
                path="/quiz"
                element={
                  <PageTransition>
                    <QuizPage englishLevel={englishLevel} />
                  </PageTransition>
                }
              />
              {/* 404 fallback */}
              <Route
                path="*"
                element={
                  <PageTransition>
                    <div className="text-center py-24">
                      <div className="text-6xl mb-4">😕</div>
                      <h1 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h1>
                      <Link to="/" className="btn-primary inline-flex mt-4">
                        Go Home
                      </Link>
                    </div>
                  </PageTransition>
                }
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </RootLayout>

      {/* Global modals & overlays */}
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
    </>
  );
}

export default App;
