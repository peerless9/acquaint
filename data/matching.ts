// Local matching engine: filter the pool by non-negotiables, score by importance-weighted
// compatibility, then plan a date at a time both people are free.

import { candidates, type Candidate, type Gender } from './candidates';
import {
  AREAS,
  BUDGETS,
  DEFAULT_TRAVEL_MINUTES,
  DURATION_MIN,
  NEEDS,
  SLOTS,
  SUITS,
  TRAVEL_OPTIONS,
  VENUES,
  travelMinutes,
  type Area,
  type DateType,
  type Need,
  type Slot,
  type SlotLabel,
  type Venue,
} from './places';
import type { DealBreaker, Importance } from './questions';
import type { Answer } from './store';

export type MatchInput = {
  answers: Record<string, Answer>;
  importance: Record<string, Importance>;
};

export type DatePlan = {
  start: Date;
  end: Date;
  slot: Slot;
  activity: DateType;
  venue: Venue;
  /** Your estimated travel time to the venue, if we know where you are. */
  travelMin?: number;
};

export type MatchResult = {
  candidate: Candidate;
  /** 0–100 */
  score: number;
  reasons: string[];
  /** Upcoming times both people are free, soonest first. */
  times: { slot: Slot; start: Date }[];
};

const WEEKLY_MATCHES = 3;
// The first date is booked at least this far out so both people can plan.
const MIN_LEAD_HOURS = 36;
const LOOKAHEAD_DAYS = 14;
// How much each importance level counts. Questions without an importance rating count as 1.
const IMPORTANCE_WEIGHT: Record<Importance, number> = { 1: 0.5, 2: 1.5, 3: 4 };

// ---- reading answers -------------------------------------------------------

const str = (a: Answer | undefined) => (typeof a === 'string' ? a : undefined);
const list = (a: Answer | undefined) => (Array.isArray(a) ? a : []);
const num = (a: Answer | undefined) => (typeof a === 'number' ? a : undefined);

function parseNumbers(text: string | undefined) {
  return (text?.match(/\d+(\.\d+)?/g) ?? []).map(Number);
}

function wantedGenders(lookingFor: string[]): Gender[] {
  const out = new Set<Gender>();
  for (const opt of lookingFor) {
    if (opt.startsWith('Male')) out.add('Male');
    if (opt.startsWith('Female')) out.add('Female');
  }
  return [...out];
}

