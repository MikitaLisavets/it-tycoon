import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './OnboardingModal.module.css';
import XPButton from '../XPButton/XPButton';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
    const t = useTranslations('Onboarding');

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modalContent}>
                <div className={styles.header}>
                    <span>{t('title')}</span>
                    <button className={styles.closeBtn} onClick={onClose}>X</button>
                </div>
                <div className={styles.body}>
                    <p style={{ marginBottom: '10px' }}>
                        <strong>{t('welcome')}</strong>
                    </p>
                    <p style={{ marginBottom: '10px' }}>
                        {t('intro')}
                    </p>
                    <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
                        <li><strong>{t('work_title')}</strong> {t('work_desc')}</li>
                        <li><strong>{t('hack_title')}</strong> {t('hack_desc')}</li>
                        <li><strong>{t('learn_title')}</strong> {t('learn_desc')}</li>
                        <li><strong>{t('shop_title')}</strong> {t('shop_desc')}</li>
                    </ul>
                    <p>
                        {t('good_luck')}
                    </p>
                </div>
                <div className={styles.footer}>
                    <XPButton onClick={onClose}>{t('ok')}</XPButton>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
