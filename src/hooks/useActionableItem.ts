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

    const completeActivity = useCallback((item: ActionableItem) => {
        const actualMoneyCost = calculateDynamicPrice(item.cost?.money || 0, state);

        const updates: any = {
            money: state.money - actualMoneyCost,
            health: Math.max(0, state.health - (item.cost?.health || 0)),
            stamina: Math.max(0, state.stamina - (item.cost?.stamina || 0)),
            mood: Math.max(0, state.mood - (item.cost?.mood || 0)),
            cooldowns: {
                ...state.cooldowns,
                [item.id]: Date.now()
            }
        };

        (['health', 'stamina', 'mood', 'money'] as const).forEach((stat) => {
            const effect = item.effect?.[stat];
            if (effect !== undefined) {
                if (stat === 'money') {
                    updates.money = (updates.money !== undefined ? updates.money : state.money) + (effect as number);
                } else {
                    const maxKey = `max${stat.charAt(0).toUpperCase()}${stat.slice(1)}` as keyof GameState;
                    const currentValue = updates[stat] !== undefined ? updates[stat] : state[stat];
                    updates[stat] = effect === 'full'
                        ? state[maxKey]
                        : Math.min(state[maxKey] as number, (currentValue as number) + (effect as number));
                }
            }
        });

        updateState(updates);
        setDelayedActivity(null);
        setProgress(0);
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
                completeActivity(delayedActivity.item);
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [delayedActivity, completeActivity]);

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
            setDelayedActivity({
                item: item,
                startTime: Date.now(),
            });
        } else {
            completeActivity(item);
        }
    }, [delayedActivity, canAfford, getCooldown, completeActivity]);

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
