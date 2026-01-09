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

    // Map reasons to more descriptive error messages
    const getErrorDetails = (reason?: string) => {
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
        <div className={styles.bsodOverlay} onClick={onRestart}>
            <div className={styles.bsodScreen}>
                <div className={styles.bsodHeader}>
                    <p>{t('GameOver.header_line1')}</p>
                    <p>{t('GameOver.header_line2')}</p>
                </div>

                <div className={styles.bsodError}>
                    {errorDetails.code}
                </div>

                <div className={styles.bsodContent}>
                    <p>{errorDetails.description}</p>
                    <br />
                    <p>{t('GameOver.cause_prefix')}</p>
                    <p>{errorDetails.cause}</p>
                    <br />
                    <p>{t('GameOver.first_time_line1')}</p>
                    <p>{t('GameOver.first_time_line2')}</p>
                    <p>{t('GameOver.first_time_line3')}</p>
                    <br />
                    <p>{t('GameOver.advice_money')}</p>
                    <p>{t('GameOver.advice_stats')}</p>
                    <p>{t('GameOver.advice_progression')}</p>
                    <br />
                    <p>{t('GameOver.technical_info')}</p>
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
