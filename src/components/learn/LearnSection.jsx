import { useState, useRef, useEffect } from 'react';
import { tokenizeWithSpaces } from '../../utils';
import Card from '../ui/Card';
import WordPopup from './WordPopup';
import { PlayIcon, PauseIcon, StopIcon, RestartIcon } from '../ui/Icons';

/**
 * @param {{
 *   story: import('../../types').Story;
 *   lang: string;
 *   dictionary: Object;
 *   fetchNewStory: () => void;
 *   isLoading: boolean;
 *   loadingProgress: number;
 * }} props
 */
const LearnSection = ({ story, lang, dictionary, fetchNewStory, isLoading, loadingProgress }) => {
  const [speechStatus, setSpeechStatus] = useState('idle'); // 'idle' | 'playing' | 'paused'
  const [topic, setTopic] = useState('Indian epics, the Ramayana or Mahabharata');
  const utteranceRef = useRef(null);

  // Stop speech when story changes
  useEffect(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeechStatus('idle');
    utteranceRef.current = null;
  }, [story.id]);

  // Clean up on unmount
  useEffect(
    () => () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    },
    [],
  );

  const handlePlayPauseResume = () => {
    if (typeof window.speechSynthesis === 'undefined') return;

    if (speechStatus === 'playing') {
      window.speechSynthesis.pause();
      setSpeechStatus('paused');
    } else if (speechStatus === 'paused' && utteranceRef.current) {
      window.speechSynthesis.resume();
      setSpeechStatus('playing');
    } else {
      try {
        const utterance = new SpeechSynthesisUtterance(story.text);
        utterance.lang = 'en-US';
        utterance.onstart = () => setSpeechStatus('playing');
        utterance.onpause = () => setSpeechStatus('paused');
        utterance.onresume = () => setSpeechStatus('playing');
        utterance.onend = () => {
          setSpeechStatus('idle');
          utteranceRef.current = null;
        };
        utterance.onerror = (e) => {
          if (e.error !== 'interrupted') console.error('TTS error:', e.error);
          setSpeechStatus('idle');
          utteranceRef.current = null;
        };
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error('Failed to start TTS', e);
        setSpeechStatus('idle');
      }
    }
  };

  const handleStop = () => {
    if (typeof window.speechSynthesis === 'undefined') return;
    window.speechSynthesis.cancel();
    setSpeechStatus('idle');
    utteranceRef.current = null;
  };

  const langLabel = lang === 'hi' ? 'Hindi' : 'Telugu';

  return (
    <Card>
      {/* Header row */}
      <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{story.title}</h2>
          <p className="text-sm text-slate-500 mt-0.5">Long-press any word to see its meaning.</p>
        </div>

        {/* Controls */}
        <div className="flex gap-2 items-center flex-wrap">
          <button
            className="btn-primary"
            onClick={handlePlayPauseResume}
            aria-label={
              speechStatus === 'playing'
                ? 'Pause narration'
                : speechStatus === 'paused'
                  ? 'Resume narration'
                  : 'Listen to story'
            }
            id="learn-listen-btn"
          >
            {speechStatus === 'playing' ? <PauseIcon /> : <PlayIcon />}
            <span>
              {speechStatus === 'playing'
                ? 'Pause'
                : speechStatus === 'paused'
                  ? 'Resume'
                  : 'Listen'}
            </span>
          </button>

          {(speechStatus === 'playing' || speechStatus === 'paused') && (
            <button className="btn-ghost" onClick={handleStop} aria-label="Stop narration">
              <StopIcon />
              <span>Stop</span>
            </button>
          )}

          <button
            className="btn-primary relative overflow-hidden"
            onClick={fetchNewStory}
            disabled={isLoading}
            id="learn-new-story-btn"
            aria-label="Generate new story"
          >
            <RestartIcon />
            <span>{isLoading ? 'Generating…' : 'New Story'}</span>
            {isLoading && (
              <span
                className="absolute bottom-0 left-0 h-0.5 bg-white/40 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Topic Selection */}
      <div className="mb-6 flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <label
          htmlFor="topic-select"
          className="text-sm font-semibold text-slate-600 whitespace-nowrap"
        >
          Topic:
        </label>
        <select
          id="topic-select"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="bg-white border text-sm border-slate-300 text-slate-700 rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2 outline-none"
        >
          <option value="Indian epics, the Ramayana or Mahabharata">
            Indian Epics (Ramayana / Mahabharata)
          </option>
          <option value="Ordering food at a restaurant">Ordering Food at a Restaurant</option>
          <option value="A job interview">A Job Interview</option>
          <option value="Traveling to a new country and asking for directions">
            Travel & Directions
          </option>
          <option value="Negotiating a price at a market">Negotiating a Price</option>
          <option value="A funny misunderstanding between friends">
            Comedy / Misunderstanding
          </option>
          <option value="A mystery set in a small village">Small Village Mystery</option>
        </select>
        <button
          className="btn-primary relative flex-shrink-0"
          onClick={() => fetchNewStory(topic)}
          disabled={isLoading}
          aria-label="Generate new story"
        >
          <RestartIcon />
          <span>{isLoading ? 'Generating…' : 'New Story'}</span>
          {isLoading && (
            <span
              className="absolute bottom-0 left-0 h-0.5 bg-white/40 transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          )}
        </button>
      </div>

      {/* Story text */}
      <div className="text-xl sm:text-2xl leading-[1.8] sm:leading-[1.9] tracking-wide text-slate-700 select-none">
        {tokenizeWithSpaces(story.text).map((token, idx) =>
          token.trim() === '' ? (
            <span key={idx}>{token}</span>
          ) : (
            <WordPopup key={idx} token={token} lang={lang} dictionary={dictionary} />
          ),
        )}
      </div>

      {/* Translation */}
      {story.translations && (
        <div className="mt-6 pt-4 border-t border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-1">Translation ({langLabel})</h4>
          <p className="text-slate-500 text-lg leading-relaxed">{story.translations[lang]}</p>
        </div>
      )}
    </Card>
  );
};

export default LearnSection;
