import { Cost } from "../types";

export type SoftwareType = 'system' | 'programs' | 'antivirus' | 'games';
export type SoftwareCategory = SoftwareType | 'home';

export interface Requirements {
    computerTier?: number;
    system?: string;
}

export interface SoftwareItem {
    id: string;
    category: SoftwareType;
    cost?: Cost;
    requirements?: Requirements;
}

export const SOFTWARES: Record<SoftwareType, SoftwareItem[]> = {
    system: [
        { id: "winos_95", category: 'system' },
        { id: "winos_98", cost: { money: 300 }, category: 'system', requirements: { computerTier: 1 } },
        { id: "winos_xp", cost: { money: 800 }, category: 'system', requirements: { computerTier: 2 } },
        { id: "winos_7", cost: { money: 1500 }, category: 'system', requirements: { computerTier: 3 } },
        { id: "winos_10", cost: { money: 3000 }, category: 'system', requirements: { computerTier: 4 } },
        { id: "winos_11", cost: { money: 6000 }, category: 'system', requirements: { computerTier: 5 } },
    ],
    programs: [
        { id: "software_notepad", cost: { money: 100 }, category: 'programs', requirements: { system: 'winos_xp' } },
        { id: "software_office", cost: { money: 500 }, category: 'programs', requirements: { system: 'winos_98' } },
        { id: "software_code_editor", cost: { money: 800 }, category: 'programs', requirements: { system: 'winos_7' } },
        { id: "software_web_wallet", cost: { money: 1500 }, category: 'programs', requirements: { system: 'winos_10' } },
        { id: "software_3d_studio", cost: { money: 5000 }, category: 'programs', requirements: { system: 'winos_11' } },
    ],
    antivirus: [
        { id: "software_antivirus", cost: { money: 300 }, category: 'antivirus' },
    ],
    games: [
        { id: "solitaire", category: 'games' },
    ]
};

