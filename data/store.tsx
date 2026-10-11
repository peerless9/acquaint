import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { OTHER, type Question } from './questions';

export type Answer = string | string[] | number;

type AppState = {
  answers: Record<string, Answer>;
  otherText: Record<string, string>;
  setAnswer: (id: string, value: Answer) => void;
  setOtherText: (id: string, value: string) => void;
  selectedMatchId: string | null;
  setSelectedMatchId: (id: string | null) => void;
  calendarAdded: boolean;
  setCalendarAdded: (added: boolean) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [otherText, setOtherTexts] = useState<Record<string, string>>({});
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [calendarAdded, setCalendarAdded] = useState(false);

  const value = useMemo<AppState>(
    () => ({
      answers,
      otherText,
      setAnswer: (id, v) => setAnswers((prev) => ({ ...prev, [id]: v })),
      setOtherText: (id, v) => setOtherTexts((prev) => ({ ...prev, [id]: v })),
      selectedMatchId,
      setSelectedMatchId: (id) => {
        setSelectedMatchId(id);
        setCalendarAdded(false);
      },
      calendarAdded,
      setCalendarAdded,
    }),
    [answers, otherText, selectedMatchId, calendarAdded],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}

export function isAnswered(q: Question, answer: Answer | undefined, other = '') {
  if (answer === undefined) return false;
  switch (q.kind) {
    case 'text':
      return typeof answer === 'string' && answer.trim().length > 0;
    case 'single':
      return answer !== OTHER || other.trim().length > 0;
    case 'multi':
      return Array.isArray(answer) && answer.length > 0;
    case 'scale':
      return typeof answer === 'number';
  }
}
