import { ActionableItem } from '../types';

export const REST_ACTIVITIES: ActionableItem[] = [
    { id: 'short_break', duration: 10, cooldown: 60, effect: { stamina: 20 } },
    { id: 'sleep', duration: 20, cooldown: 5 * 60, effect: { stamina: 'full' } },
];

export const FUN_ITEMS: ActionableItem[] = [
    { id: 'walk', effect: { mood: 5 }, duration: 10 },
    { id: 'tv', effect: { mood: 15 }, duration: 20 },
    { id: 'cinema', cost: { money: 20 }, effect: { mood: 25 }, duration: 40 },
    { id: 'restaurant', cost: { money: 50 }, effect: { health: 80, mood: 20 }, duration: 50 },
    { id: 'concert', cost: { money: 100 }, effect: { mood: 80 }, duration: 60 },
];

export const GYM_ACTIVITIES: ActionableItem[] = [
    { id: 'cardio', cost: { money: 10, stamina: 5 }, effect: { mood: 5, health: 3, maxStamina: 10 }, duration: 20 },
    { id: 'weights', cost: { money: 15, stamina: 10 }, effect: { mood: 5, health: 5, maxStamina: 20 }, duration: 30 },
    { id: 'yoga', cost: { money: 20, stamina: 8 }, effect: { mood: 10, health: 10, maxStamina: 30 }, duration: 25 },
    { id: 'personal_trainer', cost: { money: 50, stamina: 20 }, effect: { mood: 10, health: 8, maxStamina: 40 }, duration: 45 },
];
