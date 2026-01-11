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
    const t = useTranslations();

    const bootMessages = [
        t('BootScreen.msg1'),
        t('BootScreen.msg2'),
        t('BootScreen.msg3'),
        t('BootScreen.msg4'),
        t('BootScreen.msg5'),
        t('BootScreen.msg5')
    ];

    const hasStartedBoot = React.useRef(false);

    useEffect(() => {
        if (!isBooting) {
            setProgress(0);
            setCurrentMessage(0);
            hasStartedBoot.current = false;
            return;
        }

        if (!hasStartedBoot.current) {
            hasStartedBoot.current = true;
        }

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
    }, [isBooting, onBootComplete, bootMessages.length]);

    if (!isBooting) return null;

    return (
        <div className={styles.bootScreen}>
            <div className={styles.bootContent}>
                <div className={styles.logo}>
                    <h1>{t('BootScreen.title')}</h1>
                    <p className={styles.subtitle}>{t('BootScreen.subtitle')}</p>
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
                    <p>{t('BootScreen.copyright')}</p>
                </div>
            </div>
        </div>
    );
};

export default BootScreen;
