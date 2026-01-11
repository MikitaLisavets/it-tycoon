import { Job, JobId } from '../types';

export const JOBS: Partial<Record<JobId, Job>> = {
    none: {
        id: 'none',
        income: 0
    },
    warehouse_worker: {
        id: 'warehouse_worker',
        income: 1,
        cost: { stamina: 1 }
    },
    courier: {
        id: 'courier',
        income: 3,
        cost: { stamina: 2, mood: 1 },
        requirements: {
            previousJob: "warehouse_worker",
            mood: 30
        }
    },
    office_worker: {
        id: 'office_worker',
        income: 9,
        cost: { mood: 1, stamina: 2, health: 1 },
        requirements: {
            previousJob: "courier",
            education: 'school',
            mood: 40,
            software: "software_office"
        }
    },
    web_dev: {
        id: 'web_dev',
        income: 27,
        cost: { mood: 2, stamina: 3, health: 1 },
        requirements: {
            education: "college",
            previousJob: "office_worker",
            mood: 45,
            software: "software_notepad"
        }
    },
    senior_dev: {
        id: 'senior_dev',
        income: 81,
        cost: { stamina: 4, mood: 3, health: 2 },
        requirements: {
            education: "university",
            previousJob: "web_dev",
            mood: 60,
            software: "software_code_editor"
        }
    },
    startup_founder: {
        id: 'startup_founder',
        income: 243,
        cost: { stamina: 5, mood: 4, health: 3 },
        requirements: {
            education: "university",
            previousJob: "senior_dev",
            mood: 70,
            software: "software_web_wallet"
        }
    },
    it_investor: {
        id: 'it_investor',
        income: 486,
        cost: { stamina: 10, mood: 5, health: 5 },
        requirements: {
            education: "university",
            previousJob: "startup_founder",
            mood: 80,
            software: "software_investor"
        }
    }
};
