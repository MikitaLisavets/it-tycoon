"use client";

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { MusicContext } from './MusicContext';
import { MUSIC_SOURCES } from '@/lib/game/constants/music-sources';
import { parseM3U } from '@/lib/game/utils/m3u-parser';
import { useGameState } from '@/hooks/useGameState';

interface MusicProviderProps {
    children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
    const { state } = useGameState();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState('00:00');
    const [audioSrc, setAudioSrc] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    // Stop playing on game over
    useEffect(() => {
        if (state.gameOver && isPlaying) {
            setIsPlaying(false);
        }
    }, [state.gameOver, isPlaying]);

    useEffect(() => {
        const resolveStream = async () => {
            setIsLoading(true);
            setCurrentTime('00:00');

            if (MUSIC_SOURCES[currentSourceIndex].url.toLowerCase().endsWith('.m3u') || MUSIC_SOURCES[currentSourceIndex].url.includes('.m3u')) {
                const parsedUrl = await parseM3U(MUSIC_SOURCES[currentSourceIndex].url);
                if (parsedUrl) {
                    setAudioSrc(parsedUrl);
                } else {
                    setAudioSrc(MUSIC_SOURCES[currentSourceIndex].url);
                }
            } else {
                setAudioSrc(MUSIC_SOURCES[currentSourceIndex].url);
            }
            setIsLoading(false);
        };

        resolveStream();
    }, [currentSourceIndex]);

    useEffect(() => {
        if (!audioRef.current || !audioSrc) return;

        if (isPlaying) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    if (e.name !== 'AbortError') {
                        console.error("Play failed:", e);
                        setIsPlaying(false);
                    }
                });
            }
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, audioSrc]);

    useEffect(() => {
        if (audioRef.current) {
            // Apply internal volume * global system volume (0-100 scale)
            audioRef.current.volume = volume * (state.volume / 100);
        }
    }, [volume, state.volume]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                if (audioRef.current) {
                    const mins = Math.floor(audioRef.current.currentTime / 60);
                    const secs = Math.floor(audioRef.current.currentTime % 60);
                    setCurrentTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const togglePlay = () => setIsPlaying(!isPlaying);
    const nextSource = () => {
        setCurrentSourceIndex((prevIndex) => (prevIndex + 1) % MUSIC_SOURCES.length);
        setIsPlaying(true);
    };
    const prevSource = () => {
        setCurrentSourceIndex((prevIndex) => (prevIndex - 1 + MUSIC_SOURCES.length) % MUSIC_SOURCES.length);
        setIsPlaying(true);
    };
    const stop = () => {
        setIsPlaying(false);
        setCurrentTime('00:00');
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    };

    const value = {
        isPlaying,
        currentSourceIndex,
        volume,
        isLoading,
        currentTime,
        togglePlay,
        nextSource,
        prevSource,
        setVolume,
        stop,
        currentSourceName: MUSIC_SOURCES[currentSourceIndex].name
    };

    return (
        <MusicContext.Provider value={value}>
            {children}
            <audio ref={audioRef} src={audioSrc} crossOrigin="anonymous" />
        </MusicContext.Provider>
    );
};
