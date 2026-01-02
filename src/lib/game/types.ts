export interface GameState {
    version: number;
    locale: 'en' | 'de';
    // Personal Status
    money: number;
    status: string;
    job: string;
    mood: number;
    satiety: number;
    education: string;
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
    };
}

export const INITIAL_STATE: GameState = {
    version: 1,
    locale: 'en',
    money: 122,
    status: "newbie",
    job: "loader",
    mood: 3,
    satiety: -11,
    education: "basic",
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
};
