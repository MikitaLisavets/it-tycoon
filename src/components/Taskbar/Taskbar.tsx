import React from 'react';
import { useTranslations } from 'next-intl';
import { useGameState } from '@/hooks/useGameState';
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
        updateState({ locale: lang });
        setIsLangOpen(false);
    };

    return (
        <div className={styles.taskbar}>
            <button
                className={styles.startButton}
                onClick={() => window.open('https://ko-fi.com/mikiapps', '_blank')}
            >
                {t('donate')}{' '}❤️
            </button>

            <div className={styles.divider} />

            <button
                className={styles.windowButton}
                onClick={() => window.open('https://mikiapps.com', '_blank')}
            >
                <img src="icons/world.png" alt="" className={styles.windowIcon} />
                <span className={styles.windowTitle}>www.mikiapps.com</span>
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
                    onClick={() => setIsLangOpen(!isLangOpen)}
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
                        onClick={() => setIsVolumeOpen(!isVolumeOpen)}
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
