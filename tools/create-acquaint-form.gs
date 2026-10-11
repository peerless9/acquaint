// acquaint: creates the Google Form the app submits to.
// 1. Go to https://script.google.com and click "New project".
// 2. Replace everything in the editor with this file, then click Run (createAcquaintForm).
// 3. Approve the permissions. The log at the bottom prints the form and spreadsheet links.
// Generated from data/questions.ts by `npm run form:script`. Don't edit by hand.

const SPEC = {
  "title": "Acquaint Compatibility Test (app)",
  "description": "Responses submitted from the acquaint app. You can also fill it in directly.",
  "items": [
    {
      "key": "contact",
      "type": "short",
      "title": "Email or phone number",
      "help": "From the sign-up screen.",
      "required": true
    },
    {
      "type": "page",
      "title": "Preferences"
    },
    {
      "key": "name",
      "type": "short",
      "title": "What's your name?",
      "required": true
    },
    {
      "key": "gender",
      "type": "choice",
      "title": "What's your gender?",
      "choices": [
        "Male",
        "Female"
      ],
      "other": true,
      "required": true
    },
    {
      "key": "lookingFor",
      "type": "checkbox",
      "title": "Who are you looking to meet on Acquaint?",
      "help": "Check all that apply",
      "choices": [
        "Male Friend",
        "Female Friend",
        "Male Partner",
        "Female Partner",
        "Short-Term",
        "Casual",
        "Long-Term",
        "Serious",
        "Physical",
        "Non-Physical"
      ],
      "required": true
    },
    {
      "key": "age",
      "type": "short",
      "title": "What is your age?",
      "required": true
    },
    {
      "key": "ageRange",
      "type": "short",
      "title": "What age range are you looking to meet?",
      "required": true
    },
    {
      "key": "ageRange__importance",
      "type": "choice",
      "title": "How important is this to you? (What age range are you looking to meet?)",
      "choices": [
        "Not very",
        "Somewhat",
        "Very"
      ],
      "required": false
    },
    {
      "key": "height",
      "type": "short",
      "title": "What is your height?",
      "required": true
    },
    {
      "key": "area",
      "type": "choice",
      "title": "Where are you based?",
      "help": "acquaint is in San Francisco for now. We use this to find matches and venues near you.",
      "choices": [
        "Mission",
        "SoMa",
        "Marina",
        "Richmond",
        "Sunset",
        "Noe Valley"
      ],
      "required": true
    },
    {
      "key": "idealHeight",
      "type": "checkbox",
      "title": "What is your ideal height in a partner?",
      "help": "Check all that apply",
      "choices": [
        "5'0 or Less",
        "5'1",
        "5'2",
        "5'3",
        "5'4",
        "5'5",
        "5'6",
        "5'7",
        "5'8",
        "5'9",
        "5'10",
        "5'11",
        "6'0",
        "6'1",
        "6'2",
        "6'3 or More"
      ],
      "required": true
    },
    {
      "key": "idealHeight__importance",
      "type": "choice",
      "title": "How important is this to you? (What is your ideal height in a partner?)",
      "choices": [
        "Not very",
        "Somewhat",
        "Very"
      ],
      "required": false
    },
    {
      "key": "career",
      "type": "choice",
      "title": "What career stage are you in?",
      "choices": [
        "Student",
        "Employed",
        "Unemployed",
        "Retired"
      ],
      "other": true,
      "required": true
    },
    {
      "key": "partnerCareer",
      "type": "choice",
      "title": "In what career stage do you want the people you meet to be?",
      "choices": [
        "Student",
        "Employed",
        "Unemployed",
        "Retired",
        "No Preference"
      ],
      "other": true,
      "required": true
    },
    {
      "key": "partnerCareer__importance",
      "type": "choice",
      "title": "How important is this to you? (In what career stage do you want the people you meet to be?)",
      "choices": [
        "Not very",
        "Somewhat",
        "Very"
      ],
      "required": false
    },
    {
      "key": "income",
      "type": "short",
      "title": "What is your approximate monthly income?",
      "required": true
    },
    {
      "key": "partnerIncome",
      "type": "short",
      "title": "What is the ideal monthly income of your partner?",
      "required": true
    },
    {
      "key": "partnerIncome__importance",
      "type": "choice",
      "title": "How important is this to you? (What is the ideal monthly income of your partner?)",
      "choices": [
        "Not very",
        "Somewhat",
        "Very"
      ],
      "required": false
    },
    {
      "type": "page",
      "title": "Compatibility"
    },
    {
      "key": "valuedTraits",
      "type": "short",
      "title": "What traits do you value in a person or partner?",
      "required": true
    },
    {
      "key": "valuedTraits__importance",
      "type": "choice",
      "title": "How important is this to you? (What traits do you value in a person or partner?)",
      "choices": [
        "Not very",
        "Somewhat",
        "Very"
      ],
      "required": false
    },
    {
      "key": "ownTraits",
      "type": "paragraph",
      "title": "Describe some of your own traits.",
      "required": true
    },
    {
      "key": "goingOut",
      "type": "scale",
      "title": "What is your preference between going out or staying in?",
      "min": "Strongly prefer going out",
      "max": "Strongly prefer staying in",
      "required": true
    },
    {
      "key": "goingOut__importance",
      "type": "choice",
      "title": "How important is this to you? (What is your preference between going out or staying in?)",
      "choices": [
        "Not very",
        "Somewhat",
        "Very"
      ],
      "required": false
    },
    {
      "key": "redFlags",
      "type": "paragraph",
      "title": "What are some red flags in a person?",
      "required": true
    },
    {
      "key": "ownRedFlag",
      "type": "short",
      "title": "What's a red flag that you have?",
      "required": true
    },
    {
      "key": "movie",
      "type": "short",
      "title": "What's your favorite movie?",
      "required": true
    },
    {
      "key": "petPeeve",
      "type": "paragraph",
      "title": "What's a pet peeve that you have?",
      "required": true
    },
    {
      "key": "familyFriends",
      "type": "scale",
      "title": "Do you prefer spending time with family or friends?",
      "min": "Family",
      "max": "Friends",
      "required": true
    },
    {
      "key": "familyFriends__importance",
      "type": "choice",
      "title": "How important is this to you? (Do you prefer spending time with family or friends?)",
      "choices": [
        "Not very",
        "Somewhat",
        "Very"
      ],
      "required": false
    },
    {
      "type": "page",
      "title": "Non-negotiables"
    },
    {
      "key": "smoking",
      "type": "choice",
      "title": "Do you smoke?",
      "help": "Your matches have deal-breakers too, so we check both ways.",
      "choices": [
        "Yes",
        "Sometimes",
        "No"
      ],
      "required": true
    },
    {
      "key": "drinking",
      "type": "choice",
      "title": "How often do you drink?",
      "choices": [
        "Never",
        "Socially",
        "Often"
      ],
      "required": true
    },
    {
      "key": "drugs",
      "type": "choice",
      "title": "Do you use recreational drugs?",
      "choices": [
        "Never",
        "Sometimes",
        "Often"
      ],
      "required": true
    },
    {
      "key": "hasKids",
      "type": "choice",
      "title": "Do you have kids?",
      "choices": [
        "Yes",
        "No"
      ],
      "required": true
    },
    {
      "key": "wantsKids",
      "type": "choice",
      "title": "Do you want kids someday?",
      "choices": [
        "Yes",
        "No",
        "Not sure"
      ],
      "required": true
    },
    {
      "key": "pets",
      "type": "choice",
      "title": "Do you have pets?",
      "choices": [
        "Yes",
        "No"
      ],
      "required": true
    },
    {
      "key": "dealBreakers",
      "type": "checkbox",
      "title": "Which of these are deal-breakers for you?",
      "help": "We'll never match you with these. \"Lives far away\" means beyond the travel time you set later.",
      "choices": [
        "Smokes",
        "Drinks heavily",
        "Uses drugs",
        "Has kids",
        "Wants kids",
        "Doesn't want kids",
        "Lives far away",
        "Has pets",
        "None of these"
      ],
      "required": true
    },
    {
      "key": "nonNegotiables",
      "type": "paragraph",
      "title": "Are there any non-negotiables you wish to identify?",
      "required": true
    },
    {
      "type": "page",
      "title": "Dates"
    },
    {
      "key": "travel",
      "type": "choice",
      "title": "How long are you willing to travel for a date?",
      "choices": [
        "Up to 15 minutes",
        "Up to 20 minutes",
        "Up to 30 minutes",
        "Any distance"
      ],
      "required": true
    },
    {
      "key": "dateTypes",
      "type": "checkbox",
      "title": "What kinds of dates do you enjoy?",
      "help": "Check all that apply",
      "choices": [
        "Coffee",
        "Drinks",
        "A meal out",
        "A walk outdoors",
        "Something active",
        "Museum or gallery",
        "Live music or a show"
      ],
      "required": true
    },
    {
      "key": "availability",
      "type": "checkbox",
      "title": "When are you usually free for a date?",
      "help": "Pick every time that works. We only book times you're both free.",
      "choices": [
        "Weekday mornings",
        "Weekday lunch",
        "Weekday evenings",
        "Weekend mornings",
        "Weekend afternoons",
        "Weekend evenings"
      ],
      "required": true
    },
    {
      "key": "budget",
      "type": "choice",
      "title": "What's your budget for a first date?",
      "choices": [
        "$ (under $20)",
        "$$ ($20–50)",
        "$$$ ($50+)"
      ],
      "required": true
    },
    {
      "key": "needs",
      "type": "checkbox",
      "title": "Anything we should plan around?",
      "help": "Check all that apply",
      "choices": [
        "Vegetarian",
        "Vegan",
        "Gluten-free",
        "Alcohol-free",
        "Step-free access",
        "Nothing specific"
      ],
      "required": true
    }
  ]
};

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
