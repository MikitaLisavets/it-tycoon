"use client";

import React, { useRef, ReactNode } from 'react';
import GameAudio, { GameAudioHandle } from '../GameAudio/GameAudio';
import { AudioContext } from '../../hooks/useAudio';

interface AudioManagerProps {
    children: ReactNode;
}

export default function AudioManager({ children }: AudioManagerProps) {
    const clickAudioRef = useRef<GameAudioHandle>(null);
    const errorAudioRef = useRef<GameAudioHandle>(null);
    const levelUpAudioRef = useRef<GameAudioHandle>(null);
    const coinAudioRef = useRef<GameAudioHandle>(null);
    const cheatAudioRef = useRef<GameAudioHandle>(null);
    const warningAudioRef = useRef<GameAudioHandle>(null);
    const notificationAudioRef = useRef<GameAudioHandle>(null);
    const bootAudioRef = useRef<GameAudioHandle>(null);

    const value = {
        playClick: () => clickAudioRef.current?.play(),
        playError: () => errorAudioRef.current?.play(),
        playLevelUp: () => levelUpAudioRef.current?.play(),
        playCoin: () => coinAudioRef.current?.play(),
        playCheat: () => cheatAudioRef.current?.play(),
        playWarning: () => warningAudioRef.current?.play(),
        playNotification: () => notificationAudioRef.current?.play(),
        playBoot: () => bootAudioRef.current?.play(),
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
            <GameAudio ref={clickAudioRef} src="/sfx/click.mp3" baseVolume={0.5} />
            <GameAudio ref={errorAudioRef} src="/sfx/error.mp3" baseVolume={0.5} />
            <GameAudio ref={levelUpAudioRef} src="/sfx/level-up.mp3" baseVolume={0.5} />
            <GameAudio ref={coinAudioRef} src="/sfx/coin.mp3" baseVolume={0.5} />
            <GameAudio ref={cheatAudioRef} src="/sfx/cheat.mp3" baseVolume={0.5} />
            <GameAudio ref={warningAudioRef} src="/sfx/warning.mp3" baseVolume={0.5} />
            <GameAudio ref={notificationAudioRef} src="/sfx/notification.mp3" baseVolume={0.5} />
            <GameAudio ref={bootAudioRef} src="/sfx/boot.mp3" baseVolume={0.5} />
        </AudioContext.Provider>
    );
}
