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
 * }} props
 */
const TypingPractice = ({ text, onSessionComplete }) => {
  const chars = useMemo(() => text.split(''), [text]);

  const [pos,       setPos]       = useState(0);
  const [status,    setStatus]    = useState(() => Array(chars.length).fill(null));
  const [startedAt, setStartedAt] = useState(null);
  const [endedAt,   setEndedAt]   = useState(null);

  // Reset when text changes
  useEffect(() => {
    setStatus(Array(chars.length).fill(null));
    setPos(0);
    setStartedAt(null);
    setEndedAt(null);
  }, [text, chars.length]);

  // Keyboard handler
  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey || e.altKey || e.metaKey || endedAt) return;
    if (!startedAt) setStartedAt(Date.now());

    if (e.key === 'Backspace') {
      e.preventDefault();
      setPos((p) => {
        const newPos = Math.max(0, p - 1);
        setStatus((prev) => { const next = [...prev]; next[newPos] = null; return next; });
        return newPos;
      });
      return;
    }

    if (e.key.length === 1 && pos < chars.length) {
      e.preventDefault();
      setStatus((prev) => { const next = [...prev]; next[pos] = e.key === chars[pos]; return next; });
      setPos((p) => {
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

  // Session complete handler
  useEffect(() => {
    if (!endedAt || !startedAt) return;

    const elapsedMin = (endedAt - startedAt) / 60000;
    const correctChars = status.filter((s) => s === true).length;
    const typedChars   = status.filter((s) => s !== null).length || 1;
    const wpm          = elapsedMin > 0 ? Math.round((correctChars / 5) / elapsedMin) : 0;
    const accuracy     = Math.round((correctChars / typedChars) * 100);

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
  const typedCount  = status.filter((s) => s !== null).length;
  const correctCount = status.filter((s) => s === true).length;
  const accuracy    = typedCount ? Math.round((correctCount / typedCount) * 100) : 100;
  const elapsedMs   = startedAt ? ((endedAt || Date.now()) - startedAt) : 0;
  const wpmLive     = startedAt && elapsedMs > 1000 ? Math.round((correctCount / 5) / (elapsedMs / 60000)) : 0;

  return (
    <Card>
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Typing Practice</h2>
          <p className="text-sm text-slate-500 mt-0.5">Click the area below and start typing.</p>
        </div>
        <div className="flex gap-6 sm:flex-col sm:gap-0 sm:text-right">
          <div className="text-sm text-slate-500">WPM: <strong className="text-lg text-slate-700">{wpmLive}</strong></div>
          <div className="text-sm text-slate-500">
            Accuracy: <strong className={`text-lg ${accuracy > 90 ? 'text-green-600' : 'text-slate-700'}`}>{accuracy}%</strong>
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

      {/* Footer */}
      <div className="flex gap-4 mt-4 items-center">
        <button onClick={reset} className="btn-primary" id="typing-restart-btn">
          <RestartIcon />
          <span>Restart</span>
        </button>
        <div className="ml-auto text-sm text-slate-400">
          {typedCount} / {chars.length} characters
        </div>
      </div>
    </Card>
  );
};

export default TypingPractice;
