import React from 'react';
import { useTranslations } from 'next-intl';
import Modal from '../Modal/Modal';
import XPButton from '../XPButton/XPButton';
import styles from './OnboardingModal.module.css';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
    const t = useTranslations('Onboarding');

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('title')}
            width="450px"
            footer={<XPButton onClick={onClose}>{t('ok')}</XPButton>}
        >
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
        </Modal>
    );
};

export default OnboardingModal;
