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
        reward: 50,
        risk: 0.1,
        fine: 100,
        duration: 3
    },
    {
        id: 'small_business',
        reward: 200,
        risk: 0.25,
        fine: 500,
        duration: 5
    },
    {
        id: 'regional_bank',
        reward: 1000,
        risk: 0.4,
        fine: 2000,
        duration: 8
    },
    {
        id: 'government_database',
        reward: 5000,
        risk: 0.6,
        fine: 10000,
        duration: 12
    },
    {
        id: 'global_stock_exchange',
        reward: 25000,
        risk: 0.8,
        fine: 50000,
        duration: 20
    }
];
