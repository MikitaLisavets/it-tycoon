import { GameState } from "../types";

/**
 * Calculate the global inflation multiplier based on player progress.
 * We use the sum of all job levels as the primary metric for progress.
 * 
 * Formula: 1.2 ^ (TotalLevel / 5)
 * This ensures that as the player moves to higher-tier jobs and levels them up,
 * the cost of living (food, entertainment) increases to stay relevant.
 */
export function getInflationMultiplier(state: GameState): number {
    const totalJobLevels = Object.values(state.jobLevels).reduce((sum, lvl) => sum + lvl, 0);

    // Scale factor: 1.2 ^ (levels / 5)
    // At Level 0: 1.0x
    // At Level 5: 1.2x
    // At Level 20: 2.07x
    // At Level 70 (Max): ~12.8x
    return Math.pow(1.2, totalJobLevels / 5);
}

/**
 * Calculate the dynamic price of an item based on current game inflation.
 */
export function calculateDynamicPrice(basePrice: number, state: GameState): number {
    if (basePrice <= 0) return 0;
    const multiplier = getInflationMultiplier(state);
    return basePrice * multiplier;
}
