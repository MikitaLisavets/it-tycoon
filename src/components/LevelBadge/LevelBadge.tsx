import React from 'react';
import styles from './LevelBadge.module.css';

interface LevelBadgeProps {
    level: number;
    text?: string;
    className?: string;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, text = 'Lv.', className = '' }) => {
    const levelClass = styles[`levelBadge_${level as 0 | 1 | 2 | 3 | 4 | 5}`] || '';

    return (
        <span className={`${styles.levelBadge} ${levelClass} ${className}`}>
            {text} {level}
        </span>
    );
};

export default LevelBadge;
