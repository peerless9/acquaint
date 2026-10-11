# acquaint.

A dating app with no swiping and no chat. You take a compatibility quiz, get three matches each week (photos only), pick one, and acquaint plans the date.

**Try it in your browser: https://peerless9.github.io/acquaint/**. No install or account needed. It's best on a phone; on desktop it shows in a phone-width frame. Every push to `main` redeploys it automatically (see `.github/workflows/deploy-web.yml`).

This is a hackathon prototype built with Expo (React Native), TypeScript and Expo Router. It uses local mock data and in-memory state only: no backend, no auth.

## Run it

Requirements: Node 20+ and the [Expo Go](https://expo.dev/go) app on your phone (SDK 57).

```bash
npm install
npx expo start
```

Scan the QR code with the iPhone Camera app (or the Expo Go app on Android). To use the iOS Simulator instead, press `i` in the terminal.

**"You need to be signed in" on iPhone:** Expo Go on a physical iPhone only opens a dev server when Expo Go and the Expo CLI are signed in to the same Expo account. Create a free account at [expo.dev/signup](https://expo.dev/signup), run `npx expo login` on your computer, sign in to the same account in Expo Go (account icon, top right), then restart `npx expo start`. Android and the iOS Simulator don't need this. To share the app with people who don't have an account, send them the web link above.

On web, "Add to calendar" downloads an `.ics` file instead of opening the system calendar sheet.

Other scripts:

```bash
npm run typecheck   # tsc --noEmit
npx expo-doctor     # dependency / config checks
```

## Flow

1. **Sign up** (`/signup`, the first screen): email or phone number plus a password (at least 8 characters). There's no backend: only the email or phone is kept in memory, and the password is discarded.
2. **Quiz** (`/quiz`): 28 questions in four sections.
   - *Preferences* and *Compatibility*: the Acquaint Compatibility Test form, plus "Where are you based?". You can tap "Use my current location" to pick the nearest neighborhood or choose one yourself. Outside San Francisco, it asks you to pick the area you'd date in.
   - *Non-negotiables*: a few facts about you (smoking, drinking, drugs, kids, wanting kids, pets), a deal-breaker checklist, and the form's free-text question.
   - *Dates*: how long you'll travel for a date, the kinds of dates you like, when you're free, your budget, and dietary or access needs.

   Questions about what you want in a partner then ask "How important is this to you?" (Not very / Somewhat / Very). Next stays disabled until the answer, and its importance, are filled in.
3. **Picks** (`/picks`): your top 3 matches, shown as photos only. If nobody passes your non-negotiables, you get an empty state with a way back to your answers.
4. **Date** (`/date`): the match's photo next to your compatibility score, the top reasons you matched, and the planned date (when, where, what). "Add to calendar" opens the system calendar sheet in Expo Go and downloads an `.ics` file on web.
5. **Reschedule** (`/reschedule`): other upcoming times you're both free, each with the venue it would use. Confirm one to move the date, or go back and pick someone else.

## How matching works

`data/matching.ts` runs entirely on the device, against the mock pool in `data/candidates.ts`.

1. **Filters (hard):**
   - Who you're looking to meet, checked both ways.
   - Deal-breakers, also checked both ways: your list against each candidate, and each candidate's list against your "about you" answers. Facts you haven't given never count against you.
   - At least one shared free time.
   - At least one venue that both people can reach within their travel limits. "Lives far away" means their home is beyond your travel limit, and the same rule applies from their side.
2. **Score (0–100):** each answer is compared with the candidate (age range, height, career, income, traits, going out vs staying in, family vs friends, date types, budget, distance). Each comparison is weighted by the importance you gave it (Not very ×0.5, Somewhat ×1.5, Very ×4). The top 3 scores are this week's matches, and the strongest matching answers become the "reasons" chips.
3. **Plan:**
   - **Time:** the soonest time you're both free, at least 36 hours out.
   - **Activity:** something you both like that suits that time of day.
   - **Venue:** one that both people can reach within their travel limits, fits both budgets and every dietary or access need, and has the least combined travel. Venues are in `data/places.ts`.
   - **Travel time:** estimated from real neighborhood coordinates (about 8 minutes plus 3.5 minutes per mile) and shown on the Date screen.

## Project structure

```
app/              Expo Router screens: signup, quiz, picks, date, reschedule
components/       UI building blocks (Wordmark, PrimaryButton, OptionCard, Segmented, PhotoCard, …)
data/
  questions.ts    Quiz questions: edit these to change the quiz
  places.ts       Areas, time slots, date types and venues (fictional)
  candidates.ts   Mock matching pool
  matching.ts     Filtering, scoring and date planning
  useMatches.ts   Hooks for this week's matches and the selected date
  store.tsx       Shared in-memory state (account, answers, importance, selection)
utils/            Add-to-calendar (native sheet / .ics download on web)
theme.ts          Design tokens: colors, fonts, radii, sizes
```

## Editing the quiz

Each entry in `data/questions.ts` has a `kind`:

| kind     | renders as                                   | extra fields                                |
| -------- | -------------------------------------------- | ------------------------------------------- |
| `text`   | text field                                   | `multiline`, `keyboard`, `placeholder`      |
| `single` | radio cards                                  | `options`, `allowOther`                     |
| `multi`  | checkbox cards (a chip grid above 8 options) | `options`, `hint`, `exclusive` ("None of these") |
| `scale`  | 1–5 pills                                    | `minLabel`, `maxLabel`                      |
| `location` | "Use my current location" + neighborhood cards | `options`, `hint`                       |
| `group`  | several short segmented rows on one screen    | `items` (each saved under its own id)       |

Any question can add `importance: true` to ask how much it matters. Use `importanceSkip` to skip that for answers like "No Preference". If you change an option label that matching reads (deal-breakers, areas, time slots, date types), update `data/matching.ts` or `data/places.ts` to match.

## Design

Minimalist purple: background `#FAF8FF`, accent `#5A2FD6`. Headings use Bricolage Grotesque 700 and body text uses DM Sans. Icons are from lucide-react-native, and animations use react-native-reanimated. All tokens live in `theme.ts`.

Placeholder photos come from [pravatar.cc](https://pravatar.cc). Each card shows a lavender tint while its photo loads or if you're offline.