/** "5'0 or Less" → 60, "5'10" → 70, "6'3 or More" → 75 */
function heightLabelToInches(label: string) {
  const m = label.match(/(\d)'(\d+)/);
  return m ? Number(m[1]) * 12 + Number(m[2]) : undefined;
}

const isArea = (v: string | undefined): v is Area => !!v && (AREAS as readonly string[]).includes(v);
const budgetLevel = (v: string | undefined) => {
  const i = v ? (BUDGETS as readonly string[]).indexOf(v) : -1;
  return i < 0 ? undefined : ((i + 1) as 1 | 2 | 3);
};

// ---- filtering --------------------------------------------------------------

function myTravelLimit(answers: MatchInput['answers']) {
  const label = str(answers.travel);
  return TRAVEL_OPTIONS.find((t) => t.label === label)?.minutes ?? DEFAULT_TRAVEL_MINUTES;
}

/** Can both people reach this venue within the travel time they set? */
function reachable(v: Venue, c: Candidate, answers: MatchInput['answers']) {
  const myArea = str(answers.area);
  const mine = isArea(myArea) ? travelMinutes(myArea, v.area) <= myTravelLimit(answers) : true;
  return mine && travelMinutes(c.area, v.area) <= c.maxTravelMin;
}

/** Whether a deal-breaker applies to the candidate (your list). */
function candidateHas(b: DealBreaker, c: Candidate, answers: MatchInput['answers']) {
  const myArea = str(answers.area);
  switch (b) {
    case 'Smokes': return c.smokes;
    case 'Drinks heavily': return c.drinksHeavily;
    case 'Uses drugs': return c.usesDrugs;
    case 'Has kids': return c.hasKids;
    case 'Wants kids': return c.wantsKids === true;
    case "Doesn't want kids": return c.wantsKids === false;
    case 'Has pets': return c.hasPets;
    case 'Lives far away': return isArea(myArea) && travelMinutes(myArea, c.area) > myTravelLimit(answers);
  }
}

/** Whether a deal-breaker applies to you (their list), from the "about you" answers. Unknown never counts. */
function youHave(b: DealBreaker, c: Candidate, answers: MatchInput['answers']) {
  const a = (id: string) => str(answers[id]);
  const myArea = a('area');
  switch (b) {
    case 'Smokes': return a('smoking') === 'Yes' || a('smoking') === 'Sometimes';
    case 'Drinks heavily': return a('drinking') === 'Often';
    case 'Uses drugs': return a('drugs') === 'Sometimes' || a('drugs') === 'Often';
    case 'Has kids': return a('hasKids') === 'Yes';
    case 'Wants kids': return a('wantsKids') === 'Yes';
    case "Doesn't want kids": return a('wantsKids') === 'No';
    case 'Has pets': return a('pets') === 'Yes';
    case 'Lives far away': return isArea(myArea) && travelMinutes(c.area, myArea) > c.maxTravelMin;
  }
}

function passesFilters(c: Candidate, input: MatchInput) {
  const { answers } = input;

  // Who they want to meet, both ways.
  const wanted = wantedGenders(list(answers.lookingFor));
  if (wanted.length && !wanted.includes(c.gender)) return false;
  const myGender = str(answers.gender);
  if ((myGender === 'Male' || myGender === 'Female') && !c.seeks.includes(myGender)) return false;
  if (myGender && myGender !== 'Male' && myGender !== 'Female' && c.seeks.length < 2) return false;

  // Non-negotiables are hard filters, in both directions.
  const mine = list(answers.dealBreakers) as DealBreaker[];
  if (mine.some((b) => candidateHas(b, c, answers))) return false;
  if (c.dealBreakers.some((b) => youHave(b, c, answers))) return false;

  // A date needs a time you're both free and a place you can both get to.
  const free = list(answers.availability);
  if (free.length && !c.availability.some((s) => free.includes(s))) return false;
  if (!VENUES.some((v) => reachable(v, c, answers))) return false;

  return true;
}

// ---- scoring -----------------------------------------------------------------

type Part = { value: number; weight: number; reason?: string };

function scoreParts(c: Candidate, input: MatchInput): Part[] {
  const { answers, importance } = input;
  const w = (id: string) => (importance[id] ? IMPORTANCE_WEIGHT[importance[id]] : 1);
  const parts: Part[] = [];

  const ages = parseNumbers(str(answers.ageRange)).filter((n) => n >= 18 && n < 100);
  if (ages.length) {
    const lo = Math.min(...ages);
    const hi = ages.length > 1 ? Math.max(...ages) : lo + 5;
    const off = c.age < lo ? lo - c.age : c.age > hi ? c.age - hi : 0;
    parts.push({ value: Math.max(0, 1 - off / 5), weight: w('ageRange'), reason: off === 0 ? 'In your age range' : undefined });
  }

  const heights = list(answers.idealHeight).map(heightLabelToInches).filter((n): n is number => n !== undefined);
  if (heights.length) {
    const h = Math.min(75, Math.max(60, c.heightIn));
    const off = Math.min(...heights.map((x) => Math.abs(x - h)));
    parts.push({ value: off === 0 ? 1 : off === 1 ? 0.6 : 0.2, weight: w('idealHeight'), reason: off === 0 ? 'Your ideal height' : undefined });
  }

  const career = str(answers.partnerCareer);
  if (career && career !== 'No Preference' && career !== 'Other') {
    const same = c.career === career;
    parts.push({ value: same ? 1 : 0.3, weight: w('partnerCareer'), reason: same ? `${c.career}, like you wanted` : undefined });
  }

  const income = parseNumbers(str(answers.partnerIncome))[0];
  if (income) {
    const ok = c.monthlyIncome >= income;
    parts.push({ value: ok ? 1 : c.monthlyIncome / income, weight: w('partnerIncome') });
  }

  const valued = (str(answers.valuedTraits) ?? '').toLowerCase();
  if (valued.trim()) {
    const shared = c.traits.filter((t) => valued.includes(t.replace('-oriented', '')));
    parts.push({
      value: Math.min(1, 0.35 + shared.length * 0.3),
      weight: w('valuedTraits'),
      reason: shared.length ? `${capitalize(shared.slice(0, 2).join(' and '))}, as you hoped` : undefined,
    });
  }

  const goingOut = num(answers.goingOut);
  if (goingOut) {
    const diff = Math.abs(goingOut - c.goingOut);
    const label = goingOut <= 2 ? 'You both love going out' : goingOut >= 4 ? 'You both love a night in' : 'Same going-out balance';
    parts.push({ value: 1 - diff / 4, weight: w('goingOut'), reason: diff <= 1 ? label : undefined });
  }

  const famFriends = num(answers.familyFriends);
  if (famFriends) {
    const diff = Math.abs(famFriends - c.familyFriends);
    parts.push({ value: 1 - diff / 4, weight: w('familyFriends'), reason: diff === 0 ? 'Same family and friends balance' : undefined });
  }

  const types = list(answers.dateTypes);
  if (types.length) {
    const shared = c.dateTypes.filter((t) => types.includes(t));
    parts.push({
      value: shared.length ? 0.6 + 0.2 * Math.min(2, shared.length) : 0.2,
      weight: 1,
      reason: shared.length ? `You both like ${shared[0].toLowerCase()}` : undefined,
    });
  }

  const budget = budgetLevel(str(answers.budget));
  if (budget) parts.push({ value: 1 - Math.abs(budget - c.budget) / 2, weight: 0.5 });

  const area = str(answers.area);
  if (isArea(area)) {
    const mins = travelMinutes(area, c.area);
    parts.push({ value: Math.max(0, 1 - mins / 40), weight: 1, reason: mins <= 15 ? 'Lives nearby' : undefined });
  }

  return parts;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function score(c: Candidate, input: MatchInput) {
  const parts = scoreParts(c, input);
  const total = parts.reduce((s, p) => s + p.weight, 0);
  const avg = total ? parts.reduce((s, p) => s + p.value * p.weight, 0) / total : 0.7;
  // Everyone who passes the filters is a reasonable fit, so map onto 50–99.
  const value = Math.round(50 + 49 * avg);
  const reasons = parts
    .filter((p) => p.reason)
    .sort((a, b) => b.weight * b.value - a.weight * a.value)
    .map((p) => p.reason as string)
    .slice(0, 3);
  return { value, reasons };
}

// ---- scheduling --------------------------------------------------------------

export function sharedTimes(c: Candidate, input: MatchInput, now = new Date()) {
  const mine = list(input.answers.availability);
  const labels: SlotLabel[] = mine.length ? c.availability.filter((s) => mine.includes(s)) : c.availability;
  const slots = SLOTS.filter((s) => labels.includes(s.label));
  const earliest = now.getTime() + MIN_LEAD_HOURS * 3_600_000;

  const out: { slot: Slot; start: Date }[] = [];
  for (let d = 0; d <= LOOKAHEAD_DAYS; d++) {
    const day = new Date(now);
    day.setDate(day.getDate() + d);
    const weekend = day.getDay() === 0 || day.getDay() === 6;
    for (const slot of slots) {
      if (slot.weekend !== weekend) continue;
      const start = new Date(day);
      start.setHours(slot.hour, slot.minute, 0, 0);
      if (start.getTime() >= earliest) out.push({ slot, start });
    }
  }
  return out.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function planDate(c: Candidate, input: MatchInput, time: { slot: Slot; start: Date }): DatePlan {
  const { answers } = input;
  const needs = new Set<Need>([
    ...(list(answers.needs).filter((n) => (NEEDS as readonly string[]).includes(n)) as Need[]),
    ...c.needs,
  ]);
  const myTypes = list(answers.dateTypes) as DateType[];
  const suitable = SUITS[time.slot.part].filter((t) => !(t === 'Drinks' && needs.has('Alcohol-free')));

  // Prefer something you both like, then something you like, then something they like.
  const rank = (t: DateType) => (myTypes.includes(t) ? 0 : 2) + (c.dateTypes.includes(t) ? 0 : 1);
  const activities = [...suitable].sort((a, b) => rank(a) - rank(b));

  const myArea = str(answers.area);
  const budget = Math.min(budgetLevel(str(answers.budget)) ?? 3, c.budget);
  const fits = (v: Venue) => [...needs].every((n) => v.serves.includes(n));
  const reach = (v: Venue) => reachable(v, c, answers);
  const travel = (v: Venue) => (isArea(myArea) ? travelMinutes(myArea, v.area) : 0) + travelMinutes(c.area, v.area);
  const nearest = (vs: Venue[]) => [...vs].sort((a, b) => travel(a) - travel(b))[0];

  // Take the best-ranked activity that has a venue you can both reach, relaxing budget and needs last.
  let pick: { activity: DateType; venue: Venue } | undefined;
  for (const strict of [true, false]) {
    for (const activity of activities) {
      const options = VENUES.filter((v) => v.type === activity && reach(v) && (!strict || (fits(v) && v.budget <= budget)));
      if (options.length) {
        pick = { activity, venue: nearest(options) };
        break;
      }
    }
    if (pick) break;
  }
  if (!pick) {
    const venue = nearest(VENUES.filter(reach).length ? VENUES.filter(reach) : VENUES);
    pick = { activity: venue.type, venue };
  }

  const end = new Date(time.start.getTime() + DURATION_MIN[pick.activity] * 60_000);
  return {
    start: time.start,
    end,
    slot: time.slot,
    ...pick,
    travelMin: isArea(myArea) ? travelMinutes(myArea, pick.venue.area) : undefined,
  };
}

// ---- public ------------------------------------------------------------------

export function computeMatches(input: MatchInput, now = new Date()): MatchResult[] {
  return candidates
    .filter((c) => passesFilters(c, input))
    .map((c) => {
      const { value, reasons } = score(c, input);
      return { candidate: c, score: value, reasons, times: sharedTimes(c, input, now) };
    })
    .filter((m) => m.times.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, WEEKLY_MATCHES);
}

export function formatWhen(start: Date) {
  const day = start.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const time = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${day} · ${time}`;
}
