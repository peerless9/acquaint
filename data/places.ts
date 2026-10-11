// Mock city data the date planner draws from. Names and addresses are fictional.

export const AREAS = ['Mission', 'SoMa', 'Marina', 'Richmond', 'Sunset', 'Noe Valley'] as const;
export type Area = (typeof AREAS)[number];

// Rough positions in miles, used for "Lives far away" and for picking a venue between two people.
const AREA_POS: Record<Area, [number, number]> = {
  Mission: [0, 0],
  SoMa: [0.8, 1.6],
  Marina: [-1.2, 4],
  Richmond: [-4, 2.5],
  Sunset: [-4.5, 0],
  'Noe Valley': [-1, -0.6],
};

export const FAR_AWAY_MILES = 3.5;

export function distance(a: Area, b: Area) {
  const [ax, ay] = AREA_POS[a];
  const [bx, by] = AREA_POS[b];
  return Math.hypot(ax - bx, ay - by);
}

export const DATE_TYPES = [
  'Coffee',
  'Drinks',
  'A meal out',
  'A walk outdoors',
  'Something active',
  'Museum or gallery',
  'Live music or a show',
] as const;
export type DateType = (typeof DATE_TYPES)[number];

export const SLOTS = [
  { id: 'wd-morning', label: 'Weekday mornings', weekend: false, hour: 9, minute: 0, part: 'morning' },
  { id: 'wd-lunch', label: 'Weekday lunch', weekend: false, hour: 12, minute: 30, part: 'lunch' },
  { id: 'wd-evening', label: 'Weekday evenings', weekend: false, hour: 19, minute: 0, part: 'evening' },
  { id: 'we-morning', label: 'Weekend mornings', weekend: true, hour: 10, minute: 0, part: 'morning' },
  { id: 'we-afternoon', label: 'Weekend afternoons', weekend: true, hour: 14, minute: 0, part: 'afternoon' },
  { id: 'we-evening', label: 'Weekend evenings', weekend: true, hour: 19, minute: 30, part: 'evening' },
] as const;
export type Slot = (typeof SLOTS)[number];
export type SlotLabel = Slot['label'];

/** Which kinds of date make sense at each time of day. */
export const SUITS: Record<Slot['part'], DateType[]> = {
  morning: ['Coffee', 'A walk outdoors', 'Something active', 'Museum or gallery'],
  lunch: ['A meal out', 'Coffee', 'A walk outdoors'],
  afternoon: ['A walk outdoors', 'Museum or gallery', 'Something active', 'Coffee', 'A meal out'],
  evening: ['Drinks', 'A meal out', 'Live music or a show', 'Something active'],
};

export const DURATION_MIN: Record<DateType, number> = {
  Coffee: 60,
  Drinks: 90,
  'A meal out': 105,
  'A walk outdoors': 75,
  'Something active': 120,
  'Museum or gallery': 120,
  'Live music or a show': 150,
};

export const BUDGETS = ['$ (under $20)', '$$ ($20–50)', '$$$ ($50+)'] as const;

export const NEEDS = ['Vegetarian', 'Vegan', 'Gluten-free', 'Alcohol-free', 'Step-free access'] as const;
export type Need = (typeof NEEDS)[number];

export type Venue = {
  name: string;
  address: string;
  area: Area;
  type: DateType;
  /** 1 = $, 2 = $$, 3 = $$$ */
  budget: 1 | 2 | 3;
  serves: Need[];
  plan: string;
};

