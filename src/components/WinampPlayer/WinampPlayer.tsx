import React, { useState, useRef, useEffect } from 'react';
import styles from './WinampPlayer.module.css';

const WinampPlayer: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [trackName, setTrackName] = useState('2000s Hits Radio');
    const [currentTime, setCurrentTime] = useState('00:00');

    // user requested "Music Player" branding and 1.FM Top 2000s stream
    // https://strm112.1.fm/top2000_mobile_mp3
    const STREAM_URL = 'https://www.internet-radio.com/servers/tools/playlistgenerator/?u=https://2000s.radiomonster.fm:443/ultra.m3u&t=.m3u';

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
                        {/* Fake visualization bars */}
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className={styles.bar} style={{ height: `${Math.random() * 100}%` }}></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Controls Area */}
            <div className={styles.controlsArea}>
                <div className={styles.mainControls}>
                    <button className={styles.prevBtn} title="Prev"></button>
                    <button className={styles.playBtn} onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
                        {isPlaying ? '||' : '►'}
                    </button>
                    <button className={styles.pauseBtn} onClick={togglePlay} title="Pause"></button>
                    <button className={styles.stopBtn} onClick={() => {
                        if (audioRef.current) {
                            audioRef.current.pause();
                            audioRef.current.currentTime = 0;
                            setIsPlaying(false);
                            setCurrentTime('00:00');
                        }
                    }} title="Stop">■</button>
                    <button className={styles.nextBtn} title="Next"></button>
                </div>
                <div className={styles.volumeControl}>
                    <label>Vol</label>
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
                Music Player
            </div>

            <audio ref={audioRef} src={STREAM_URL} crossOrigin="anonymous" />
        </div>
    );
};

export default WinampPlayer;
