import React from 'react';
import { useTranslations } from 'next-intl';
import Modal from '../Modal/Modal';
import XPButton from '../XPButton/XPButton';
import styles from './AboutModal.module.css';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
    const t = useTranslations();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('About.title')}
            zIndex={10000}
            width="400px"
            footer={<XPButton onClick={onClose}>{t('Common.ok')}</XPButton>}
        >
            <div className={styles.body}>
                <p>{t('About.description')}</p>
                <br />
                <div className={styles.list}>
                    <div>• {t('About.no_ai')}</div>
                    <div>• {t('About.no_ml')}</div>
                    <div>• {t('About.no_blockchain')}</div>
                </div>

                <div className={styles.stampContainer}>
                    <div className={styles.stamp}>
                        {t('About.stamp')}
                    </div>
                </div>

                <br />
                <p>{t('About.inspiration')}</p>

                <br />
                <p>
                    {t('About.dev_by')} MikiApps
                </p>
                <p>
                    {t('About.more_apps')} <a href="https://mikiapps.com" target="_blank" rel="noopener noreferrer" className={styles.link}>https://mikiapps.com</a>
                </p>
                <p>
                    {t('About.support')} <a href="https://ko-fi.com/mikiapps" target="_blank" rel="noopener noreferrer" className={styles.link}>https://ko-fi.com/mikiapps</a>
                </p>
            </div>
        </Modal>
    );
};

export default AboutModal;
