import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { OTHER, type Importance, type Question } from './questions';

export type Answer = string | string[] | number;

/** Prototype only: the password is never stored, and nothing leaves the device. */
export type Account = { method: 'email' | 'phone'; contact: string };

type AppState = {
  account: Account | null;
  setAccount: (account: Account) => void;
  answers: Record<string, Answer>;
  otherText: Record<string, string>;
  setAnswer: (id: string, value: Answer) => void;
  setOtherText: (id: string, value: string) => void;
  importance: Record<string, Importance>;
  setImportance: (id: string, value: Importance) => void;
  selectedMatchId: string | null;
  setSelectedMatchId: (id: string | null) => void;
  /** ISO start of a rescheduled date; null means the soonest shared time. */
  chosenStart: string | null;
  setChosenStart: (iso: string | null) => void;
  calendarAdded: boolean;
  setCalendarAdded: (added: boolean) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [otherText, setOtherTexts] = useState<Record<string, string>>({});
  const [importance, setImportances] = useState<Record<string, Importance>>({});
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [calendarAdded, setCalendarAdded] = useState(false);
  const [chosenStart, setChosenStartState] = useState<string | null>(null);

  const value = useMemo<AppState>(
    () => ({
      account,
      setAccount,
      answers,
      otherText,
      setAnswer: (id, v) => setAnswers((prev) => ({ ...prev, [id]: v })),
      setOtherText: (id, v) => setOtherTexts((prev) => ({ ...prev, [id]: v })),
      importance,
      setImportance: (id, v) => setImportances((prev) => ({ ...prev, [id]: v })),
      selectedMatchId,
      setSelectedMatchId: (id) => {
        setSelectedMatchId(id);
        setChosenStartState(null);
        setCalendarAdded(false);
      },
      chosenStart,
      setChosenStart: (iso) => {
        setChosenStartState(iso);
        setCalendarAdded(false);
      },
      calendarAdded,
      setCalendarAdded,
    }),
    [account, answers, otherText, importance, selectedMatchId, chosenStart, calendarAdded],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}

export function isAnswered(q: Question, answers: Record<string, Answer>, otherText: Record<string, string>) {
  const answer = answers[q.id];
  switch (q.kind) {
    case 'group':
      return q.items.every((item) => typeof answers[item.id] === 'string');
    case 'text':
      return typeof answer === 'string' && answer.trim().length > 0;
    case 'single':
    case 'location':
      return typeof answer === 'string' && (answer !== OTHER || (otherText[q.id] ?? '').trim().length > 0);
    case 'multi':
      return Array.isArray(answer) && answer.length > 0;
    case 'scale':
      return typeof answer === 'number';
  }
}
