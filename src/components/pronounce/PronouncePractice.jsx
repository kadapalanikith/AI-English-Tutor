import { useState, useEffect, useCallback, useRef } from 'react';
import Card from '../ui/Card';
import { MicIcon, RestartIcon, SpeakerIcon, CloseIcon } from '../ui/Icons';
import { similarityPct } from '../../utils';

const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;
const isSpeechRecognitionSupported = !!SpeechRecognitionAPI;

const getColorForScore = (score) => {
  if (score >= 85) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
};

/**
 * @param {{
 *   text: string;
 *   onSessionComplete: (summary: Object) => void;
 * }} props
 */
const PronouncePractice = ({ text, onSessionComplete }) => {
  const [isListening,      setIsListening]      = useState(false);
  const [transcript,       setTranscript]       = useState('');
  const [finalTranscript,  setFinalTranscript]  = useState('');
  const [score,            setScore]            = useState(null);
  const [wordScores,       setWordScores]       = useState(null);
  const [error,            setError]            = useState(null);
  const [ttsInput,         setTtsInput]         = useState('');
  const [isSpeaking,       setIsSpeaking]       = useState(false);

  const recognitionRef       = useRef(null);
  const utteranceRefTTS      = useRef(null);
  const shouldProcessOnEnd   = useRef(false);

  const reset = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onend    = null;
      recognitionRef.current.onerror  = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setTranscript('');
    setFinalTranscript('');
    setScore(null);
    setWordScores(null);
    setError(null);
    shouldProcessOnEnd.current = false;
  }, []);

  // Reset when story changes
  useEffect(() => { reset(); }, [text, reset]);

  // Cleanup on unmount
  useEffect(() => () => {
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
  }, []);

  // Process transcript once listening stops
  useEffect(() => {
    if (!isListening && shouldProcessOnEnd.current) {
      const result = finalTranscript.trim();
      if (result) {
        const calculatedScore = similarityPct(text, result);
        setScore(calculatedScore);

        const originalTokens = text.split(/\s+/).filter(Boolean);
        const spokenTokens   = result.split(/\s+/).filter(Boolean);

        const calculatedWordScores = originalTokens.map((originalToken, index) => {
          const spokenToken   = spokenTokens[index] || '';
          const cleanOriginal = originalToken.toLowerCase().replace(/[.,]/g, '');
          const cleanSpoken   = spokenToken.toLowerCase().replace(/[.,]/g, '');
          return { word: originalToken, score: similarityPct(cleanOriginal, cleanSpoken) };
        });
        setWordScores(calculatedWordScores);

        const incorrectWords = calculatedWordScores
          .filter((ws) => ws.score < 75)
          .map((ws) => ws.word.toLowerCase().replace(/[.,]/g, ''));

        onSessionComplete({
          score: calculatedScore,
          wordScores: calculatedWordScores,
          incorrectWords: [...new Set(incorrectWords)],
        });
      }
      shouldProcessOnEnd.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, finalTranscript]);

  const handleSpeak = useCallback(() => {
    if (!window.speechSynthesis || !ttsInput.trim()) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRefTTS.current = null;
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(ttsInput);
    utterance.lang    = 'en-US';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend   = () => { setIsSpeaking(false); utteranceRefTTS.current = null; };
    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') console.error('TTS error:', e.error);
      setIsSpeaking(false);
      utteranceRefTTS.current = null;
    };
    utteranceRefTTS.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [ttsInput, isSpeaking]);

  const handleListen = () => {
    if (isListening) {
      shouldProcessOnEnd.current = true;
      recognitionRef.current?.stop();
    } else {
      if (!isSpeechRecognitionSupported) {
        setError('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
        return;
      }
      reset();

      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;
      recognition.continuous      = true;
      recognition.interimResults  = true;
      recognition.lang            = 'en-US';

      recognition.onresult = (event) => {
        let interim = '';
        let final   = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setTranscript(interim);
        if (final.trim()) setFinalTranscript((prev) => (prev ? `${prev} ` : '') + final.trim());
      };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
          setError('Microphone access was denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          setError('No speech detected. Please make sure your microphone is working.');
        } else {
          setError(`An error occurred: ${event.error}. Please try again.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <Card>
      {/* TTS section */}
      <div className="pb-4 border-b border-slate-200 mb-4">
        <h3 className="text-lg font-bold text-slate-800">Hear it First</h3>
        <p className="text-sm text-slate-500 mt-0.5 mb-3">Type a word or sentence to hear how it's pronounced.</p>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <input
              id="tts-input"
              type="text"
              className="w-full px-3 py-2 pr-10 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-300 focus:border-brand-400 outline-none"
              value={ttsInput}
              onChange={(e) => setTtsInput(e.target.value)}
              placeholder="e.g. The quick brown fox…"
              aria-label="Text to pronounce"
            />
            {ttsInput && (
              <button
                type="button"
                onClick={() => setTtsInput('')}
                className="absolute right-0 top-0 h-full px-3 flex items-center text-slate-400 hover:text-slate-600"
                aria-label="Clear input"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={handleSpeak}
            disabled={!ttsInput.trim()}
            className="btn-primary rounded-xl"
            id="tts-speak-btn"
          >
            <SpeakerIcon />
            <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
          </button>
        </div>
      </div>

      {/* Practice section */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">Pronunciation Practice</h2>
        <p className="text-sm text-slate-500 mt-0.5 mb-4">Click the mic and read the text below aloud.</p>

        {/* Story text with scored colouring */}
        <div
          className="p-5 bg-brand-50 rounded-xl text-xl sm:text-2xl leading-relaxed tracking-wide border-2 border-dashed border-slate-300 mb-4"
          aria-label="Text to read aloud"
        >
          {wordScores ? (
            wordScores.map((info, idx) => (
              <span key={idx}>
                <span className={`rounded-md px-1 py-0.5 transition-colors duration-300 ${getColorForScore(info.score)}`}>
                  {info.word}
                </span>
                {idx < wordScores.length - 1 ? ' ' : ''}
              </span>
            ))
          ) : (
            text
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center min-h-[40px]">
          {error ? (
            <div className="w-full flex flex-col sm:flex-row items-start gap-4">
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl w-full">
                <strong>Oops!</strong> {error}
              </div>
              <button onClick={handleListen} className="btn-primary flex-shrink-0" id="pronounce-retry-btn">
                <RestartIcon />
                Try Again
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleListen}
                disabled={!isSpeechRecognitionSupported || isSpeaking}
                className={`btn-primary ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
                id="pronounce-listen-btn"
              >
                <MicIcon />
                <span>{isListening ? 'Stop & See Score' : 'Start Listening'}</span>
              </button>
              <button onClick={reset} disabled={isSpeaking} className="btn-ghost" id="pronounce-reset-btn">
                <RestartIcon />
                Reset
              </button>
              {score !== null && (
                <div className="ml-auto text-center sm:text-right">
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Overall Score</div>
                  <div className={`text-3xl font-extrabold ${score > 80 ? 'text-green-600' : 'text-slate-700'}`}>
                    {score}%
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Live transcript */}
        {!error && (transcript || finalTranscript) && (
          <div className="mt-4 p-4 bg-white border border-slate-200 rounded-xl">
            <h4 className="text-sm font-semibold text-slate-600 mb-1">What I heard:</h4>
            <p className="text-slate-700">
              {finalTranscript}
              <span className="text-slate-400">{transcript}</span>
            </p>
          </div>
        )}

        {/* Browser unsupported warning */}
        {!isSpeechRecognitionSupported && !error && (
          <div className="mt-4 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 p-3 rounded-xl">
            ⚠️ Speech recognition is not supported in your browser. Please try Chrome or Edge for this feature.
          </div>
        )}
      </div>
    </Card>
  );
};

export default PronouncePractice;
