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

    // Actions logic
    const actionLabel = t('Game.Education.start_part');
    const onAction = onStart;
    const actionDisabled = state.money < dynamicCost || isPartCompleted || isTrackCompleted || isLocked;


    // Action Content (Progress Bar + Time)
    const actionContent = (
        <div className={styles.actionContent}>
            {isPartActive && status === 'studying' && (
                <ProgressBar progress={progress} height="12px" />
            )}
            {!isPartCompleted && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <StatBadge stat="TIME" value={`${part.duration}s`} label={t('Rest.duration')} />
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
                    title={t('Game.cost')}
                />
            </div>
        );
    }

    return (
        <div className={`${styles.ticketCard} ${isPartCompleted ? styles.completed : ''} ${isPartActive ? styles.active : ''}`}>
            {isPartCompleted && <div className={styles.stamp}>{t('Game.Education.completed')}</div>}

            <div className={styles.ticketContent}>
                <div className={styles.ticketHeader}>
                    <span>{t('Game.Education.class').toUpperCase()} {index + 1}0{Math.floor(Math.random() * 10)}</span>
                </div>

                <div className={styles.ticketBody}>
                    <ListOption
                        title={part.title}
                        subtitle={subtitle}
                        actionLabel={actionLabel}
                        onAction={onAction}
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
