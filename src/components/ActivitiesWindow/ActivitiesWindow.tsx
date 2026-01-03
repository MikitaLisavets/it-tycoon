import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import XPButton from '../XPButton/XPButton';
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

    // Unified Row Component
    const ActivityRow = ({
        name,
        costs,
        effects,
        duration,
        actionLabel,
        onAction,
        disabled,
        isProgress,
        cooldown
    }: any) => (
        <div className={styles.activityRow}>
            <div className={styles.info}>
                <span className={styles.name}>{name}</span>
                <div className={styles.details}>
                    {costs && (
                        <div className={styles.costs}>
                            <span>{gt('cost')} </span>
                            {costs.money > 0 && <span className={styles.costItem} style={{ color: STAT_ICONS.MONEY.color }}>{STAT_ICONS.MONEY.icon} -{costs.money} {t('money')}</span>}
                            {costs.health > 0 && <span className={styles.costItem} style={{ color: STAT_ICONS.HEALTH.color }}>{STAT_ICONS.HEALTH.icon} -{costs.health} {t('health')}</span>}
                            {costs.mood > 0 && <span className={styles.costItem} style={{ color: STAT_ICONS.MOOD.color }}>{STAT_ICONS.MOOD.icon} -{costs.mood} {t('mood')}</span>}
                            {costs.stamina > 0 && <span className={styles.costItem} style={{ color: STAT_ICONS.STAMINA.color }}>{STAT_ICONS.STAMINA.icon} -{costs.stamina} {t('stamina')}</span>}
                            {Object.values(costs).every(v => v === 0) && <span>{t('Entertainment.free')}</span>}
                        </div>
                    )}

                    {effects && (
                        <div className={styles.effects}>
                            <span>{gt('effects')}: </span>
                            {effects.stamina === 'full' ? (
                                <span className={styles.effectItem} style={{ color: STAT_ICONS.STAMINA.color }}>{STAT_ICONS.STAMINA.icon} {t('Rest.effect_full')}</span>
                            ) : effects.stamina > 0 ? (
                                <span className={styles.effectItem} style={{ color: STAT_ICONS.STAMINA.color }}>{STAT_ICONS.STAMINA.icon} +{effects.stamina} {gt('stamina').replace(':', '')}</span>
                            ) : null}
                            {effects.mood > 0 && <span className={styles.effectItem} style={{ color: STAT_ICONS.MOOD.color }}>{STAT_ICONS.MOOD.icon} +{effects.mood} {gt('mood').replace(':', '')}</span>}
                            {effects.health > 0 && <span className={styles.effectItem} style={{ color: STAT_ICONS.HEALTH.color }}>{STAT_ICONS.HEALTH.icon} +{effects.health} {gt('health').replace(':', '')}</span>}
                            {effects.money > 0 && <span className={styles.effectItem} style={{ color: STAT_ICONS.MONEY.color }}>{STAT_ICONS.MONEY.icon} +{effects.money} {gt('money').replace(':', '')}</span>}
                        </div>
                    )}
                    {duration && <span>{STAT_ICONS.TIME.icon} {duration}</span>}
                </div>
            </div>
            <div className={styles.actionArea}>
                {isProgress ? (
                    <div className={styles.progressBarContainer}>
                        <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
                    </div>
                ) : (
                    <XPButton
                        onClick={onAction}
                        disabled={disabled}
                        style={{ minWidth: '80px' }}
                    >
                        {cooldown > 0 ? `${cooldown}s` : actionLabel}
                    </XPButton>
                )}
            </div>
        </div>
    );

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

            <div className={styles.content} style={{ padding: '10px' }}>

                {activeTab === 'rest' && (
                    <>
                        {REST_ACTIVITIES.map(activity => {
                            const cooldown = getRestCooldown(activity);
                            const isResting = activeRest?.id === activity.id;
                            const isBlocked = !!activeRest && !isResting;

                            const costMoney = activity.cost?.money || 0;
                            const costHealth = activity.cost?.health || 0;

                            const effectText = activity.stamina === 'full'
                                ? t('Rest.effect_full')
                                : t('Rest.effect_stamina', { amount: activity.stamina });

                            const canAfford = state.money >= costMoney && state.health >= costHealth;
                            const isDisabled = isBlocked || (cooldown > 0) || !canAfford;

                            return (
                                <ActivityRow
                                    key={activity.id}
                                    name={t(`Rest.${activity.name}`)}
                                    costs={{ money: costMoney, health: costHealth }}
                                    effects={{ stamina: activity.stamina }}
                                    duration={t('Rest.duration', { seconds: activity.duration })}
                                    actionLabel={t('Rest.start')}
                                    onAction={() => startRest(activity)}
                                    disabled={isDisabled}
                                    isProgress={isResting}
                                    cooldown={cooldown}
                                />
                            );
                        })}
                    </>
                )}

                {activeTab === 'entertainment' && (
                    <>
                        {FUN_ITEMS.map((item) => (
                            <ActivityRow
                                key={item.id}
                                name={item.name}
                                costs={{ money: item.cost }}
                                effects={{ mood: item.mood }}
                                actionLabel={t('Entertainment.do')}
                                onAction={() => handleFun(item)}
                                disabled={state.money < item.cost}
                            />
                        ))}
                    </>
                )}

                {activeTab === 'gym' && (
                    <>
                        {GYM_ACTIVITIES.map((activity) => {
                            const effects = [];
                            effects.push(`+${activity.stamina} ${t('Gym.stamina')}`);
                            if (activity.mood) effects.push(`+${activity.mood} ${t('Gym.mood')}`);

                            return (
                                <ActivityRow
                                    key={activity.id}
                                    name={activity.name}
                                    costs={{ money: activity.cost }}
                                    effects={{ stamina: activity.stamina, mood: activity.mood }}
                                    actionLabel={t('Gym.do')}
                                    onAction={() => handleGym(activity)}
                                    disabled={state.money < activity.cost}
                                />
                            );
                        })}
                    </>
                )}

            </div>
        </WindowFrame>
    );
};

export default ActivitiesWindow;
