"use client";

import React from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useTranslations } from 'next-intl';
import styles from './GoalsList.module.css';

const GoalsList: React.FC = () => {
    const { state } = useGameState();
    const t = useTranslations();

    const batchSize = 3;
    const allGoals = state.goals;

    // Find the current batch index (first batch with uncompleted goals)
    let startIndex = 0;
    for (let i = 0; i < allGoals.length; i += batchSize) {
        const batch = allGoals.slice(i, i + batchSize);
        const allCompleted = batch.every(g => g.completed);
        if (!allCompleted) {
            startIndex = i;
            break;
        }
        startIndex = i + batchSize; // Move to next potential batch
    }

    const currentBatch = allGoals.slice(startIndex, startIndex + batchSize);
    const isAllGloballyCompleted = allGoals.every(g => g.completed);

    return (
        <div className={styles.container}>
            <div className={styles.tape} />
            <div className={styles.title}>{t('Dashboard.todo_list') || 'TO-DO LIST'}</div>
            <div className={styles.content}>
                {allGoals.length === 0 && (
                    <div className={styles.empty}>{t('Dashboard.no_objectives') || 'No current objectives.'}</div>
                )}

                {isAllGloballyCompleted && allGoals.length > 0 && (
                    <div className={styles.allCompleted}>
                        🎉 {t('Dashboard.all_goals_completed')}
                    </div>
                )}

                {!isAllGloballyCompleted && currentBatch.map((goal) => (
                    <div
                        key={goal.id}
                        className={`${styles.goalItem} ${goal.completed ? styles.completed : ''}`}
                    >
                        <span className={styles.bullet}>
                            {goal.completed ? '✓' : '•'}
                        </span>
                        {t(goal.text)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GoalsList;
