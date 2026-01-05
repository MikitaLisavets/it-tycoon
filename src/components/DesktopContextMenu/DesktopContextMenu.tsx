import React, { useEffect, useRef } from 'react';
import styles from './DesktopContextMenu.module.css';

interface DesktopContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onChangeWallpaper: () => void;
    onResetWallpaper: () => void;
}

const DesktopContextMenu: React.FC<DesktopContextMenuProps> = ({
    x,
    y,
    onClose,
    onChangeWallpaper,
    onResetWallpaper
}) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            className={styles.contextMenu}
            style={{ top: y, left: x }}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div className={styles.menuItem} onClick={() => { onChangeWallpaper(); onClose(); }}>
                Change Wallpaper...
            </div>
            <div className={styles.menuItem} onClick={() => { onResetWallpaper(); onClose(); }}>
                Reset to Default
            </div>
        </div>
    );
};

export default DesktopContextMenu;
