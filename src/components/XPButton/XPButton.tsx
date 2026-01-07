import React from 'react';
import styles from './XPButton.module.css';
import { useAudio } from '../../hooks/useAudio';

interface XPButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'primary';
    children: React.ReactNode;
    actionSound?: 'click' | 'purchase' | 'none';
}

const XPButton: React.FC<XPButtonProps> = ({ variant = 'default', children, className, onClick, actionSound = 'click', ...props }) => {
    const { playClick, playPurchase } = useAudio();
    const btnClass = variant === 'primary' ? styles.primary : styles.button;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (actionSound === 'click') playClick();
        if (actionSound === 'purchase') playPurchase();
        if (onClick) onClick(e);
    };

    return (
        <button className={`${btnClass} ${className || ''}`} onClick={handleClick} {...props}>
            {children}
        </button>
    );
};

export default XPButton;
