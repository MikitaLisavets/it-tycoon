import React from 'react';
import styles from './XPButton.module.css';

interface XPButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'primary';
    children: React.ReactNode;
}

const XPButton: React.FC<XPButtonProps> = ({ variant = 'default', children, className, ...props }) => {
    const btnClass = variant === 'primary' ? styles.primary : styles.button;
    return (
        <button className={`${btnClass} ${className || ''}`} {...props}>
            {children}
        </button>
    );
};

export default XPButton;
