import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * @param {ReturnType<import('./useGoals').useGoals>} goalsManager
 */
export function useProgress(goalsManager) {
  const [records, setRecords] = useLocalStorage('eec_records', []);
  const [streak, setStreak] = useLocalStorage('eec_streak', { count: 0, last: 0 });

  // Destructure stable function refs to avoid adding the whole goalsManager
  // object as a dep (it's recreated on every render, causing infinite loops).
  const { resetDailyGoals } = goalsManager;

  const addRecord = useCallback(
    (record) => {
      setRecords((r) => [...r, record].slice(-100));

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      if (!streak || !streak.last) {
        setStreak({ count: 1, last: Date.now() });
        resetDailyGoals();
        return;
      }

      const lastDate = new Date(streak.last);
      lastDate.setHours(0, 0, 0, 0);
      const diffDays = Math.round(
        (todayStart.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000),
      );

      if (diffDays >= 1) {
        resetDailyGoals();
        if (diffDays === 1) {
          setStreak((s) => ({ count: (s.count || 0) + 1, last: Date.now() }));
        } else {
          setStreak({ count: 1, last: Date.now() });
        }
      }
    },
    [streak, setRecords, setStreak, resetDailyGoals],
  );

  return { records, addRecord, streak };
}
