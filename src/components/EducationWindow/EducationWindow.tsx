"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import { useGameState } from '../../hooks/useGameState';
import { EDUCATION_TRACKS } from '../../lib/game/constants/education';
import { EducationId } from '../../lib/game/types';
import styles from './EducationWindow.module.css';
import { calculateDynamicPrice } from '../../lib/game/utils/economy';
import EducationTrackItem from './components/EducationTrackItem';
import { useAudio } from '../../hooks/useAudio';
import GameAudio from '../GameAudio/GameAudio';
import HelpModal from '../HelpModal/HelpModal';

interface EducationWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onReset?: () => void;
    isFocused?: boolean;
    onFocus?: () => void;
}

const EducationWindow: React.FC<EducationWindowProps> = ({ isOpen, onClose, onReset, isFocused, onFocus }) => {
    const { state, updateState } = useGameState();
    const t = useTranslations();

    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [expandedTracks, setExpandedTracks] = useState<Set<string>>(new Set());
    const [quizResult, setQuizResult] = useState<{ type: 'success' | 'failure', onContinue: () => void } | null>(null);
    const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
    const { playClick, playError, playLevelUp, playPurchase } = useAudio();

    const {
        completedTracks,
        activeTrackId,
        currentPartIndex,
        status
    } = state.educationProgress;

    const handleStartPart = (trackId: string) => {
        playClick();
        const track = EDUCATION_TRACKS.find(t => t.id === trackId);
        if (!track) return;

        // Determine which part to start
        // If it's a new track, we start at 0
        // If it's the active track, we continue at currentPartIndex
        const targetPartIndex = (trackId === activeTrackId) ? currentPartIndex : 0;

        const partToStart = track.parts[targetPartIndex];
        const cost = calculateDynamicPrice(partToStart.cost, state);

        if (state.stats.money < cost) return;

        updateState({
            stats: {
                ...state.stats,
                money: state.stats.money - cost
            },
            educationProgress: {
                ...state.educationProgress,
                activeTrackId: trackId as EducationId,
                currentPartIndex: targetPartIndex,
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
        const currentQuiz = currentPart.quizzes[currentQuizIndex];

        if (answerIndex === currentQuiz.answer) {
            // Correct - play level up sound
            playLevelUp();
            setQuizResult({
                type: 'success',
                onContinue: () => {
                    setQuizResult(null);
                    setCurrentQuizIndex(0); // Reset for next time
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
                            stats: {
                                ...state.stats,
                                education: activeTrackId
                            }
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
                }
            });

        } else {
            // Wrong - Rejected
            playError();
            setQuizResult({
                type: 'failure',
                onContinue: () => {
                    setQuizResult(null);
                    setCurrentQuizIndex(0); // Reset for next time
                    updateState({
                        educationProgress: {
                            ...state.educationProgress,
                            activeTrackId: null,
                            currentPartIndex: 0,
                            status: 'idle'
                        }
                    });
                }
            });
        }
    };

    useEffect(() => {
        if (status === 'studying' && activeTrackId && state.educationProgress.startTime && !state.gameOver) {
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

                    // Pick random quiz question when study finishes
                    const quizCount = part.quizzes.length;
                    const randomIndex = Math.floor(Math.random() * quizCount);
                    setCurrentQuizIndex(randomIndex);

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

    useEffect(() => {
        // Auto-expand active track or first unlocked track if nothing is active
        if (activeTrackId) {
            setExpandedTracks(new Set([activeTrackId]));
        } else {
            // Find first unlocked AND uncompleted track
            const firstUnlockedUncompleted = EDUCATION_TRACKS.find(t => {
                const isCompleted = completedTracks.includes(t.id as EducationId);
                if (isCompleted) return false;

                if (t.requirements?.education) {
                    return completedTracks.includes(t.requirements.education as EducationId);
                }
                return true;
            });

            if (firstUnlockedUncompleted) {
                setExpandedTracks(new Set([firstUnlockedUncompleted.id]));
            }
        }
    }, [activeTrackId, completedTracks, isOpen]); // Rerender on open to ensure fresh state

    const toggleTrack = (trackId: string) => {
        playClick();
        const newExpanded = new Set(expandedTracks);
        if (newExpanded.has(trackId)) {
            newExpanded.delete(trackId);
        } else {
            newExpanded.add(trackId);
        }
        setExpandedTracks(newExpanded);
    };

    if (!isOpen) return null;

    return (
        <>
            <WindowFrame
                id="education_window"
                title={t('Education.title')}
                onCloseClick={onClose}
                onResetClick={onReset}
                onHelpClick={() => setIsHelpOpen(true)}
                width="500px"
                height="600px"
                isFocused={isFocused}
                onFocus={onFocus}
            >
                <div className={styles.container}>
                    {EDUCATION_TRACKS.map(track => {
                        const isCompleted = completedTracks.includes(track.id as EducationId);
                        const isTrackActive = activeTrackId === track.id;

                        return (
                            <EducationTrackItem
                                key={track.id}
                                track={track}
                                isExpanded={expandedTracks.has(track.id)}
                                isCompleted={isCompleted}
                                isActive={isTrackActive}
                                completedTracks={completedTracks}
                                state={state}
                                currentPartIndex={currentPartIndex}
                                status={status}
                                progress={progress}
                                currentQuizIndex={currentQuizIndex}
                                quizResult={quizResult}
                                onToggle={toggleTrack}
                                onStart={handleStartPart}
                                onQuizAnswer={handleQuizAnswer}
                            />
                        );
                    })}
                </div>
            </WindowFrame>
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={t('Education.title')}
                content={t('Education.help_content')}
            />
        </>
    );
};

export default EducationWindow;
