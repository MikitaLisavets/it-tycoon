"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { GAME_CONSTANTS, CREDIT_WARNING_DAYS } from '../lib/game/constants/index';
import { GameState } from '../lib/game/types';

export function useDesktopNotifications(
    state: GameState,
    isInitialized: boolean,
    showNotification: (title: string, message: string, type?: 'info' | 'warning', badge?: any) => void,
    dismissNotification: () => void,
    updateState: (updates: Partial<GameState>) => void
) {
    const tNotification = useTranslations();
    const [lastWarnings, setLastWarnings] = useState<{ health: number; mood: number }>({ health: 0, mood: 0 });

    // Notification Logic (Generator)
    useEffect(() => {
        if (!isInitialized || state.gameOver) return;

        const now = Date.now();
        const COOLDOWN = 60000; // 1 minute cooldown for same warning

        // Check Health
        if (state.stats.health < GAME_CONSTANTS.CRITICAL_THRESHOLD && now - lastWarnings.health > COOLDOWN) {
            showNotification(
                tNotification('Notifications.low_health_title'),
                tNotification('Notifications.low_health'),
                'warning'
            );
            setLastWarnings(prev => ({ ...prev, health: now }));
        }

        // Check Mood
        if (state.stats.mood < GAME_CONSTANTS.CRITICAL_THRESHOLD && now - lastWarnings.mood > COOLDOWN) {
            showNotification(
                tNotification('Notifications.low_mood_title'),
                tNotification('Notifications.low_mood'),
                'warning'
            );
            setLastWarnings(prev => ({ ...prev, mood: now }));
        }

        // Check Credits Due Soon
        if (state.banking && state.banking.credits.length > 0) {
            const currentDays = state.date.year * 360 + state.date.month * 30 + state.date.day;

            for (const credit of state.banking.credits) {
                const dueDays = credit.dueDate.year * 360 + credit.dueDate.month * 30 + credit.dueDate.day;
                const daysLeft = dueDays - currentDays;

                if (daysLeft <= CREDIT_WARNING_DAYS && daysLeft > 0) {
                    const creditWarningKey = `credit_${credit.id}`;
                    const lastCreditWarning = (lastWarnings as Record<string, number>)[creditWarningKey] || 0;

                    if (now - lastCreditWarning > COOLDOWN) {
                        showNotification(
                            tNotification('Notifications.credit_due_soon_title'),
                            tNotification('Notifications.credit_due_soon', { days: daysLeft }),
                            'warning'
                        );
                        setLastWarnings(prev => ({ ...prev, [creditWarningKey]: now }));
                    }
                }
            }
        }
    }, [state.stats.health, state.stats.mood, state.banking, state.date, state.gameOver, isInitialized, lastWarnings, tNotification, showNotification]);

    // Random Virus Event Logic
    useEffect(() => {
        if (!isInitialized || state.gameOver) return;

        const currentDays = state.date.year * 360 + state.date.month * 30 + state.date.day;
        const isProtected = state.software.antivirus !== 'none' && (state.software.protectionUntilDay || 0) > currentDays;

        if (state.computer.modem === 'modem_none' || isProtected) return;

        // Condition: modem owned, no antivirus or expired. Trigger on date change (every tick)
        const roll = Math.random();
        if (roll < GAME_CONSTANTS.VIRUS_PROBABILITY_PER_TICK) {
            showNotification(
                tNotification('Notifications.virus_title'),
                tNotification('Notifications.virus_description'),
                'warning',
                { stat: 'MOOD', value: GAME_CONSTANTS.VIRUS_MOOD_PENALTY, prefix: '-' }
            );
            updateState({
                stats: {
                    ...state.stats,
                    mood: Math.max(0, state.stats.mood - GAME_CONSTANTS.VIRUS_MOOD_PENALTY)
                }
            });
        }
    }, [state.date, state.computer.modem, state.software.antivirus, state.software.protectionUntilDay, state.gameOver, isInitialized, showNotification, tNotification, updateState]);

    // Dismiss notifications on game over
    useEffect(() => {
        if (state.gameOver) {
            dismissNotification();
        }
    }, [state.gameOver, dismissNotification]);
}
