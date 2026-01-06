"use client";

import React, { createContext, useContext } from 'react';

interface AudioContextType {
    playClick: () => void;
    playError: () => void;
    playLevelUp: () => void;
    playCoin: () => void;
    playCheat: () => void;
}

export const AudioContext = createContext<AudioContextType | null>(null);

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
}
