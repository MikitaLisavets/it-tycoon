"use client";

import React, { createContext, useContext } from 'react';

export interface MusicContextType {
    isPlaying: boolean;
    currentSourceIndex: number;
    volume: number;
    isLoading: boolean;
    currentTime: string;
    togglePlay: () => void;
    nextSource: () => void;
    prevSource: () => void;
    setVolume: (volume: number) => void;
    stop: () => void;
    currentSourceName: string;
}

export const MusicContext = createContext<MusicContextType | null>(null);

export function useMusic() {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
}
