import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import StatBadge from '../StatBadge/StatBadge';
import ListOption from '../ListOption/ListOption';
import { useGameState } from '../../hooks/useGameState';
import { REST_ACTIVITIES, RestActivity, FUN_ITEMS, GYM_ACTIVITIES, STAT_ICONS } from '../../lib/game/constants/index';
import styles from './ActivitiesWindow.module.css';

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
    const [activeRest, setActiveRest] = useState<{ id: string; startTime: number; duration: number } | null>(null);
    const [progress, setProgress] = useState(0);
    const [activeTab, setActiveTab] = useState<Tab>('rest');

    // Reset progress when window closes
    useEffect(() => {
        if (!isOpen) {
            setActiveRest(null);
            setProgress(0);
        }
    }, [isOpen]);

    // Handle Rest progress tick
    useEffect(() => {
        if (!activeRest) {
            setProgress(0);
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - activeRest.startTime;
            const percent = Math.min(100, (elapsed / (activeRest.duration * 1000)) * 100);

            setProgress(percent);

            if (percent >= 100) {
                completeRest(activeRest.id);
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [activeRest]);

    const startRest = (activity: RestActivity) => {
        if (activeRest) return;
        if (state.money < (activity.cost?.money || 0)) return;
        if (state.health < (activity.cost?.health || 0)) return;

        const lastUsed = state.cooldowns?.rest?.[activity.id] || 0;
        if (Date.now() - lastUsed < activity.cooldown) return;

        setActiveRest({
            id: activity.id,
            startTime: Date.now(),
            duration: activity.duration
        });
    };

    const completeRest = (activityId: string) => {
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

        if (activity.stamina === 'full') {
            updates.stamina = state.maxStamina;
        } else {
            updates.stamina = Math.min(state.maxStamina, state.stamina + (activity.stamina as number));
        }

        updateState(updates);
        setActiveRest(null);
    };

    const handleFun = (item: typeof FUN_ITEMS[0]) => {
        if (state.money >= item.cost) {
            updateState({
                money: state.money - item.cost,
                mood: Math.min(state.maxMood, state.mood + item.mood),
            });
        }
    };

    const handleGym = (activity: typeof GYM_ACTIVITIES[0]) => {
        const updates: any = {
            money: state.money - activity.cost,
            stamina: Math.min(state.maxStamina, state.stamina + activity.stamina),
            health: Math.max(0, Math.min(state.maxHealth, state.health + (activity.health || 0))),
        };

        if (activity.mood) {
            updates.mood = Math.min(state.maxMood, state.mood + activity.mood);
        }

        updateState(updates);
    };

    const getRestCooldown = (activity: RestActivity) => {
        const lastUsed = state.cooldowns?.rest?.[activity.id] || 0;
        const remaining = activity.cooldown - (Date.now() - lastUsed);
        return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    };

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
                        {REST_ACTIVITIES.map(activity => {
                            const cooldown = getRestCooldown(activity);
                            const isResting = activeRest?.id === activity.id;
                            const isBlocked = !!activeRest && !isResting;

                            const costMoney = activity.cost?.money || 0;
                            const costHealth = activity.cost?.health || 0;

                            const canAfford = state.money >= costMoney && state.health >= costHealth;
                            const isDisabled = isBlocked || (cooldown > 0) || !canAfford;

                            return (
                                <ListOption
                                    key={activity.id}
                                    title={t(`Rest.${activity.name}`)}
                                    subtitle={
                                        <div className={styles.costs}>
                                            <span>{gt('cost')} </span>
                                            {costMoney > 0 && <StatBadge stat="MONEY" value={costMoney} prefix="-" label={t('money')} />}
                                            {costHealth > 0 && <StatBadge stat="HEALTH" value={costHealth} prefix="-" label={t('health')} />}

                                            <span style={{ marginLeft: '8px' }}>{gt('effects')}: </span>
                                            {activity.stamina === 'full' ? (
                                                <StatBadge stat="STAMINA" value={t('Rest.effect_full')} />
                                            ) : (typeof activity.stamina === 'number' && activity.stamina > 0) ? (
                                                <StatBadge stat="STAMINA" value={activity.stamina} prefix="+" label={gt('stamina').replace(':', '')} />
                                            ) : null}
                                        </div>
                                    }
                                    extra={
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span>{STAT_ICONS.TIME.icon} {t('Rest.duration', { seconds: activity.duration })}</span>
                                        </div>
                                    }
                                    actionLabel={!isResting ? (cooldown > 0 ? `${cooldown}s` : t('Rest.start')) : undefined}
                                    onAction={!isResting ? () => startRest(activity) : undefined}
                                    actionDisabled={isDisabled}
                                    actionContent={
                                        isResting && (
                                            <div className={styles.progressBarContainer}>
                                                <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
                                            </div>
                                        )
                                    }
                                />
                            );
                        })}
                    </>
                )}

                {activeTab === 'entertainment' && (
                    <>
                        {FUN_ITEMS.map((item) => (
                            <ListOption
                                key={item.id}
                                title={item.name}
                                subtitle={
                                    <div className={styles.costs}>
                                        <span>{gt('cost')} </span>
                                        {item.cost > 0 ? (
                                            <StatBadge stat="MONEY" value={item.cost} prefix="-" label={t('money')} />
                                        ) : (
                                            <span>{t('Entertainment.free')}</span>
                                        )}

                                        <span style={{ marginLeft: '8px' }}>{gt('effects')}: </span>
                                        {item.mood > 0 && <StatBadge stat="MOOD" value={item.mood} prefix="+" label={gt('mood').replace(':', '')} />}
                                    </div>
                                }
                                actionLabel={t('Entertainment.do')}
                                onAction={() => handleFun(item)}
                                actionDisabled={state.money < item.cost}
                            />
                        ))}
                    </>
                )}

                {activeTab === 'gym' && (
                    <>
                        {GYM_ACTIVITIES.map((activity) => (
                            <ListOption
                                key={activity.id}
                                title={activity.name}
                                subtitle={
                                    <div className={styles.costs}>
                                        <span>{gt('cost')} </span>
                                        <StatBadge stat="MONEY" value={activity.cost} prefix="-" label={t('money')} />

                                        <span style={{ marginLeft: '8px' }}>{gt('effects')}: </span>
                                        <StatBadge stat="STAMINA" value={activity.stamina} prefix="+" label={t('Gym.stamina')} />
                                        {activity.mood && <StatBadge stat="MOOD" value={activity.mood} prefix="+" label={t('Gym.mood')} />}
                                    </div>
                                }
                                actionLabel={t('Gym.do')}
                                onAction={() => handleGym(activity)}
                                actionDisabled={state.money < activity.cost}
                            />
                        ))}
                    </>
                )}

            </div>
        </WindowFrame>
    );
};

export default ActivitiesWindow;
