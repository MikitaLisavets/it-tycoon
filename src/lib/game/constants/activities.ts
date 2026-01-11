import { ActionableItem } from '../types';

export const REST_ACTIVITIES: ActionableItem[] = [
    { id: 'drink_coffee', duration: 5, cooldown: 30, effect: { mood: 5, stamina: 5 } },
    { id: 'short_break', duration: 10, cooldown: 60, effect: { stamina: 20, mood: 20, health: 20 } },
    { id: 'sleep', duration: 30, cooldown: 5 * 60, effect: { stamina: 'full', health: 'full', mood: 'full' } },
];

export const FUN_ITEMS: ActionableItem[] = [
    { id: 'walk', effect: { mood: 10 }, duration: 5 },
    { id: 'tv', effect: { mood: 35 }, duration: 10 },
    { id: 'cinema', cost: { money: 30 }, effect: { mood: 60 }, duration: 20 },
    { id: 'restaurant', cost: { money: 80 }, effect: { health: 80, mood: 80 }, duration: 30 },
    { id: 'concert', cost: { money: 120 }, effect: { mood: 'full' }, duration: 40 },
];

export const GYM_ACTIVITIES: ActionableItem[] = [
    { id: 'cardio', cost: { money: 30, stamina: 10 }, effect: { mood: 10, health: 10 }, duration: 5 },
    { id: 'weights', cost: { money: 100, stamina: 15 }, effect: { mood: 30, health: 30 }, duration: 15 },
    { id: 'yoga', cost: { money: 150, stamina: 12 }, effect: { mood: 50, health: 50 }, duration: 30 },
    { id: 'strength_training', cost: { money: 200, stamina: 50 }, effect: { mood: 'full', health: 'full' }, duration: 40 },
];
