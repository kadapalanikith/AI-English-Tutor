import { useState, useRef, useCallback } from 'react';
import { normalizeKey } from '../../utils';

/**
 * Inline word with a long-press translation popup.
 * @param {{ token: string; lang: string; dictionary: Object }} props
 */
const WordPopup = ({ token, lang, dictionary }) => {
  const [popup, setPopup] = useState(null);
  const timerRef = useRef(null);

  const showPopup = useCallback(() => {
    const key = normalizeKey(token);
    const translation = dictionary[lang]?.[key] || '—';
    setPopup(translation);
  }, [token, lang, dictionary]);

  const startTimer = useCallback(() => {
    timerRef.current = setTimeout(showPopup, 300);
  }, [showPopup]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPopup(null);
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
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white rounded-xl text-sm font-semibold whitespace-nowrap z-10 shadow-xl animate-fade-in">
          {popup}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </span>
      )}
    </span>
  );
};

export default WordPopup;
