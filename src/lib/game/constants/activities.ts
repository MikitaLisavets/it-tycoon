import { FoodItem, FunItem, GymActivity } from '../types';

export const FOOD_ITEMS: FoodItem[] = [
    { id: 'snack', name: 'Snack', cost: 5, health: 10 },
    { id: 'fastfood', name: 'Fast Food', cost: 15, health: 30 },
    { id: 'restaurant', name: 'Restaurant', cost: 50, health: 80 },
];

export const FUN_ITEMS: FunItem[] = [
    { id: 'walk', name: 'Walk in park', cost: 0, mood: 5 },
    { id: 'tv', name: 'Watch TV', cost: 0, mood: 14 },
    { id: 'cinema', name: 'Cinema', cost: 20, mood: 25 },
    { id: 'concert', name: 'Concert', cost: 100, mood: 80 },
];

export const GYM_ACTIVITIES: GymActivity[] = [
    { id: 'cardio', name: 'Cardio Training', cost: 10, stamina: 5, health: -3 },
    { id: 'weights', name: 'Weight Training', cost: 15, stamina: 10, health: -5 },
    { id: 'yoga', name: 'Yoga Class', cost: 20, stamina: 8, mood: 10, health: -2 },
    { id: 'personal_trainer', name: 'Personal Trainer', cost: 50, stamina: 20, health: -8 },
];
