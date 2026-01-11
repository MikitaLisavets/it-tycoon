import { ActionableItem } from "../types";

export const FOOD_ITEMS: ActionableItem[] = [
    { id: 'snack', cost: { money: 5 }, effect: { health: 3, mood: 3 } },
    { id: 'energy_drink', cost: { money: 5, health: 5 }, effect: { stamina: 30 } },
    { id: 'burger', cost: { money: 20 }, effect: { health: 30, mood: 10 } },
    { id: 'kebab', cost: { money: 30 }, effect: { health: 40, mood: 15 } },
    { id: 'pizza', cost: { money: 40 }, effect: { health: 50, mood: 20 } },
];

export const MEDICINE: ActionableItem[] = [
    { id: 'painkillers', cost: { money: 500 }, effect: { maxHealth: 5 } },
    { id: 'vitamin_pack', cost: { money: 1500 }, effect: { maxHealth: 15 } },
    { id: 'health_checkup', cost: { money: 15000 }, effect: { maxHealth: 25 } },
    { id: 'medical_insurance', cost: { money: 50000 }, effect: { maxHealth: 45 } },
];

export const LIFESTYLE: ActionableItem[] = [
    { id: 'mp3_player', cost: { money: 500 }, effect: { maxMood: 5 } },
    { id: 'smartphone', cost: { money: 1500 }, effect: { maxMood: 15 } },
    { id: 'home_renovation', cost: { money: 15000 }, effect: { maxMood: 25 } },
    { id: 'car', cost: { money: 50000 }, effect: { maxMood: 45 } },
];

export const PERFORMANCE: ActionableItem[] = [
    { id: 'dumbbell', cost: { money: 500 }, effect: { maxStamina: 5 } },
    { id: 'gym_membership', cost: { money: 1500 }, effect: { maxStamina: 10 } },
    { id: 'treadmill', cost: { money: 15000 }, effect: { maxStamina: 25 } },
    { id: 'personal_trainer', cost: { money: 50000 }, effect: { maxStamina: 45 } },
];