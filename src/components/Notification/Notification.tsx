import React, { useEffect } from 'react';
import styles from './Notification.module.css';
import StatBadge from '../StatBadge/StatBadge';

interface NotificationProps {
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'error';
    onClose: () => void;
    duration?: number;
    badge?: {
        stat: any;
        value: string | number;
        prefix?: string;
    };
}

const Notification: React.FC<NotificationProps> = ({ title, message, type = 'info', onClose, duration = 5000, badge }) => {

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
                {badge && (
                    <div className={styles.badgeContainer}>
                        <StatBadge {...badge} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;
