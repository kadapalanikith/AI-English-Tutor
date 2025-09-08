import React, { useMemo } from 'react';
import Card from '../common/Card';
import SparklineChart from './SparklineChart';
import { CloseIcon } from '../common/Icons';
import { Goal, Language, PracticeRecord, Streak } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: Streak;
  records: PracticeRecord[];
  goals: Goal[];
  lang: Language;
  setLang: (lang: Language) => void;
  completionPercentage: number;
  userName: string;
  setUserName: (name: string) => void;
  englishLevel: string;
  setEnglishLevel: (level: string) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, streak, records, goals, lang, setLang, completionPercentage, userName, setUserName, englishLevel, setEnglishLevel }) => {
    if (!isOpen) return null;

    const wpmSeries = useMemo(() => records.filter((r): r is Extract<PracticeRecord, { type: 'typing' }> => r.type === 'typing').map(r => r.wpm), [records]);
    const accSeries = useMemo(() => records.filter((r): r is Extract<PracticeRecord, { type: 'typing' }> => r.type === 'typing').map(r => r.accuracy), [records]);
    
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-slate-50 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Welcome back,</p>
                        <input 
                            value={userName} 
                            onChange={e => setUserName(e.target.value)} 
                            placeholder="Enter your name" 
                            className="text-3xl font-bold text-slate-800 bg-transparent focus:bg-slate-100 rounded-lg p-2 -ml-2 w-full outline-none transition-colors focus:ring-2 focus:ring-teal-300"
                            aria-label="User name"
                        />
                    </div>
                    <button className="text-slate-500 hover:text-teal-600" onClick={onClose} aria-label="Close profile">
                       <CloseIcon />
                    </button>
                </div>

                <Card className="mb-6">
                    <div className="flex justify-around items-center text-center">
                        <div>
                            <div className="text-3xl font-bold text-teal-600">{streak?.count || 0}</div>
                            <div className="text-sm text-slate-500">Day Streak</div>
                        </div>
                        <div className="h-16 w-px bg-slate-200"></div>
                        <div className="w-1/2">
                            <div className="text-sm text-slate-500 mb-2">Daily Goal Progress</div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                                <div className="bg-teal-600 h-2.5 rounded-full transition-all duration-500" style={{width: `${completionPercentage}%`}}></div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-700 mt-0 mb-3">Performance Trends</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <div className="text-sm font-medium text-slate-600 mb-2">WPM Trend (Last {wpmSeries.length})</div>
                            <SparklineChart values={wpmSeries} />
                        </Card>
                        <Card>
                            <div className="text-sm font-medium text-slate-600 mb-2">Accuracy Trend</div>
                            <SparklineChart values={accSeries} color="#10b981" />
                        </Card>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-slate-700 mt-0 mb-3">Settings</h3>
                    <Card>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-600 block mb-1">English Level</label>
                                <select value={englishLevel} onChange={e => setEnglishLevel(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-100 focus:ring-2 focus:ring-teal-300 focus:border-teal-400 outline-none">
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-600 block mb-1">Native Language</label>
                                <select value={lang} onChange={e => setLang(e.target.value as Language)} className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-100 focus:ring-2 focus:ring-teal-300 focus:border-teal-400 outline-none">
                                    <option value="hi">Hindi</option>
                                    <option value="te">Telugu</option>
                                </select>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;