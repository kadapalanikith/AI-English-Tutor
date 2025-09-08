
import React, { useState, useRef, useEffect } from 'react';
import { Story, Language, Dictionary } from '../../types';
import { tokenizeWithSpaces } from '../../lib/utils';
import Card from '../common/Card';
import WordPopup from './WordPopup';
import { PlayIcon, PauseIcon, StopIcon, RestartIcon } from '../common/Icons';

interface LearnSectionProps {
  story: Story;
  lang: Language;
  dictionary: Dictionary;
  fetchNewStory: () => void;
  isLoading: boolean;
  loadingProgress: number;
}

const LearnSection: React.FC<LearnSectionProps> = ({ story, lang, dictionary, fetchNewStory, isLoading, loadingProgress }) => {
    
    const [speechStatus, setSpeechStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        // When story changes, stop any speech and reset the state.
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        setSpeechStatus('idle');
        utteranceRef.current = null;
    }, [story.id]);

    const handlePlayPauseResume = () => {
        if (typeof window.speechSynthesis === 'undefined') {
            console.error("Speech synthesis not supported.");
            return;
        }

        if (speechStatus === 'playing') {
            window.speechSynthesis.pause();
            setSpeechStatus('paused');
        } else if (speechStatus === 'paused' && utteranceRef.current) {
            window.speechSynthesis.resume();
            setSpeechStatus('playing');
        } else if (speechStatus === 'idle') {
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
                utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
                    // "interrupted" is expected when we cancel speech, so don't log it as an error.
                    if (e.error !== 'interrupted') {
                        console.error("Speech synthesis error:", e.error);
                    }
                    setSpeechStatus('idle');
                    utteranceRef.current = null;
                };
                utteranceRef.current = utterance;
                window.speechSynthesis.speak(utterance);
            } catch(e) {
                console.error("Failed to start speech synthesis", e);
                setSpeechStatus('idle');
                utteranceRef.current = null;
            }
        }
    };

    const handleStop = () => {
        if (typeof window.speechSynthesis === 'undefined') return;
        window.speechSynthesis.cancel();
        setSpeechStatus('idle');
        utteranceRef.current = null;
    };
    
    return (
        <Card>
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 m-0">{story.title}</h2>
                    <p className="text-sm text-slate-500 m-0">Long-press a word for its meaning.</p>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                    <button 
                        className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
                        onClick={handlePlayPauseResume}
                        aria-label={speechStatus === 'playing' ? 'Pause narration' : speechStatus === 'paused' ? 'Resume narration' : 'Listen to story'}
                    >
                        {speechStatus === 'playing' ? <PauseIcon /> : <PlayIcon />}
                        <span>{speechStatus === 'playing' ? 'Pause' : speechStatus === 'paused' ? 'Resume' : 'Listen'}</span>
                    </button>
                    {(speechStatus === 'playing' || speechStatus === 'paused') && (
                        <button 
                            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-teal-50 hover:border-teal-200 transition flex items-center gap-2"
                            onClick={handleStop}
                            aria-label="Stop narration"
                        >
                            <StopIcon />
                            <span>Stop</span>
                        </button>
                    )}
                    <button className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition flex items-center gap-2 relative overflow-hidden disabled:bg-slate-400" onClick={fetchNewStory} disabled={isLoading}>
                       <RestartIcon />
                        <span>{isLoading ? 'Generating...' : 'New Story'}</span>
                         {isLoading && <div className="absolute bottom-0 left-0 h-1 bg-white/30" style={{width: `${loadingProgress}%`}}></div>}
                    </button>
                </div>
            </div>
            
            <div className="mt-4 text-xl sm:text-2xl leading-relaxed text-slate-700">
                 {tokenizeWithSpaces(story.text).map((token, idx) => (
                    token.trim() === '' ? <span key={idx}>{token}</span> : <WordPopup token={token} key={idx} lang={lang} dictionary={dictionary} />
                ))}
            </div>
            {story.translations && (
                <div className="mt-6 pt-4 border-t border-slate-200">
                    <h4 className="m-0 mb-2 font-semibold text-slate-800">Translation ({lang === 'hi' ? 'Hindi' : 'Telugu'})</h4>
                    <p className="m-0 text-slate-500 text-lg leading-relaxed">{story.translations[lang]}</p>
                </div>
            )}
        </Card>
    );
};

export default LearnSection;