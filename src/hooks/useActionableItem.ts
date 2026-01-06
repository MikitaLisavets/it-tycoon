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
        const updates: any = {};

        // Base state to calculate against (will be merged later)
        const currentMoney = updates.money !== undefined ? updates.money : state.money;
        const currentHealth = updates.health !== undefined ? updates.health : state.health;
        const currentStamina = updates.stamina !== undefined ? updates.stamina : state.stamina;
        const currentMood = updates.mood !== undefined ? updates.mood : state.mood;

        if (mode === 'cost' || mode === 'both') {
            const actualMoneyCost = calculateDynamicPrice(item.cost?.money || 0, state);
            updates.money = currentMoney - actualMoneyCost;
            updates.health = Math.max(0, currentHealth - (item.cost?.health || 0));
            updates.stamina = Math.max(0, currentStamina - (item.cost?.stamina || 0));
            updates.mood = Math.max(0, currentMood - (item.cost?.mood || 0));
        }

        if (mode === 'effect' || mode === 'both') {
            const baseMoney = updates.money !== undefined ? updates.money : currentMoney;
            const baseHealth = updates.health !== undefined ? updates.health : currentHealth;
            const baseStamina = updates.stamina !== undefined ? updates.stamina : currentStamina;
            const baseMood = updates.mood !== undefined ? updates.mood : currentMood;

            (['health', 'stamina', 'mood', 'money'] as const).forEach((stat) => {
                const effect = item.effect?.[stat];
                if (effect !== undefined) {
                    if (stat === 'money') {
                        updates.money = baseMoney + (effect as number);
                    } else {
                        const maxKey = `max${stat.charAt(0).toUpperCase()}${stat.slice(1)}` as keyof GameState;
                        const val = stat === 'health' ? baseHealth : stat === 'stamina' ? baseStamina : baseMood;
                        updates[stat] = effect === 'full'
                            ? state[maxKey]
                            : Math.min(state[maxKey] as number, val + (effect as number));
                    }
                }
            });

            // Handle max stat increases if present
            (['maxHealth', 'maxStamina', 'maxMood'] as const).forEach((maxStat) => {
                const effect = item.effect?.[maxStat];
                if (effect !== undefined) {
                    updates[maxStat] = (state[maxStat] as number) + (effect as number);
                }
            });

            updates.cooldowns = {
                ...state.cooldowns,
                [item.id]: Date.now()
            };
        }

        updateState(updates);
    }, [state, updateState]);

    useEffect(() => {
        if (!delayedActivity) {
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

    const canAfford = useCallback((item: ActionableItem) => {
        const costMoney = calculateDynamicPrice(item.cost?.money || 0, state);
        const costHealth = item.cost?.health || 0;
        const costStamina = item.cost?.stamina || 0;
        const costMood = item.cost?.mood || 0;

        return state.money >= costMoney &&
            state.health >= costHealth &&
            state.stamina >= costStamina &&
            state.mood >= costMood;
    }, [state.money, state.health, state.stamina, state.mood]);

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
        canAfford,
        getDynamicPrice: useCallback((basePrice: number) => calculateDynamicPrice(basePrice, state), [state]),
        progress,
        delayedActivityId: delayedActivity?.item.id || null,
        isAnyInProgress: !!delayedActivity
    };
}
