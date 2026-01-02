import React from 'react';
import styles from './HelpModal.module.css';
import XPButton from '../XPButton/XPButton';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modalContent}>
                <div className={styles.header}>
                    <span>{title} - Help</span>
                    <button className={styles.closeBtn} onClick={onClose}>X</button>
                </div>
                <div className={styles.body}>
                    <p>{content}</p>
                </div>
                <div className={styles.footer}>
                    <XPButton onClick={onClose}>OK</XPButton>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
