export const GAME_CONSTANTS = {
    GAME_NAME: 'desktop-life',
    TICK_RATE_MS: 1000,
    GAME_MINUTES_PER_TICK: 30,
    DAY_LENGTH_MINUTES: 24 * 60, // 1440
    DECAY_RATES: {
        HEALTH_PER_TICK: 0.1,   // Slower decay
        MOOD_PER_TICK: 0.1,     // Slower decay
        STAMINA_PER_TICK: 0.5, // +1 every 2 seconds (0.5 per tick)
    },
    GAME_OVER_THRESHOLD: 0, // Game over at 0
    CRITICAL_THRESHOLD: 10, // Warning/Red text threshold
    VIRUS_PROBABILITY_PER_TICK: 0.01, // 1% chance per tick
    VIRUS_MOOD_PENALTY: 5,
    ANTI_VIRUS_PROTECTION_DAYS: 5,
};
