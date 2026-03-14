import { useState, useRef, useCallback } from 'react';
import { normalizeKey } from '../../utils';
import { translateSingleWord } from '../../services/geminiService';

/**
 * Inline word with a long-press translation popup.
 * @param {{ token: string; lang: string; dictionary: Object }} props
 */
const WordPopup = ({ token, lang, dictionary }) => {
  const [popup, setPopup] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef(null);

  const showPopup = useCallback(async () => {
    const key = normalizeKey(token);

    // Speak out loud immediately
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(key);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }

    if (dictionary[lang]?.[key]) {
      setPopup(dictionary[lang][key]);
    } else {
      setIsLoading(true);
      setPopup('…'); // Loading indicator
      const trans = await translateSingleWord(key);
      setPopup(trans[lang] || '—');
      setIsLoading(false);
    }
  }, [token, lang, dictionary]);

  const startTimer = useCallback(() => {
    // Shorter hold threshold for immediate feedback (150ms)
    timerRef.current = setTimeout(showPopup, 150);
  }, [showPopup]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    // Don't close immediately if it's loading so they can see the result, or close it if they let go.
    // For "click-to-define", let it disappear when mouse leaves.
    setTimeout(() => {
      setPopup(null);
      setIsLoading(false);
    }, 1000); // 1 sec delay before disappearing
  }, []);

  return (
    <span
      className="relative inline-block cursor-pointer hover:text-brand-700 transition-colors duration-100"
      onMouseDown={startTimer}
      onMouseUp={clearTimer}
      onMouseLeave={clearTimer}
      onTouchStart={startTimer}
      onTouchEnd={clearTimer}
      role="button"
      tabIndex={0}
      aria-label={`Long press to see translation of "${token}"`}
    >
      {token}
      {popup && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-brand-800 text-white rounded-xl text-sm font-semibold whitespace-nowrap z-10 shadow-2xl animate-fade-in border border-brand-700">
          {isLoading ? (
            <span className="animate-pulse flex space-x-1">
              <span
                className="w-1.5 h-1.5 rounded-full bg-white animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-white animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-white animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </span>
          ) : (
            popup
          )}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brand-800" />
        </span>
      )}
    </span>
  );
};

export default WordPopup;
