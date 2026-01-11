import { ActionableItem } from "../types";

export const FOOD_ITEMS: ActionableItem[] = [
    { id: 'snack', cost: { money: 10 }, effect: { health: 10 } },
    { id: 'burger', cost: { money: 30 }, effect: { health: 30 } },
    { id: 'pizza', cost: { money: 60 }, effect: { health: 50 } },
    { id: 'kebab', cost: { money: 45 }, effect: { health: 40 } },
    { id: 'energy_drink', cost: { money: 15, health: 5 }, effect: { stamina: 10 } },
];


export const FURNITURE_ITEMS: ActionableItem[] = [
    { id: 'ikea_basic', cost: { money: 1500 }, effect: { maxMood: 15 }, isOneTime: true },
    { id: 'designer_set', cost: { money: 8000 }, effect: { maxMood: 40 }, isOneTime: true },
    { id: 'luxury_italian', cost: { money: 25000 }, effect: { maxMood: 100 }, isOneTime: true },
];

export const CLOTHES_ITEMS: ActionableItem[] = [
    { id: 'casual_wear', cost: { money: 500 }, effect: { maxHealth: 5 }, isOneTime: true },
    { id: 'business_suit', cost: { money: 3000 }, effect: { maxHealth: 20 }, isOneTime: true },
    { id: 'designer_brand', cost: { money: 12000 }, effect: { maxHealth: 50 }, isOneTime: true },
];