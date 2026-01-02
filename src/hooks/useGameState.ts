"use client";

import { useState, useEffect } from 'react';
import { GameState, INITIAL_STATE } from '../lib/game/types';

const STORAGE_KEY = 'it-tycoon-state';

export function useGameState() {
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
                    setState(parsed);
                }
            } catch (error) {
                console.error('Failed to parse saved state:', error);
                setState(INITIAL_STATE);
            }
        }
        setIsInitialized(true);
    }, []);

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
        setState(INITIAL_STATE);
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        state,
        updateState,
        resetState,
        isInitialized,
    };
}
