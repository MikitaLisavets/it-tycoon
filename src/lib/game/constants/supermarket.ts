import { ActionableItem } from "../types";

export const FOOD_ITEMS: ActionableItem[] = [
    { id: 'snack', cost: { money: 5 }, effect: { health: 10 } },
    { id: 'fastfood', cost: { money: 15 }, effect: { health: 30 } },
    { id: 'restaurant', cost: { money: 50 }, effect: { health: 80 } },
    { id: 'energy_drink', cost: { money: 5, health: 5 }, effect: { stamina: 10 } },
];
