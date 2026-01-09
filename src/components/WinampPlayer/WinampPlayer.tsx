import React, { useState, useRef, useEffect } from 'react';
import styles from './WinampPlayer.module.css';
import { parseM3U } from '@/lib/game/utils/m3u-parser';
import { useTranslations } from 'next-intl';
import { MUSIC_SOURCES } from '@/lib/game/constants/music-sources';
import { useAudio } from '@/hooks/useAudio';
import { useGameState } from '@/hooks/useGameState';

const WinampPlayer: React.FC = () => {
    const t = useTranslations('Winamp');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState('00:00');
    const [visualizerData, setVisualizerData] = useState<number[]>(new Array(10).fill(0));
    const audio = useAudio();

    const { state } = useGameState();

    // State to hold the resolved audio stream URL
    const [audioSrc, setAudioSrc] = useState<string>('');
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
            // Reset time when source changes
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

    // Sync audio element with isPlaying state and audioSrc changes
    useEffect(() => {
        if (!audioRef.current || !audioSrc) return;

        if (isPlaying) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    // Ignore abort errors which happen when switching tracks/toggling quickly
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
            audioRef.current.volume = volume;
        }
    }, [volume]);

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

    // Visualizer loop
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setVisualizerData(prev => prev.map(() => Math.random() * 100));
            }, 100);
        } else {
            setVisualizerData(new Array(10).fill(0));
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    };

    const nextSource = () => {
        setCurrentSourceIndex((prevIndex) => (prevIndex + 1) % MUSIC_SOURCES.length);
        setIsPlaying(true); // Auto-play on switch
    };

    const prevSource = () => {
        setCurrentSourceIndex((prevIndex) => (prevIndex - 1 + MUSIC_SOURCES.length) % MUSIC_SOURCES.length);
        setIsPlaying(true); // Auto-play on switch
    };

    return (
        <div className={styles.winampContainer}>
            {/* Display Area */}
            <div className={styles.displayArea}>
                <div className={styles.titleBar}>
                    <span className={styles.titleText}>
                        {isLoading ? t('loading') : `${MUSIC_SOURCES[currentSourceIndex].name} *** 128kbps *** 44kHz`}
                    </span>
                </div>
                <div className={styles.visuals}>
                    <div className={styles.timer}>{currentTime}</div>
                    <div className={styles.oscilloscope}>
                        {visualizerData.map((height, i) => (
                            <div key={i} className={styles.bar} style={{ height: `${height}%` }}></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Controls Area */}
            <div className={styles.controlsArea}>
                <div className={styles.mainControls}>
                    <button className={styles.controlBtn} title={t('controls.prev')} onClick={() => {
                        audio.playClick();
                        prevSource();
                    }}>|&lt;</button>
                    <button className={styles.controlBtn} onClick={() => {
                        audio.playClick();
                        togglePlay();
                    }} title={isPlaying ? t('controls.pause') : t('controls.play')}>
                        {isPlaying ? '||' : '►'}
                    </button>
                    <button className={styles.controlBtn} onClick={() => {
                        audio.playClick();
                        setIsPlaying(false);
                        setCurrentTime('00:00');
                        if (audioRef.current) {
                            audioRef.current.currentTime = 0;
                        }
                    }} title={t('controls.stop')}>■</button>
                    <button className={styles.controlBtn} title={t('controls.next')} onClick={() => {
                        audio.playClick();
                        nextSource();
                    }}>&gt;|</button>
                </div>



                <div className={styles.volumeControl}>
                    <label>{t('controls.volume')}</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className={styles.volumeSlider}
                    />
                </div>
            </div>

            <div className={styles.branding}>
                {t('title')}
            </div>

            <audio ref={audioRef} src={audioSrc} crossOrigin="anonymous" />
        </div>
    );
};

export default WinampPlayer;
