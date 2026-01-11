"use client";

import { useState, useEffect, useCallback } from 'react';
import { useGameState } from './useGameState';
import { ActionableItem, GameState } from '../lib/game/types';
import { calculateDynamicPrice } from '../lib/game/utils/economy';

export function useActionableItem() {
    const { state, updateState } = useGameState();
    const [delayedActivity, setDelayedActivity] = useState<{
        item: ActionableItem;
        startTime: number;
    } | null>(null);
    const [progress, setProgress] = useState(0);

    const performActivity = useCallback((item: ActionableItem, mode: 'cost' | 'effect' | 'both') => {
        const statsUpdates: Partial<GameState['stats']> = {};

        // Base values for calculation (using current state if not updated in this pass)
        const currentMoney = state.stats.money;
        const currentHealth = state.stats.health;
        const currentStamina = state.stats.stamina;
        const currentMood = state.stats.mood;

        if (mode === 'cost' || mode === 'both') {
            const actualMoneyCost = calculateDynamicPrice(item.cost?.money || 0, state);
            statsUpdates.money = currentMoney - actualMoneyCost;
            statsUpdates.health = Math.max(0, currentHealth - (item.cost?.health || 0));
            statsUpdates.stamina = Math.max(0, currentStamina - (item.cost?.stamina || 0));
            statsUpdates.mood = Math.max(0, currentMood - (item.cost?.mood || 0));
        }

        if (mode === 'effect' || mode === 'both') {
            const baseMoney = statsUpdates.money !== undefined ? statsUpdates.money : currentMoney;
            const baseHealth = statsUpdates.health !== undefined ? statsUpdates.health : currentHealth;
            const baseStamina = statsUpdates.stamina !== undefined ? statsUpdates.stamina : currentStamina;
            const baseMood = statsUpdates.mood !== undefined ? statsUpdates.mood : currentMood;

            (['health', 'stamina', 'mood', 'money'] as const).forEach((stat) => {
                const effect = item.effect?.[stat];
                if (effect !== undefined) {
                    if (stat === 'money') {
                        statsUpdates.money = baseMoney + (effect as number);
                    } else {
                        const maxKey = `max${stat.charAt(0).toUpperCase()}${stat.slice(1)}` as keyof GameState['stats'];
                        const val = stat === 'health' ? baseHealth : stat === 'stamina' ? baseStamina : baseMood;
                        statsUpdates[stat] = effect === 'full'
                            ? state.stats[maxKey] as any
                            : Math.min(state.stats[maxKey] as number, val + (effect as number));
                    }
                }
            });

            // Handle max stat increases if present
            (['maxHealth', 'maxStamina', 'maxMood'] as const).forEach((maxStat) => {
                const effect = item.effect?.[maxStat];
                if (effect !== undefined) {
                    statsUpdates[maxStat] = (state.stats[maxStat] as number) + (effect as number);
                }
            });
        }

        const finalUpdate: Partial<GameState> = {
            stats: {
                ...state.stats,
                ...statsUpdates
            }
        };

        if (mode === 'effect' || mode === 'both') {
            finalUpdate.cooldowns = {
                ...state.cooldowns,
                [item.id]: Date.now()
            };

            if (item.isOneTime) {
                finalUpdate.purchasedItems = [
                    ...(state.purchasedItems || []),
                    item.id
                ];
            }
        }

        updateState(finalUpdate);
    }, [state, updateState]);

    useEffect(() => {
        if (!delayedActivity || state.gameOver) {
            setProgress(0);
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - delayedActivity.startTime;
            const durationMs = (delayedActivity.item.duration || 0) * 1000;
            const percent = Math.min(100, (elapsed / durationMs) * 100);

            setProgress(percent);

            if (percent >= 100) {
                performActivity(delayedActivity.item, 'effect');
                setDelayedActivity(null);
                setProgress(0);
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [delayedActivity, performActivity]);

    const getCooldown = useCallback((item: ActionableItem) => {
        if (!item.cooldown) return 0;
        const lastUsed = state.cooldowns?.[item.id] || 0;
        const remaining = item.cooldown * 1000 - (Date.now() - lastUsed);
        return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    }, [state.cooldowns]);

    const isPurchased = useCallback((item: ActionableItem) => {
        return !!state.purchasedItems?.includes(item.id);
    }, [state.purchasedItems]);

    const canAfford = useCallback((item: ActionableItem) => {
        if (item.isOneTime && isPurchased(item)) return false;

        const costMoney = calculateDynamicPrice(item.cost?.money || 0, state);
        const costHealth = item.cost?.health || 0;
        const costStamina = item.cost?.stamina || 0;
        const costMood = item.cost?.mood || 0;

        return state.stats.money >= costMoney &&
            state.stats.health >= costHealth &&
            state.stats.stamina >= costStamina &&
            state.stats.mood >= costMood;
    }, [state.stats.money, state.stats.health, state.stats.stamina, state.stats.mood, state.stats.education, isPurchased, state]);

    const handleAction = useCallback((item: ActionableItem) => {
        if (delayedActivity) return;
        if (!canAfford(item)) return;
        if (getCooldown(item) > 0) return;

        if (item.duration) {
            performActivity(item, 'cost');
            setDelayedActivity({
                item: item,
                startTime: Date.now(),
            });
        } else {
            performActivity(item, 'both');
        }
    }, [delayedActivity, canAfford, getCooldown, performActivity]);

    return {
        handleAction,
        getCooldown,
        isPurchased,
        canAfford,
        getDynamicPrice: useCallback((basePrice: number) => calculateDynamicPrice(basePrice, state), [state]),
        progress,
        delayedActivityId: delayedActivity?.item.id || null,
        isAnyInProgress: !!delayedActivity
    };
}
