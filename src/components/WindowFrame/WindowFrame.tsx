import React, { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { useGameState } from '@/hooks/useGameState';
import { GAME_CONSTANTS } from '@/lib/game/constants/index';
import AboutModal from '../AboutModal/AboutModal';
import styles from './WindowFrame.module.css';

interface WindowFrameProps {
  id?: string;
  title: string;
  children: ReactNode;
  width?: string;
  height?: string;
  icon?: string; // Optional icon url or component
  onHelpClick?: () => void;
  onCloseClick?: () => void;
  onResetClick?: () => void;
  isFocused?: boolean;
  onFocus?: () => void;
}

const WindowFrame: React.FC<WindowFrameProps> = ({
  id,
  title,
  children,
  width = '100%',
  height = 'auto',
  onHelpClick,
  onCloseClick,
  onResetClick,
  isFocused,
  onFocus
}) => {
  const t = useTranslations('WindowFrame');
  const { state, updateState } = useGameState();
  const [isMaximized, setIsMaximized] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Dragging state
  const [position, setPosition] = React.useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = React.useRef<{ x: number; y: number } | null>(null);

  // Resizing state
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null);
  const [isResizing, setIsResizing] = React.useState(false);
  const resizeStartRef = React.useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  // About modal state
  const [isAboutOpen, setIsAboutOpen] = React.useState(false);

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
            // Try to load from localStorage first
            if (id) {
              try {
                const storageKey = `${GAME_CONSTANTS.GAME_NAME}-window-positions`;
                const savedPositions = JSON.parse(localStorage.getItem(storageKey) || '{}');
                const savedPos = savedPositions[id];

                if (savedPos && typeof savedPos.x === 'number' && typeof savedPos.y === 'number') {
                  // Check if the saved position is within current bounds
                  if (savedPos.x >= 0 && savedPos.x <= maxX && savedPos.y >= 0 && savedPos.y <= maxY) {
                    return savedPos;
                  }
                }
              } catch (e) {
                console.error('Failed to load window position:', e);
              }
            }

            // Default: Initial center
            const initialX = (window.innerWidth - offsetWidth) / 2;
            const initialY = (window.innerHeight - 28 - offsetHeight) / 2;
            return { x: Math.max(0, initialX), y: Math.max(0, initialY) };
          } else {
            // Adjust if out of bounds (e.g. on resize)
            return {
              x: Math.max(0, Math.min(prev.x, maxX)),
              y: Math.max(0, Math.min(prev.y, maxY))
            };
          }
        });

        // Handle size initialization
        if (id && !size) {
          try {
            const sizeKey = `${GAME_CONSTANTS.GAME_NAME}-window-sizes`;
            const savedSizes = JSON.parse(localStorage.getItem(sizeKey) || '{}');
            const savedSize = savedSizes[id];
            if (savedSize && typeof savedSize.width === 'number' && typeof savedSize.height === 'number') {
              setSize(savedSize);
            }
          } catch (e) {
            console.error('Failed to load window size:', e);
          }
        }
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [id, title]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized || isMobile || !position) return;
    if (e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (isMaximized || isMobile || !windowRef.current) return;
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: windowRef.current.offsetWidth,
      h: windowRef.current.offsetHeight
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

    const handleResizeMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeStartRef.current) return;

      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;

      setSize({
        width: Math.max(200, resizeStartRef.current.w + deltaX),
        height: Math.max(150, resizeStartRef.current.h + deltaY)
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;

      // Save position to localStorage
      if (position && id) {
        try {
          const storageKey = `${GAME_CONSTANTS.GAME_NAME}-window-positions`;
          const savedPositions = JSON.parse(localStorage.getItem(storageKey) || '{}');
          savedPositions[id] = position;
          localStorage.setItem(storageKey, JSON.stringify(savedPositions));
        } catch (e) {
          console.error('Failed to save window position:', e);
        }
      }
    };

    const handleResizeMouseUp = () => {
      if (isResizing && id && size) {
        try {
          const sizeKey = `${GAME_CONSTANTS.GAME_NAME}-window-sizes`;
          const savedSizes = JSON.parse(localStorage.getItem(sizeKey) || '{}');
          savedSizes[id] = size;
          localStorage.setItem(sizeKey, JSON.stringify(savedSizes));
        } catch (e) {
          console.error('Failed to save window size:', e);
        }
      }
      setIsResizing(false);
      resizeStartRef.current = null;
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleResizeMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleResizeMouseMove);
      document.removeEventListener('mouseup', handleResizeMouseUp);
    };
  }, [isDragging, isResizing, position, size, id, title]);

  const toggleMaximize = () => {
    if (!isMobile) {
      setIsMaximized(!isMaximized);
    }
  };

  const windowStyle: React.CSSProperties = (isMaximized || isMobile)
    ? {}
    : {
      width: size ? `${size.width}px` : width,
      height: size ? `${size.height}px` : height,
      maxHeight: size ? `${size.height}px` : '',
      position: 'absolute',
      left: position ? `${position.x}px` : '50%', // Fallback to center before measurement
      top: position ? `${position.y}px` : '50%',
      transform: position ? 'none' : 'translate(-50%, -50%)', // Center transform fallback
      zIndex: isFocused ? 100 : (isDragging ? 90 : 10),
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
      className={`${styles.window} ${(isMaximized || isMobile) ? styles.maximized : ''} ${isFocused ? styles.focused : ''}`}
      style={windowStyle}
      onMouseDown={() => onFocus?.()}
    >
      <div
        className={styles.titleBar}
        onMouseDown={handleMouseDown}
        style={{ cursor: (isMaximized || isMobile) ? 'default' : 'move' }}
      >
        <div className={styles.title}>
          {/* Default generic icon if none provided */}
          <img src="/icons/computer.png" alt="" width={16} height={16} />
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
                  if (onResetClick) {
                    onResetClick();
                  } else if (onCloseClick) {
                    onCloseClick();
                  }
                }}
              >
                {t('reset')}
              </div>
            </div>
          )}
        </div>
        <span className={styles.menuItem} onClick={onHelpClick}>{t('help')}</span>
        <span className={styles.menuItem} onClick={() => setIsAboutOpen(true)}>{t('about')}</span>
      </div>
      <div className={styles.content}>
        {children}
      </div>
      {!isMaximized && !isMobile && (
        <div className={styles.resizeHandle} onMouseDown={handleResizeMouseDown} />
      )}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
};

export default WindowFrame;
