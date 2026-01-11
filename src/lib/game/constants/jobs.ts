import { Job, JobId } from '../types';

export const JOBS: Partial<Record<JobId, Job>> = {
    none: {
        id: 'none',
        income: 0
    },
    warehouse_worker: {
        id: 'warehouse_worker',
        income: 2,
        cost: { stamina: 1 }
    },
    courier: {
        id: 'courier',
        income: 5,
        cost: { health: 1, stamina: 3, mood: 2 },
        requirements: {
            previousJob: "warehouse_worker",
            mood: 30
        }
    },
    office_worker: {
        id: 'office_worker',
        income: 12,
        cost: { mood: 3, stamina: 4, health: 1 },
        requirements: {
            previousJob: "courier",
            education: 'school',
            mood: 40,
            software: "software_office"
        }
    },
    web_dev: {
        id: 'web_dev',
        income: 25,
        cost: { mood: 5, stamina: 5, health: 2 },
        requirements: {
            education: "college",
            previousJob: "office_worker",
            mood: 45,
            software: "software_notepad"
        }
    },
    senior_dev: {
        id: 'senior_dev',
        income: 60,
        cost: { stamina: 8, mood: 8, health: 3 },
        requirements: {
            education: "university",
            previousJob: "web_dev",
            mood: 60,
            software: "software_code_editor"
        }
    },
    startup_founder: {
        id: 'startup_founder',
        income: 150,
        cost: { stamina: 15, mood: 12, health: 5 },
        requirements: {
            education: "university",
            previousJob: "senior_dev",
            mood: 70,
            software: "software_web_wallet"
        }
    },
    it_investor: {
        id: 'it_investor',
        income: 400,
        cost: { stamina: 25, mood: 20, health: 10 },
        requirements: {
            education: "university",
            previousJob: "startup_founder",
            mood: 80,
            software: "software_investor"
        }
    }
};
