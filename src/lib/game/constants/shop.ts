import { ActionableItem } from "../types";

export const FOOD_ITEMS: ActionableItem[] = [
    { id: 'snack', cost: { money: 5 }, effect: { health: 10 } },
    { id: 'burger', cost: { money: 15 }, effect: { health: 30 } },
    { id: 'pizza', cost: { money: 25 }, effect: { health: 50 } },
    { id: 'kebab', cost: { money: 20 }, effect: { health: 40 } },
    { id: 'energy_drink', cost: { money: 5, health: 5 }, effect: { stamina: 10 } },
];


export const FURNITURE_ITEMS: ActionableItem[] = [
    { id: 'ikea_basic', cost: { money: 500 }, effect: { maxMood: 10 }, isOneTime: true },
    { id: 'designer_set', cost: { money: 2000 }, effect: { maxMood: 25 }, isOneTime: true },
    { id: 'luxury_italian', cost: { money: 5000 }, effect: { maxMood: 50 }, isOneTime: true },
];

export const CLOTHES_ITEMS: ActionableItem[] = [
    { id: 'casual_wear', cost: { money: 200 }, effect: { maxHealth: 5 }, isOneTime: true },
    { id: 'business_suit', cost: { money: 1000 }, effect: { maxHealth: 15 }, isOneTime: true },
    { id: 'designer_brand', cost: { money: 3000 }, effect: { maxHealth: 30 }, isOneTime: true },
];