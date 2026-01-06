import React from 'react';
import styles from './XPButton.module.css';
import { useAudio } from '../../hooks/useAudio';

interface XPButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'primary';
    children: React.ReactNode;
    mute?: boolean;
}

const XPButton: React.FC<XPButtonProps> = ({ variant = 'default', children, className, onClick, mute, ...props }) => {
    const { playClick } = useAudio();
    const btnClass = variant === 'primary' ? styles.primary : styles.button;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!mute) playClick();
        if (onClick) onClick(e);
    };

    return (
        <button className={`${btnClass} ${className || ''}`} onClick={handleClick} {...props}>
            {children}
        </button>
    );
};

export default XPButton;
