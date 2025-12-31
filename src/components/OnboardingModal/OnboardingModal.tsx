import React from 'react';
import styles from './OnboardingModal.module.css';
import XPButton from '../XPButton/XPButton';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modalContent}>
                <div className={styles.header}>
                    <span>How to Play</span>
                    <button className={styles.closeBtn} onClick={onClose}>X</button>
                </div>
                <div className={styles.body}>
                    <p style={{ marginBottom: '10px' }}>
                        <strong>Welcome to IT Tycoon!</strong>
                    </p>
                    <p style={{ marginBottom: '10px' }}>
                        Start your journey from a newbie to an IT mogul.
                        Manage your money, status, and happiness.
                    </p>
                    <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
                        <li><strong>Work:</strong> Earn money but lose energy.</li>
                        <li><strong>Hack:</strong> High risk, high reward.</li>
                        <li><strong>Learn:</strong> Improve your skills to get better jobs.</li>
                        <li><strong>Shop:</strong> Buy better equipment and furniture.</li>
                    </ul>
                    <p>
                        Good luck!
                    </p>
                </div>
                <div className={styles.footer}>
                    <XPButton onClick={onClose}>OK</XPButton>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
