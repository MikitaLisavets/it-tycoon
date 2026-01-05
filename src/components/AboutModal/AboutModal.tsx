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
    const t = useTranslations('About');

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('title')}
            zIndex={10000}
            width="400px"
            footer={<XPButton onClick={onClose}>{t('ok')}</XPButton>}
        >
            <div className={styles.body}>
                <p>{t('p1')}</p>
                <p>{t('p2')}</p>
                <br />
                <div className={styles.list}>
                    <div>• {t('item1')}</div>
                    <div>• {t('item2')}</div>
                    <div>• {t('item3')}</div>
                </div>

                <div className={styles.stampContainer}>
                    <div className={styles.stamp}>
                        {t('stamp')}
                    </div>
                </div>

                <br />
                <p>{t('p3')}</p>
                <p>{t('p4')}</p>
                <br />
                <p>
                    {t('dev')} MikiApps
                </p>
                <p>
                    {t('more')} <a href="https://mikiapps.com" target="_blank" rel="noopener noreferrer" className={styles.link}>https://mikiapps.com</a>
                </p>
                <p>
                    {t('donate')} <a href="https://ko-fi.com/mikiapps" target="_blank" rel="noopener noreferrer" className={styles.link}>https://ko-fi.com/mikiapps</a>
                </p>
            </div>
        </Modal>
    );
};

export default AboutModal;
