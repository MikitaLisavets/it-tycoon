import React, { useEffect } from 'react';
import styles from './Notification.module.css';

interface NotificationProps {
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'error';
    onClose: () => void;
    duration?: number;
}

const Notification: React.FC<NotificationProps> = ({ title, message, type = 'info', onClose, duration = 5000 }) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={styles.container}>
            <button className={styles.closeButton} onClick={onClose}>X</button>
            <div className={styles.title}>
                {type === 'warning' || type === 'error' ? '⚠️' : 'ℹ️'} {title}
            </div>
            <div className={styles.message}>
                {message}
            </div>
        </div>
    );
};

export default Notification;
