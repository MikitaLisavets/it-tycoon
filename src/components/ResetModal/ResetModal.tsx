"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './ResetModal.module.css';

interface ResetModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ResetModal: React.FC<ResetModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    const t = useTranslations('ResetModal');

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.titleBar}>
                    <div className={styles.title}>{t('confirm_title')}</div>
                    <button className={styles.closeBtn} onClick={onCancel}>X</button>
                </div>
                <div className={styles.content}>
                    <div className={styles.body}>
                        <div className={styles.icon}>
                            <img src="https://win98icons.alexmeub.com/icons/png/msg_warning-0.png" alt="Warning" width={32} height={32} />
                        </div>
                        <div className={styles.message}>
                            {t('confirm_message')}
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.xpButton} onClick={onConfirm}>{t('yes')}</button>
                        <button className={styles.xpButton} onClick={onCancel}>{t('no')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetModal;
