export const GAME_CONSTANTS = {
    TICK_RATE_MS: 1000,
    GAME_MINUTES_PER_TICK: 30,
    DAY_LENGTH_MINUTES: 24 * 60, // 1440
    DECAY_RATES: {
        HEALTH_PER_TICK: 0, //0.3,   // Slower decay
        MOOD_PER_TICK: 0, //0.2,     // Slower decay
        STAMINA_PER_TICK: 0, //0.05, // Much slower decay
    },
    GAME_OVER_THRESHOLD: -50, // Less harsh
};
