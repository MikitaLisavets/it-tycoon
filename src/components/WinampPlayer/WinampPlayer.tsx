import React, { useState, useEffect } from 'react';
import styles from './WinampPlayer.module.css';
import { useTranslations } from 'next-intl';
import { useAudio } from '@/hooks/useAudio';
import { useMusic } from '@/context/MusicContext';

import { MusicIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon, StopIcon, VolumeIcon } from './WinampIcons';

const WinampPlayer: React.FC = () => {
    const t = useTranslations();
    const [visualizerData, setVisualizerData] = useState<number[]>(new Array(10).fill(0));
    const audio = useAudio();
    const {
        isPlaying,
        currentSourceName,
        volume,
        isLoading,
        currentTime,
        togglePlay,
        nextSource,
        prevSource,
        setVolume,
        stop
    } = useMusic();

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

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    };

    return (
        <div className={styles.winampContainer}>
            {/* Display Area */}
            <div className={styles.displayArea}>
                <div className={styles.titleBar}>
                    <span className={styles.titleText}>
                        {isLoading ? t('Winamp.loading') : `${currentSourceName} *** 128kbps *** 44kHz`}
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
                    <button className={styles.controlBtn} title={t('Winamp.controls_prev')} onClick={() => {
                        audio.playClick();
                        prevSource();
                    }}>
                        <PrevIcon />
                    </button>
                    <button className={styles.controlBtn} onClick={() => {
                        audio.playClick();
                        togglePlay();
                    }} title={isPlaying ? t('Winamp.controls_pause') : t('Winamp.controls_play')}>
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <button className={styles.controlBtn} onClick={() => {
                        audio.playClick();
                        stop();
                    }} title={t('Winamp.controls_stop')}>
                        <StopIcon />
                    </button>
                    <button className={styles.controlBtn} title={t('Winamp.controls_next')} onClick={() => {
                        audio.playClick();
                        nextSource();
                    }}>
                        <NextIcon />
                    </button>
                </div>

                <div className={styles.volumeControl}>
                    {isPlaying ? <MusicIcon width={12} height={12} /> : <VolumeIcon width={12} height={12} />}
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
                {t('Winamp.title')}
            </div>
        </div>
    );
};

export default WinampPlayer;
