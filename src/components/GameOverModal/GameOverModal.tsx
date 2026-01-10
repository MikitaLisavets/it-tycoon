import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAudio } from '@/hooks/useAudio';
import styles from './GameOverModal.module.css';

interface GameOverModalProps {
    isOpen: boolean;
    onRestart: () => void;
    reason?: string;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, onRestart, reason }) => {
    const t = useTranslations();
    const { playError } = useAudio();

    useEffect(() => {
        if (isOpen) {
            playError();
        }
    }, [isOpen, playError]);

    if (!isOpen) return null;

    const handleRestart = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation();
        onRestart();
    };

    // Map reasons to more descriptive error messages
    const getErrorDetails = (reason?: string) => {
        console.log('reason', reason);
        if (reason?.includes('health') || reason?.includes('Health')) {
            return {
                code: t('GameOver.health_code'),
                description: t('GameOver.health_desc'),
                cause: t('GameOver.health_cause')
            };
        } else if (reason?.includes('money') || reason?.includes('Money')) {
            return {
                code: t('GameOver.money_code'),
                description: t('GameOver.money_desc'),
                cause: t('GameOver.money_cause')
            };
        } else if (reason?.includes('mood') || reason?.includes('Mood')) {
            return {
                code: t('GameOver.mood_code'),
                description: t('GameOver.mood_desc'),
                cause: t('GameOver.mood_cause')
            };
        } else if (reason?.includes('credit') || reason?.includes('Credit')) {
            return {
                code: t('GameOver.credit_code'),
                description: t('GameOver.credit_desc'),
                cause: t('GameOver.credit_cause')
            };
        } else {
            return {
                code: t('GameOver.default_code'),
                description: t('GameOver.default_desc'),
                cause: t('GameOver.default_cause')
            };
        }
    };

    const errorDetails = getErrorDetails(reason);

    return (
        <div className={styles.bsodOverlay} onClick={handleRestart} onKeyDown={handleRestart} autoFocus>
            <div className={styles.bsodScreen}>
                <div className={styles.bsodHeader}>
                    <p>{t('GameOver.header')}</p>
                </div>

                <div className={styles.bsodError}>
                    {errorDetails.code}
                </div>

                <div className={styles.bsodContent}>
                    <p>{errorDetails.description}</p>
                    <br />
                    <b>{t('GameOver.cause_prefix')}</b>
                    <p>{errorDetails.cause}</p>
                    <br />
                    <br />
                    <p>*** STOP: 0x000000{Math.floor(Math.random() * 100).toString(16).toUpperCase().padStart(2, '0')} (0x{Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0')},0x{Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0')},0x{Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0')},0x{Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0')})</p>
                </div>

                <div className={styles.bsodFooter}>
                    <p>{t('GameOver.restart')}</p>
                </div>
            </div>
        </div>
    );
};

export default GameOverModal;
