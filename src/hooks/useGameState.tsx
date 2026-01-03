"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { GameState, INITIAL_STATE } from '../lib/game/types';
import { GAME_CONSTANTS, JOBS } from '../lib/game/constants/index';

const STORAGE_KEY = 'it-tycoon-state';

interface GameStateContextType {
    state: GameState;
    updateState: (updates: Partial<GameState>) => void;
    resetState: () => void;
    isInitialized: boolean;
}

const GameStateContext = createContext<GameStateContextType | null>(null);

function useGameStateInternal() {
    const [state, setState] = useState<GameState>(INITIAL_STATE);
    const [isInitialized, setIsInitialized] = useState(false);

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
                    // Ensure new fields like locale are present even if version matches
                    const mergedState = { ...INITIAL_STATE, ...parsed };

                    // Migration for Max Stats if missing
                    if (!parsed.maxMood) mergedState.maxMood = 100;
                    if (!parsed.maxHealth) mergedState.maxHealth = 100;
                    if (!parsed.maxStamina) mergedState.maxStamina = 100;

                    // Migration for Cooldowns
                    if (!parsed.cooldowns) {
                        mergedState.cooldowns = { rest: {} };
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
        if (!isInitialized || state.gameOver) return;

        const interval = setInterval(() => {
            setState((prev) => {
                const next = { ...prev };
                next.date = { ...prev.date };

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

                // Decay Needs
                next.health = Math.max(0, next.health - GAME_CONSTANTS.DECAY_RATES.HEALTH_PER_TICK);
                next.mood = Math.max(0, next.mood - GAME_CONSTANTS.DECAY_RATES.MOOD_PER_TICK);

                // Stamina Regen (Clamp to Max)
                const maxStamina = next.maxStamina || 100; // Fallback
                next.stamina = Math.min(maxStamina, Math.max(0, next.stamina + GAME_CONSTANTS.DECAY_RATES.STAMINA_PER_TICK));

                // Passive Income
                if (hoursPassed > 0) {
                    const currentJob = JOBS[prev.job];
                    if (currentJob && currentJob.type === 'passive') {
                        next.money += currentJob.income * hoursPassed;
                    }
                }

                // Check Game Over
                if (next.health <= GAME_CONSTANTS.GAME_OVER_THRESHOLD || next.mood <= GAME_CONSTANTS.GAME_OVER_THRESHOLD) {
                    next.gameOver = true;
                }

                return next;
            });
        }, GAME_CONSTANTS.TICK_RATE_MS);

        return () => clearInterval(interval);
    }, [isInitialized, state.gameOver]);

    // Save to localStorage on change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
    }, [state, isInitialized]);

    const updateState = (updates: Partial<GameState>) => {
        setState((prev) => ({ ...prev, ...updates }));
    };

    const resetState = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATE));
        setState(INITIAL_STATE);
    };

    return {
        state,
        updateState,
        resetState,
        isInitialized,
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
