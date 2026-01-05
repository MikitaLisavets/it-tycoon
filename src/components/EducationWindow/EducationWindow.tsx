"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import { useGameState } from '../../hooks/useGameState';
import { EDUCATION_TRACKS, EducationTrack, EducationPart } from '../../lib/game/constants/education';
import { EducationId } from '../../lib/game/types';
import styles from './EducationWindow.module.css';
import StatBadge from '../StatBadge/StatBadge';
import { calculateDynamicPrice } from '../../lib/game/utils/economy';
import ProgressBar from '../ProgressBar/ProgressBar';

interface EducationWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onReset?: () => void;
    isFocused?: boolean;
    onFocus?: () => void;
}

const EducationWindow: React.FC<EducationWindowProps> = ({ isOpen, onClose, onReset, isFocused, onFocus }) => {
    const { state, updateState } = useGameState();
    const t = useTranslations('Game.Education');
    const gt = useTranslations('Game');

    const [progress, setProgress] = useState(0);
    const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

    const {
        completedTracks,
        activeTrackId,
        currentPartIndex,
        status
    } = state.educationProgress;

    const handleApply = (trackId: string) => {
        const track = EDUCATION_TRACKS.find(t => t.id === trackId);
        if (!track) return;

        const firstPart = track.parts[0];
        const cost = calculateDynamicPrice(firstPart.cost, state);

        if (state.money < cost) return;

        updateState({
            money: state.money - cost,
            educationProgress: {
                ...state.educationProgress,
                activeTrackId: trackId as EducationId,
                currentPartIndex: 0,
                status: 'studying',
                startTime: Date.now()
            }
        });
    };

    const handleStartNextPart = () => {
        if (!activeTrackId) return;
        const track = EDUCATION_TRACKS.find(t => t.id === activeTrackId);
        if (!track) return;

        const nextPart = track.parts[currentPartIndex];
        const cost = calculateDynamicPrice(nextPart.cost, state);

        if (state.money < cost) return;

        updateState({
            money: state.money - cost,
            educationProgress: {
                ...state.educationProgress,
                status: 'studying',
                startTime: Date.now()
            }
        });
    };

    const handleQuizAnswer = (answerIndex: number) => {
        if (!activeTrackId) return;
        const track = EDUCATION_TRACKS.find(t => t.id === activeTrackId);
        if (!track) return;

        const currentPart = track.parts[currentPartIndex];

        if (answerIndex === currentPart.quiz.answer) {
            // Correct
            if (currentPartIndex === track.parts.length - 1) {
                // Completed whole track
                updateState({
                    educationProgress: {
                        completedTracks: [...completedTracks, activeTrackId],
                        activeTrackId: null,
                        currentPartIndex: 0,
                        status: 'idle'
                    },
                    // Also update the legacy education field for backward compatibility
                    education: activeTrackId
                });
            } else {
                // Next part
                updateState({
                    educationProgress: {
                        ...state.educationProgress,
                        currentPartIndex: currentPartIndex + 1,
                        status: 'idle' // Waiting for user to start next part
                    }
                });
            }
        } else {
            // Wrong - Rejected
            alert(t('rejected_message'));
            updateState({
                educationProgress: {
                    ...state.educationProgress,
                    activeTrackId: null,
                    currentPartIndex: 0,
                    status: 'idle'
                }
            });
        }
    };

    useEffect(() => {
        if (status === 'studying' && activeTrackId && state.educationProgress.startTime) {
            const track = EDUCATION_TRACKS.find(t => t.id === activeTrackId);
            if (!track) return;
            const part = track.parts[currentPartIndex];
            const durationMs = part.duration * 1000;
            const startTime = state.educationProgress.startTime;

            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const percent = Math.min(100, (elapsed / durationMs) * 100);
                setProgress(percent);

                if (percent >= 100) {
                    clearInterval(interval);
                    updateState({
                        educationProgress: {
                            ...state.educationProgress,
                            status: 'quiz'
                        }
                    });
                    setProgress(0);
                }
            }, 100);

            return () => clearInterval(interval);
        } else {
            setProgress(0);
        }
    }, [status, activeTrackId, currentPartIndex, state.educationProgress.startTime, updateState]);

    const isTrackLocked = (track: EducationTrack) => {
        if (track.requirements?.education) {
            return !completedTracks.includes(track.requirements.education as EducationId);
        }
        return false;
    };

    if (!isOpen) return null;

    return (
        <WindowFrame
            id="education_window"
            title={t('title')}
            onCloseClick={onClose}
            onResetClick={onReset}
            width="500px"
            isFocused={isFocused}
            onFocus={onFocus}
        >
            <div className={styles.content}>
                {EDUCATION_TRACKS.map(track => {
                    const isCompleted = completedTracks.includes(track.id as EducationId);
                    const isActive = activeTrackId === track.id;
                    const isLocked = isTrackLocked(track);
                    const canAffordTrack = track.parts[0].cost <= state.money;

                    return (
                        <div key={track.id} className={styles.trackCard}>
                            <div className={styles.trackHeader}>
                                <span className={styles.trackTitle}>{track.title}</span>
                                {isCompleted && <span className={styles.completedBadge}>{t('completed')}</span>}
                            </div>

                            {isLocked ? (
                                <div className={styles.lockedMessage}>
                                    {t('locked_by', { req: track.requirements?.education || '' })}
                                </div>
                            ) : (
                                <div className={styles.partList}>
                                    {track.parts.map((part, index) => {
                                        const isPartCompleted = isCompleted || (isActive && index < currentPartIndex);
                                        const isPartActive = isActive && index === currentPartIndex;

                                        return (
                                            <div
                                                key={part.id}
                                                className={`${styles.partItem} ${isPartActive ? styles.active : ''} ${isPartCompleted ? styles.completed : ''}`}
                                            >
                                                <div className={styles.partInfo}>
                                                    <span className={styles.partTitle}>{part.title}</span>
                                                    {!isPartCompleted && (
                                                        <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem' }}>
                                                            <span>{gt('cost')}: ${calculateDynamicPrice(part.cost, state)}</span>
                                                            <span>{gt('duration')}: {part.duration}s</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={styles.partActions}>
                                                    {!isCompleted && !activeTrackId && index === 0 && !isLocked && (
                                                        <button
                                                            className={styles.optionBtn}
                                                            onClick={() => handleApply(track.id)}
                                                            disabled={state.money < calculateDynamicPrice(part.cost, state)}
                                                        >
                                                            {t('apply')}
                                                        </button>
                                                    )}

                                                    {isPartActive && status === 'idle' && (
                                                        <button
                                                            className={styles.optionBtn}
                                                            onClick={handleStartNextPart}
                                                            disabled={state.money < calculateDynamicPrice(part.cost, state)}
                                                        >
                                                            {t('start_part')}
                                                        </button>
                                                    )}

                                                    {isPartActive && status === 'studying' && (
                                                        <ProgressBar progress={progress} height="20px" />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {isActive && status === 'quiz' && (
                                <div className={styles.quizContainer}>
                                    <div className={styles.question}>
                                        {track.parts[currentPartIndex].quiz.question}
                                    </div>
                                    <div className={styles.options}>
                                        {track.parts[currentPartIndex].quiz.options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                className={styles.optionBtn}
                                                onClick={() => handleQuizAnswer(idx)}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </WindowFrame>
    );
};

export default EducationWindow;
