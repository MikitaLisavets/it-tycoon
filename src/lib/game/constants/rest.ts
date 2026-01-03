export interface RestActivity {
    id: 'short_break' | 'sleep';
    name: string; // Translation key suffix
    duration: number; // in seconds
    stamina: number | 'full';
    cost?: {
        money: number;
        health: number;
    };
    cooldown: number; // in milliseconds
}

export const REST_ACTIVITIES: RestActivity[] = [
    {
        id: 'short_break',
        name: 'short_break',
        duration: 10,
        stamina: 20,
        cooldown: 60 * 1000 // 1 minute cooldown
    },
    {
        id: 'sleep',
        name: 'sleep',
        duration: 20,
        stamina: 'full',
        cooldown: 5 * 60 * 1000 // 5 minutes cooldown
    }
];
