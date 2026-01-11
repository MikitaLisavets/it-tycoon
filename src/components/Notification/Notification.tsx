import React, { useEffect } from 'react';
import styles from './Notification.module.css';
import StatBadge from '../StatBadge/StatBadge';
import { InfoIcon, WarningIcon, ErrorIcon } from '../Icons/SystemIcons';

interface NotificationProps {
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'error' | 'success';
    onClose: () => void;
    duration?: number;
    badge?: {
        stat: any;
        value: string | number;
        prefix?: string;
    };
}

const Notification: React.FC<NotificationProps> = ({ title, message, type = 'info', onClose, duration = 5000, badge }) => {

    const getIcon = () => {
        switch (type) {
            case 'warning': return <WarningIcon size={16} />;
            case 'error': return <ErrorIcon size={16} />;
            case 'success': return <InfoIcon size={16} style={{ filter: 'hue-rotate(90deg)' }} />; // Greenish info for success
            default: return <InfoIcon size={16} />;
        }
    };

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
                {getIcon()} {title}
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
