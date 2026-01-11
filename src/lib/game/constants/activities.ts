import { ActionableItem } from '../types';

export const REST_ACTIVITIES: ActionableItem[] = [
    { id: 'short_break', duration: 10, cooldown: 60, effect: { stamina: 20 } },
    { id: 'sleep', duration: 24, cooldown: 5 * 60, effect: { stamina: 'full', health: 'full', mood: 'full' } },
];

export const FUN_ITEMS: ActionableItem[] = [
    { id: 'walk', effect: { mood: 10 }, duration: 10 },
    { id: 'tv', effect: { mood: 20 }, duration: 20 },
    { id: 'cinema', cost: { money: 50 }, effect: { mood: 35 }, duration: 40 },
    { id: 'restaurant', cost: { money: 120 }, effect: { health: 70, mood: 30 }, duration: 50 },
    { id: 'concert', cost: { money: 300 }, effect: { mood: 100 }, duration: 60 },
];

export const GYM_ACTIVITIES: ActionableItem[] = [
    { id: 'cardio', cost: { money: 100, stamina: 10 }, effect: { mood: 10, health: 5, maxStamina: 10 }, duration: 30 },
    { id: 'weights', cost: { money: 250, stamina: 15 }, effect: { mood: 10, health: 8, maxStamina: 20 }, duration: 45 },
    { id: 'yoga', cost: { money: 500, stamina: 12 }, effect: { mood: 20, health: 15, maxStamina: 30 }, duration: 40 },
    { id: 'personal_trainer', cost: { money: 1500, stamina: 30 }, effect: { mood: 20, health: 15, maxStamina: 50 }, duration: 60 },
];
