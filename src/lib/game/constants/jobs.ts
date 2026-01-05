import { Job, JobId } from '../types';

export const JOBS: Partial<Record<JobId, Job>> = {
    none: {
        id: 'none',
        income: 0
    },
    warehouse_worker: {
        id: 'warehouse_worker',
        income: 1,
        cost: { mood: 1, stamina: 1 }
    },
    courier: {
        id: 'courier',
        income: 3,
        cost: { health: 1, stamina: 2 },
        requirements: {
            previousJob: "warehouse_worker",
            mood: 30
        }
    },
    office_worker: {
        id: 'office_worker',
        income: 8,
        cost: { mood: 1, stamina: 3 },
        requirements: {
            previousJob: "courier",
            education: 'school',
            mood: 40
        }
    },
    web_dev: {
        id: 'web_dev',
        income: 15,
        cost: { mood: 1, stamina: 3 },
        requirements: {
            education: "college",
            computerTier: 1,
            previousJob: "office_worker",
            mood: 45
        }
    },
    senior_dev: {
        id: 'senior_dev',
        income: 40,
        cost: { stamina: 4, mood: 2 },
        requirements: {
            education: "university",
            computerTier: 2,
            previousJob: "web_dev",
            mood: 60
        }
    },
    startup_founder: {
        id: 'startup_founder',
        income: 80,
        cost: { stamina: 5, mood: 3, health: 1 },
        requirements: {
            education: "university",
            computerTier: 3,
            previousJob: "senior_dev",
            mood: 70
        }
    },
    it_investor: {
        id: 'it_investor',
        income: 100,
        cost: { stamina: 8, mood: 5, health: 2 },
        requirements: {
            education: "university",
            computerTier: 4,
            previousJob: "startup_founder",
            mood: 80
        }
    }
};
