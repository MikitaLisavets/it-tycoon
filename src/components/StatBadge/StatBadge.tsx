import React from 'react';
import { STAT_ICONS } from '../../lib/game/constants/index';
import styles from './StatBadge.module.css';

interface StatBadgeProps {
    stat: keyof typeof STAT_ICONS;
    value: string | number;
    prefix?: string;
    label?: string;
    className?: string;
    showIcon?: boolean;
}

const StatBadge: React.FC<StatBadgeProps> = ({
    stat,
    value,
    prefix = '',
    label = '',
    className = '',
    showIcon = true
}) => {
    const iconData = STAT_ICONS[stat];

    if (!iconData) return null;

    return (
        <span
            className={`${styles.statBadge} ${className}`}
            style={{ color: iconData.color }}
        >
            <span className={`${styles.value}`}>{prefix}{value}</span>
            {showIcon && <span className={styles.icon}>{iconData.icon}</span>}
            {label && <span className={styles.label}> {label}</span>}
        </span>
    );
};

export default StatBadge;
