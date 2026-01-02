import { Job } from '../types';

export const JOBS: Record<string, Job> = {
    loader: { title: 'Loader', type: 'manual', income: 5, cost: 2 }, // cost is energy/satiety/mood cost
    salesman: { title: 'Salesman', type: 'manual', income: 10, cost: 3 },
    junior_dev: { title: 'Jun. Developer', type: 'passive', income: 10 }, // income per tick? per hour? Let's say per hour.
    middle_dev: { title: 'Mid. Developer', type: 'passive', income: 25 },
    senior_dev: { title: 'Sen. Developer', type: 'passive', income: 50 },
    lead_dev: { title: 'Lead Developer', type: 'passive', income: 100 },
};
