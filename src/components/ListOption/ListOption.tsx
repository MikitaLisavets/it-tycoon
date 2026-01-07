import React, { ReactNode } from 'react';
import XPButton from '../XPButton/XPButton';
import styles from './ListOption.module.css';

interface ListOptionProps {
    title: ReactNode;
    subtitle?: ReactNode;
    extra?: ReactNode;
    actionLabel?: ReactNode;
    onAction?: () => void;
    actionDisabled?: boolean;
    actionContent?: ReactNode;
    className?: string;
    actionSound?: 'click' | 'purchase' | 'none';
}

const ListOption: React.FC<ListOptionProps> = ({
    title,
    subtitle,
    extra,
    actionLabel,
    onAction,
    actionDisabled,
    actionContent,
    className = '',
    actionSound = 'click'
}) => {
    return (
        <div className={`${styles.container} ${className}`}>
            <div className={styles.info}>
                <div className={styles.title}>{title}</div>
                {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                {extra && <div className={styles.extra}>{extra}</div>}
            </div>
            <div className={styles.action}>
                {actionLabel && onAction && (
                    <XPButton
                        onClick={onAction}
                        disabled={actionDisabled}
                        actionSound={actionSound}
                        style={{ minWidth: '80px' }}
                    >
                        {actionLabel}
                    </XPButton>
                )}
                {actionContent}
            </div>
        </div>
    );
};

export default ListOption;
