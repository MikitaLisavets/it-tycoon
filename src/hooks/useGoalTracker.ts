"use client";

import { useEffect } from 'react';
import { useGameState } from './useGameState';
import { useNotification } from './useNotification';
import { useTranslations } from 'next-intl';
import { calculateComputerLevel } from '@/lib/game/utils/hardware';

export function useGoalTracker() {
    const { state, updateState } = useGameState();
    const { showNotification } = useNotification();
    const t = useTranslations();

    useEffect(() => {
        if (!state.goals) return;

        let changed = false;
        const newGoals = state.goals.map(goal => {
            if (goal.completed) return goal;

            let isNowCompleted = false;

            if (goal.id === 'get_job' && state.job.id !== 'none') {
                isNowCompleted = true;
            } else if (goal.id === 'upgrade_pc' && state.computer.cpu !== 'intel_386') {
                isNowCompleted = true;
            } else if (goal.id === 'internet_access' && state.internet.access !== 'none') {
                isNowCompleted = true;
            } else if (goal.id === 'complete_school' && state.educationProgress.completedTracks.includes('school')) {
                isNowCompleted = true;
            } else if (goal.id === 'get_office_job' && (state.job.id === 'office_worker' || state.job.id === 'web_dev' || state.job.id === 'senior_dev' || state.job.id === 'startup_founder' || state.job.id === 'it_investor')) {
                isNowCompleted = true;
            } else if (goal.id === 'buy_first_software' && (state.software.programs.length > 0 || state.software.games.length > 0)) {
                isNowCompleted = true;
            } else if (goal.id === 'reach_1000' && state.stats.money >= 1000) {
                isNowCompleted = true;
            } else if (goal.id === 'complete_college' && state.educationProgress.completedTracks.includes('college')) {
                isNowCompleted = true;
            } else if (goal.id === 'become_developer' && (state.job.id === 'web_dev' || state.job.id === 'senior_dev' || state.job.id === 'startup_founder' || state.job.id === 'it_investor')) {
                isNowCompleted = true;
            } else if (goal.id === 'reach_10000' && state.stats.money >= 10000) {
                isNowCompleted = true;
            }

            if (isNowCompleted) {
                changed = true;
                showNotification(
                    t('Notifications.goal_completed_title'),
                    t(goal.text),
                    "info"
                );
                return { ...goal, completed: true };
            }

            return goal;
        });

        // Check if all goals are completed
        const allCompleted = newGoals.every(g => g.completed);
        const wasAllCompleted = state.goals.every(g => g.completed);

        if (allCompleted && !wasAllCompleted) {
            showNotification(
                t('Notifications.all_goals_completed_title'),
                t('Notifications.all_goals_completed'),
                "info"
            );
        }

        if (changed) {
            updateState({ goals: newGoals });
        }
    }, [state.stats, state.job, state.computer, state.internet, state.goals, updateState, showNotification, t]);

    useEffect(() => {
        if (!state.achievements) return;

        const newAchievements = [...state.achievements];
        let changed = false;

        const checkAndUnlock = (id: string, criteria: boolean) => {
            if (!newAchievements.includes(id) && criteria) {
                newAchievements.push(id);
                changed = true;
                showNotification(
                    t('Notifications.achievement_unlocked_title'),
                    t(`Achievements.${id}.title`),
                    "info"
                );
            }
        };

        checkAndUnlock('first_job', state.job.id !== 'none');
        checkAndUnlock('millionaire', state.stats.money >= 1000000);
        checkAndUnlock('university_grad', state.educationProgress.completedTracks.includes('university'));
        checkAndUnlock('career_master', state.job.levels['it_investor'] >= 10);
        checkAndUnlock('hardware_pro', calculateComputerLevel(state.computer) >= 5);
        checkAndUnlock('solitaire_pro', state.logs.some(l => l.type === 'solitaire_win'));
        checkAndUnlock('hacker_pro', new Set(state.logs.filter(l => l.type === 'hack_success').map(l => l.data?.targetId)).size >= 5);

        // Survivor: Live for one full game year (2000 -> 2001)
        checkAndUnlock('survivor', state.date.year > 2000);

        if (changed) {
            updateState({ achievements: newAchievements });
        }
    }, [state.stats, state.job, state.computer, state.educationProgress, state.logs, state.date, state.achievements, updateState, showNotification]);
}
