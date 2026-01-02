import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './GameOverModal.module.css';
import XPButton from '../XPButton/XPButton';

interface GameOverModalProps {
    isOpen: boolean;
    onRestart: () => void;
    reason?: string;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, onRestart, reason }) => {
    const t = useTranslations('GameOver');

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modalContent}>
                <div className={styles.header}>
                    <span>{t('title')}</span>
                </div>
                <div className={styles.body}>
                    <h2 style={{ color: '#d00', marginBottom: '20px' }}>{t('game_over')}</h2>
                    {reason && <p>{reason}</p>}
                    <p>{t('message')}</p>
                </div>
                <div className={styles.footer}>
                    <XPButton onClick={onRestart}>{t('restart')}</XPButton>
                </div>
            </div>
        </div>
    );
};

export default GameOverModal;
