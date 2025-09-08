import React from 'react';
import { Section } from '../../types';
import Card from '../common/Card';
import { HomeIcon } from '../common/Icons';

interface HelpScreenProps {
  setSection: (section: Section) => void;
}

const HelpScreen: React.FC<HelpScreenProps> = ({ setSection }) => {
    return (
        <div className="max-w-xl mx-auto mt-5 mb-5 animate-fade-in">
             <div className="mb-6">
                <button onClick={() => setSection('home')} className="flex items-center gap-2 text-slate-600 hover:text-teal-600 font-semibold transition-colors py-2 px-3 -ml-3 rounded-lg hover:bg-slate-100">
                    <HomeIcon />
                    <span>Back to Home</span>
                </button>
            </div>
            <Card>
                <h3 className="text-xl font-bold text-slate-800 m-0 mb-4">How to Use Your AI English Tutor</h3>
                <p className="text-slate-600 m-0 mb-4">Your personal guide to mastering English. Here's a quick tour of the features designed to help you succeed:</p>
                <div className="space-y-5">
                    <div>
                        <h4 className="font-bold text-slate-700 text-lg">📖 Learn Stories</h4>
                        <p className="text-slate-600 m-0 mt-1">
                            Read engaging stories generated just for you. Tap the <strong>'New Story'</strong> button for fresh content. Long-press any word to see its translation in your native language. Use the <strong>'Listen'</strong> button to hear the story narrated, helping you with listening comprehension.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-700 text-lg">⌨️ Practice Typing</h4>
                        <p className="text-slate-600 m-0 mt-1">
                            Hone your keyboard skills by typing out the stories. You'll get real-time feedback on your speed (WPM) and accuracy. After each session, you'll receive a <strong>personalized exercise</strong> if you struggled with certain words.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-700 text-lg">🔊 Practice Pronunciation</h4>
                         <p className="text-slate-600 m-0 mt-1">
                            <strong>Hear it First:</strong> Type any word or sentence to hear its correct pronunciation before you practice.
                            <br />
                            <strong>Practice Aloud:</strong> Click the microphone and read the story. Our AI will score your pronunciation and highlight words you can improve on.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-700 text-lg">🤖 Meet LiftBot</h4>
                        <p className="text-slate-600 m-0 mt-1">
                            Have a question? Click the <strong>chat icon</strong> in the bottom-right corner. LiftBot is your friendly AI assistant, ready to help with grammar, vocabulary, or how to use the app.
                        </p>
                    </div>
                     <div>
                        <h4 className="font-bold text-slate-700 text-lg">👤 Track Your Progress</h4>
                        <p className="text-slate-600 m-0 mt-1">
                            Click the <strong>profile icon</strong> in the top-right. Here you can set your name, change your English level, see your daily streak, and view charts of your performance over time.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default HelpScreen;
