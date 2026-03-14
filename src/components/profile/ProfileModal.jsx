import { useMemo } from 'react';
import Card from '../ui/Card';
import { CloseIcon } from '../ui/Icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * @param {{
 *   isOpen: boolean; onClose: () => void;
 *   streak: import('../../types').Streak;
 *   records: import('../../types').PracticeRecord[];
 *   goals: import('../../types').Goal[];
 *   lang: string; setLang: (l: string) => void;
 *   completionPercentage: number;
 *   userName: string; setUserName: (n: string) => void;
 *   englishLevel: string; setEnglishLevel: (l: string) => void;
 * }} props
 */
const ProfileModal = ({
  isOpen,
  onClose,
  streak,
  records,
  goals,
  lang,
  setLang,
  completionPercentage,
  userName,
  setUserName,
  englishLevel,
  setEnglishLevel,
}) => {
  const chartData = useMemo(() => {
    const typingRecords = records.filter((r) => r.type === 'typing');
    return typingRecords.map((r, i) => ({
      name: `T${i + 1}`,
      wpm: r.wpm,
      accuracy: r.accuracy,
    }));
  }, [records]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex justify-center items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="User profile"
    >
      <div
        className="bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Welcome back,</p>
            <input
              id="profile-name-input"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="text-3xl font-bold text-slate-800 bg-transparent focus:bg-slate-100 rounded-lg p-2 -ml-2 w-full outline-none transition-colors focus:ring-2 focus:ring-brand-300"
              aria-label="Your name"
            />
          </div>
          <button
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg mt-1"
            onClick={onClose}
            aria-label="Close profile"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Streak + Goal progress */}
        <Card className="mb-6">
          <div className="flex justify-around items-center text-center">
            <div>
              <div className="text-4xl font-extrabold text-brand-600">{streak?.count || 0}</div>
              <div className="text-sm text-slate-500 mt-1">🔥 Day Streak</div>
            </div>
            <div className="h-16 w-px bg-slate-200" />
            <div className="w-1/2">
              <div className="text-sm text-slate-500 mb-2">Daily Goal Progress</div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-brand-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                  role="progressbar"
                  aria-valuenow={completionPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <div className="text-xs text-slate-400 mt-1">{completionPercentage}% complete</div>
            </div>
          </div>
        </Card>

        {/* Daily goals */}
        {goals.length > 0 && (
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-700 mb-3">Today&apos;s Goals</h3>
            <div className="space-y-2">
              {goals.map((g) => (
                <div key={g.id} className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${g.done ? 'border-brand-500 bg-brand-500' : 'border-slate-300'}`}
                  >
                    {g.done && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className={g.done ? 'text-brand-700 font-medium' : 'text-slate-600'}>
                        {g.label}
                      </span>
                      <span className="text-slate-400">
                        {g.progress}/{g.target}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-brand-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (g.progress / g.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance charts */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-700 mb-3">Performance Trends</h3>
          <Card className="h-72">
            <div className="text-sm font-medium text-slate-500 mb-4">WPM & Accuracy History</div>
            {chartData.length > 0 ? (
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#64748B' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 12, fill: '#64748B' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 12, fill: '#64748B' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="wpm"
                      stroke="#2563EB"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="WPM"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Accuracy %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400">
                Complete a typing session to see your stats!
              </div>
            )}
          </Card>
        </div>

        {/* Settings */}
        <div>
          <h3 className="text-base font-bold text-slate-700 mb-3">Settings</h3>
          <Card>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="text-sm font-medium text-slate-600 block mb-1"
                  htmlFor="english-level-select"
                >
                  English Level
                </label>
                <select
                  id="english-level-select"
                  value={englishLevel}
                  onChange={(e) => setEnglishLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-brand-300 focus:border-brand-400 outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label
                  className="text-sm font-medium text-slate-600 block mb-1"
                  htmlFor="native-lang-select"
                >
                  Native Language
                </label>
                <select
                  id="native-lang-select"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-brand-300 focus:border-brand-400 outline-none"
                >
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
