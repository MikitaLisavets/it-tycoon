/**
 * Calculate income based on level using clicker-game-style exponential scaling
 * Formula: baseIncome * (1.1 ^ level)
 * 
 * This provides satisfying progression typical of idle/clicker games:
 * - Level 0: 1.0x base
 * - Level 5: 1.61x base
 * - Level 10: 2.59x base
 * 
 * @param baseIncome - The base income for the job
 * @param level - Current level (0-10)
 * @returns Total income at the given level
 */
export function calculateLevelIncome(baseIncome: number, level: number): number {
    const multiplier = Math.pow(1.1, level);
    return baseIncome * multiplier;
}

/**
 * Calculate just the bonus portion of income (excluding base)
 * 
 * @param baseIncome - The base income for the job
 * @param level - Current level (0-10)
 * @returns Bonus income earned from leveling
 */
export function calculateLevelBonus(baseIncome: number, level: number): number {
    const totalIncome = calculateLevelIncome(baseIncome, level);
    return totalIncome - baseIncome;
}
