
export const GAME_CONSTANTS = {
    TICK_RATE_MS: 1000,
    GAME_MINUTES_PER_TICK: 20,
    DAY_LENGTH_MINUTES: 24 * 60, // 1440
    DECAY_RATES: {
        SATIETY_PER_TICK: 0.3, // Slower decay
        MOOD_PER_TICK: 0.2,    // Slower decay
    },
    GAME_OVER_THRESHOLD: -50, // Less harsh
};

export const JOBS: Record<string, { title: string; type: 'manual' | 'passive'; income: number; cost?: number }> = {
    loader: { title: 'Loader', type: 'manual', income: 5, cost: 2 }, // cost is energy/satiety/mood cost
    salesman: { title: 'Salesman', type: 'manual', income: 10, cost: 3 },
    junior_dev: { title: 'Jun. Developer', type: 'passive', income: 10 }, // income per tick? per hour? Let's say per hour.
    middle_dev: { title: 'Mid. Developer', type: 'passive', income: 25 },
    senior_dev: { title: 'Sen. Developer', type: 'passive', income: 50 },
    lead_dev: { title: 'Lead Developer', type: 'passive', income: 100 },
};

export const COURSES = {
    basic_pc: { title: 'Basic PC Skills', cost: 100, durationVal: 10 }, // duration in days/hours?
    programming_basics: { title: 'Programming Basics', cost: 500 },
    advanced_programming: { title: 'Advanced Programming', cost: 1500 },
};

export const FOOD_ITEMS = [
    { id: 'snack', name: 'Snack', cost: 5, satiety: 10 },
    { id: 'fastfood', name: 'Fast Food', cost: 15, satiety: 30 },
    { id: 'restaurant', name: 'Restaurant', cost: 50, satiety: 80 },
];

export const FUN_ITEMS = [
    { id: 'walk', name: 'Walk in park', cost: 0, mood: 5 },
    { id: 'cinema', name: 'Cinema', cost: 20, mood: 25 },
    { id: 'concert', name: 'Concert', cost: 100, mood: 80 },
];
