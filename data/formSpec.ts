// The Google Form version of the quiz, derived from `questions.ts` so the two never drift.
// Used by scripts/build-form-script.ts (creates the form) and scripts/sync-form.ts (reads its field IDs).

import { IMPORTANCE_LEVELS, questions, type Question } from './questions';

export const FORM_TITLE = 'Acquaint Compatibility Test (app)';
export const FORM_DESCRIPTION = 'Responses submitted from the acquaint app. You can also fill it in directly.';

export type FormItem =
  | { type: 'page'; title: string }
  | {
      /** Key the app uses for this answer: a question id, a group item id, `${id}__importance`, or `contact`. */
      key: string;
      type: 'short' | 'paragraph' | 'choice' | 'checkbox' | 'scale';
      title: string;
      help?: string;
      choices?: string[];
      other?: boolean;
      min?: string;
      max?: string;
      required: boolean;
    };

export const importanceKey = (id: string) => `${id}__importance`;

function itemsFor(q: Question): FormItem[] {
  const help = 'hint' in q ? q.hint : undefined;
  const base: FormItem[] = [];
  switch (q.kind) {
    case 'text':
      base.push({ key: q.id, type: q.multiline ? 'paragraph' : 'short', title: q.prompt, help, required: true });
      break;
    case 'single':
      base.push({ key: q.id, type: 'choice', title: q.prompt, help, choices: q.options, other: q.allowOther, required: true });
      break;
    case 'location':
      base.push({ key: q.id, type: 'choice', title: q.prompt, help, choices: q.options, required: true });
      break;
    case 'multi':
      base.push({ key: q.id, type: 'checkbox', title: q.prompt, help, choices: q.options, required: true });
      break;
    case 'scale':
      base.push({ key: q.id, type: 'scale', title: q.prompt, help, min: q.minLabel, max: q.maxLabel, required: true });
      break;
    case 'group':
      q.items.forEach((item, i) =>
        base.push({ key: item.id, type: 'choice', title: item.label, help: i === 0 ? help : undefined, choices: item.options, required: true }),
      );
      break;
  }
  if (q.importance)
    base.push({
      key: importanceKey(q.id),
      type: 'choice',
      title: `How important is this to you? (${q.prompt})`,
      choices: [...IMPORTANCE_LEVELS],
      // Skipped for answers like "No Preference", so it can't be required.
      required: false,
    });
  return base;
}

export function formItems(): FormItem[] {
  const items: FormItem[] = [
    { key: 'contact', type: 'short', title: 'Email or phone number', help: 'From the sign-up screen.', required: true },
  ];
  let section: string | undefined;
  for (const q of questions) {
    if (q.section !== section) {
      section = q.section;
      items.push({ type: 'page', title: section });
    }
    items.push(...itemsFor(q));
  }
  return items;
}
