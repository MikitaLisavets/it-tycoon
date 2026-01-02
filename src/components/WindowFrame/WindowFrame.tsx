import React, { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { useGameState } from '@/hooks/useGameState';
import styles from './WindowFrame.module.css';

interface WindowFrameProps {
  title: string;
  children: ReactNode;
  width?: string;
  height?: string;
  icon?: string; // Optional icon url or component
  onHelpClick?: () => void;
  onCloseClick?: () => void;
}

const WindowFrame: React.FC<WindowFrameProps> = ({ title, children, width = '100%', height = 'auto', onHelpClick, onCloseClick }) => {
  const t = useTranslations('WindowFrame');
  const { state, updateState } = useGameState();
  const [isMaximized, setIsMaximized] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Dragging state
  const [position, setPosition] = React.useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const windowRef = React.useRef<HTMLDivElement>(null);

  // Center on mount and handle resize
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (windowRef.current) {
        const { offsetWidth, offsetHeight } = windowRef.current;
        const maxX = window.innerWidth - offsetWidth;
        const maxY = window.innerHeight - 28 - offsetHeight; // 28px taskbar

        setPosition(prev => {
          if (!prev) {
            // Initial center
            const initialX = (window.innerWidth - offsetWidth) / 2;
            const initialY = (window.innerHeight - 28 - offsetHeight) / 2;
            return { x: Math.max(0, initialX), y: Math.max(0, initialY) };
          } else {
            // Adjust if out of bounds
            return {
              x: Math.max(0, Math.min(prev.x, maxX)),
              y: Math.max(0, Math.min(prev.y, maxY))
            };
          }
        });
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized || isMobile || !position) return;

    // Only drag with left mouse button
    if (e.button !== 0) return;

    e.preventDefault(); // Prevent text selection
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current || !windowRef.current) return;

      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;

      // Boundary checks
      const windowWidth = windowRef.current.offsetWidth;
      const windowHeight = windowRef.current.offsetHeight;
      const maxX = window.innerWidth - windowWidth;
      const maxY = window.innerHeight - 28 - windowHeight; // 28px is taskbar height

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const toggleMaximize = () => {
    if (!isMobile) {
      setIsMaximized(!isMaximized);
    }
  };

  const windowStyle: React.CSSProperties = (isMaximized || isMobile)
    ? {}
    : {
      width,
      height,
      position: 'absolute',
      left: position ? `${position.x}px` : '50%', // Fallback to center before measurement
      top: position ? `${position.y}px` : '50%',
      transform: position ? 'none' : 'translate(-50%, -50%)', // Center transform fallback
      zIndex: isDragging ? 100 : 10,
      boxShadow: isDragging ? '4px 4px 10px rgba(0,0,0,0.5)' : undefined
    };

  // Dropdown state
  const [isFileMenuOpen, setIsFileMenuOpen] = React.useState(false);
  const fileMenuRef = React.useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(event.target as Node)) {
        setIsFileMenuOpen(false);
      }
    };

    if (isFileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFileMenuOpen]);

  const handleSaveGame = () => {
    try {
      const stateString = JSON.stringify(state);
      const encodedState = btoa(stateString);
      navigator.clipboard.writeText(encodedState).then(() => {
        alert(t('save_success'));
      });
    } catch (e) {
      console.error('Failed to save game:', e);
    }
    setIsFileMenuOpen(false);
  };

  const handleLoadGame = () => {
    const code = window.prompt(t('load_prompt'));
    if (code) {
      try {
        const decodedString = atob(code);
        const parsedState = JSON.parse(decodedString);

        // Basic validation
        if (parsedState && typeof parsedState === 'object' && 'version' in parsedState) {
          updateState(parsedState);
          alert(t('load_success'));
        } else {
          alert(t('load_invalid'));
        }
      } catch (e) {
        console.error('Failed to load game:', e);
        alert(t('load_error'));
      }
    }
    setIsFileMenuOpen(false);
  };

  return (
    <div
      ref={windowRef}
      className={`${styles.window} ${(isMaximized || isMobile) ? styles.maximized : ''}`}
      style={windowStyle}
    >
      <div
        className={styles.titleBar}
        onMouseDown={handleMouseDown}
        style={{ cursor: (isMaximized || isMobile) ? 'default' : 'move' }}
      >
        <div className={styles.title}>
          {/* Default generic icon if none provided */}
          <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png" alt="" width={16} height={16} />
          {title}
        </div>
        <div className={styles.controls}>
          {/* Visual only buttons */}
          <button className={`${styles.controlBtn} ${styles.help}`} onClick={onHelpClick}>?</button>
          {!isMobile && (
            <button className={`${styles.controlBtn} ${styles.maximize}`} onClick={toggleMaximize}>□</button>
          )}
          <button className={`${styles.controlBtn} ${styles.close}`} onClick={onCloseClick}>X</button>
        </div>
      </div>
      <div className={styles.menuBar}>
        <div style={{ position: 'relative' }} ref={fileMenuRef}>
          <span
            className={styles.menuItem}
            onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
            style={{ backgroundColor: isFileMenuOpen ? '#316AC5' : undefined, color: isFileMenuOpen ? 'white' : undefined }}
          >
            {t('file')}
          </span>
          {isFileMenuOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownItem} onClick={handleSaveGame}>
                {t('save')}
              </div>
              <div className={styles.dropdownItem} onClick={handleLoadGame}>
                {t('load')}
              </div>
              <div
                className={styles.dropdownItem}
                onClick={() => {
                  setIsFileMenuOpen(false);
                  if (onCloseClick) onCloseClick();
                }}
              >
                {t('reset')}
              </div>
            </div>
          )}
        </div>
        <span className={styles.menuItem} onClick={onHelpClick}>{t('help')}</span>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default WindowFrame;