export const VENUES: Venue[] = [
  { name: 'Juniper Coffee House', address: '88 Alder Ave', area: 'Mission', type: 'Coffee', budget: 1, serves: ['Vegetarian', 'Vegan', 'Gluten-free', 'Alcohol-free', 'Step-free access'], plan: 'Coffee, then a walk through the park' },
  { name: 'Tidepool Coffee', address: '1207 Kelp St', area: 'Sunset', type: 'Coffee', budget: 1, serves: ['Vegetarian', 'Vegan', 'Alcohol-free'], plan: 'Coffee and a pastry by the window' },
  { name: 'Lantern Roasters', address: '402 Harbor Ln', area: 'Marina', type: 'Coffee', budget: 1, serves: ['Vegetarian', 'Gluten-free', 'Alcohol-free', 'Step-free access'], plan: 'Coffee, then a stroll along the water' },
  { name: 'Little Fern Wine Bar', address: '31 Wren St', area: 'Noe Valley', type: 'Drinks', budget: 2, serves: ['Vegetarian', 'Gluten-free'], plan: 'A glass of wine, then dessert next door' },
  { name: 'The Copper Owl', address: '560 Foundry St', area: 'SoMa', type: 'Drinks', budget: 2, serves: ['Vegetarian', 'Vegan', 'Alcohol-free', 'Step-free access'], plan: 'Cocktails or mocktails at the bar' },
  { name: 'Saffron & Salt', address: '2290 Valencia Row', area: 'Mission', type: 'A meal out', budget: 2, serves: ['Vegetarian', 'Vegan', 'Gluten-free', 'Alcohol-free', 'Step-free access'], plan: 'Shared plates and a long conversation' },
  { name: "Nonna's Table", address: '715 Clement Way', area: 'Richmond', type: 'A meal out', budget: 2, serves: ['Vegetarian', 'Alcohol-free'], plan: 'Handmade pasta, split a dessert' },
  { name: 'Kettle & Crumb', address: '19 Chestnut Ct', area: 'Marina', type: 'A meal out', budget: 1, serves: ['Vegetarian', 'Gluten-free', 'Alcohol-free', 'Step-free access'], plan: 'A relaxed lunch of soup and sandwiches' },
  { name: 'Ember Room', address: '88 Townsend Pl', area: 'SoMa', type: 'A meal out', budget: 3, serves: ['Vegetarian', 'Vegan', 'Gluten-free', 'Step-free access'], plan: "A tasting menu at the chef's counter" },
  { name: 'Hilltop Park Loop', address: 'Meet at the north gate, 20th & Ridge', area: 'Mission', type: 'A walk outdoors', budget: 1, serves: ['Vegetarian', 'Vegan', 'Gluten-free', 'Alcohol-free'], plan: 'An easy loop with a view at the top' },
  { name: 'Bayfront Trail', address: 'Meet at the Marina Green kiosk', area: 'Marina', type: 'A walk outdoors', budget: 1, serves: ['Vegetarian', 'Vegan', 'Gluten-free', 'Alcohol-free', 'Step-free access'], plan: 'A flat walk along the bay' },
  { name: 'Cliffside Path', address: 'Meet at the Outer Point lookout', area: 'Richmond', type: 'A walk outdoors', budget: 1, serves: ['Vegetarian', 'Vegan', 'Gluten-free', 'Alcohol-free'], plan: 'A coastal walk with ocean views' },
  { name: 'The Boulder Room', address: '1420 Harbor Way', area: 'SoMa', type: 'Something active', budget: 2, serves: ['Vegetarian', 'Alcohol-free'], plan: 'Beginner bouldering, then tacos' },
  { name: 'Lucky Pin Lanes', address: '33 Mission Bay Blvd', area: 'SoMa', type: 'Something active', budget: 2, serves: ['Vegetarian', 'Gluten-free', 'Alcohol-free', 'Step-free access'], plan: 'Two games of bowling, loser buys fries' },
  { name: 'Gallery Nine', address: '9 Yerba Ln', area: 'SoMa', type: 'Museum or gallery', budget: 2, serves: ['Vegetarian', 'Vegan', 'Gluten-free', 'Alcohol-free', 'Step-free access'], plan: 'Walk the new exhibit, then coffee in the café' },
  { name: 'Sunset Science Hall', address: '1800 Fog Ave', area: 'Sunset', type: 'Museum or gallery', budget: 2, serves: ['Vegetarian', 'Alcohol-free', 'Step-free access'], plan: 'The planetarium show, then the aquarium' },
  { name: 'The Velvet Room', address: '3030 Mission Row', area: 'Mission', type: 'Live music or a show', budget: 2, serves: ['Vegetarian', 'Alcohol-free', 'Step-free access'], plan: 'A small live set, good seats near the stage' },
  { name: 'Golden Hour Jazz', address: '41 Church Hill', area: 'Noe Valley', type: 'Live music or a show', budget: 3, serves: ['Vegetarian', 'Gluten-free'], plan: 'A jazz trio and a shared cheese plate' },
];
