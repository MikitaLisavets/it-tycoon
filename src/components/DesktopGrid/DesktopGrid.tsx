import React from 'react';
import styles from './DesktopGrid.module.css';
import DesktopShortcut from '../DesktopShortcut/DesktopShortcut';

export interface ShortcutData {
    id: string;
    label: string;
    icon: string | React.ReactNode;
}

interface DesktopGridProps {
    shortcuts: ShortcutData[];
    onIconDoubleClick: (id: string) => void;
}

const DesktopGrid: React.FC<DesktopGridProps> = ({ shortcuts, onIconDoubleClick }) => {
    return (
        <div className={styles.gridContainer}>
            {shortcuts.map(shortcut => (
                <DesktopShortcut
                    key={shortcut.id}
                    id={shortcut.id}
                    label={shortcut.label}
                    icon={shortcut.icon}
                    onDoubleClick={onIconDoubleClick}
                />
            ))}
        </div>
    );
};

export default DesktopGrid;
