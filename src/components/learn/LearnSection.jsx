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
