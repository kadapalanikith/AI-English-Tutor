import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import Card from '../ui/Card';
import { RestartIcon } from '../ui/Icons';
import { tokenizeWithSpaces } from '../../utils';

/** Memoised single character span */
const CharSpan = memo(({ char, state, isCurrent }) => {
  const cls =
    state === true
      ? 'bg-brand-100 text-brand-800'
      : state === false
        ? 'bg-red-100 text-red-700 underline decoration-wavy'
        : '';

  return (
    <span className={`relative px-0.5 py-1 rounded transition-colors duration-150 ${cls}`}>
      {char}
      {isCurrent && (
        <span className="absolute left-0 top-1 w-0.5 h-6 bg-brand-500 animate-pulse-slow rounded-full" />
      )}
    </span>
  );
});
CharSpan.displayName = 'CharSpan';

/**
 * @param {{
 *   text: string;
 *   onSessionComplete: (summary: Object) => void;
 *   averageWpm: number;
 * }} props
 */
const TypingPractice = ({ text, onSessionComplete, averageWpm = 30 }) => {
  const chars = useMemo(() => text.split(''), [text]);

  const [pos, setPos] = useState(0);
  const [status, setStatus] = useState(() => Array(chars.length).fill(null));
  const [startedAt, setStartedAt] = useState(null);
  const [endedAt, setEndedAt] = useState(null);
  const [liveElapsedMs, setLiveElapsedMs] = useState(0);

  // Live timer for Ghost Racer (updates 10x per second)
  useEffect(() => {
    let intervalId;
    if (startedAt && !endedAt) {
      intervalId = setInterval(() => {
        setLiveElapsedMs(Date.now() - startedAt);
      }, 100);
    } else if (endedAt) {
      setLiveElapsedMs(endedAt - startedAt);
    }
    return () => clearInterval(intervalId);
  }, [startedAt, endedAt]);

  // Reset when text changes
  useEffect(() => {
    setStatus(Array(chars.length).fill(null));
    setPos(0);
    setStartedAt(null);
    setEndedAt(null);
    setLiveElapsedMs(0);
  }, [text, chars.length]);

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e) => {
      if (e.ctrlKey || e.altKey || e.metaKey || endedAt) return;
      if (!startedAt) setStartedAt(Date.now());

      if (e.key === 'Backspace') {
        e.preventDefault();
        setPos((p) => {
          const newPos = Math.max(0, p - 1);
          setStatus((prev) => {
            const next = [...prev];
            next[newPos] = null;
            return next;
          });
          return newPos;
        });
        return;
      }

      if (e.key.length === 1 && pos < chars.length) {
        e.preventDefault();
        setStatus((prev) => {
          const next = [...prev];
          next[pos] = e.key === chars[pos];
          return next;
        });
        setPos((p) => {
          const nextPos = p + 1;
          if (nextPos >= chars.length) setEndedAt(Date.now());
          return nextPos;
        });
      }
    },
    [chars, pos, startedAt, endedAt],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Session complete handler
  useEffect(() => {
    if (!endedAt || !startedAt) return;

    const elapsedMin = (endedAt - startedAt) / 60000;
    const correctChars = status.filter((s) => s === true).length;
    const typedChars = status.filter((s) => s !== null).length || 1;
    const wpm = elapsedMin > 0 ? Math.round(correctChars / 5 / elapsedMin) : 0;
    const accuracy = Math.round((correctChars / typedChars) * 100);

    // Collect incorrect words
    const words = tokenizeWithSpaces(text);
    const incorrectWords = [];
    let charCursor = 0;
    words.forEach((word) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endedAt, startedAt]);

  const reset = useCallback(() => {
    setPos(0);
    setStatus(Array(chars.length).fill(null));
    setStartedAt(null);
    setEndedAt(null);
  }, [chars.length]);

  // Live stats
  const typedCount = status.filter((s) => s !== null).length;
  const correctCount = status.filter((s) => s === true).length;
  const accuracy = typedCount ? Math.round((correctCount / typedCount) * 100) : 100;
  const elapsedMs = liveElapsedMs;
  const wpmLive =
    startedAt && elapsedMs > 1000 ? Math.round(correctCount / 5 / (elapsedMs / 60000)) : 0;

  // Ghost calculation: (averageWpm * 5) chars per minute
  const charsPerMs = (averageWpm * 5) / 60000;
  const ghostChars = Math.min(chars.length, Math.floor(elapsedMs * charsPerMs));
  const myProgress = Math.min(100, Math.round((typedCount / chars.length) * 100));
  const ghostProgress = Math.min(100, Math.round((ghostChars / chars.length) * 100));

  return (
    <Card>
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Typing Practice</h2>
          <p className="text-sm text-slate-500 mt-0.5">Click the area below and start typing.</p>
        </div>
        <div className="flex gap-6 sm:flex-col sm:gap-0 sm:text-right">
          <div className="text-sm text-slate-500">
            WPM: <strong className="text-lg text-slate-700">{wpmLive}</strong>
          </div>
          <div className="text-sm text-slate-500">
            Accuracy:{' '}
            <strong className={`text-lg ${accuracy > 90 ? 'text-green-600' : 'text-slate-700'}`}>
              {accuracy}%
            </strong>
          </div>
        </div>
      </div>

      {/* Typing area */}
      <div
        className="p-5 bg-brand-50 rounded-xl text-xl sm:text-2xl leading-relaxed tracking-wide cursor-text border-2 border-dashed border-slate-300 focus-within:border-brand-500 transition-colors"
        tabIndex={0}
        id="typing-area"
        role="textbox"
        aria-label="Typing practice area"
        aria-readonly="false"
      >
        {chars.map((char, i) => (
          <CharSpan key={i} char={char} state={status[i]} isCurrent={i === pos && !endedAt} />
        ))}
      </div>

      {/* Ghost Racer UI */}
      <div className="mt-6 flex flex-col gap-3 pb-2 select-none">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Race against yourself
        </h3>

        {/* User (Blue) */}
        <div className="relative h-6 bg-slate-100 rounded-full w-full shadow-inner border border-slate-200">
          <div
            className="absolute top-0 left-0 h-full bg-brand-500 rounded-full transition-all duration-200 shadow-md flex items-center justify-end px-2"
            style={{ width: `${Math.max(5, myProgress)}%` }}
          >
            <span className="text-sm">🏎️</span>
          </div>
        </div>

        {/* Ghost (Gray) */}
        <div className="relative h-6 bg-slate-100 rounded-full w-full shadow-inner border border-slate-200 opacity-60">
          <div
            className="absolute top-0 left-0 h-full bg-slate-400 rounded-full transition-all duration-200 flex items-center justify-end px-2"
            style={{ width: `${Math.max(5, ghostProgress)}%` }}
          >
            <span className="text-sm">👻</span>
          </div>
          <div className="absolute right-0 top-0 h-full flex items-center pr-3">
            <span className="text-[10px] font-bold text-slate-400">Avg {averageWpm} WPM</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-4 mt-8 items-center border-t border-slate-100 pt-4">
        <button onClick={reset} className="btn-primary" id="typing-restart-btn">
          <RestartIcon />
          <span>Restart</span>
        </button>
        <div className="ml-auto text-sm font-medium text-slate-500">
          {typedCount} / {chars.length} characters
        </div>
      </div>
    </Card>
  );
};

export default TypingPractice;
