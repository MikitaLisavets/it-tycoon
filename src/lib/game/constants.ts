
export const GAME_CONSTANTS = {
    TICK_RATE_MS: 1000,
    GAME_MINUTES_PER_TICK: 30,
    DAY_LENGTH_MINUTES: 24 * 60, // 1440
    DECAY_RATES: {
        HEALTH_PER_TICK: 0.3,   // Slower decay
        MOOD_PER_TICK: 0.2,     // Slower decay
        STAMINA_PER_TICK: 0.05, // Much slower decay
    },
    GAME_OVER_THRESHOLD: -50, // Less harsh
};

export const STAT_ICONS = {
    MONEY: { icon: '$', color: '#2ecc71' },      // Green
    MOOD: { icon: '☺', color: '#f39c12' },       // Orange
    HEALTH: { icon: '✚', color: '#e74c3c' },    // Red - Food/Health
    STAMINA: { icon: '⚡︎', color: '#3498db' }, // Blue - Muscle/Stamina
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
    { id: 'snack', name: 'Snack', cost: 5, health: 10 },
    { id: 'fastfood', name: 'Fast Food', cost: 15, health: 30 },
    { id: 'restaurant', name: 'Restaurant', cost: 50, health: 80 },
];

export const FUN_ITEMS = [
    { id: 'walk', name: 'Walk in park', cost: 0, mood: 5 },
    { id: 'cinema', name: 'Cinema', cost: 20, mood: 25 },
    { id: 'concert', name: 'Concert', cost: 100, mood: 80 },
];

export const GYM_ACTIVITIES = [
    { id: 'cardio', name: 'Cardio Training', cost: 10, stamina: 5, health: -3 },
    { id: 'weights', name: 'Weight Training', cost: 15, stamina: 10, health: -5 },
    { id: 'yoga', name: 'Yoga Class', cost: 20, stamina: 8, mood: 10, health: -2 },
    { id: 'personal_trainer', name: 'Personal Trainer', cost: 50, stamina: 20, health: -8 },
];
