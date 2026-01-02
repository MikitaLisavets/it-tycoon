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
    const trayRef = React.useRef<HTMLDivElement>(null);
    const { state, updateState } = useGameState();
    const t = useTranslations('Taskbar');

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (trayRef.current && !trayRef.current.contains(event.target as Node)) {
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
            {/* <div className={styles.divider} /> */}

            {/* Window List Area - Can be populated dynamically later */}

            <div className={styles.tray} ref={trayRef}>
                {isLangOpen && (
                    <div style={{
                        position: 'absolute',
                        bottom: '28px',
                        right: '0',
                        backgroundColor: '#c0c0c0',
                        border: '2px solid #dfdfdf',
                        borderRightColor: '#000000',
                        borderBottomColor: '#000000',
                        borderLeftColor: '#ffffff',
                        borderTopColor: '#ffffff',
                        padding: '2px',
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100px',
                        zIndex: 1000
                    }}>
                        <button
                            onClick={() => changeLanguage('en')}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                textAlign: 'left',
                                padding: '4px 8px',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                fontSize: '12px',
                                width: '100%',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#000080';
                                e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#000000';
                            }}
                        >
                            English
                        </button>
                        <button
                            onClick={() => changeLanguage('de')}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                textAlign: 'left',
                                padding: '4px 8px',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                fontSize: '12px',
                                width: '100%',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#000080';
                                e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#000000';
                            }}
                        >
                            Deutsch
                        </button>
                    </div>
                )}
                <button
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    title="Switch Language"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        marginRight: '8px',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        padding: '2px 5px',
                        boxShadow: isLangOpen ? 'inset 1px 1px #000, inset -1px -1px #fff' : 'none'
                    }}
                >
                    {state.locale}
                </button>
                <div className={styles.time} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '11px', lineHeight: '1.1' }}>
                    <span>{time}</span>
                    <span>{date}</span>
                </div>
            </div>
        </div>
    );
};

export default Taskbar;
