import { Job } from '../types';

export const JOBS: Record<string, Job> = {
    begging: {
        title: 'Begging',
        type: 'manual',
        income: 1,
        cost: { mood: 1 }
    },
    loader: {
        title: 'Loader',
        type: 'manual',
        income: 5,
        cost: { health: 2 },
        requirements: { stamina: 70 }
    },
    salesman: {
        title: 'Salesman',
        type: 'manual',
        income: 10,
        cost: { mood: 3 },
        requirements: { education: 'school' }
    },
    dev: {
        title: 'Developer',
        type: 'passive',
        income: 50,
        requirements: { education: 'college', computerTier: 1 }
    },
    hacker: {
        title: 'Hacker',
        type: 'passive',
        income: 100,
        requirements: { education: 'college', computerTier: 1 }
    },
    ceo: {
        title: 'CEO',
        type: 'passive',
        income: 300,
        requirements: { education: 'university', stamina: 80 }
    },
    investor: {
        title: 'Investor',
        type: 'passive',
        income: 500,
        requirements: { education: 'university', money: 100000, computerTier: 2 }
    }
};
