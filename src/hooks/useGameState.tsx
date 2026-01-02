"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { GameState, INITIAL_STATE } from '../lib/game/types';

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
                    setState({ ...INITIAL_STATE, ...parsed });
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
