import { useState } from 'react';

const tourSteps = [
  { icon: '📖', title: 'Learn Stories',         description: 'Read AI-generated stories from Indian epics. Long-press any word to see its translation in your native language.' },
  { icon: '⌨️', title: 'Practice Typing',        description: 'Improve your typing speed and accuracy by typing the stories you read. Get real-time WPM and accuracy stats.' },
  { icon: '🔊', title: 'Practice Pronunciation', description: 'Read the stories aloud and get instant AI feedback on your pronunciation, word by word.' },
  { icon: '🤖', title: 'Meet LiftBot',           description: 'Have any doubts? Ask your personal AI English tutor any question about grammar, vocabulary, or the app.' },
];

/**
 * @param {{ onComplete: () => void; setLang: (lang: string) => void }} props
 */
const OnboardingModal = ({ onComplete, setLang }) => {
  const [step, setStep] = useState(1); // 1 = lang select, 2..5 = tour steps

  const handleLanguageSelect = (lang) => {
    setLang(lang);
    setStep(2);
  };

  const currentTour = tourSteps[step - 2];
  const isLastStep = step === tourSteps.length + 1;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome onboarding"
    >
      <div className="bg-white rounded-3xl p-8 w-full max-w-md text-center shadow-2xl animate-slide-up">
        {/* Step 1 – Language selection */}
        {step === 1 && (
          <div>
            <div className="text-5xl mb-4">🚀</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome to AI English Tutor!</h1>
            <p className="text-slate-500 mb-6">To personalise your experience, please select your mother tongue.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="btn-primary py-4 text-base rounded-xl flex-1 justify-center"
                onClick={() => handleLanguageSelect('hi')}
                id="onboard-hindi"
              >
                हिन्दी (Hindi)
              </button>
              <button
                className="btn-primary py-4 text-base rounded-xl flex-1 justify-center"
                onClick={() => handleLanguageSelect('te')}
                id="onboard-telugu"
              >
                తెలుగు (Telugu)
              </button>
            </div>
          </div>
        )}

        {/* Steps 2-5 – Tour */}
        {step > 1 && step <= tourSteps.length + 1 && (
          <div>
            <div className="text-6xl mb-4">{currentTour.icon}</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">{currentTour.title}</h2>
            <p className="text-slate-500 mb-6">{currentTour.description}</p>

            {/* Step dots */}
            <div className="flex justify-center gap-2 mb-6">
              {tourSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${i === step - 2 ? 'w-6 bg-brand-600' : 'w-2 bg-slate-200'}`}
                />
              ))}
            </div>

            {isLastStep ? (
              <button className="btn-primary py-3 px-8 text-base rounded-xl" onClick={onComplete} id="onboard-start">
                Start Learning! 🎉
              </button>
            ) : (
              <button className="btn-primary py-3 px-8 text-base rounded-xl" onClick={() => setStep((s) => s + 1)} id="onboard-next">
                Next →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingModal;
