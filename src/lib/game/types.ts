export type EducationLevel = 'none' | 'school' | 'college' | 'university';
export type JobId = 'none' | 'beggar' | 'loader' | 'salesman' | 'dev' | 'hacker' | 'ceo' | 'investor';

export interface GameState {
    version: number;
    locale: 'en' | 'de';
    // Personal Status
    money: number;
    job: JobId;
    mood: number;
    health: number;
    stamina: number;
    education: EducationLevel;
    english: string;

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
    mood: 50,
    health: 50,
    stamina: 30,
    education: "none",
    english: "none",

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

    // Time
    date: {
        day: 1,
        month: 1,
        year: 2000,
        hour: 9,
        minute: 0,
    },
    gameOver: false,
};

export interface JobRequirements {
    education?: EducationLevel;
    courses?: string[];
    computerTier?: number;
    money?: number;
    health?: number;
    stamina?: number;
}

export interface Job {
    title: string;
    type: 'manual' | 'passive';
    income: number;
    cost?: { health?: number; mood?: number; stamina?: number };
    requirements?: JobRequirements;
}

export interface FoodItem {
    id: string;
    name: string;
    cost: number;
    health: number;
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

