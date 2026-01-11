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
    duration?: number;
}

export const SOFTWARES: Record<SoftwareType, SoftwareItem[]> = {
    system: [
        { id: "winos_95", category: 'system' },
        { id: "winos_98", cost: { money: 400 }, category: 'system', requirements: { computerTier: 1 }, duration: 10 },
        { id: "winos_xp", cost: { money: 1200 }, category: 'system', requirements: { computerTier: 2 }, duration: 20 },
        { id: "winos_7", cost: { money: 3000 }, category: 'system', requirements: { computerTier: 3 }, duration: 30 },
        { id: "winos_10", cost: { money: 8000 }, category: 'system', requirements: { computerTier: 4 }, duration: 45 },
        { id: "winos_11", cost: { money: 20000 }, category: 'system', requirements: { computerTier: 5 }, duration: 60 },
    ],
    programs: [
        { id: "software_office", cost: { money: 200 }, category: 'programs', requirements: { system: 'winos_98' }, duration: 2 },
        { id: "software_notepad", cost: { money: 800 }, category: 'programs', requirements: { system: 'winos_xp' }, duration: 2 },
        { id: "software_code_editor", cost: { money: 2500 }, category: 'programs', requirements: { system: 'winos_7' }, duration: 2 },
        { id: "software_web_wallet", cost: { money: 6000 }, category: 'programs', requirements: { system: 'winos_10' }, duration: 2 },
        { id: "software_investor", cost: { money: 15000 }, category: 'programs', requirements: { system: 'winos_11' }, duration: 2 },
    ],
    antivirus: [
        { id: "software_antivirus", cost: { money: 300 }, category: 'antivirus', duration: 10 },
    ],
    games: [
        { id: "solitaire", cost: { money: 50 }, category: 'games', duration: 2 },
    ]
};

