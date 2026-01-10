import React, { useState, useEffect, useCallback, useRef } from 'react';
import WindowFrame from '../WindowFrame/WindowFrame';
import styles from './SolitaireWindow.module.css';
import { useTranslations } from 'next-intl';
import * as logic from './logic';
import { useAudio } from '../../hooks/useAudio';
import XPButton from '../XPButton/XPButton';


interface SolitaireWindowProps {
    isOpen: boolean;
    onClose: () => void;
    isFocused: boolean;
    onFocus: () => void;
}

const SolitaireWindow: React.FC<SolitaireWindowProps> = ({
    isOpen,
    onClose,
    isFocused,
    onFocus,
}) => {
    const t = useTranslations();
    const [gameState, setGameState] = useState<logic.SolitaireState | null>(null);
    const [selectedCard, setSelectedCard] = useState<{ card: logic.Card; pileType: 'waste' | 'tableau' | 'foundation'; pileIndex?: number | logic.Suit; cardIndex?: number } | null>(null);
    const [isWon, setIsWon] = useState(false);
    const audio = useAudio();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(null);
    const foundationsRef = useRef<(HTMLDivElement | null)[]>([]);


    const startNewGame = useCallback(() => {
        setGameState(logic.initializeGame());
        setSelectedCard(null);
        setIsWon(false);
    }, []);

    const cheatWin = useCallback(() => {
        setGameState(prev => {
            if (!prev) return prev;
            const newState = { ...prev };
            logic.SUITS.forEach(suit => {
                newState.foundation[suit] = logic.RANKS.map(rank => ({
                    suit,
                    rank,
                    isFaceUp: true,
                    id: `cheat-${rank}-${suit}`
                }));
            });
            return newState;
        });
        setIsWon(true);
    }, []);

    useEffect(() => {
        if (isOpen && !gameState) {
            startNewGame();
        }
    }, [isOpen, gameState, startNewGame]);
    const runWinAnimation = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Ensure canvas size is correct
        canvas.width = canvas.parentElement?.clientWidth || 800;
        canvas.height = canvas.parentElement?.clientHeight || 600;

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Initial clear

        const foundations = gameState?.foundation;
        if (!foundations) return;

        const suits: logic.Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
        let suitIdx = 0;
        let cardIdx = 12; // Start from top card (King)

        const foundationPositions = foundationsRef.current.map(f => {
            if (!f) return { x: 0, y: 0, w: 60, h: 84 };
            const rect = f.getBoundingClientRect();
            const parent = canvas.parentElement;
            if (!parent) return { x: 0, y: 0, w: 60, h: 84 };
            const cRect = parent.getBoundingClientRect();
            return {
                x: rect.left - cRect.left,
                y: rect.top - cRect.top,
                w: rect.width,
                h: rect.height
            };
        });

        const cardWidth = foundationPositions[0]?.w || 60;
        const cardHeight = foundationPositions[0]?.h || 84;

        const spawnCard = () => {
            while (suitIdx < 4) {
                if (cardIdx < 0) {
                    suitIdx++;
                    cardIdx = 12;
                    if (suitIdx >= 4) return null;
                }

                const suit = suits[suitIdx];
                const card = foundations[suit][cardIdx];
                cardIdx--;

                if (card) {
                    const pos = foundationPositions[suitIdx];
                    return {
                        x: pos.x,
                        y: pos.y,
                        vx: (Math.random() - 0.5) * 10 - 5,
                        vy: Math.random() * -10,
                        suit: card.suit,
                        rank: card.rank
                    };
                }
            }
            return null;
        };

        const activeCards: any[] = [];
        let framesToNextSpawn = 0;

        const gravity = 0.5;
        const bounce = -0.7;

        const animate = () => {
            if (framesToNextSpawn <= 0) {
                const newCard = spawnCard();
                if (newCard) {
                    activeCards.push(newCard);
                    framesToNextSpawn = 15;
                }
            }
            framesToNextSpawn--;

            activeCards.forEach((c, idx) => {
                const isRed = c.suit === 'hearts' || c.suit === 'diamonds';
                ctx.fillStyle = 'white';
                ctx.strokeStyle = '#000';
                ctx.beginPath();
                ctx.rect(c.x, c.y, cardWidth, cardHeight);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = isRed ? '#d11' : '#000';
                ctx.font = 'bold 12px Arial';
                ctx.fillText(c.rank, c.x + 5, c.y + 15);
                const suitSymbol = { spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣' }[c.suit as logic.Suit];
                ctx.font = '20px Arial';
                ctx.fillText(suitSymbol, c.x + cardWidth / 2 - 10, c.y + cardHeight / 2 + 7);

                c.x += c.vx;
                c.y += c.vy;
                c.vy += gravity;

                if (c.y + cardHeight > canvas.height) {
                    c.y = canvas.height - cardHeight;
                    c.vy *= bounce;
                    if (Math.abs(c.vy) < 1) c.vy = 0;
                }

                if (c.x + cardWidth < 0 || c.x > canvas.width) {
                    activeCards.splice(idx, 1);
                }
            });

            if (activeCards.length > 0 || suitIdx < 4) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animate();
    }, [gameState]);

    useEffect(() => {
        if (isWon) {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = canvas.parentElement?.clientWidth || 800;
                canvas.height = canvas.parentElement?.clientHeight || 600;
            }
            const timer = setTimeout(runWinAnimation, 500);
            return () => {
                clearTimeout(timer);
                if (animationRef.current) cancelAnimationFrame(animationRef.current);
            };
        }
    }, [isWon, runWinAnimation]);

    if (!isOpen || !gameState) return null;

    const handleStockClick = () => {
        if (gameState.stock.length === 0) {
            // Recycle waste to stock
            setGameState(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    stock: [...prev.waste].reverse().map(c => ({ ...c, isFaceUp: false })),
                    waste: []
                };
            });
        } else {
            // Draw from stock to waste
            setGameState(prev => {
                if (!prev) return prev;
                const newStock = [...prev.stock];
                const card = newStock.pop()!;
                return {
                    ...prev,
                    stock: newStock,
                    waste: [...prev.waste, { ...card, isFaceUp: true }]
                };
            });
        }
        audio.playClick();
        setSelectedCard(null);
    };

    const handleCardClick = (card: logic.Card, pileType: 'waste' | 'tableau' | 'foundation', pileIndex?: number | logic.Suit, cardIndex?: number) => {
        onFocus();

        if (!selectedCard) {
            // Select card if it's face up
            if (card.isFaceUp) {
                audio.playClick();
                setSelectedCard({ card, pileType, pileIndex, cardIndex });
            }
            return;
        }


        // Try to move
        let success = false;
        if (pileType === 'tableau' && typeof pileIndex === 'number') {
            success = moveCardsToTableau(pileIndex);
        } else if (pileType === 'foundation' && typeof pileIndex === 'string') {
            success = moveCardsToFoundation(pileIndex as logic.Suit);
        }

        if (success) {
            audio.playClick();
            setSelectedCard(null);
        } else {
            // If it's the same card, deselect
            if (selectedCard.card.id === card.id) {
                setSelectedCard(null);
            } else if (card.isFaceUp) {
                // Otherwise select the new card
                audio.playClick();
                setSelectedCard({ card, pileType, pileIndex, cardIndex });
            }
        }
    };


    const handleEmptyPileClick = (pileType: 'tableau' | 'foundation', pileIndex: number | logic.Suit) => {
        if (!selectedCard) return;

        let success = false;
        if (pileType === 'tableau' && typeof pileIndex === 'number') {
            success = moveCardsToTableau(pileIndex);
        } else if (pileType === 'foundation' && typeof pileIndex === 'string') {
            success = moveCardsToFoundation(pileIndex as logic.Suit);
        }

        if (success) {
            audio.playClick();
            setSelectedCard(null);
        }
    };

    const handleDragStart = (e: React.DragEvent, card: logic.Card, pileType: 'waste' | 'tableau' | 'foundation', pileIndex?: number | logic.Suit, cardIndex?: number) => {
        if (!card.isFaceUp) {
            e.preventDefault();
            return;
        }

        setSelectedCard({ card, pileType, pileIndex, cardIndex });
        e.dataTransfer.setData('application/json', JSON.stringify({ card, pileType, pileIndex, cardIndex }));
        e.dataTransfer.effectAllowed = 'move';

        // Visual feedback - optional, browser handles ghost image
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetPileType: 'tableau' | 'foundation', targetPileIndex: number | logic.Suit) => {
        e.preventDefault();
        if (!selectedCard) return;

        let success = false;
        if (targetPileType === 'tableau' && typeof targetPileIndex === 'number') {
            success = moveCardsToTableau(targetPileIndex);
        } else if (targetPileType === 'foundation' && typeof targetPileIndex === 'string') {
            success = moveCardsToFoundation(targetPileIndex as logic.Suit);
        }

        if (success) {
            audio.playClick();
        }
        setSelectedCard(null);
    };

    const moveCardsToTableau = (targetPileIndex: number): boolean => {
        if (!selectedCard || !gameState) return false;

        let success = false;
        setGameState(prev => {
            if (!prev) return prev;

            const targetPile = prev.tableau[targetPileIndex];
            if (!logic.canMoveToTableau(selectedCard.card, targetPile)) return prev;

            const newState = { ...prev };
            let cardsToMove: logic.Card[] = [];

            if (selectedCard.pileType === 'waste') {
                if (newState.waste.length === 0 || newState.waste[newState.waste.length - 1].id !== selectedCard.card.id) return prev;
                cardsToMove = [newState.waste.pop()!];
            } else if (selectedCard.pileType === 'tableau') {
                const sourcePileIndex = selectedCard.pileIndex as number;
                const sourcePile = [...newState.tableau[sourcePileIndex]];
                if (sourcePile.length <= selectedCard.cardIndex! || sourcePile[selectedCard.cardIndex!].id !== selectedCard.card.id) return prev;

                cardsToMove = sourcePile.splice(selectedCard.cardIndex!);
                newState.tableau[sourcePileIndex] = sourcePile;
                // Flip new top card
                if (sourcePile.length > 0) {
                    sourcePile[sourcePile.length - 1].isFaceUp = true;
                }
            } else if (selectedCard.pileType === 'foundation') {
                const suit = selectedCard.card.suit;
                const sourceFoundation = [...newState.foundation[suit]];
                if (sourceFoundation.length === 0 || sourceFoundation[sourceFoundation.length - 1].id !== selectedCard.card.id) return prev;

                cardsToMove = [sourceFoundation.pop()!];
                newState.foundation[suit] = sourceFoundation;
            }

            newState.tableau[targetPileIndex] = [...newState.tableau[targetPileIndex], ...cardsToMove];
            success = true;
            return newState;
        });
        return success;
    };

    const moveCardsToFoundation = (suit: logic.Suit): boolean => {
        if (!selectedCard || !gameState) return false;

        let success = false;
        setGameState(prev => {
            if (!prev) return prev;

            // Only top card can move to foundation
            if (selectedCard.pileType === 'tableau') {
                const sourcePileIndex = selectedCard.pileIndex as number;
                const pile = prev.tableau[sourcePileIndex];
                if (selectedCard.cardIndex !== pile.length - 1) return prev;
            }

            const targetFoundation = prev.foundation[suit];
            if (!logic.canMoveToFoundation(selectedCard.card, targetFoundation, suit)) return prev;

            const newState = { ...prev };
            let card: logic.Card;

            if (selectedCard.pileType === 'waste') {
                if (newState.waste.length === 0 || newState.waste[newState.waste.length - 1].id !== selectedCard.card.id) return prev;
                card = newState.waste.pop()!;
            } else if (selectedCard.pileType === 'tableau') {
                const sourcePileIndex = selectedCard.pileIndex as number;
                const sourcePile = [...newState.tableau[sourcePileIndex]];
                if (sourcePile.length === 0 || sourcePile[sourcePile.length - 1].id !== selectedCard.card.id) return prev;

                card = sourcePile.pop()!;
                newState.tableau[sourcePileIndex] = sourcePile;
                if (sourcePile.length > 0) {
                    sourcePile[sourcePile.length - 1].isFaceUp = true;
                }
            } else {
                return prev;
            }

            newState.foundation[suit] = [...newState.foundation[suit], card];
            checkWinCondition(newState);
            success = true;
            return newState;
        });
        return success;
    };

    const checkWinCondition = (state: logic.SolitaireState) => {
        const allDone = Object.values(state.foundation).every(pile => pile.length === 13);
        if (allDone) {
            setIsWon(true);
        }
    };


    const renderCard = (card: logic.Card, pileType: 'waste' | 'tableau' | 'foundation', pileIndex?: number | logic.Suit, cardIndex?: number, isRootInPile: boolean = false, children?: React.ReactNode) => {
        if (!card) return null;
        const isSelected = selectedCard?.card?.id === card.id;
        const colorClass = logic.getSuitColor(card.suit) === 'red' ? styles.cardRed : styles.cardBlack;
        const suitSymbol = { spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣' }[card.suit];

        return (
            <div
                key={card.id}
                draggable={card.isFaceUp}
                className={`${styles.card} ${!card.isFaceUp ? styles.cardBack : colorClass} ${isSelected ? styles.selected : ''}`}
                style={pileType === 'tableau' ? { top: isRootInPile ? 0 : 'var(--stack-offset)', position: isRootInPile ? 'relative' : 'absolute' } : {}}
                onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(card, pileType, pileIndex, cardIndex);
                }}
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    audio.playClick();
                    // Auto-move to foundation on double click
                    // We need the most recent state to avoid issues with multiple rapid clicks
                    // but since we are in a functional update usually, here we just try to find the correct suit
                    const suit = card.suit;
                    moveCardsToFoundation(suit);
                }}
                onDragStart={(e) => {
                    e.stopPropagation();
                    handleDragStart(e, card, pileType, pileIndex, cardIndex);
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => {
                    e.stopPropagation();
                    if (pileType === 'tableau' && typeof pileIndex === 'number') {
                        handleDrop(e, 'tableau', pileIndex);
                    } else if (pileType === 'foundation' && typeof pileIndex === 'string') {
                        handleDrop(e, 'foundation', pileIndex as logic.Suit);
                    }
                }}
            >
                {card.isFaceUp && (
                    <>
                        <div className={styles.rank}>{card.rank}</div>
                        <div className={styles.suit}>{suitSymbol}</div>
                        <div className={`${styles.rank} ${styles.bottomRank}`}>{card.rank}</div>
                    </>
                )}
                {children}
            </div>
        );
    };

    const renderTableauStack = (pile: logic.Card[], pIdx: number, cIdx: number): React.ReactNode => {
        if (cIdx >= pile.length) return null;
        return renderCard(
            pile[cIdx],
            'tableau',
            pIdx,
            cIdx,
            cIdx === 0,
            renderTableauStack(pile, pIdx, cIdx + 1)
        );
    };


    return (
        <WindowFrame
            id="solitaire_window"
            title={t('Values.solitaire')}
            onCloseClick={onClose}
            width="min(800px, 95vw)"
            height="min(600px, 80vh)"
            isFocused={isFocused}
            onFocus={onFocus}
        >
            <div className={styles.container}>
                <div className={styles.controls}>
                    <XPButton onClick={startNewGame}>{t('Solitaire.new_game')}</XPButton>
                    {/* {process.env.NODE_ENV === 'development' && (
                        <XPButton onClick={cheatWin}>Win (Debug)</XPButton>
                    )} */}
                </div>
                <div className={styles.board}>
                    <div className={styles.topRow}>
                        <div className={styles.stockWaste}>
                            <div className={`${styles.pile} ${gameState.stock.length === 0 ? styles.emptyPile : styles.cardBack}`} onClick={handleStockClick}>
                                {gameState.stock.length > 0 && <div className={styles.cardBack} style={{ width: '100%', height: '100%' }} />}
                            </div>
                            <div className={styles.pile}>
                                {gameState.waste.length > 0 && renderCard(gameState.waste[gameState.waste.length - 1], 'waste')}
                            </div>
                        </div>
                        <div className={styles.foundations}>
                            {(['spades', 'hearts', 'diamonds', 'clubs'] as logic.Suit[]).map((suit, idx) => (
                                <div
                                    key={suit}
                                    ref={el => { foundationsRef.current[idx] = el; }}
                                    className={`${styles.pile} ${gameState.foundation[suit].length === 0 ? styles.emptyPile : ''}`}
                                    onClick={() => handleEmptyPileClick('foundation', suit)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, 'foundation', suit)}
                                >
                                    {gameState.foundation[suit].length > 0 ?
                                        renderCard(gameState.foundation[suit][gameState.foundation[suit].length - 1], 'foundation', suit) :
                                        <div style={{ opacity: 0.2, fontSize: '40px', textAlign: 'center' }}>{{ spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣' }[suit]}</div>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.tableau}>
                        {gameState.tableau.map((pile, pIdx) => (
                            <div
                                key={pIdx}
                                className={styles.pile}
                                onClick={() => handleEmptyPileClick('tableau', pIdx)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, 'tableau', pIdx)}
                            >
                                {renderTableauStack(pile, pIdx, 0)}
                            </div>
                        ))}
                    </div>
                </div>
                {isWon && <canvas ref={canvasRef} className={styles.animationCanvas} />}
                {isWon && (
                    <div className={styles.winMessage}>
                        <h2>{t('Solitaire.victory')}</h2>
                        <XPButton onClick={startNewGame}>{t('Solitaire.new_game')}</XPButton>
                    </div>
                )}
            </div>
        </WindowFrame>
    );
};

export default SolitaireWindow;
