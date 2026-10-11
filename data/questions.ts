// Questions from the "Acquaint Compatibility Test" Google Form.
// Edit freely: each question renders based on its `kind`.
// `importance: true` asks "How important is this?" after the answer; skip it for answers in `importanceSkip`.

import { AREAS, BUDGETS, DATE_TYPES, NEEDS, SLOTS } from './places';

export type Section = 'Preferences' | 'Compatibility' | 'Non-negotiables' | 'Dates';

type Base = {
  id: string;
  section: Section;
  prompt: string;
  importance?: boolean;
  importanceSkip?: string[];
};

export type TextQuestion = Base & {
  kind: 'text';
  multiline?: boolean;
  keyboard?: 'default' | 'number-pad';
  placeholder?: string;
};
export type SingleQuestion = Base & { kind: 'single'; options: string[]; allowOther?: boolean };
/** `exclusive` is an option like "None of these" that clears the others when picked. */
export type MultiQuestion = Base & { kind: 'multi'; options: string[]; hint?: string; exclusive?: string };
export type ScaleQuestion = Base & { kind: 'scale'; minLabel: string; maxLabel: string };

export type Question = TextQuestion | SingleQuestion | MultiQuestion | ScaleQuestion;

export const OTHER = 'Other';

export const IMPORTANCE_LEVELS = ['Not very', 'Somewhat', 'Very'] as const;
export type Importance = 1 | 2 | 3;

export function needsImportance(q: Question, answer: unknown) {
  return !!q.importance && !(typeof answer === 'string' && q.importanceSkip?.includes(answer));
}

const careerStages = ['Student', 'Employed', 'Unemployed', 'Retired'];

const heights = [
  "5'0 or Less", "5'1", "5'2", "5'3", "5'4", "5'5", "5'6", "5'7",
  "5'8", "5'9", "5'10", "5'11", "6'0", "6'1", "6'2", "6'3 or More",
];

export const questions: Question[] = [
  // Preferences
  { id: 'name', section: 'Preferences', kind: 'text', prompt: "What's your name?", placeholder: 'First name' },
  { id: 'gender', section: 'Preferences', kind: 'single', prompt: "What's your gender?", options: ['Male', 'Female'], allowOther: true },
  {
    id: 'lookingFor',
    section: 'Preferences',
    kind: 'multi',
    prompt: 'Who are you looking to meet on Acquaint?',
    hint: 'Check all that apply',
    options: [
      'Male Friend', 'Female Friend', 'Male Partner', 'Female Partner', 'Short-Term',
      'Casual', 'Long-Term', 'Serious', 'Physical', 'Non-Physical',
    ],
  },
  { id: 'age', section: 'Preferences', kind: 'text', prompt: 'What is your age?', keyboard: 'number-pad', placeholder: 'e.g. 27' },
  { id: 'ageRange', section: 'Preferences', kind: 'text', importance: true, prompt: 'What age range are you looking to meet?', placeholder: 'e.g. 24–32' },
  { id: 'height', section: 'Preferences', kind: 'text', prompt: 'What is your height?', placeholder: "e.g. 5'9" },
  { id: 'idealHeight', section: 'Preferences', kind: 'multi', importance: true, prompt: 'What is your ideal height in a partner?', hint: 'Check all that apply', options: heights },
  { id: 'career', section: 'Preferences', kind: 'single', prompt: 'What career stage are you in?', options: careerStages, allowOther: true },
  {
    id: 'partnerCareer',
    section: 'Preferences',
    kind: 'single',
    prompt: 'In what career stage do you want the people you meet to be?',
    options: [...careerStages, 'No Preference'],
    allowOther: true,
    importance: true,
    importanceSkip: ['No Preference'],
  },
  { id: 'income', section: 'Preferences', kind: 'text', prompt: 'What is your approximate monthly income?', keyboard: 'number-pad', placeholder: 'e.g. 4000' },
  { id: 'partnerIncome', section: 'Preferences', kind: 'text', importance: true, prompt: 'What is the ideal monthly income of your partner?', placeholder: 'e.g. 3000 or more' },

  // Compatibility
  { id: 'valuedTraits', section: 'Compatibility', kind: 'text', importance: true, prompt: 'What traits do you value in a person or partner?', placeholder: 'Kindness, curiosity…' },
  { id: 'ownTraits', section: 'Compatibility', kind: 'text', multiline: true, prompt: 'Describe some of your own traits.', placeholder: 'A few words or a few sentences' },
  { id: 'goingOut', section: 'Compatibility', kind: 'scale', importance: true, prompt: 'What is your preference between going out or staying in?', minLabel: 'Strongly prefer going out', maxLabel: 'Strongly prefer staying in' },
  { id: 'redFlags', section: 'Compatibility', kind: 'text', multiline: true, prompt: 'What are some red flags in a person?', placeholder: 'Be honest' },
  { id: 'ownRedFlag', section: 'Compatibility', kind: 'text', prompt: "What's a red flag that you have?", placeholder: 'We all have one' },
  { id: 'movie', section: 'Compatibility', kind: 'text', prompt: "What's your favorite movie?", placeholder: 'Just one' },
  { id: 'petPeeve', section: 'Compatibility', kind: 'text', multiline: true, prompt: "What's a pet peeve that you have?", placeholder: 'Loud chewing, slow walkers…' },
  { id: 'familyFriends', section: 'Compatibility', kind: 'scale', importance: true, prompt: 'Do you prefer spending time with family or friends?', minLabel: 'Family', maxLabel: 'Friends' },

  // Non-negotiables: hard filters, never traded off against other answers
  {
    id: 'dealBreakers',
    section: 'Non-negotiables',
    kind: 'multi',
    prompt: 'Which of these are deal-breakers for you?',
    hint: "We'll never match you with someone who has these",
    options: [
      'Smokes', 'Drinks heavily', 'Uses drugs', 'Has kids', 'Wants kids', "Doesn't want kids",
      'Lives far away', 'Has pets', 'None of these',
    ],
    exclusive: 'None of these',
  },
  { id: 'nonNegotiables', section: 'Non-negotiables', kind: 'text', multiline: true, prompt: 'Are there any non-negotiables you wish to identify?', placeholder: 'Anything else we should never match you with. Write "none" if not.' },

  // Dates: what the planner needs to book a first date you'll both enjoy
  { id: 'area', section: 'Dates', kind: 'single', prompt: 'Which part of San Francisco are you in?', options: [...AREAS] },
  { id: 'dateTypes', section: 'Dates', kind: 'multi', prompt: 'What kinds of dates do you enjoy?', hint: 'Check all that apply', options: [...DATE_TYPES] },
  {
    id: 'availability',
    section: 'Dates',
    kind: 'multi',
    prompt: 'When are you usually free for a date?',
    hint: "Pick every time that works. We only book times you're both free.",
    options: SLOTS.map((s) => s.label),
  },
  { id: 'budget', section: 'Dates', kind: 'single', prompt: "What's your budget for a first date?", options: [...BUDGETS] },
  {
    id: 'needs',
    section: 'Dates',
    kind: 'multi',
    prompt: 'Anything we should plan around?',
    hint: 'Check all that apply',
    options: [...NEEDS, 'Nothing specific'],
    exclusive: 'Nothing specific',
  },
];
