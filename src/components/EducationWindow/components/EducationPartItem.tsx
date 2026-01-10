import React from 'react';
import { useTranslations } from 'next-intl';
import styles from '../EducationWindow.module.css';
import { EducationPart } from '../../../lib/game/constants/education';
import ListOption from '../../ListOption/ListOption';
import StatBadge from '../../StatBadge/StatBadge';
import StatList from '../../StatList/StatList';
import ProgressBar from '../../ProgressBar/ProgressBar';
import { calculateDynamicPrice } from '../../../lib/game/utils/economy';
import QuizDisplay from './QuizDisplay';
import { GameState } from '../../../lib/game/types';

interface QuizResult {
    type: 'success' | 'failure';
    onContinue: () => void;
}

interface EducationPartItemProps {
    part: EducationPart;
    index: number;
    trackId: string;
    isTrackActive: boolean;
    isTrackCompleted: boolean;
    currentPartIndex: number;
    status: 'idle' | 'studying' | 'quiz';
    state: GameState;
    progress: number;
    currentQuizIndex: number;
    quizResult: QuizResult | null;
    isLocked: boolean;
    onStart: () => void;
    onQuizAnswer: (index: number) => void;
}

const EducationPartItem: React.FC<EducationPartItemProps> = ({
    part,
    index,
    isTrackActive,
    isTrackCompleted,
    currentPartIndex,
    status,
    state,
    progress,
    currentQuizIndex,
    quizResult,
    isLocked,
    onStart,
    onQuizAnswer
}) => {
    const t = useTranslations();

    // Logic from EducationWindow.tsx
    const isPartCompleted = isTrackCompleted || (isTrackActive && index < currentPartIndex);
    const isPartActive = isTrackActive && index === currentPartIndex;
    const dynamicCost = calculateDynamicPrice(part.cost, state);

    // Check if this part is not yet available:
    // - If track is NOT active: only the first part (index 0) is available
    // - If track IS active: only parts at or before currentPartIndex are available
    const isNotYetAvailable = isTrackActive
        ? index > currentPartIndex  // Track active: can only click current or earlier parts
        : index > 0;                 // Track not started: can only click first part

    // Actions logic
    let actionLabel = t('Education.start');
    if (isPartCompleted) {
        actionLabel = t('Education.btn_completed');
    } else if (isPartActive && (status === 'studying' || status === 'quiz')) {
        actionLabel = t('Education.learning');
    }

    const onAction = isPartActive ? undefined : onStart;
    const isLearningInProgress = status === 'studying' || status === 'quiz';
    const actionDisabled = state.money < dynamicCost || isPartCompleted || isTrackCompleted || isLocked || isNotYetAvailable || isLearningInProgress;


    // Action Content (Progress Bar + Time)
    const actionContent = isPartActive && (status === 'quiz') ? null : (
        <div className={styles.actionContent}>
            {isPartActive && status === 'studying' && (
                <ProgressBar progress={progress} height="12px" />
            )}
            {!isPartCompleted && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <StatBadge stat="TIME" value={`${part.duration}s`} />
                </div>
            )}
        </div>
    );

    // Subtitle logic
    let subtitle = null;
    if (!isPartCompleted) {
        subtitle = (
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <StatList
                    type="cost"
                    data={{ money: dynamicCost }}
                    title={t('Common.cost')}
                />
            </div>
        );
    }

    return (
        <div className={`${styles.ticketCard} ${isPartCompleted ? styles.completed : ''} ${isPartActive ? styles.active : ''} ${actionDisabled && !isPartCompleted && !isTrackCompleted && !isPartActive ? styles.disabled : ''}`}>
            {isPartCompleted && <div className={styles.stamp}>{t('Education.completed')}</div>}

            <div className={styles.ticketContent}>
                <div className={styles.ticketHeader}>
                    <span>{t('Education.class').toUpperCase()} #{index + 1}0{Math.floor(Math.random() * 10)}</span>

                    {actionDisabled && !isPartCompleted && !isTrackCompleted && !isLearningInProgress && (
                        <div className={styles.errorMessage}>
                            {state.money < dynamicCost && (
                                <span>{t('Education.insufficient_funds')}</span>
                            )}
                            {isNotYetAvailable && state.money >= dynamicCost && (
                                <span>{t('Education.complete_previous_first')}</span>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.ticketBody}>
                    <ListOption
                        title={part.title}
                        subtitle={subtitle}
                        actionLabel={actionLabel}
                        onAction={onAction}
                        actionSound={(!isPartCompleted && !isTrackCompleted && !isLocked && !isNotYetAvailable) ? 'purchase' : 'click'}
                        actionDisabled={actionDisabled}
                        actionContent={actionContent}
                        className={isPartCompleted ? 'opacity-50' : ''}
                    />
                </div>

                {/* Quiz Section */}
                {isPartActive && status === 'quiz' && (
                    <QuizDisplay
                        quiz={part.quizzes[currentQuizIndex]}
                        result={quizResult}
                        onAnswer={onQuizAnswer}
                    />
                )}
            </div>
        </div>
    );
};

export default EducationPartItem;
