
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Card from '../common/Card';
import { MicIcon, RestartIcon, SpeakerIcon, CloseIcon } from '../common/Icons';
import { PronounceRecord } from '../../types';
import { similarityPct } from '../../lib/utils';

interface PronouncePracticeProps {
  text: string;
  onSessionComplete: (summary: Omit<PronounceRecord, 'type' | 'ts'> & { incorrectWords: string[] }) => void;
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognitionAPI;

const PronouncePractice: React.FC<PronouncePracticeProps> = ({ text, onSessionComplete }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [wordScores, setWordScores] = useState<{ word: string; score: number }[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ttsInput, setTtsInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const utteranceRefTTS = useRef<SpeechSynthesisUtterance | null>(null);
  const shouldProcessOnEnd = useRef(false);

  const reset = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.onerror = null;
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

  useEffect(() => {
    reset();
  }, [text, reset]);
  
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!isListening && shouldProcessOnEnd.current) {
      const result = finalTranscript.trim();
      if (result) {
        const calculatedScore = similarityPct(text, result);
        setScore(calculatedScore);

        const originalWordTokens = text.split(/\s+/).filter(Boolean);
        const spokenWordTokens = result.split(/\s+/).filter(Boolean);
      
        const calculatedWordScores = originalWordTokens.map((originalToken, index) => {
            const spokenToken = spokenWordTokens[index] || '';
            const cleanOriginal = originalToken.toLowerCase().replace(/[.,]/g, '');
            const cleanSpoken = spokenToken.toLowerCase().replace(/[.,]/g, '');
            return { word: originalToken, score: similarityPct(cleanOriginal, cleanSpoken) };
        });
        setWordScores(calculatedWordScores);

        const incorrectWords = calculatedWordScores.filter(ws => ws.score < 75).map(ws => ws.word.toLowerCase().replace(/[.,]/g, ''));
        
        onSessionComplete({ score: calculatedScore, wordScores: calculatedWordScores, incorrectWords: [...new Set(incorrectWords)] });
      }
      shouldProcessOnEnd.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, finalTranscript]);

  const handleSpeak = useCallback(() => {
    if (typeof window.speechSynthesis === 'undefined' || !ttsInput.trim()) {
        return;
    }

    if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        utteranceRefTTS.current = null;
        return;
    }
    
    // Always cancel any previous speech before starting a new one.
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(ttsInput);
    utterance.lang = 'en-US';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRefTTS.current = null;
    };
    utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
        if (e.error !== 'interrupted') {
            console.error("Speech synthesis error:", e.error);
        }
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
        setError("Speech recognition is not supported in this browser.");
        return;
      }
      
      reset();
      
      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                  final += event.results[i][0].transcript;
              } else {
                  interimTranscript += event.results[i][0].transcript;
              }
          }
          setTranscript(interimTranscript);
          if(final.trim()) {
            setFinalTranscript(prev => (prev ? prev + ' ' : '') + final.trim());
          }
      };

      recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          if (event.error === 'not-allowed') {
            setError('Microphone access was denied. Please allow microphone access in your browser settings to use this feature.');
          } else if (event.error === 'no-speech') {
            setError("No speech was detected. Please make sure your microphone is working and try again.");
          } else {
            setError(`An error occurred: ${event.error}. Please try again.`);
          }
          setIsListening(false);
      };

      recognition.onend = () => {
          setIsListening(false);
      };
      
      recognition.start();
      setIsListening(true);
    }
  };
  
  const getColorForScore = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <div className="pb-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 m-0">Hear it First</h3>
          <p className="text-sm text-slate-500 m-0 mt-1">Type a word or sentence to hear how it's pronounced.</p>
          <div className="flex gap-2 mt-3">
              <div className="relative flex-grow">
                <input
                    type="text"
                    className="w-full px-3 py-2 pr-10 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-300 focus:border-teal-400 outline-none"
                    value={ttsInput}
                    onChange={e => setTtsInput(e.target.value)}
                    placeholder="e.g., The quick brown fox..."
                    aria-label="Text to pronounce"
                />
                {ttsInput && (
                  <button
                    type="button"
                    onClick={() => setTtsInput('')}
                    className="absolute right-0 top-0 h-full px-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Clear input"
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
              <button 
                  onClick={handleSpeak} 
                  disabled={!ttsInput.trim()} 
                  className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition flex items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                  <SpeakerIcon />
                  <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
              </button>
          </div>
      </div>

      <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 m-0">Pronunciation Practice</h2>
            <p className="text-sm text-slate-500 m-0">Click the mic and read the text below aloud.</p>
          </div>
        </div>
        <div className="p-5 bg-teal-50 rounded-lg text-xl sm:text-2xl leading-relaxed tracking-wide border-2 border-dashed border-slate-200">
          {wordScores ? (
            wordScores.map((scoreInfo, idx) => (
              <React.Fragment key={idx}>
                <span className={`rounded px-1 py-0.5 transition-colors duration-300 ${getColorForScore(scoreInfo.score)}`}>
                  {scoreInfo.word}
                </span>
                {idx < wordScores.length - 1 ? ' ' : ''}
              </React.Fragment>
            ))
          ) : (
            text
          )}
        </div>
        <div className="flex flex-wrap gap-4 mt-4 items-center min-h-[40px]">
          {error ? (
              <div className='w-full flex flex-col sm:flex-row items-center gap-4'>
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg w-full">
                      <strong className="font-semibold">Oops!</strong> {error}
                  </div>
                  <button onClick={handleListen} disabled={isSpeaking} className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition flex items-center gap-2 flex-shrink-0 disabled:bg-slate-400">
                      <RestartIcon />
                      <span>Try Again</span>
                  </button>
              </div>
          ) : (
            <>
              <button onClick={handleListen} disabled={!isSpeechRecognitionSupported || isSpeaking} className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition flex items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed">
                <MicIcon />
                <span>{isListening ? 'Stop & See Score' : 'Start Listening'}</span>
              </button>
              <button onClick={reset} disabled={isSpeaking} className="px-4 py-2 text-sm font-semibold text-white bg-slate-500 rounded-lg hover:bg-slate-600 transition flex items-center gap-2 disabled:bg-slate-400">
                <RestartIcon />
                <span>Reset</span>
              </button>
              {score !== null && (
                  <div className="w-full sm:w-auto sm:ml-auto text-center sm:text-right">
                      <div className="text-sm text-slate-500">Overall Score</div>
                      <div className={`text-2xl font-bold ${score > 80 ? 'text-green-600' : 'text-slate-700'}`}>{score}%</div>
                  </div>
              )}
            </>
          )}
        </div>
        {!error && (transcript || finalTranscript) && (
          <div className="mt-4 p-4 bg-white border border-slate-200 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-600 m-0 mb-1">What I heard:</h4>
              <p className="text-slate-700 m-0">
                {finalTranscript}
                <span className="text-slate-400">{transcript}</span>
              </p>
          </div>
        )}
        {!isSpeechRecognitionSupported && !error &&(
            <div className="mt-4 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg">
                Speech recognition is not supported in your browser. Please try Chrome or Safari for this feature.
            </div>
        )}
      </div>
    </Card>
  );
};

export default PronouncePractice;