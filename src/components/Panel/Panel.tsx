import React from 'react';
import styles from './Panel.module.css';

interface PanelProps {
    label: string;
    children: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ label, children }) => {
    return (
        <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>{label}</legend>
            <div className={styles.content}>
                {children}
            </div>
        </fieldset>
    );
};

export default Panel;
