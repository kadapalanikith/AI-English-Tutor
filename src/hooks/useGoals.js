import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

/** @type {import('../types').Goal[]} */
const initialGoals = [
  { id: 'type50', label: 'Type 50 characters today', target: 50, progress: 0, done: false },
  { id: 'pron10', label: 'Pronounce 10 words',        target: 10, progress: 0, done: false },
];

export function useGoals() {
  const [goals, setGoals] = useLocalStorage('eec_goals', initialGoals);

  const incrementGoal = useCallback((id, amount = 1) => {
    setGoals((gs) =>
      gs.map((g) =>
        g.id === id
          ? { ...g, progress: Math.min(g.target, g.progress + amount), done: g.progress + amount >= g.target }
          : g,
      ),
    );
  }, [setGoals]);

  const resetDailyGoals = useCallback(() => {
    setGoals((gs) => gs.map((g) => ({ ...g, progress: 0, done: false })));
  }, [setGoals]);

  return { goals, incrementGoal, resetDailyGoals };
}
