export type EducationId = 'none' | 'school' | 'college' | 'university';
export type JobId = 'none' | 'warehouse_worker' | 'courier' | 'office_worker' | 'junior_dev' | 'senior_dev' | 'startup_founder' | 'it_investor';

export interface GameState {
    version: number;
    locale: 'en' | 'de';
    money: number;
    job: JobId;
    mood: number;
    maxMood: number;
    health: number;
    maxHealth: number;
    stamina: number;
    maxStamina: number;
    education: EducationId;
    english: string;
    volume: number;

    // Computer Hardware
    computer: {
        monitor: string;
        printer: string;
        scanner: string;
        modem: string;
        cpu: string;
        hdd: string;
        cd_rom: string;
        ram: string;
        sound: string;
        video: string;
    };

    // My Life / Assets
    life: {
        rooms: number;
        furniture: string;
        kitchen: string;
        bathroom: string;
        clothes: string;
        car: string;
    };

    // Programs / Software
    programs: {
        system: string;
        office: string;
        graphics: string;
        antivirus: string;
    };

    // Internet
    internet: {
        access: string;
    };

    // Education Costs/Status
    educationState: {
        school: string;
        english: string;
        courses: string;
    },
    jobLevels: Record<string, number>; // jobId -> level (0-10)
    jobExp: Record<string, number>;    // jobId -> exp
    cooldowns: {
        rest: Record<string, number>; // activityId -> timestamp
    };
    date: {
        day: number;
        month: number;
        year: number;
        hour: number;
        minute: number;
    };
    gameOver: boolean;
}

export const INITIAL_STATE: GameState = {
    version: 1,
    locale: 'en',
    money: 100,
    job: "none",
    mood: 51,
    maxMood: 100,
    health: 51,
    maxHealth: 100,
    stamina: 29,
    maxStamina: 100,
    education: "none",
    english: "none",
    volume: 50,

    computer: {
        monitor: "none",
        printer: "none",
        scanner: "none",
        modem: "none",
        cpu: "intel_486",
        hdd: "none",
        cd_rom: "none",
        ram: "none",
        sound: "none",
        video: "none",
    },

    life: {
        rooms: 2,
        furniture: "used",
        kitchen: "small",
        bathroom: "bucket",
        clothes: "ragged",
        car: "no_car",
    },

    programs: {
        system: "none",
        office: "none",
        graphics: "none",
        antivirus: "none",
    },

    internet: {
        access: "none",
    },

    educationState: {
        school: "not_studying",
        english: "not_studying",
        courses: "not_studying",
    },
    jobLevels: {
        warehouse_worker: 0,
        courier: 0,
        office_worker: 0,
        junior_dev: 0,
        senior_dev: 0,
        startup_founder: 0,
        it_investor: 0,
    },
    jobExp: {
        warehouse_worker: 0,
        courier: 0,
        office_worker: 0,
        junior_dev: 0,
        senior_dev: 0,
        startup_founder: 0,
        it_investor: 0,
    },

    cooldowns: {
        rest: {},
    },

    // Time
    date: {
        day: 1,
        month: 1,
        year: 2000,
        hour: 0,
        minute: 0,
    },
    gameOver: false,
};

export interface JobRequirements {
    education?: EducationId;
    computerTier?: number;
    previousJob?: JobId;
    mood?: number;
}

export interface Job {
    id: JobId;
    income: number;
    cost?: { health?: number; mood?: number; stamina?: number };
    requirements?: JobRequirements;
}

export interface Cost {
    money?: number;
    health?: number;
    mood?: number;
    stamina?: number;
}

export interface Effect {
    money?: number;
    health?: number | 'full';
    mood?: number | 'full';
    stamina?: number | 'full';
}

export interface ActionableItem {
    id: string;
    duration?: number;
    cost?: Cost;
    cooldown?: number;
    effect?: Effect;
}

export interface FoodItem {
    id: string;
    name: string;
    cost: number;
    health: number;
    stamina?: number;
}

export interface FunItem {
    id: string;
    name: string;
    cost: number;
    mood: number;
}

export interface GymActivity {
    id: string;
    name: string;
    cost: number;
    stamina: number;
    health?: number;
    mood?: number;
}

