import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import HelpModal from '../HelpModal/HelpModal';
import styles from './MinesweeperWindow.module.css';
import * as logic from './logic';
import { useGameState } from '../../hooks/useGameState';
import { useGameLogs } from '../../hooks/useGameLogs';
import { useAudio } from '../../hooks/useAudio';
import { MinesweeperState } from '../../lib/game/types';

interface MinesweeperWindowProps {
    isOpen: boolean;
    onClose: () => void;
    isFocused: boolean;
    onFocus: () => void;
}

const MinesweeperWindow: React.FC<MinesweeperWindowProps> = ({
    isOpen,
    onClose,
    isFocused,
    onFocus,
}) => {
    const t = useTranslations();
    const { state, updateState } = useGameState();
    const { logMinesweeperPlay } = useGameLogs(); // Assuming we might want logs later
    const audio = useAudio();
    const gameState = state.apps.minesweeper;

    const boardRef = React.useRef<HTMLDivElement>(null);
    const [gridStyle, setGridStyle] = useState<React.CSSProperties>({});
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    useEffect(() => {
        if (!boardRef.current || !gameState) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            const boardRect = entry.contentRect;
            const boardRatio = boardRect.width / boardRect.height;
            const gridRatio = gameState.grid[0].length / gameState.grid.length;

            if (gridRatio > boardRatio) {
                // Grid is wider than board slot
                setGridStyle({
                    width: '100%',
                    height: 'auto'
                });
            } else {
                // Grid is taller (or same) than board slot
                setGridStyle({
                    width: 'auto',
                    height: '100%'
                });
            }
        });

        observer.observe(boardRef.current);
        return () => observer.disconnect();
    }, [gameState?.grid]);

    const [timer, setTimer] = useState(0);

    const updateMinesweeperState = useCallback((newState: MinesweeperState) => {
        updateState({
            apps: {
                ...state.apps,
                minesweeper: newState
            }
        });
    }, [state.apps, updateState]);

    const startNewGame = useCallback(() => {
        const newState = logic.initializeGame();
        updateMinesweeperState(newState);
        setTimer(0);
        logMinesweeperPlay();
    }, [updateMinesweeperState, logMinesweeperPlay]);

    useEffect(() => {
        if (isOpen && !gameState) {
            startNewGame();
        }
    }, [isOpen, gameState, startNewGame]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (gameState && !gameState.isWon && !gameState.isLost && gameState.startTime) {
            interval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - gameState.startTime!) / 1000);
                setTimer(Math.min(999, elapsed));
            }, 1000);
        } else if (gameState && (gameState.isWon || gameState.isLost) && gameState.startTime) {
            // Keep final time
            const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
            setTimer(Math.min(999, elapsed));
        } else {
            setTimer(0);
        }
        return () => clearInterval(interval);
    }, [gameState?.startTime, gameState?.isWon, gameState?.isLost]);

    const handleCellClick = (r: number, c: number) => {
        if (!gameState || gameState.isWon || gameState.isLost) return;

        onFocus();
        const cell = gameState.grid[r][c];
        if (cell.isFlagged || cell.isRevealed) return;

        const newState = logic.revealCell(gameState, r, c);

        if (newState.isLost) {
            audio.playClick(); // Explosion sound ideally, reusing click for now
        } else {
            audio.playClick();
        }

        updateMinesweeperState(newState);
    };

    const handleContextMenu = (e: React.MouseEvent, r: number, c: number) => {
        e.preventDefault();
        if (!gameState || gameState.isWon || gameState.isLost) return;

        onFocus();
        // audio.playClick(); // secondary click sound?
        const newState = logic.toggleFlag(gameState, r, c);
        updateMinesweeperState(newState);
    };

    const handleFaceClick = () => {
        startNewGame();
    };

    if (!isOpen || !gameState) return null;

    const renderCell = (r: number, c: number) => {
        const cell = gameState.grid[r][c];
        const isRevealed = cell.isRevealed;

        let content = null;
        let className = styles.cell;

        if (isRevealed) {
            className += ` ${styles.cellRevealed}`;
            if (cell.isMine) {
                className += ` ${styles.cellMine}`;
                // If it's the one we clicked to lose, make it redder?
                // For now just standard mine
                content = "💣";
                if (gameState.isLost && !cell.isFlagged) { // Specific styling for the mine that blew up could be done if we tracked it
                    className += ` ${styles.cellExploded}`;
                }
            } else if (cell.neighborMines > 0) {
                content = <span className={styles[`number${cell.neighborMines}`]}>{cell.neighborMines}</span>;
            }
        } else {
            if (cell.isFlagged) {
                content = <span className={styles.cellFlag}>🚩</span>;
            }
        }

        // Correct false flags at end
        if (gameState.isLost && !cell.isMine && cell.isFlagged) {
            content = "❌";
        }

        // Show unrevealed mines at loss
        if (gameState.isLost && cell.isMine && !cell.isRevealed && !cell.isFlagged) {
            className += ` ${styles.cellRevealed}`; // Show flattened
            content = "💣";
        }
        // Show flags at win (logic handles setting them, but just valid rendering)


        return (
            <div
                key={`${r}-${c}`}
                className={className}
                onClick={() => handleCellClick(r, c)}
                onContextMenu={(e) => handleContextMenu(e, r, c)}
            >
                {content}
            </div>
        );
    };

    return (
        <>
            <WindowFrame
                id="minesweeper_window"
                title={t('Values.minesweeper')}
                onCloseClick={onClose}
                onHelpClick={() => setIsHelpOpen(true)}
                width="auto"
                height="auto"
                isFocused={isFocused}
                onFocus={onFocus}
            >
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.counter}>{Math.max(0, gameState.totalMines - gameState.flagsPlaced).toString().padStart(3, '0')}</div>
                        <div className={styles.faceButton} onClick={handleFaceClick}>
                            {gameState.isWon ? '😎' : gameState.isLost ? '😵' : '🙂'}
                        </div>
                        <div className={styles.counter}>{timer.toString().padStart(3, '0')}</div>
                    </div>

                    <div className={styles.board} ref={boardRef}>
                        <div
                            className={styles.gridLayer}
                            style={{
                                aspectRatio: `${gameState.grid[0].length} / ${gameState.grid.length}`,
                                ...gridStyle
                            }}
                        >
                            {gameState.grid.map((rowV, r) => (
                                <div key={r} className={styles.row}>
                                    {rowV.map((_, c) => renderCell(r, c))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </WindowFrame>
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={t('Values.minesweeper')}
                content={t('Minesweeper.help_content')}
            />
        </>
    );
};

export default MinesweeperWindow;
