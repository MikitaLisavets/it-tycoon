"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { GameState, INITIAL_STATE } from '../lib/game/types';
import { GAME_CONSTANTS, JOBS } from '../lib/game/constants/index';
import { cheatManager, CHEATS } from '../lib/game/cheats';

const STORAGE_KEY = `${GAME_CONSTANTS.GAME_NAME}-state`;

interface GameStateContextType {
    state: GameState;
    updateState: (updates: Partial<GameState> | ((prev: GameState) => Partial<GameState>)) => void;
    resetState: () => void;
    isInitialized: boolean;
    isPaused: boolean;
    setIsPaused: (paused: boolean) => void;
}

const GameStateContext = createContext<GameStateContextType | null>(null);

function useGameStateInternal() {
    const [state, setState] = useState<GameState>(INITIAL_STATE);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // ... (existing useEffects for load/save/loop remain unchanged, I will just wrap dispatch around setState)

    // Load from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);

                // Version check/migration logic
                if (!parsed.version || parsed.version < INITIAL_STATE.version) {
                    console.warn('Game state version mismatch. Resetting to initial state.');
                    setState(INITIAL_STATE);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATE));
                } else {
                    const mergedState = { ...INITIAL_STATE, ...parsed };

                    // Migration for Player Stats
                    if (parsed.money !== undefined && !parsed.stats) {
                        mergedState.stats = {
                            money: parsed.money,
                            mood: parsed.mood ?? 50,
                            maxMood: parsed.maxMood ?? 100,
                            health: parsed.health ?? 50,
                            maxHealth: parsed.maxHealth ?? 100,
                            stamina: parsed.stamina ?? 30,
                            maxStamina: parsed.maxStamina ?? 100,
                            education: parsed.education ?? "none",
                        };
                        // Remove old properties
                        delete (mergedState as any).money;
                        delete (mergedState as any).mood;
                        delete (mergedState as any).maxMood;
                        delete (mergedState as any).health;
                        delete (mergedState as any).maxHealth;
                        delete (mergedState as any).stamina;
                        delete (mergedState as any).maxStamina;
                        delete (mergedState as any).education;
                    }

                    setState(mergedState);
                }
            } catch (error) {
                console.error('Failed to parse saved state:', error);
                setState(INITIAL_STATE);
            }
        }
        setIsInitialized(true);
    }, []);

    // Game Loop
    useEffect(() => {
        if (!isInitialized || state.gameOver || isPaused) return;

        const interval = setInterval(() => {
            setState((prev) => {
                const next = { ...prev };
                next.date = { ...prev.date };
                next.stats = { ...prev.stats };

                next.internet.access = next.computer.modem !== 'modem_none' ? 'yes' : 'none';

                // Update Time
                next.date.minute += GAME_CONSTANTS.GAME_MINUTES_PER_TICK;
                let hoursPassed = 0;

                if (next.date.minute >= 60) {
                    hoursPassed = Math.floor(next.date.minute / 60);
                    next.date.hour += hoursPassed;
                    next.date.minute %= 60;
                }

                if (next.date.hour >= 24) {
                    next.date.day += Math.floor(next.date.hour / 24);
                    next.date.hour %= 24;

                    if (next.date.day > 30) {
                        next.date.day = 1;
                        next.date.month += 1;
                        if (next.date.month > 12) {
                            next.date.month = 1;
                            next.date.year += 1;
                        }
                    }
                }

                next.stats.health = Math.max(0, next.stats.health - GAME_CONSTANTS.DECAY_RATES.HEALTH_PER_TICK);
                next.stats.mood = Math.max(0, next.stats.mood - GAME_CONSTANTS.DECAY_RATES.MOOD_PER_TICK);

                // Stamina Regen (Clamp to Max)
                const maxStamina = next.stats.maxStamina || 100; // Fallback
                next.stats.stamina = Math.min(maxStamina, Math.max(0, next.stats.stamina + GAME_CONSTANTS.DECAY_RATES.STAMINA_PER_TICK));

                // Check Game Over
                if (next.stats.health <= GAME_CONSTANTS.GAME_OVER_THRESHOLD) {
                    next.gameOverReason = 'health';
                    next.gameOver = true;
                }
                if (next.stats.mood <= GAME_CONSTANTS.GAME_OVER_THRESHOLD) {
                    next.gameOverReason = 'mood';
                    next.gameOver = true;
                }

                // Banking: Check credit due dates
                if (next.banking && next.banking.credits.length > 0) {
                    const currentDays = next.date.year * 360 + next.date.month * 30 + next.date.day;

                    for (const credit of next.banking.credits) {
                        const dueDays = credit.dueDate.year * 360 + credit.dueDate.month * 30 + credit.dueDate.day;
                        if (currentDays > dueDays) {
                            // Credit overdue - game over!
                            next.gameOver = true;
                            next.gameOverReason = 'credit';
                            break;
                        }
                    }
                }

                // Banking: Calculate deposit interest (on day change)
                if (next.banking && next.banking.deposits.length > 0 && hoursPassed > 0 && next.date.hour === 0) {
                    // Monthly interest: each 30 days
                    const currentDays = next.date.year * 360 + next.date.month * 30 + next.date.day;

                    next.banking = {
                        ...next.banking,
                        deposits: next.banking.deposits.map(deposit => {
                            const startDays = deposit.startDate.year * 360 + deposit.startDate.month * 30 + deposit.startDate.day;
                            const daysSinceStart = currentDays - startDays;

                            // Calculate daily interest (Monthly Rate / 30)
                            const dailyInterest = (deposit.amount * (deposit.interestRate / 100)) / 30;
                            return {
                                ...deposit,
                                accumulatedInterest: deposit.accumulatedInterest + dailyInterest,
                            };
                        }),
                    };
                }

                if (cheatManager.isCheatActive(CHEATS.G0D)) {
                    next.stats.money = 1000000;
                    next.stats.health = next.stats.maxHealth;
                    next.stats.mood = next.stats.maxMood;
                    next.stats.stamina = next.stats.maxStamina;
                }

                return next;
            });
        }, GAME_CONSTANTS.TICK_RATE_MS);

        return () => clearInterval(interval);
    }, [isInitialized, state.gameOver, isPaused]);

    // Save to localStorage on change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
    }, [state, isInitialized]);

    const updateState = (updates: Partial<GameState> | ((prev: GameState) => Partial<GameState>)) => {
        setState((prev) => {
            const nextUpdates = typeof updates === 'function' ? updates(prev) : updates;
            return { ...prev, ...nextUpdates };
        });
    };

    const resetState = () => {
        const currentLocale = state.locale;
        const currentVolume = state.volume;
        const freshState = JSON.parse(JSON.stringify(INITIAL_STATE));
        freshState.locale = currentLocale;
        freshState.volume = currentVolume;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(freshState));
        setState(freshState);
    };

    return {
        state,
        updateState,
        resetState,
        isInitialized,
        isPaused,
        setIsPaused
    };
}

export function GameStateProvider({ children }: { children: ReactNode }) {
    const gameState = useGameStateInternal();

    return (
        <GameStateContext.Provider value={gameState} >
            {children}
        </GameStateContext.Provider>
    );
}

export function useGameState() {
    const context = useContext(GameStateContext);
    if (!context) {
        throw new Error('useGameState must be used within a GameStateProvider');
    }
    return context;
}
