import type { Area, DateType, Need, SlotLabel } from './places';

export type Gender = 'Male' | 'Female';

/** A mock member of the matching pool. Only the photo is ever shown before the date. */
export type Candidate = {
  id: string;
  photo: string;
  gender: Gender;
  /** Genders this person wants to meet. */
  seeks: Gender[];
  age: number;
  heightIn: number;
  career: 'Student' | 'Employed' | 'Unemployed' | 'Retired';
  monthlyIncome: number;
  traits: string[];
  /** 1 = strongly prefers going out, 5 = strongly prefers staying in */
  goingOut: number;
  /** 1 = family, 5 = friends */
  familyFriends: number;
  smokes: boolean;
  drinksHeavily: boolean;
  usesDrugs: boolean;
  hasKids: boolean;
  wantsKids: boolean | null;
  hasPets: boolean;
  area: Area;
  availability: SlotLabel[];
  dateTypes: DateType[];
  budget: 1 | 2 | 3;
  needs: Need[];
};

const photo = (img: number) => `https://i.pravatar.cc/800?img=${img}`;

export const candidates: Candidate[] = [
  {
    id: 'c1', photo: photo(47), gender: 'Female', seeks: ['Male'], age: 27, heightIn: 66, career: 'Employed', monthlyIncome: 6200,
    traits: ['kind', 'curious', 'funny', 'honest'], goingOut: 2, familyFriends: 3,
    smokes: false, drinksHeavily: false, usesDrugs: false, hasKids: false, wantsKids: true, hasPets: true,
    area: 'Noe Valley', availability: ['Weekday evenings', 'Weekend evenings', 'Weekend afternoons'],
    dateTypes: ['Drinks', 'A meal out', 'Live music or a show'], budget: 2, needs: [],
  },
  {
    id: 'c2', photo: photo(12), gender: 'Male', seeks: ['Female'], age: 29, heightIn: 71, career: 'Employed', monthlyIncome: 5400,
    traits: ['funny', 'outgoing', 'loyal', 'adventurous'], goingOut: 1, familyFriends: 4,
    smokes: false, drinksHeavily: false, usesDrugs: false, hasKids: false, wantsKids: null, hasPets: false,
    area: 'Mission', availability: ['Weekend mornings', 'Weekend afternoons', 'Weekday evenings'],
    dateTypes: ['Coffee', 'A walk outdoors', 'Something active'], budget: 1, needs: ['Vegetarian'],
  },
  {
    id: 'c3', photo: photo(32), gender: 'Female', seeks: ['Male', 'Female'], age: 25, heightIn: 64, career: 'Student', monthlyIncome: 1800,
    traits: ['creative', 'calm', 'kind', 'thoughtful'], goingOut: 4, familyFriends: 2,
    smokes: false, drinksHeavily: false, usesDrugs: false, hasKids: false, wantsKids: true, hasPets: true,
    area: 'Sunset', availability: ['Weekday lunch', 'Weekend mornings', 'Weekend afternoons'],
    dateTypes: ['Coffee', 'Museum or gallery', 'A walk outdoors'], budget: 1, needs: ['Vegan'],
  },
  {
    id: 'c4', photo: photo(13), gender: 'Male', seeks: ['Female', 'Male'], age: 33, heightIn: 74, career: 'Employed', monthlyIncome: 9000,
    traits: ['ambitious', 'confident', 'honest', 'driven'], goingOut: 2, familyFriends: 2,
    smokes: false, drinksHeavily: true, usesDrugs: false, hasKids: false, wantsKids: true, hasPets: false,
    area: 'SoMa', availability: ['Weekday evenings', 'Weekend evenings'],
    dateTypes: ['Drinks', 'A meal out'], budget: 3, needs: [],
  },
  {
    id: 'c5', photo: photo(26), gender: 'Female', seeks: ['Male'], age: 31, heightIn: 68, career: 'Employed', monthlyIncome: 7400,
    traits: ['adventurous', 'active', 'outgoing', 'curious'], goingOut: 1, familyFriends: 4,
    smokes: false, drinksHeavily: false, usesDrugs: false, hasKids: false, wantsKids: false, hasPets: true,
    area: 'Marina', availability: ['Weekday mornings', 'Weekend mornings', 'Weekend afternoons'],
    dateTypes: ['Something active', 'A walk outdoors', 'Coffee'], budget: 2, needs: ['Gluten-free'],
  },
  {
    id: 'c6', photo: photo(51), gender: 'Male', seeks: ['Female'], age: 35, heightIn: 70, career: 'Employed', monthlyIncome: 6800,
    traits: ['calm', 'thoughtful', 'kind', 'family-oriented'], goingOut: 4, familyFriends: 1,
    smokes: false, drinksHeavily: false, usesDrugs: false, hasKids: true, wantsKids: true, hasPets: false,
    area: 'Richmond', availability: ['Weekend afternoons', 'Weekend evenings', 'Weekday lunch'],
    dateTypes: ['A meal out', 'Museum or gallery', 'Live music or a show'], budget: 2, needs: [],
  },
  {
    id: 'c7', photo: photo(44), gender: 'Female', seeks: ['Male', 'Female'], age: 28, heightIn: 63, career: 'Employed', monthlyIncome: 4800,
    traits: ['funny', 'warm', 'creative', 'spontaneous'], goingOut: 2, familyFriends: 3,
    smokes: true, drinksHeavily: false, usesDrugs: false, hasKids: false, wantsKids: null, hasPets: false,
    area: 'Mission', availability: ['Weekday evenings', 'Weekend evenings'],
    dateTypes: ['Live music or a show', 'Drinks', 'A meal out'], budget: 2, needs: [],
  },
  {
    id: 'c8', photo: photo(53), gender: 'Male', seeks: ['Female'], age: 26, heightIn: 69, career: 'Student', monthlyIncome: 1500,
    traits: ['curious', 'creative', 'honest', 'gentle'], goingOut: 3, familyFriends: 3,
    smokes: false, drinksHeavily: false, usesDrugs: false, hasKids: false, wantsKids: true, hasPets: true,
    area: 'Sunset', availability: ['Weekday lunch', 'Weekend mornings', 'Weekend afternoons'],
    dateTypes: ['Coffee', 'Museum or gallery', 'A walk outdoors'], budget: 1, needs: ['Vegetarian'],
  },
  {
    id: 'c9', photo: photo(36), gender: 'Female', seeks: ['Male'], age: 30, heightIn: 67, career: 'Employed', monthlyIncome: 8200,
    traits: ['ambitious', 'loyal', 'honest', 'witty'], goingOut: 3, familyFriends: 2,
    smokes: false, drinksHeavily: false, usesDrugs: false, hasKids: false, wantsKids: true, hasPets: false,
    area: 'SoMa', availability: ['Weekday evenings', 'Weekend afternoons', 'Weekend evenings'],
    dateTypes: ['A meal out', 'Drinks', 'Museum or gallery'], budget: 3, needs: ['Step-free access'],
  },
  {
    id: 'c10', photo: photo(59), gender: 'Male', seeks: ['Female', 'Male'], age: 31, heightIn: 72, career: 'Employed', monthlyIncome: 5900,
    traits: ['kind', 'funny', 'patient', 'curious'], goingOut: 3, familyFriends: 3,
    smokes: false, drinksHeavily: false, usesDrugs: false, hasKids: false, wantsKids: true, hasPets: true,
    area: 'Noe Valley', availability: ['Weekday evenings', 'Weekend mornings', 'Weekend evenings'],
    dateTypes: ['Coffee', 'A meal out', 'Live music or a show'], budget: 2, needs: [],
  },
  {
    id: 'c11', photo: photo(27), gender: 'Female', seeks: ['Male', 'Female'], age: 24, heightIn: 65, career: 'Student', monthlyIncome: 1200,
    traits: ['outgoing', 'spontaneous', 'warm', 'adventurous'], goingOut: 1, familyFriends: 5,
    smokes: false, drinksHeavily: true, usesDrugs: true, hasKids: false, wantsKids: false, hasPets: false,
    area: 'SoMa', availability: ['Weekday evenings', 'Weekend evenings'],
    dateTypes: ['Drinks', 'Live music or a show', 'Something active'], budget: 1, needs: [],
  },
  {
    id: 'c12', photo: photo(60), gender: 'Male', seeks: ['Female'], age: 28, heightIn: 68, career: 'Employed', monthlyIncome: 4300,
    traits: ['warm', 'funny', 'loyal', 'active'], goingOut: 2, familyFriends: 2,
    smokes: false, drinksHeavily: false, usesDrugs: false, hasKids: false, wantsKids: true, hasPets: true,
    area: 'Marina', availability: ['Weekday mornings', 'Weekend mornings', 'Weekend afternoons'],
    dateTypes: ['A walk outdoors', 'Something active', 'Coffee'], budget: 1, needs: ['Gluten-free'],
  },
  {
    id: 'c13', photo: photo(16), gender: 'Female', seeks: ['Male'], age: 34, heightIn: 66, career: 'Employed', monthlyIncome: 7000,
    traits: ['calm', 'thoughtful', 'family-oriented', 'kind'], goingOut: 5, familyFriends: 1,
    smokes: false, drinksHeavily: false, usesDrugs: false, hasKids: true, wantsKids: null, hasPets: true,
    area: 'Richmond', availability: ['Weekday lunch', 'Weekend mornings', 'Weekend afternoons'],
    dateTypes: ['Coffee', 'A meal out', 'A walk outdoors'], budget: 2, needs: ['Alcohol-free'],
  },
  {
    id: 'c14', photo: photo(68), gender: 'Male', seeks: ['Female', 'Male'], age: 30, heightIn: 73, career: 'Employed', monthlyIncome: 7600,
    traits: ['confident', 'witty', 'curious', 'ambitious'], goingOut: 2, familyFriends: 4,
    smokes: false, drinksHeavily: false, usesDrugs: false, hasKids: false, wantsKids: true, hasPets: false,
    area: 'Mission', availability: ['Weekday evenings', 'Weekend afternoons', 'Weekend evenings'],
    dateTypes: ['Museum or gallery', 'Drinks', 'Live music or a show'], budget: 2, needs: [],
  },
];
