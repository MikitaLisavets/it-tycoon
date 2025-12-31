import React from 'react';
import styles from './Taskbar.module.css';

interface TaskbarProps {
    date: string;
    time: string;
}

const Taskbar: React.FC<TaskbarProps> = ({ date, time }) => {
    return (
        <div className={styles.taskbar}>
            <button className={styles.startButton}>
                start
            </button>
            <div className={styles.divider} />

            {/* Window List Area - Can be populated dynamically later */}

            <div className={styles.tray}>
                <div className={styles.time} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '11px', lineHeight: '1.1' }}>
                    <span>{time}</span>
                    <span>{date}</span>
                </div>
            </div>
        </div>
    );
};

export default Taskbar;
