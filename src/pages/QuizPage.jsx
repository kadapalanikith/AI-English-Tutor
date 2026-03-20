import { useState } from 'react';
import Card from '../components/ui/Card';
import { generateGrammarQuiz } from '../services/geminiService';
import { playSuccessSound, playPopSound } from '../utils/audio';

const QuizPage = ({ englishLevel }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuiz = async () => {
    setLoading(true);
    setFinished(false);
    setError(null);
    setSelectedAnswer(null);
    setCurrentIdx(0);
    setScore(0);
    try {
      const q = await generateGrammarQuiz(englishLevel);
      setQuestions(q);
    } catch (e) {
      console.error(e);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (option) => {
    if (selectedAnswer) return; // Prevent changing answer
    playPopSound();
    setSelectedAnswer(option);
    if (option === questions[currentIdx].answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedAnswer(null);
    } else {
      if (score >= questions.length - 1) playSuccessSound(); // 80%+ gets ding
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-brand-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Generating your custom quiz...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Daily Quiz Challenge</h2>
          <p className="text-slate-500 mb-6">
            Test your grammar and vocabulary with 5 AI-generated questions tailored to your level.
          </p>
          <button className="btn-primary inline-flex" onClick={fetchQuiz}>
            Start Quiz
          </button>
          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        </Card>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">{score >= 4 ? '🏆' : '👍'}</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Quiz Complete!</h2>
          <p className="text-slate-500 mb-6">
            You scored {score} out of {questions.length}.
          </p>
          <button className="btn-primary inline-flex" onClick={fetchQuiz}>
            Play Again
          </button>
        </Card>
      </div>
    );
  }

  const q = questions[currentIdx];
  const isCorrect = selectedAnswer === q.answer;

  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="mb-4 flex justify-between items-center text-sm font-semibold text-slate-500">
        <span>
          Question {currentIdx + 1} of {questions.length}
        </span>
        <span>Score: {score}</span>
      </div>
      <Card>
        <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">{q.question}</h3>
        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            let btnClass =
              'w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium ';
            if (!selectedAnswer) {
              btnClass += 'border-slate-200 hover:border-brand-400 bg-white text-slate-700';
            } else if (opt === q.answer) {
              btnClass += 'border-green-500 bg-green-50 text-green-800';
            } else if (opt === selectedAnswer) {
              btnClass += 'border-red-500 bg-red-50 text-red-800';
            } else {
              btnClass += 'border-slate-200 bg-slate-50 text-slate-400 opacity-50';
            }
            return (
              <button
                key={idx}
                className={btnClass}
                onClick={() => handleSelect(opt)}
                disabled={!!selectedAnswer}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 animate-slide-up">
            <h4 className={`font-bold mb-1 ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect.'}
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">{q.explanation}</p>
            <button className="btn-primary w-full mt-4" onClick={handleNext}>
              {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default QuizPage;
