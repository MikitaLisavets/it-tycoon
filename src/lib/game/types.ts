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

export type LogType = 'solitaire_win' | 'solitaire_play' | 'hack_success' | 'game_start' | 'job_apply' | 'achievement_unlock' | 'goal_complete' | 'info' | 'warning' | 'error' | 'success' | 'minesweeper_play' | 'minesweeper_win';

export interface LogEntry {
    id: string;
    type: LogType;
    text: string;
    timestamp: number;
    data?: any;
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

export interface PlayerStats {
    money: number;
    mood: number;
    maxMood: number;
    health: number;
    maxHealth: number;
    stamina: number;
    maxStamina: number;
    education: EducationId;
}

export interface GameState {
    version: number;
    locale: 'en' | 'de' | 'fr' | 'es' | 'ru' | 'sv' | 'pl';
    volume: number;
    stats: PlayerStats;

    // Computer Hardware
    computer: {
        monitor: string;
        modem: string;
        cpu: string;
        hdd: string;
        ram: string;
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
    software: {
        system: string;
        ownedSystems: string[];
        antivirus: string;
        games: string[];
        programs: string[];
        protectionUntilDay?: number;
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

    // Job
    job: {
        id: JobId;
        levels: Record<string, number>; // jobId -> level (0-10)
        exp: Record<string, number>;    // jobId -> exp
    };

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

    // Apps State
    apps: {
        solitaire: SolitaireState | null;
        minesweeper: MinesweeperState | null;
    };

    purchasedItems: string[];
    goals: { id: string, text: string, completed: boolean }[];
    achievements: string[];
    logs: LogEntry[];
}

export const INITIAL_STATE: GameState = {
    version: 1,
    locale: 'en',
    volume: 50,
    stats: {
        money: 100,
        mood: 50,
        maxMood: 100,
        health: 50,
        maxHealth: 100,
        stamina: 30,
        maxStamina: 100,
        education: "none",
    },

    computer: {
        monitor: "monitor_basic",
        modem: "modem_none",
        cpu: "intel_386",
        hdd: "170mb_hdd",
        ram: "4mb_ram",
        video: "vga_card",
    },

    life: {
        rooms: 2,
        furniture: "used",
        kitchen: "small",
        bathroom: "bucket",
        clothes: "ragged",
        car: "no_car",
    },

    software: {
        system: "os_95",
        ownedSystems: ["os_95"],
        games: [],
        programs: [],
        antivirus: "none",
        protectionUntilDay: 0,
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

    job: {
        id: "none",
        levels: {
            warehouse_worker: 0,
            courier: 0,
            office_worker: 0,
            web_dev: 0,
            senior_dev: 0,
            startup_founder: 0,
            it_investor: 0,
        },
        exp: {
            warehouse_worker: 0,
            courier: 0,
            office_worker: 0,
            web_dev: 0,
            senior_dev: 0,
            startup_founder: 0,
            it_investor: 0,
        },
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

    apps: {
        solitaire: null,
        minesweeper: null
    },

    purchasedItems: [],
    goals: [
        { id: 'get_job', text: "Goals.get_job", completed: false },
        { id: 'internet_access', text: "Goals.internet_access", completed: false },
        { id: 'upgrade_pc', text: "Goals.upgrade_pc", completed: false },
        { id: 'deposit', text: "Goals.deposit", completed: false },
        { id: 'complete_school', text: "Goals.complete_school", completed: false },
        { id: 'reach_1000', text: "Goals.reach_1000", completed: false },
        { id: 'buy_first_software', text: "Goals.buy_first_software", completed: false },
        { id: 'get_office_job', text: "Goals.get_office_job", completed: false },
        { id: 'play_solitaire', text: "Goals.play_solitaire", completed: false },
        { id: 'complete_college', text: "Goals.complete_college", completed: false },
        { id: 'become_developer', text: "Goals.become_developer", completed: false },
        { id: 'hack', text: "Goals.hack", completed: false },
        { id: 'reach_10000', text: "Goals.reach_10000", completed: false },
    ],
    achievements: [],
    logs: []
};

// Solitaire Types
export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
    suit: Suit;
    rank: Rank;
    isFaceUp: boolean;
    id: string;
}

export type Pile = Card[];

export interface SolitaireState {
    stock: Pile;
    waste: Pile;
    foundation: Record<Suit, Pile>;
    tableau: Pile[];
    isWon: boolean;
}

// Minesweeper Types
export interface MinesweeperCell {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    neighborMines: number;
    id: string; // row-col
}

export interface MinesweeperState {
    grid: MinesweeperCell[][];
    isWon: boolean;
    isLost: boolean;
    startTime: number | null;
    flagsPlaced: number;
    totalMines: number;
    difficulty: 'beginner' | 'intermediate' | 'expert';
}

export interface JobRequirements {
    education?: EducationId;
    computerTier?: number;
    previousJob?: JobId;
    mood?: number;
    software?: string;
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
    maxHealth?: number;
    mood?: number | 'full';
    maxMood?: number;
    stamina?: number | 'full';
    maxStamina?: number;
}

export interface ActionableItem {
    id: string;
    duration?: number;
    cost?: Cost;
    cooldown?: number;
    effect?: Effect;
    isOneTime?: boolean;
}