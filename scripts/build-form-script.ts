// Writes tools/create-acquaint-form.gs: a Google Apps Script that creates the Google Form
// (and its responses spreadsheet) with every quiz question. Run: npm run form:script

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { FORM_DESCRIPTION, FORM_TITLE, formItems } from '../data/formSpec';

const spec = { title: FORM_TITLE, description: FORM_DESCRIPTION, items: formItems() };

const script = `// acquaint: creates the Google Form the app submits to.
// 1. Go to https://script.google.com and click "New project".
// 2. Replace everything in the editor with this file, then click Run (createAcquaintForm).
// 3. Approve the permissions. The log at the bottom prints the form and spreadsheet links.
// Generated from data/questions.ts by \`npm run form:script\`. Don't edit by hand.

const SPEC = ${JSON.stringify(spec, null, 2)};

function createAcquaintForm() {
  const form = FormApp.create(SPEC.title);
  form.setDescription(SPEC.description);
  form.setCollectEmail(false);
  form.setAllowResponseEdits(false);
  form.setProgressBar(true);
  // Workspace accounts default to sign-in only; the app submits anonymously.
  try { form.setRequireLogin(false); } catch (e) {}

  for (const it of SPEC.items) {
    if (it.type === 'page') {
      form.addPageBreakItem().setTitle(it.title);
      continue;
    }
    let item;
    if (it.type === 'short') item = form.addTextItem();
    else if (it.type === 'paragraph') item = form.addParagraphTextItem();
    else if (it.type === 'choice') {
      item = form.addMultipleChoiceItem().setChoiceValues(it.choices);
      if (it.other) item.showOtherOption(true);
    } else if (it.type === 'checkbox') item = form.addCheckboxItem().setChoiceValues(it.choices);
    else if (it.type === 'scale') item = form.addScaleItem().setBounds(1, 5).setLabels(it.min, it.max);
    item.setTitle(it.title).setRequired(it.required);
    if (it.help) item.setHelpText(it.help);
  }

  const sheet = SpreadsheetApp.create(SPEC.title + ' (Responses)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  try { form.setPublished(true); } catch (e) {}
  form.setAcceptingResponses(true);

  Logger.log('Form link (send this to Claude): ' + form.getPublishedUrl());
  Logger.log('Edit the form: ' + form.getEditUrl());
  Logger.log('Responses spreadsheet: ' + sheet.getUrl());
}
`;

const out = join(__dirname, '..', 'tools', 'create-acquaint-form.gs');
mkdirSync(join(__dirname, '..', 'tools'), { recursive: true });
writeFileSync(out, script);
console.log(`Wrote ${out} (${spec.items.filter((i) => i.type !== 'page').length} questions)`);
