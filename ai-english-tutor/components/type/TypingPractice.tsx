
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Card from '../common/Card';
import { RestartIcon } from '../common/Icons';
import { TypingRecord } from '../../types';
import { tokenizeWithSpaces } from '../../lib/utils';

interface TypingPracticeProps {
  text: string;
  onSessionComplete: (summary: Omit<TypingRecord, 'type' | 'ts'> & { incorrectWords: string[] }) => void;
}

const CharSpan: React.FC<{ char: string; state: boolean | null; isCurrent: boolean }> = React.memo(({ char, state, isCurrent }) => {
  const stateClass = state === true ? 'bg-teal-100 text-teal-800' : state === false ? 'bg-red-100 text-red-800 underline' : '';
  return (
    <span className={`px-0.5 py-1 rounded-md transition-colors duration-200 relative ${stateClass}`}>
      {char}
      {isCurrent && <span className="absolute left-0 top-1 w-0.5 h-6 bg-teal-500 animate-pulse"></span>}
    </span>
  );
});

const TypingPractice: React.FC<TypingPracticeProps> = ({ text, onSessionComplete }) => {
  const chars = useMemo(() => text.split(''), [text]);
  const [pos, setPos] = useState(0);
  const [status, setStatus] = useState<Array<boolean | null>>(() => Array(chars.length).fill(null));
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [endedAt, setEndedAt] = useState<number | null>(null);

  useEffect(() => {
    setStatus(Array(chars.length).fill(null));
    setPos(0);
    setStartedAt(null);
    setEndedAt(null);
  }, [text, chars.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.altKey || e.metaKey || endedAt) return;
    if (!startedAt) setStartedAt(Date.now());
    
    if (e.key === 'Backspace') {
      e.preventDefault();
      setPos(p => {
        const newPos = Math.max(0, p - 1);
        setStatus(prev => { const next = [...prev]; next[newPos] = null; return next; });
        return newPos;
      });
      return;
    }

    if (e.key.length === 1 && pos < chars.length) {
      e.preventDefault();
      setStatus(prev => { const next = [...prev]; next[pos] = e.key === chars[pos]; return next; });
      setPos(p => {
        const nextPos = p + 1;
        if (nextPos >= chars.length) setEndedAt(Date.now());
        return nextPos;
      });
    }
  }, [chars, pos, startedAt, endedAt]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  useEffect(() => {
    if (endedAt && startedAt) {
      const elapsedMin = (endedAt - startedAt) / 60000;
      const correctChars = status.filter(s => s === true).length;
      const typedChars = status.filter(s => s !== null).length || 1;
      const wpm = elapsedMin > 0 ? Math.round((correctChars / 5) / elapsedMin) : 0;
      const accuracy = Math.round((correctChars / typedChars) * 100);

      const words = tokenizeWithSpaces(text);
      const incorrectWords: string[] = [];
      let charCursor = 0;
      words.forEach(word => {
          const wordLen = word.length;
          if (word.trim().length > 0) {
              const wordStatuses = status.slice(charCursor, charCursor + wordLen);
              if (wordStatuses.includes(false)) {
                  incorrectWords.push(word.replace(/[.,]/g, ''));
              }
          }
          charCursor += wordLen;
      });

      onSessionComplete({ wpm, accuracy, typedChars, incorrectWords: [...new Set(incorrectWords)] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endedAt, startedAt]);

  const reset = useCallback(() => {
    setPos(0);
    setStatus(Array(chars.length).fill(null));
    setStartedAt(null);
    setEndedAt(null);
  }, [chars.length]);
  
  const typedCount = status.filter(s => s !== null).length;
  const correctCount = status.filter(s => s === true).length;
  const accuracy = typedCount ? Math.round((correctCount / typedCount) * 100) : 100;
  const elapsedMs = startedAt ? ((endedAt || Date.now()) - startedAt) : 0;
  const wpmLive = startedAt && elapsedMs > 1000 ? Math.round(((correctCount / 5) / (elapsedMs / 60000))) : 0;

  return (
    <Card>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 m-0">Typing Practice</h2>
          <p className="text-sm text-slate-500 m-0">Click the area below and start typing.</p>
        </div>
        <div className="sm:text-right flex gap-x-4 sm:block sm:flex-shrink-0">
          <div className="text-sm text-slate-500">WPM: <strong className="text-lg text-slate-700">{wpmLive}</strong></div>
          <div className="text-sm text-slate-500">Accuracy: <strong className={`text-lg ${accuracy > 90 ? 'text-green-600' : 'text-slate-700'}`}>{accuracy}%</strong></div>
        </div>
      </div>
      <div className="p-5 bg-teal-50 rounded-lg text-xl sm:text-2xl leading-relaxed tracking-wide cursor-text border-2 border-dashed border-slate-200 focus-within:border-teal-500" tabIndex={0}>
        {chars.map((char, i) => <CharSpan key={i} char={char} state={status[i]} isCurrent={i === pos && !endedAt} />)}
      </div>
      <div className="flex gap-4 mt-4 items-center">
        <button onClick={reset} className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition flex items-center gap-2">
          <RestartIcon />
          <span>Restart</span>
        </button>
        <div className="ml-auto text-sm text-slate-500">Typed: {typedCount}/{chars.length}</div>
      </div>
    </Card>
  );
};

export default TypingPractice;