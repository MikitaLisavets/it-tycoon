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
    const t = useTranslations();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('Onboarding.title')}
            width="450px"
            footer={<XPButton onClick={onClose}>{t('Common.ok')}</XPButton>}
        >
            <div className={styles.body}>
                <p style={{ marginBottom: '10px' }}>
                    <strong>{t('Onboarding.welcome')}</strong>
                </p>
                <p style={{ marginBottom: '10px' }}>
                    {t('Onboarding.intro')}
                </p>
                <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
                    <li><strong>{t('Onboarding.section_work')}</strong> {t('Onboarding.section_work')}</li>
                    <li><strong>{t('Onboarding.section_hack')}</strong> {t('Onboarding.section_hack')}</li>
                    <li><strong>{t('Onboarding.section_learn')}</strong> {t('Onboarding.section_learn')}</li>
                    <li><strong>{t('Onboarding.section_shop')}</strong> {t('Onboarding.section_shop')}</li>
                </ul>
                <p>
                    {t('Onboarding.good_luck')}
                </p>
            </div>
        </Modal>
    );
};

export default OnboardingModal;
