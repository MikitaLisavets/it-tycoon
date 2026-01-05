import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import StatBadge from '../StatBadge/StatBadge';
import ListOption from '../ListOption/ListOption';
import Tabs from '../Tabs/Tabs';
import StatList from '../StatList/StatList';
import { useGameState } from '../../hooks/useGameState';
import { REST_ACTIVITIES, FUN_ITEMS, GYM_ACTIVITIES } from '../../lib/game/constants/index';
import styles from './ActivitiesWindow.module.css';
import { ActionableItem } from '@/lib/game/types';

interface ActivitiesWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onReset?: () => void;
    isFocused?: boolean;
    onFocus?: () => void;
}

type Tab = 'rest' | 'entertainment' | 'gym';

const ActivitiesWindow: React.FC<ActivitiesWindowProps> = ({ isOpen, onClose, onReset, isFocused, onFocus }) => {
    const { state, updateState } = useGameState();
    const t = useTranslations();
    const gt = useTranslations('Game');
    const [delayedActivity, setDelayedActivity] = useState<{ id: string; startTime: number; duration: number } | null>(null);
    const [progress, setProgress] = useState(0);
    const [activeTab, setActiveTab] = useState<Tab>('rest');

    // Reset progress when window closes
    // useEffect(() => {
    //     if (!isOpen) {
    //         setDelayedActivity(null);
    //         setProgress(0);
    //     }
    // }, [isOpen]);

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

    const renderActivityList = (activityList: ActionableItem[], namespace: string) => {
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
                    title={t(`${namespace}.${activity.id}`)}
                    subtitle={
                        <div className={styles.subtitle}>
                            <StatList
                                type="cost"
                                data={activity.cost}
                                title={gt('cost')}
                                isFree={!activity.cost?.money && !activity.cost?.health && !activity.cost?.stamina && !activity.cost?.mood}
                                freeLabel={t('free')}
                            />
                            <StatList
                                type="effect"
                                data={activity.effect}
                                title={gt('effects')}
                                freeLabel={t('Rest.effect_full')}
                            />
                        </div>
                    }
                    actionLabel={!isDelayed ? (cooldown > 0 ? `${cooldown}s` : t('Rest.start')) : undefined}
                    onAction={!isDelayed ? () => handleActivity(activity) : undefined}
                    actionDisabled={isDisabled}
                    actionContent={
                        <div className={styles.actionContent}>
                            {isDelayed && (
                                <div className={styles.progressBarContainer}>
                                    <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
                                </div>
                            )}

                            {activity.duration && (
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <StatBadge stat="TIME" value={`${activity.duration}s`} prefix="" label={t('Rest.duration')} />
                                </div>
                            )}
                        </div>
                    }
                />
            );
        })
    }

    const tabList = [
        { id: 'rest', label: t('Activities.tabs.rest') },
        { id: 'entertainment', label: t('Activities.tabs.entertainment') },
        { id: 'gym', label: t('Activities.tabs.gym') },
    ] as const;

    if (!isOpen) return null;

    return (
        <WindowFrame
            id="activities_window"
            title={t('Activities.title')}
            onCloseClick={onClose}
            onResetClick={onReset}
            width="480px"
            isFocused={isFocused}
            onFocus={onFocus}
        >
            <Tabs
                tabs={tabList}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <div className={styles.content} style={{ padding: '0 10px' }}>

                {activeTab === 'rest' && (
                    <>
                        {renderActivityList(REST_ACTIVITIES, 'Rest')}
                    </>
                )}

                {activeTab === 'entertainment' && (
                    <>
                        {renderActivityList(FUN_ITEMS, 'Entertainment')}
                    </>
                )}

                {activeTab === 'gym' && (
                    <>
                        {renderActivityList(GYM_ACTIVITIES, 'Gym')}
                    </>
                )}

            </div>
        </WindowFrame>
    );
};

export default ActivitiesWindow;
