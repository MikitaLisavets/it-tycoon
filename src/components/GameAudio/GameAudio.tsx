"use client";

import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { useGameState } from '../../hooks/useGameState';

export interface GameAudioHandle {
    play: () => void;
    stop: () => void;
}

interface GameAudioProps {
    src: string;
    baseVolume?: number; // 0 to 1, multiplier for global volume
}

const GameAudio = forwardRef<GameAudioHandle, GameAudioProps>(({ src, baseVolume = 1.0 }, ref) => {
    const { state } = useGameState();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Keep volume in sync with state
    useEffect(() => {
        if (audioRef.current) {
            // Volume is state.volume (0-100) / 100 * baseVolume (0-1)
            audioRef.current.volume = (state.volume / 100) * baseVolume;
        }
    }, [state.volume, baseVolume]);

    useImperativeHandle(ref, () => ({
        play: () => {
            if (audioRef.current) {
                const audio = audioRef.current;
                audio.currentTime = 0;

                const attemptPlay = () => {
                    audio.play().catch(err => {
                        // Browsers block autoplay/some audio triggers without interaction
                        // We log but don't crash
                        console.warn(`[GameAudio] Playback failed for ${src}:`, err);
                    });
                };

                if (audio.readyState >= 3) {
                    attemptPlay();
                } else {
                    // Wait for it to be ready
                    const onCanPlay = () => {
                        attemptPlay();
                        audio.removeEventListener('canplaythrough', onCanPlay);
                    };
                    audio.addEventListener('canplaythrough', onCanPlay);
                }
            }
        },
        stop: () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }
    }));

    return (
        <audio
            ref={audioRef}
            src={src}
            preload="auto"
            style={{ display: 'none' }}
        />
    );
});

GameAudio.displayName = 'GameAudio';

export default GameAudio;
