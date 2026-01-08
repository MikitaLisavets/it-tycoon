"use client";

import { useState, useEffect } from 'react';
import { GAME_CONSTANTS } from '../lib/game/constants/index';

const STORAGE_KEY = `${GAME_CONSTANTS.GAME_NAME}-desktop-wallpaper`;

export function useDesktopWallpaper(isInitialized: boolean) {
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

    // Load from localStorage
    useEffect(() => {
        if (isInitialized) {
            const savedBg = localStorage.getItem(STORAGE_KEY);
            if (savedBg) {
                setBackgroundImage(savedBg);
            }
        }
    }, [isInitialized]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setBackgroundImage(base64String);
                localStorage.setItem(STORAGE_KEY, base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetBackground = () => {
        setBackgroundImage(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        backgroundImage,
        handleFileChange,
        resetBackground
    };
}
