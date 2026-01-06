import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAudio } from '../../hooks/useAudio';
import styles from './BootScreen.module.css';

interface BootScreenProps {
    isBooting: boolean;
    onBootComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ isBooting, onBootComplete }) => {
    const [progress, setProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState(0);
    const t = useTranslations('BootScreen');
    const { playBoot } = useAudio();

    const bootMessages = [
        t('message1'),
        t('message2'),
        t('message3'),
        t('message4'),
        t('message5'),
        t('message6')
    ];

    useEffect(() => {
        if (!isBooting) {
            setProgress(0);
            setCurrentMessage(0);
            return;
        }

        playBoot();

        // Progress bar animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        // Message cycling
        const messageInterval = setInterval(() => {
            setCurrentMessage(prev => {
                if (prev >= bootMessages.length - 1) {
                    clearInterval(messageInterval);
                    return prev;
                }
                return prev + 1;
            });
        }, 300);

        const bootTimeout = setTimeout(() => {
            onBootComplete();
        }, 2000);

        return () => {
            clearInterval(progressInterval);
            clearInterval(messageInterval);
            clearTimeout(bootTimeout);
        };
    }, [isBooting, onBootComplete, playBoot]);

    if (!isBooting) return null;

    return (
        <div className={styles.bootScreen}>
            <div className={styles.bootContent}>
                <div className={styles.logo}>
                    <h1>{t('title')}</h1>
                    <p className={styles.subtitle}>{t('subtitle')}</p>
                </div>

                <div className={styles.loadingArea}>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className={styles.bootMessage}>{bootMessages[currentMessage]}</p>
                </div>

                <div className={styles.copyright}>
                    <p>{t('copyright')}</p>
                </div>
            </div>
        </div>
    );
};

export default BootScreen;
