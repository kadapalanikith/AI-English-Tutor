
import React, { useState, useRef, useCallback } from 'react';
import { Language, Dictionary } from '../../types';
import { normalizeKey } from '../../lib/utils';

interface WordPopupProps {
  token: string;
  lang: Language;
  dictionary: Dictionary;
}

const WordPopup: React.FC<WordPopupProps> = ({ token, lang, dictionary }) => {
  const [popup, setPopup] = useState<string | null>(null);
  // FIX: Use ReturnType<typeof setTimeout> for browser compatibility instead of NodeJS.Timeout
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showPopup = useCallback(() => {
    const key = normalizeKey(token);
    const translation = dictionary[lang]?.[key] || '—';
    setPopup(translation);
  }, [token, lang, dictionary]);
  
  const startTimer = useCallback(() => {
    timerRef.current = setTimeout(showPopup, 300);
  }, [showPopup]);
  
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setPopup(null);
  }, []);

  return (
    <span 
      className="relative inline-block cursor-pointer"
      onMouseDown={startTimer}
      onMouseUp={clearTimer}
      onMouseLeave={clearTimer}
      onTouchStart={startTimer}
      onTouchEnd={clearTimer}
    >
      {token}
      {popup && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-base font-semibold whitespace-nowrap z-10 shadow-lg">
          {popup}
        </span>
      )}
    </span>
  );
};

export default WordPopup;
