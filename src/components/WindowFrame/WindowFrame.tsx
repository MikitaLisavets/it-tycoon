import React, { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { useGameState } from '@/hooks/useGameState';
import { useAudio } from '@/hooks/useAudio';
import { GAME_CONSTANTS } from '@/lib/game/constants/index';
import styles from './WindowFrame.module.css';
import { ComputerIcon, HelpIcon, MaximizeIcon, RestoreIcon, CloseIcon } from '../Icons/SystemIcons';
import { useUIContext } from '@/context/UIContext';

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
  minWidth?: string;
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
  onFocus,
  minWidth
}) => {
  const t = useTranslations();
  const { state, updateState } = useGameState();
  const { playClick } = useAudio();
  const [isMaximized, setIsMaximized] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Dragging state
  const [position, setPosition] = React.useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const rafIdRef = React.useRef<number | null>(null);
  const windowDimensionsRef = React.useRef<{ width: number; height: number } | null>(null);

  // Resizing state
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null);
  const [isResizing, setIsResizing] = React.useState(false);
  const resizeStartRef = React.useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  // About modal context
  const { openAboutModal } = useUIContext();

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
            const initialX = Math.round((window.innerWidth - offsetWidth) / 2);
            const initialY = Math.round((window.innerHeight - 28 - offsetHeight) / 2);
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
    // Cache window dimensions to avoid layout recalculation during drag
    if (windowRef.current) {
      windowDimensionsRef.current = {
        width: windowRef.current.offsetWidth,
        height: windowRef.current.offsetHeight
      };
    }
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
      if (!isDragging || !dragStartRef.current || !windowDimensionsRef.current) return;

      // Cancel any pending RAF
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      // Use RAF for smooth 60fps updates
      rafIdRef.current = requestAnimationFrame(() => {
        const newX = e.clientX - dragStartRef.current!.x;
        const newY = e.clientY - dragStartRef.current!.y;

        // Boundary checks using cached dimensions
        const { width: windowWidth, height: windowHeight } = windowDimensionsRef.current!;
        const maxX = window.innerWidth - windowWidth;
        const maxY = window.innerHeight - 28 - windowHeight; // 28px is taskbar height

        setPosition({
          x: Math.round(Math.max(0, Math.min(newX, maxX))),
          y: Math.round(Math.max(0, Math.min(newY, maxY)))
        });
      });
    };

    const handleResizeMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeStartRef.current) return;

      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;

      setSize({
        width: Math.round(Math.max(200, resizeStartRef.current.w + deltaX)),
        height: Math.round(Math.max(150, resizeStartRef.current.h + deltaY))
      });
    };

    const handleMouseUp = () => {
      // Cancel any pending RAF
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      setIsDragging(false);
      dragStartRef.current = null;
      windowDimensionsRef.current = null;

      // Debounce localStorage save to avoid blocking
      if (position && id) {
        setTimeout(() => {
          try {
            const storageKey = `${GAME_CONSTANTS.GAME_NAME}-window-positions`;
            const savedPositions = JSON.parse(localStorage.getItem(storageKey) || '{}');
            savedPositions[id] = position;
            localStorage.setItem(storageKey, JSON.stringify(savedPositions));
          } catch (e) {
            console.error('Failed to save window position:', e);
          }
        }, 0);
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
    playClick();
    if (!isMobile) {
      setIsMaximized(!isMaximized);
    }
  };

  const windowStyle: React.CSSProperties = (isMaximized || isMobile)
    ? {}
    : {
      width: size ? `${size.width}px` : width,
      height: size ? `${size.height}px` : height,
      minWidth: minWidth,
      maxHeight: size ? `${size.height}px` : '',
      position: 'absolute',
      // Use transform for GPU acceleration instead of left/top
      left: position ? 0 : '50%',
      top: position ? 0 : '50%',
      transform: position ? `translate3d(${position.x}px, ${position.y}px, 0)` : 'translate(-50%, -50%)',
      opacity: position ? 1 : 0,
      zIndex: isFocused ? 100 : (isDragging ? 90 : 10),
      willChange: isDragging ? 'transform' : undefined
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
        alert(t('Common.save_success'));
      });
    } catch (e) {
      console.error('Failed to save game:', e);
    }
    setIsFileMenuOpen(false);
  };

  const handleLoadGame = () => {
    const code = window.prompt(t('Common.load_prompt'));
    if (code) {
      try {
        const decodedString = atob(code);
        const parsedState = JSON.parse(decodedString);

        // Basic validation
        if (parsedState && typeof parsedState === 'object' && 'version' in parsedState) {
          updateState(parsedState);
          alert(t('Common.load_success'));
        } else {
          alert(t('Common.load_invalid'));
        }
      } catch (e) {
        console.error('Failed to load game:', e);
        alert(t('Common.load_error'));
      }
    }
    setIsFileMenuOpen(false);
  };

  return (
    <div
      ref={windowRef}
      className={`${styles.window} ${(isMaximized || isMobile) ? styles.maximized : ''} ${isFocused ? styles.focused : ''} ${isDragging ? styles.dragging : ''}`}
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
          <ComputerIcon size={16} />
          <span className={styles.titleText}>{title}</span>
        </div>
        <div className={styles.controls}>
          {/* Visual only buttons */}
          <button className={`${styles.controlBtn} ${styles.help}`} onClick={() => { playClick(); onHelpClick?.(); }}>
            <HelpIcon size={16} />
          </button>
          {!isMobile && (
            <button className={`${styles.controlBtn} ${styles.maximize}`} onClick={toggleMaximize}>
              {isMaximized ? <RestoreIcon size={12} /> : <MaximizeIcon size={12} />}
            </button>
          )}
          <button className={`${styles.controlBtn} ${styles.close}`} onClick={() => { playClick(); onCloseClick?.(); }}>
            <CloseIcon size={12} />
          </button>
        </div>
      </div>
      <div className={styles.menuBar}>
        <div style={{ position: 'relative' }} ref={fileMenuRef}>
          <span
            className={styles.menuItem}
            onClick={() => { playClick(); setIsFileMenuOpen(!isFileMenuOpen); }}
            style={{ backgroundColor: isFileMenuOpen ? '#316AC5' : undefined, color: isFileMenuOpen ? 'white' : undefined }}
          >
            {t('Common.file')}
          </span>
          {isFileMenuOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownItem} onClick={() => { playClick(); handleSaveGame(); }}>
                {t('Common.save')}
              </div>
              <div className={styles.dropdownItem} onClick={() => { playClick(); handleLoadGame(); }}>
                {t('Common.load')}
              </div>
              <div
                className={styles.dropdownItem}
                onClick={() => {
                  playClick();
                  setIsFileMenuOpen(false);
                  if (onResetClick) {
                    onResetClick();
                  } else if (onCloseClick) {
                    onCloseClick();
                  }
                }}
              >
                {t('Common.reset')}
              </div>
            </div>
          )}
        </div>
        <span className={styles.menuItem} onClick={() => { playClick(); onHelpClick?.(); }}>{t('Common.help')}</span>
        <span className={styles.menuItem} onClick={() => { playClick(); openAboutModal(); }}>{t('Common.about')}</span>
      </div>
      <div className={styles.content}>
        {children}
      </div>
      {!isMaximized && !isMobile && (
        <div className={styles.resizeHandle} onMouseDown={handleResizeMouseDown} />
      )}
    </div>
  );
};

export default WindowFrame;
