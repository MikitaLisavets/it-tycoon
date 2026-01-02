import { Job } from '../types';

export const JOBS: Record<string, Job> = {
    begging: { title: 'Begging', type: 'manual', income: 1, cost: { mood: 1 } },
    loader: { title: 'Loader', type: 'manual', income: 5, cost: { health: 2 } }, // cost is energy/satiety/mood cost
    salesman: { title: 'Salesman', type: 'manual', income: 10, cost: { mood: 3 } },
    dev: { title: 'Developer', type: 'passive', income: 50 },
    hacker: { title: 'Hacker', type: 'passive', income: 100 },
    ceo: { title: 'CEO', type: 'passive', income: 300 },
    investor: { title: 'Investor', type: 'passive', income: 500 }
};
