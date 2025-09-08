
import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { PracticeRecord, Streak } from '../types';
import { useGoals } from './useGoals';

export function useProgress(goalsManager: ReturnType<typeof useGoals>) {
  const [records, setRecords] = useLocalStorage<PracticeRecord[]>('eec_records', []);
  const [streak, setStreak] = useLocalStorage<Streak>('eec_streak', { count: 0, last: 0 });

  const addRecord = useCallback((record: PracticeRecord) => {
    setRecords(r => [...r, record].slice(-100));
    
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    if (!streak || !streak.last) {
      setStreak({ count: 1, last: Date.now() });
      goalsManager.resetDailyGoals();
      return;
    }

    const lastDate = new Date(streak.last);
    lastDate.setHours(0, 0, 0, 0);
    const diffDays = Math.round((todayStart.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000));

    if (diffDays >= 1) {
      goalsManager.resetDailyGoals();
      if (diffDays === 1) {
        setStreak(s => ({ count: (s.count || 0) + 1, last: Date.now() }));
      } else {
        setStreak({ count: 1, last: Date.now() });
      }
    }
  }, [streak, setRecords, setStreak, goalsManager]);

  return { records, addRecord, streak };
}
