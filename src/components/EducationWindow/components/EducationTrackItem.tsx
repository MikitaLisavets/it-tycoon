import React from 'react';
import { useTranslations } from 'next-intl';
import styles from '../EducationWindow.module.css';
import { EducationTrack } from '../../../lib/game/constants/education';
import { EducationId, GameState } from '../../../lib/game/types';
import EducationPartItem from './EducationPartItem';

interface QuizResult {
    type: 'success' | 'failure';
    onContinue: () => void;
}

interface EducationTrackItemProps {
    track: EducationTrack;
    isExpanded: boolean;
    isCompleted: boolean;
    isActive: boolean;
    completedTracks: string[];
    state: GameState;
    currentPartIndex: number;
    status: 'idle' | 'studying' | 'quiz';
    progress: number;
    currentQuizIndex: number;
    quizResult: QuizResult | null;
    onToggle: (id: string) => void;
    onStart: (trackId: string) => void;
    onQuizAnswer: (index: number) => void;
}

const EducationTrackItem: React.FC<EducationTrackItemProps> = ({
    track,
    isExpanded,
    isCompleted,
    isActive,
    completedTracks,
    state,
    currentPartIndex,
    status,
    progress,
    currentQuizIndex,
    quizResult,
    onToggle,
    onStart,
    onQuizAnswer
}) => {
    const t = useTranslations();

    const isLocked = () => {
        if (track.requirements?.education) {
            return !completedTracks.includes(track.requirements.education as EducationId);
        }
        return false;
    };
    const locked = isLocked();

    return (
        <div className={styles.trackSection}>
            <div
                className={styles.trackHeader}
                onClick={() => onToggle(track.id)}
            >
                <div className={styles.headerContent}>
                    <div className={`${styles.chevron} ${isExpanded ? styles.expanded : ''}`} />
                    <span>{track.title}</span>
                </div>
                {isCompleted && <span className={styles.completedBadge}>{t('Game.Education.completed')}</span>}
            </div>

            {isExpanded && (
                <>
                    {locked ? (
                        <div className={styles.lockedMessage}>
                            {t('Game.Education.locked_by', { req: t(`Game.values.${track.requirements?.education}`) || '' })}
                        </div>
                    ) : (
                        <div className={styles.partList}>
                            {track.parts.map((part, index) => (
                                <EducationPartItem
                                    key={part.id}
                                    part={part}
                                    index={index}
                                    trackId={track.id}
                                    isTrackActive={isActive}
                                    isTrackCompleted={isCompleted}
                                    currentPartIndex={currentPartIndex}
                                    status={status}
                                    state={state}
                                    progress={progress}
                                    currentQuizIndex={currentQuizIndex}
                                    quizResult={quizResult}
                                    isLocked={locked}
                                    onStart={() => onStart(track.id)}
                                    onQuizAnswer={onQuizAnswer}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default EducationTrackItem;
