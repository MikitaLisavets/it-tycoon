"use client";

import { useState, useEffect } from 'react';
import { GAME_CONSTANTS } from '../lib/game/constants/index';

const STORAGE_KEY = `${GAME_CONSTANTS.GAME_NAME}-open-windows`;

export function useWindowManager(isInitialized: boolean, gameOver: boolean) {
    const [openWindows, setOpenWindows] = useState<string[]>([]);
    const [focusedWindow, setFocusedWindow] = useState<string | null>(null);

    // Load from localStorage
    useEffect(() => {
        if (isInitialized) {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    setOpenWindows(JSON.parse(saved));
                }
            } catch (e) {
                console.error('Failed to load open windows:', e);
            }
        }
    }, [isInitialized]);

    // Save to localStorage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(openWindows));
        }
    }, [openWindows, isInitialized]);

    // Close on Game Over
    useEffect(() => {
        if (gameOver) {
            setOpenWindows(prev => prev.filter(w => w !== 'winamp' && w !== 'internet'));
        }
    }, [gameOver]);

    const toggleWindow = (id: string) => {
        setOpenWindows(prev => {
            if (prev.includes(id)) {
                return prev.filter(w => w !== id);
            }
            return [...prev, id];
        });
        setFocusedWindow(id);
    };

    const closeWindow = (id: string) => {
        setOpenWindows(prev => prev.filter(w => w !== id));
        if (focusedWindow === id) {
            setFocusedWindow(null);
        }
    };

    const resetWindows = () => {
        setOpenWindows([]);
        setFocusedWindow(null);
    };

    return {
        openWindows,
        focusedWindow,
        setFocusedWindow,
        toggleWindow,
        closeWindow,
        resetWindows
    };
}
