# acquaint.

A dating app with no swiping and no chat. You take a compatibility quiz, get three matches each week (photos only), pick one, and acquaint plans the date.

This is a hackathon prototype built with Expo (React Native), TypeScript and Expo Router. It uses local mock data and in-memory state only: no backend, no auth.

## Run it

Requirements: Node 20+ and the [Expo Go](https://expo.dev/go) app on your phone (SDK 57).

```bash
npm install
npx expo start
```

Scan the QR code with the iPhone Camera app (or the Expo Go app on Android). To use the iOS Simulator instead, press `i` in the terminal.

Other scripts:

```bash
npm run typecheck   # tsc --noEmit
npx expo-doctor     # dependency / config checks
```

## Flow

1. **Quiz** (`/quiz`): 20 questions from the Acquaint Compatibility Test, split into *Preferences* and *Compatibility*. Supports single choice (with an "Other" write-in), multi-select, short or long text, and 1–5 scales. Next stays disabled until the question is answered.
2. **Picks** (`/picks`): three photo cards. Tap one to select it (purple ring and check badge), tap again to deselect.
3. **Date** (`/date`): the chosen match, plus when, where and the plan. "Add to calendar" opens the system calendar sheet (`expo-calendar/legacy`, which works in Expo Go without a calendar permission). "Reschedule" goes back to Picks.

## Project structure

```
app/            Expo Router screens (_layout, index → /quiz, quiz, picks, date)
components/     UI building blocks (Wordmark, PrimaryButton, OptionCard, PhotoCard, …)
data/
  questions.ts  Quiz questions: edit these to change the quiz
  matches.ts    Mock matches and their generated date plans
  store.tsx     Shared in-memory state (answers, selected match)
theme.ts        Design tokens: colors, fonts, radii, sizes
```

## Editing the quiz

Each entry in `data/questions.ts` has a `kind`:

| kind     | renders as                                   | extra fields                         |
| -------- | -------------------------------------------- | ------------------------------------ |
| `text`   | text field                                   | `multiline`, `keyboard`, `placeholder` |
| `single` | radio cards                                  | `options`, `allowOther`              |
| `multi`  | checkbox cards (a chip grid above 8 options) | `options`, `hint`                    |
| `scale`  | 1–5 pills                                    | `minLabel`, `maxLabel`               |

## Design

Minimalist purple: background `#FAF8FF`, accent `#5A2FD6`. Headings use Bricolage Grotesque 700 and body text uses DM Sans. Icons are from lucide-react-native, and animations use react-native-reanimated. All tokens live in `theme.ts`.

Placeholder photos come from [pravatar.cc](https://pravatar.cc). Each card shows a lavender tint while its photo loads or if you're offline.
