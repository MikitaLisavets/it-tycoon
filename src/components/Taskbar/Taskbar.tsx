import React from 'react';
import { useTranslations } from 'next-intl';
import { useGameState } from '@/hooks/useGameState';
import { useAudio } from '@/hooks/useAudio';
import styles from './Taskbar.module.css';

interface TaskbarProps {
    date: string;
    time: string;
}

const Taskbar: React.FC<TaskbarProps> = ({ date, time }) => {
    const [isLangOpen, setIsLangOpen] = React.useState(false);
    const [isVolumeOpen, setIsVolumeOpen] = React.useState(false);
    const langRef = React.useRef<HTMLDivElement>(null);
    const volumeRef = React.useRef<HTMLDivElement>(null);
    const { state, updateState } = useGameState();
    const { playClick } = useAudio();
    const t = useTranslations('Taskbar');

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const inLang = langRef.current && langRef.current.contains(target);
            const inVolume = volumeRef.current && volumeRef.current.contains(target);

            if (!inLang) {
                setIsLangOpen(false);
            }
            if (!inVolume) {
                setIsVolumeOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const changeLanguage = (lang: 'en' | 'de') => {
        playClick();
        updateState({ locale: lang });
        setIsLangOpen(false);
    };

    const getStartButtonStyle = () => {
        const sys = state.software.system;
        if (sys === 'winos_95' || sys === 'winos_98') return styles.start95;
        if (sys === 'winos_xp') return styles.startXP;
        if (sys === 'winos_7') return styles.start7;
        if (sys === 'winos_10' || sys === 'winos_11') return styles.start10;
        return styles.start95;
    };

    const getTaskbarClass = () => {
        const sys = state.software.system;
        if (sys === 'winos_95' || sys === 'winos_98') return styles.taskbar95;
        if (sys === 'winos_xp') return styles.taskbarXP;
        if (sys === 'winos_7') return styles.taskbar7;
        if (sys === 'winos_10' || sys === 'winos_11') return styles.taskbar10;
        return styles.taskbarXP;
    };

    return (
        <div className={`${styles.taskbar} ${getTaskbarClass()}`}>
            <button
                className={`${styles.startButton} ${getStartButtonStyle()}`}
                onClick={() => { playClick(); window.open('https://ko-fi.com/mikiapps', '_blank'); }}
            >
                {t('donate')}{' '}❤️
            </button>

            <div className={styles.divider} />

            <button
                className={styles.windowButton}
                onClick={() => window.open('https://mikiapps.com', '_blank')}
            >
                <img src="icons/world.png" alt="" className={styles.windowIcon} />
                <span className={styles.windowTitle}>More apps at MikiApps</span>
            </button>

            <div className={styles.langSwitcher} ref={langRef}>
                {isLangOpen && (
                    <div className={styles.langDropdown}>
                        <button
                            onClick={() => changeLanguage('en')}
                            className={styles.langOption}
                        >
                            English
                        </button>
                        <button
                            onClick={() => changeLanguage('de')}
                            className={styles.langOption}
                        >
                            Deutsch
                        </button>
                    </div>
                )}
                <button
                    onClick={() => { playClick(); setIsLangOpen(!isLangOpen); }}
                    title="Switch Language"
                    className={`${styles.langButton} ${isLangOpen ? styles.langButtonActive : ''}`}
                >
                    {state.locale}
                </button>
            </div>

            <div className={styles.tray}>
                <div className={styles.volumeControl} ref={volumeRef}>
                    {isVolumeOpen && (
                        <div className={styles.volumeDropdown}>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={state.volume}
                                onChange={(e) => updateState({ volume: parseInt(e.target.value) })}
                                className={styles.volumeSlider}
                            />
                            <div className={styles.volumeLabel}>{state.volume}%</div>
                        </div>
                    )}
                    <button
                        onClick={() => { playClick(); setIsVolumeOpen(!isVolumeOpen); }}
                        className={`${styles.trayIcon} ${isVolumeOpen ? styles.trayIconActive : ''}`}
                        title="Volume"
                    >
                        {state.volume === 0 ? '🔇' : '🔊'}
                    </button>
                </div>
                <div className={styles.time}>
                    <span>{time}</span>
                    <span>{date}</span>
                </div>
            </div>
        </div>
    );
};

export default Taskbar;
