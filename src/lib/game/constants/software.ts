export interface SoftwareItem {
    id: string;
    level: number;
    price: number;
    category: 'system' | 'office' | 'graphics' | 'antivirus' | 'games';
    requirements?: Requirements;
}

export const SOFTWARES: Record<string, SoftwareItem[]> = {
    system: [
        { id: "winos_95", level: 0, price: 0, category: 'system' },
        { id: "winos_98", level: 2, price: 300, category: 'system', requirements: { computerTier: 1 } },
        { id: "winos_xp", level: 3, price: 800, category: 'system', requirements: { computerTier: 2 } },
        { id: "winos_7", level: 4, price: 1500, category: 'system', requirements: { computerTier: 3 } },
        { id: "winos_10", level: 5, price: 3000, category: 'system', requirements: { computerTier: 4 } },
        { id: "winos_11", level: 6, price: 6000, category: 'system', requirements: { computerTier: 5 } },
    ],
    office: [
        { id: "none", level: 0, price: 0, category: 'office' },
        { id: "textpad", level: 1, price: 50, category: 'office' },
        { id: "easy_office_97", level: 2, price: 200, category: 'office' },
        { id: "microhard_office_2000", level: 3, price: 500, category: 'office' },
        { id: "office_xp_pro", level: 4, price: 1000, category: 'office' },
        { id: "office_365_cloud", level: 5, price: 2500, category: 'office' },
    ],
    graphics: [
        { id: "none", level: 0, price: 0, category: 'graphics' },
        { id: "paint_simple", level: 1, price: 50, category: 'graphics' },
        { id: "pixel_master_pro", level: 2, price: 250, category: 'graphics' },
        { id: "photoshop_pro_7", level: 3, price: 600, category: 'graphics' },
        { id: "3d_studio_max", level: 4, price: 1500, category: 'graphics' },
        { id: "adobe_suite_cc", level: 5, price: 3500, category: 'graphics' },
    ],
    antivirus: [
        { id: "none", level: 0, price: 0, category: 'antivirus' },
        { id: "novitus_free", level: 1, price: 20, category: 'antivirus' },
        { id: "shield_plus_2000", level: 2, price: 150, category: 'antivirus' },
        { id: "total_security_2000", level: 3, price: 400, category: 'antivirus' },
        { id: "norton_antivirus", level: 4, price: 800, category: 'antivirus' },
        { id: "kaspersky_internet_sec", level: 5, price: 1500, category: 'antivirus' },
    ],
    games: [
        { id: "none", level: 0, price: 0, category: 'games' },
        { id: "solitaire", level: 1, price: 0, category: 'games' },
        { id: "minesweeper", level: 2, price: 0, category: 'games' },
        { id: "doom_classic", level: 3, price: 50, category: 'games' },
        { id: "simcity_2000", level: 4, price: 200, category: 'games' },
        { id: "half_life", level: 5, price: 500, category: 'games' },
        { id: "world_of_warcraft", level: 6, price: 1000, category: 'games' },
    ]
};

export const SOFTWARE_LEVELS: Record<string, number> = Object.values(SOFTWARES).flat().reduce((acc, item) => {
    acc[item.id] = item.level;
    return acc;
}, {} as Record<string, number>);
