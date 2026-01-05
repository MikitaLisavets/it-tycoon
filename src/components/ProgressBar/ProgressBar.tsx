import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
    progress: number;
    height?: string;
    text?: string;
    className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, height = '20px', text, className }) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    return (
        <div
            className={`${styles.container} ${className || ''}`}
            style={{ height }}
        >
            <div
                className={styles.fill}
                style={{ width: `${clampedProgress}%` }}
            />
            {text && <span className={styles.text}>{text}</span>}
        </div>
    );
};

export default ProgressBar;
