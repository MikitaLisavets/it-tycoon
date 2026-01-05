"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import Modal from '../Modal/Modal';
import XPButton from '../XPButton/XPButton';
import styles from './ResetModal.module.css';

interface ResetModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ResetModal: React.FC<ResetModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    const t = useTranslations('ResetModal');

    return (
        <Modal
            isOpen={isOpen}
            onClose={onCancel}
            title={t('confirm_title')}
            width="350px"
            footer={
                <>
                    <XPButton onClick={onConfirm}>{t('yes')}</XPButton>
                    <XPButton onClick={onCancel}>{t('no')}</XPButton>
                </>
            }
        >
            <div className={styles.body}>
                <div className={styles.icon}>
                    <img src="/icons/warning.png" alt="Warning" width={32} height={32} />
                </div>
                <div className={styles.message}>
                    {t('confirm_message')}
                </div>
            </div>
        </Modal>
    );
};

export default ResetModal;
