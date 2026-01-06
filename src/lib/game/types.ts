export type EducationId = 'none' | 'school' | 'college' | 'university';
export type JobId = 'none' | 'warehouse_worker' | 'courier' | 'office_worker' | 'web_dev' | 'senior_dev' | 'startup_founder' | 'it_investor';

// Banking Types
export interface GameDate {
    day: number;
    month: number;
    year: number;
    hour: number;
    minute: number;
}

export interface CreditRecord {
    id: string;
    amount: number;           // Original amount borrowed
    totalDue: number;         // Amount + interest to repay
    interestRate: number;     // Percentage (e.g., 10 for 10%)
    takenAt: GameDate;        // When credit was taken
    dueDate: GameDate;        // When repayment is due
    termDays: number;         // Duration in game days
}

export interface DepositRecord {
    id: string;
    amount: number;           // Deposited amount
    interestRate: number;     // Monthly percentage (e.g., 2 for 2%)
    startDate: GameDate;      // When deposit was made
    accumulatedInterest: number; // Total interest earned so far
}

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
        modem: string;
        cpu: string;
        hdd: string;
        ram: string;
        video: string;
        printer: string;
        scanner: string;
        cd_rom: string;
        sound: string;
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
        games: string;
    };

    // Internet
    internet: {
        access: string;
    };

    // Education Costs/Status
    educationProgress: {
        completedTracks: EducationId[];
        activeTrackId: EducationId | null;
        currentPartIndex: number;
        status: 'idle' | 'studying' | 'quiz';
        startTime?: number;
    };
    jobLevels: Record<string, number>; // jobId -> level (0-10)
    jobExp: Record<string, number>;    // jobId -> exp
    cooldowns: Record<string, number>; // activityId -> timestamp
    date: {
        day: number;
        month: number;
        year: number;
        hour: number;
        minute: number;
    };
    gameOver: boolean;
    gameOverReason?: 'health' | 'mood' | 'credit';

    // Banking
    banking: {
        credits: CreditRecord[];
        deposits: DepositRecord[];
    };
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
        monitor: "monitor_basic",
        modem: "modem_none",
        cpu: "intel_386",
        hdd: "170mb_hdd",
        ram: "4mb_ram",
        video: "vga_card",
        printer: "none",
        scanner: "none",
        cd_rom: "none",
        sound: "none",
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
        games: "none",
    },

    internet: {
        access: "none",
    },

    educationProgress: {
        completedTracks: [],
        activeTrackId: null,
        currentPartIndex: 0,
        status: 'idle',
    },
    jobLevels: {
        warehouse_worker: 0,
        courier: 0,
        office_worker: 0,
        web_dev: 0,
        senior_dev: 0,
        startup_founder: 0,
        it_investor: 0,
    },
    jobExp: {
        warehouse_worker: 0,
        courier: 0,
        office_worker: 0,
        web_dev: 0,
        senior_dev: 0,
        startup_founder: 0,
        it_investor: 0,
    },

    cooldowns: {},

    // Time
    date: {
        day: 1,
        month: 1,
        year: 2000,
        hour: 0,
        minute: 0,
    },
    gameOver: false,
    gameOverReason: undefined,

    // Banking
    banking: {
        credits: [],
        deposits: [],
    },
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