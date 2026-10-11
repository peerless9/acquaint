import { useMemo } from 'react';

import { computeMatches, planDate } from './matching';
import { useAppState } from './store';

/** This week's matches for the current quiz answers. */
export function useMatches() {
  const { answers, importance } = useAppState();
  return useMemo(() => computeMatches({ answers, importance }), [answers, importance]);
}

/** The selected match, its planned date, and the other times you're both free. */
export function useSelectedDate() {
  const { answers, importance, selectedMatchId, chosenStart } = useAppState();
  const matches = useMatches();

  return useMemo(() => {
    const match = matches.find((m) => m.candidate.id === selectedMatchId);
    if (!match) return null;
    const time = match.times.find((t) => t.start.toISOString() === chosenStart) ?? match.times[0];
    const plan = planDate(match.candidate, { answers, importance }, time);
    return { match, plan };
  }, [matches, selectedMatchId, chosenStart, answers, importance]);
}
