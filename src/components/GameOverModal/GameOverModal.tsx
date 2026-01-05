import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './GameOverModal.module.css';

interface GameOverModalProps {
    isOpen: boolean;
    onRestart: () => void;
    reason?: string;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, onRestart, reason }) => {
    const t = useTranslations('GameOver');

    if (!isOpen) return null;

    // Map reasons to more descriptive error messages
    const getErrorDetails = (reason?: string) => {
        if (reason?.includes('health') || reason?.includes('Health')) {
            return {
                code: t('health_code'),
                description: t('health_description'),
                cause: t('health_cause')
            };
        } else if (reason?.includes('money') || reason?.includes('Money')) {
            return {
                code: t('money_code'),
                description: t('money_description'),
                cause: t('money_cause')
            };
        } else if (reason?.includes('mood') || reason?.includes('Mood')) {
            return {
                code: t('mood_code'),
                description: t('mood_description'),
                cause: t('mood_cause')
            };
        } else if (reason?.includes('credit') || reason?.includes('Credit')) {
            return {
                code: t('credit_code'),
                description: t('credit_description'),
                cause: t('credit_cause')
            };
        } else {
            return {
                code: t('default_code'),
                description: t('default_description'),
                cause: t('default_cause')
            };
        }
    };

    const errorDetails = getErrorDetails(reason);

    return (
        <div className={styles.bsodOverlay} onClick={onRestart}>
            <div className={styles.bsodScreen}>
                <div className={styles.bsodHeader}>
                    <p>{t('header_line1')}</p>
                    <p>{t('header_line2')}</p>
                </div>

                <div className={styles.bsodError}>
                    {errorDetails.code}
                </div>

                <div className={styles.bsodContent}>
                    <p>{errorDetails.description}</p>
                    <br />
                    <p>{t('cause_prefix')}</p>
                    <p>{errorDetails.cause}</p>
                    <br />
                    <p>{t('first_time_line1')}</p>
                    <p>{t('first_time_line2')}</p>
                    <p>{t('first_time_line3')}</p>
                    <br />
                    <p>{t('advice_money')}</p>
                    <p>{t('advice_stats')}</p>
                    <p>{t('advice_progression')}</p>
                    <br />
                    <p>{t('technical_info')}</p>
                    <br />
                    <p>*** STOP: 0x000000{Math.floor(Math.random() * 100).toString(16).toUpperCase().padStart(2, '0')} (0x{Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0')},0x{Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0')},0x{Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0')},0x{Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0')})</p>
                </div>

                <div className={styles.bsodFooter}>
                    <p>{t('press_key')}</p>
                </div>
            </div>
        </div>
    );
};

export default GameOverModal;
