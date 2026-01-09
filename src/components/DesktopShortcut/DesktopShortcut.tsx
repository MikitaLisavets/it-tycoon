import React, { useState, useRef } from 'react';
import styles from './DesktopShortcut.module.css';
import { useAudio } from '@/hooks/useAudio';

interface DesktopShortcutProps {
    id: string;
    label: string;
    icon: string | React.ReactNode;
    onDoubleClick: (id: string) => void;
}

const DesktopShortcut: React.FC<DesktopShortcutProps> = ({ id, label, icon, onDoubleClick }) => {
    const { playClick } = useAudio();
    const [isSelected, setIsSelected] = useState(false);
    const lastClickTime = useRef<number>(0);

    const handleShortCutClick = (e: React.MouseEvent | React.TouchEvent) => {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastClickTime.current;
        lastClickTime.current = currentTime;

        playClick();

        if (timeDiff < 300) {
            // Double click detected
            onDoubleClick(id);
            setIsSelected(false);
        } else {
            // Single click - select
            setIsSelected(true);
        }
    };

    return (
        <div
            className={`${styles.shortcut} ${isSelected ? styles.selected : ''}`}
            onClick={handleShortCutClick}
            role="button"
            tabIndex={0}
        >
            <div className={styles.iconContainer}>
                {typeof icon === 'string' ? (
                    // If icon is a URL string (or later a path), render an img. 
                    // For now, if it's a simple string like 'winamp', we might want a placeholder or map it.
                    // Assuming passing a src or a component for flexibility.
                    <img src={icon} alt={label} className={styles.iconImage} onError={(e) => {
                        // Fallback if image fails
                        (e.target as HTMLImageElement).style.display = 'none';
                    }} />
                ) : (
                    icon
                )}
                {/* Shortcut Overlay Arrow */}
                <div className={styles.shortcutOverlay}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0V10H10V0H0Z" fill="white" />
                        <path d="M2.5 7.5L7.5 2.5M7.5 2.5V6.5M7.5 2.5H3.5" stroke="black" strokeWidth="1.5" />
                    </svg>
                </div>
            </div>
            <span className={styles.label}>{label}</span>
        </div>
    );
};

export default DesktopShortcut;
