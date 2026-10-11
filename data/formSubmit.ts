import { Platform } from 'react-native';

import { FORM_CONFIG } from './formConfig';
import { formItems, importanceKey } from './formSpec';
import { IMPORTANCE_LEVELS, OTHER, type Importance } from './questions';
import type { Answer } from './store';

export type FormConfig = {
  responseUrl: string;
  viewUrl: string;
  /** Every page index, so Google accepts a one-shot submission of a multi-section form. */
  pageHistory: string;
  /** App answer key → Google Form entry id. */
  entries: Record<string, number>;
};

export const isFormConnected = () => FORM_CONFIG !== null;

type Submission = {
  contact?: string;
  answers: Record<string, Answer>;
  otherText: Record<string, string>;
  importance: Record<string, Importance>;
};

/** Form-encoded body in the shape Google Forms' own page posts. */
export function buildFormBody(config: FormConfig, { contact, answers, otherText, importance }: Submission) {
  const body = new URLSearchParams();
  const put = (key: string, value: string) => {
    const id = config.entries[key];
    if (id !== undefined && value !== '') body.append(`entry.${id}`, value);
  };

  for (const item of formItems()) {
    if (item.type === 'page') continue;
    if (item.key === 'contact') {
      put('contact', contact ?? '');
      continue;
    }
    if (item.key.endsWith(importanceKey(''))) {
      const level = importance[item.key.slice(0, -importanceKey('').length)];
      if (level) put(item.key, IMPORTANCE_LEVELS[level - 1]);
      continue;
    }
    const a = answers[item.key];
    if (a === undefined) continue;
    if (Array.isArray(a)) a.forEach((v) => put(item.key, v));
    else if (a === OTHER && item.other) {
      put(item.key, '__other_option__');
      const id = config.entries[item.key];
      if (id !== undefined) body.append(`entry.${id}.other_option_response`, otherText[item.key] ?? '');
    } else put(item.key, String(a));
  }

  body.append('pageHistory', config.pageHistory);
  return body;
}

/**
 * Sends the quiz to the Google Form. Never throws: returns false when not connected or offline.
 * On web the browser hides Google's response (no-cors), so success there means "sent", not "confirmed".
 */
export async function submitToForm(submission: Submission) {
  if (!FORM_CONFIG) return false;
  try {
    const res = await fetch(FORM_CONFIG.responseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: buildFormBody(FORM_CONFIG, submission).toString(),
      ...(Platform.OS === 'web' ? { mode: 'no-cors' as const } : {}),
    });
    return Platform.OS === 'web' || res.ok;
  } catch {
    return false;
  }
}
