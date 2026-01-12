export interface HackingTarget {
    id: string;
    reward: number;
    risk: number; // 0-1, probability of failure
    fine: number; // money lost on failure
    duration: number; // seconds for the animation
}

export const HACKING_TARGETS: HackingTarget[] = [
    {
        id: 'local_shop',
        reward: 100,
        risk: 0.1,
        fine: 300,
        duration: 3
    },
    {
        id: 'small_business',
        reward: 500,
        risk: 0.2,
        fine: 1000,
        duration: 5
    },
    {
        id: 'regional_bank',
        reward: 3000,
        risk: 0.4,
        fine: 10000,
        duration: 8
    },
    {
        id: 'government_database',
        reward: 15000,
        risk: 0.6,
        fine: 50000,
        duration: 12
    },
    {
        id: 'global_stock_exchange',
        reward: 100000,
        risk: 0.8,
        fine: 300000,
        duration: 20
    }
];
