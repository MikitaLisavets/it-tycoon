import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import StatBadge from '../StatBadge/StatBadge';
import ListOption from '../ListOption/ListOption';
import { useGameState } from '../../hooks/useGameState';
import { REST_ACTIVITIES, FUN_ITEMS, GYM_ACTIVITIES } from '../../lib/game/constants/index';
import styles from './ActivitiesWindow.module.css';
import { ActionableItem } from '@/lib/game/types';

interface ActivitiesWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onReset?: () => void;
}

type Tab = 'rest' | 'entertainment' | 'gym';

const ActivitiesWindow: React.FC<ActivitiesWindowProps> = ({ isOpen, onClose, onReset }) => {
    const { state, updateState } = useGameState();
    const t = useTranslations();
    const gt = useTranslations('Game');
    const [delayedActivity, setDelayedActivity] = useState<{ id: string; startTime: number; duration: number } | null>(null);
    const [progress, setProgress] = useState(0);
    const [activeTab, setActiveTab] = useState<Tab>('rest');

    // Reset progress when window closes
    useEffect(() => {
        if (!isOpen) {
            setDelayedActivity(null);
            setProgress(0);
        }
    }, [isOpen]);

    // Handle Rest progress tick
    useEffect(() => {
        if (!delayedActivity) {
            setProgress(0);
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - delayedActivity.startTime;
            const percent = Math.min(100, (elapsed / (delayedActivity.duration * 1000)) * 100);

            setProgress(percent);

            if (percent >= 100) {
                completeActivity(delayedActivity.id);
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [delayedActivity]);

    const handleActivity = (activity: ActionableItem) => {
        if (delayedActivity) return;
        if (state.money < (activity.cost?.money || 0)) return;
        if (state.health < (activity.cost?.health || 0)) return;

        const lastUsed = state.cooldowns?.rest?.[activity.id] || 0;
        if (activity.cooldown && Date.now() - lastUsed < activity.cooldown) return;

        if (activity.duration) {
            setDelayedActivity({
                id: activity.id,
                startTime: Date.now(),
                duration: activity.duration
            });
        } else {
            completeActivity(activity.id);
        }
    };

    const completeActivity = (activityId: string) => {
        const activity = REST_ACTIVITIES.find(a => a.id === activityId);
        if (!activity) return;

        const updates: any = {
            money: state.money - (activity.cost?.money || 0),
            health: Math.max(0, state.health - (activity.cost?.health || 0)),
            cooldowns: {
                ...state.cooldowns,
                rest: {
                    ...state.cooldowns?.rest,
                    [activity.id]: Date.now()
                }
            }
        };

        (['health', 'stamina', 'mood'] as const).forEach((stat) => {
            const effect = activity.effect?.[stat];
            if (effect) {
                const maxKey = `max${stat.charAt(0).toUpperCase()}${stat.slice(1)}` as keyof typeof state;
                updates[stat] = effect === 'full'
                    ? state[maxKey]
                    : Math.min(state[maxKey] as number, state[stat] + (effect as number));
            }
        });

        updateState(updates);
        setDelayedActivity(null);
    };


    const getActivityCooldown = (activity: ActionableItem) => {
        if (!activity.cooldown) return 0;

        const lastUsed = state.cooldowns?.rest?.[activity.id] || 0;
        const remaining = activity.cooldown - (Date.now() - lastUsed);
        return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    };

    const renderActivityList = (activityList: ActionableItem[]) => {
        return activityList.map(activity => {
            const cooldown = getActivityCooldown(activity);
            const isDelayed = delayedActivity?.id === activity.id;
            const isBlocked = !!delayedActivity && !isDelayed;

            const costMoney = activity.cost?.money || 0;
            const costHealth = activity.cost?.health || 0;

            const canAfford = state.money >= costMoney && state.health >= costHealth;
            const isDisabled = isBlocked || (cooldown > 0) || !canAfford;

            return (
                <ListOption
                    key={activity.id}
                    title={t(`Rest.${activity.id}`)}
                    subtitle={
                        <div className={styles.costs}>
                            <span>{gt('cost')} </span>
                            {activity.cost?.money && <StatBadge stat="MONEY" value={activity.cost.money} prefix="-" label={t('money')} />}
                            {activity.cost?.health && <StatBadge stat="HEALTH" value={activity.cost.health} prefix="-" label={t('health')} />}
                            {activity.cost?.stamina && <StatBadge stat="STAMINA" value={activity.cost.stamina} prefix="-" label={t('stamina')} />}
                            {activity.cost?.mood && <StatBadge stat="MOOD" value={activity.cost.mood} prefix="-" label={t('mood')} />}

                            <br />
                            <span>{gt('effects')}: </span>

                            {activity.effect?.health === 'full' ? (
                                <StatBadge stat="HEALTH" value={t('Rest.effect_full')} />
                            ) : (typeof activity.effect?.health === 'number' && activity.effect?.health > 0) ? (
                                <StatBadge stat="HEALTH" value={activity.effect.health} prefix="+" label={gt('health').replace(':', '')} />
                            ) : null}
                            {activity.effect?.stamina === 'full' ? (
                                <StatBadge stat="STAMINA" value={t('Rest.effect_full')} />
                            ) : (typeof activity.effect?.stamina === 'number' && activity.effect?.stamina > 0) ? (
                                <StatBadge stat="STAMINA" value={activity.effect.stamina} prefix="+" label={gt('stamina').replace(':', '')} />
                            ) : null}
                            {activity.effect?.mood === 'full' ? (
                                <StatBadge stat="MOOD" value={t('Rest.effect_full')} />
                            ) : (typeof activity.effect?.mood === 'number' && activity.effect?.mood > 0) ? (
                                <StatBadge stat="MOOD" value={activity.effect.mood} prefix="+" label={gt('mood').replace(':', '')} />
                            ) : null}
                        </div>
                    }
                    extra={activity.duration && (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <StatBadge stat="TIME" value={activity.duration} prefix="" label={t('Rest.duration')} />
                        </div>
                    )}
                    actionLabel={!isDelayed ? (cooldown > 0 ? `${cooldown}s` : t('Rest.start')) : undefined}
                    onAction={!isDelayed ? () => handleActivity(activity) : undefined}
                    actionDisabled={isDisabled}
                    actionContent={
                        isDelayed && (
                            <div className={styles.progressBarContainer}>
                                <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
                            </div>
                        )
                    }
                />
            );
        })
    }

    if (!isOpen) return null;

    return (
        <WindowFrame title={t('Activities.title')} onCloseClick={onClose} onResetClick={onReset} width="480px">
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'rest' ? styles.active : ''}`}
                    onClick={() => setActiveTab('rest')}
                >
                    {t('Activities.tabs.rest')}
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'entertainment' ? styles.active : ''}`}
                    onClick={() => setActiveTab('entertainment')}
                >
                    {t('Activities.tabs.entertainment')}
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'gym' ? styles.active : ''}`}
                    onClick={() => setActiveTab('gym')}
                >
                    {t('Activities.tabs.gym')}
                </button>
            </div>

            <div className={styles.content} style={{ padding: '0 10px' }}>

                {activeTab === 'rest' && (
                    <>
                        {renderActivityList(REST_ACTIVITIES)}
                    </>
                )}

                {activeTab === 'entertainment' && (
                    <>
                        {renderActivityList(FUN_ITEMS)}
                    </>
                )}

                {activeTab === 'gym' && (
                    <>
                        {renderActivityList(GYM_ACTIVITIES)}
                    </>
                )}

            </div>
        </WindowFrame>
    );
};

export default ActivitiesWindow;
