import React, { useState, useRef, useEffect } from 'react';
import styles from './WinampPlayer.module.css';
import { parseM3U } from '@/lib/game/utils/m3u-parser';
import { useTranslations } from 'next-intl';

const WinampPlayer: React.FC = () => {
    const t = useTranslations('Winamp');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [trackName, setTrackName] = useState('2000s Hits Radio');
    const [currentTime, setCurrentTime] = useState('00:00');
    const [visualizerData, setVisualizerData] = useState<number[]>(new Array(10).fill(0));


    const STREAM_URL = 'https://sa46.scastream.com.au/live/7noughties_128.stream/playlist.m3u8';

    // State to hold the resolved audio stream URL
    const [audioSrc, setAudioSrc] = useState<string>('');

    useEffect(() => {
        const resolveStream = async () => {
            if (STREAM_URL.toLowerCase().endsWith('.m3u') || STREAM_URL.includes('.m3u')) {
                const parsedUrl = await parseM3U(STREAM_URL);
                if (parsedUrl) {
                    setAudioSrc(parsedUrl);
                    // Update track name if it was a generic one, or keep it.
                    // Ideally, we might extract metadata eventually.
                } else {
                    // Fallback to original if parsing fails (might be a direct stream named .m3u?)
                    setAudioSrc(STREAM_URL);
                }
            } else {
                setAudioSrc(STREAM_URL);
            }
        };

        resolveStream();
    }, [STREAM_URL]);

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
                // Generate random heights for bars
                setVisualizerData(prev => prev.map(() => Math.random() * 100));
            }, 100);
        } else {
            // Reset to flat line when stopped/paused
            setVisualizerData(new Array(10).fill(0));
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Play failed:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    };

    return (
        <div className={styles.winampContainer}>
            {/* Display Area */}
            <div className={styles.displayArea}>
                <div className={styles.titleBar}>
                    <span className={styles.titleText}>{trackName} *** 128kbps *** 44kHz</span>
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
                    <button className={styles.controlBtn} title={t('controls.prev')} disabled>|&lt;</button>
                    <button className={styles.controlBtn} onClick={togglePlay} title={isPlaying ? t('controls.pause') : t('controls.play')}>
                        {isPlaying ? '||' : '►'}
                    </button>
                    <button className={styles.controlBtn} onClick={() => {
                        if (audioRef.current) {
                            audioRef.current.pause();
                            audioRef.current.currentTime = 0;
                            setIsPlaying(false);
                            setCurrentTime('00:00');
                        }
                    }} title={t('controls.stop')}>■</button>
                    <button className={styles.controlBtn} title={t('controls.next')} disabled>&gt;|</button>
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
