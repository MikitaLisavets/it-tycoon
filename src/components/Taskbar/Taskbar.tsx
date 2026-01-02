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
    const langRef = React.useRef<HTMLDivElement>(null);
    const { state, updateState } = useGameState();
    const t = useTranslations('Taskbar');

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const inLang = langRef.current && langRef.current.contains(target);

            if (!inLang) {
                setIsLangOpen(false);
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
                {t('donate')} ❤️
            </button>

            <div className={styles.divider} />

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
                <div className={styles.time}>
                    <span>{time}</span>
                    <span>{date}</span>
                </div>
            </div>
        </div>
    );
};

export default Taskbar;
