import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import XPButton from '../XPButton/XPButton';
import HelpModal from '../HelpModal/HelpModal';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import { REST_ACTIVITIES, RestActivity } from '../../lib/game/constants/index';
import styles from './RestWindow.module.css';

interface RestWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onReset?: () => void;
}

const RestWindow: React.FC<RestWindowProps> = ({ isOpen, onClose, onReset }) => {
    const { state, updateState } = useGameState();
    const { playCoin } = useAudio();
    const t = useTranslations('Rest');
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    // Track active rest progress: { activityId: startTime }
    const [activeRest, setActiveRest] = useState<{ id: string; startTime: number; duration: number } | null>(null);
    const [progress, setProgress] = useState(0);

    // Initial render / cooldown check
    // We rely on state.cooldowns.rest which assumes persistent timestamps

    // Reset progress when window closes
    useEffect(() => {
        if (!isOpen) {
            setActiveRest(null);
            setProgress(0);
        }
    }, [isOpen]);

    // Handle progress tick
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

    if (!isOpen) return null;

    const startRest = (activity: ActionableItem) => {
        // Validation
        if (activeRest) return; // Busy
        if (state.money < (activity.cost?.money || 0)) return;
        if (state.health < (activity.cost?.health || 0)) return;

        // Cooldown check
        const lastUsed = state.cooldowns?.rest?.[activity.id] || 0;
        if (Date.now() - lastUsed < activity.cooldown) return;

        // Start
        setActiveRest({
            id: activity.id,
            startTime: Date.now(),
            duration: activity.duration
        });
    };

    const completeRest = (activityId: string) => {
        const activity = REST_ACTIVITIES.find(a => a.id === activityId);
        if (!activity) return;

        if (activity.cost?.money && activity.cost.money > 0) playCoin();

        if (activity.cost?.money && activity.cost.money > 0) playCoin();

        const updates: any = {
            money: state.money - (activity.cost?.money || 0),
            health: Math.max(0, state.health - (activity.cost?.health || 0)), // Clamp to 0
            cooldowns: {
                ...state.cooldowns,
                rest: {
                    ...state.cooldowns?.rest,
                    [activity.id]: Date.now()
                }
            }
        };

        if (activity.effect?.stamina === 'full') {
            updates.stamina = state.maxStamina;
        } else if (activity.effect?.stamina !== undefined) {
            updates.stamina = Math.min(state.maxStamina, state.stamina + (activity.effect.stamina as number));
        }

        updateState(updates);
        setActiveRest(null);
    };

    const getCooldownRemaining = (activity: ActionableItem) => {
        const lastUsed = state.cooldowns?.rest?.[activity.id] || 0;
        const remaining = activity.cooldown - (Date.now() - lastUsed);
        return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    };

    return (
        <>
            <WindowFrame title={t('title')} onCloseClick={onClose} onResetClick={onReset} onHelpClick={() => setIsHelpOpen(true)} width="450px">
                <div style={{ padding: '10px' }}>
                    <div style={{ marginBottom: '15px', padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                        <strong>{t('effect_full').replace('Full Stamina', 'Current Stamina')}: {Math.floor(state.stamina)}/{state.maxStamina}</strong>
                    </div>

                    {REST_ACTIVITIES.map(activity => {
                        const cooldown = getCooldownRemaining(activity);
                        const isResting = activeRest?.id === activity.id;
                        const isBlocked = !!activeRest && !isResting;
                        const costMoney = activity.cost?.money || 0;
                        const costHealth = activity.cost?.health || 0;

                        const canAfford = state.money >= costMoney && state.health >= costHealth;
                        const isDisabled = isBlocked || (cooldown > 0) || !canAfford;

                        return (
                            <div key={activity.id} className={styles.activityRow}>
                                <div className={styles.info}>
                                    <span className={styles.name}>{t(activity.id)}</span>
                                    <div className={styles.details}>
                                        <span className={styles.cost}>
                                            {costMoney > 0 && `${t('cost_money', { money: costMoney })} `}
                                            {costHealth > 0 && `${t('cost_health', { health: costHealth })} `}
                                            {costMoney === 0 && costHealth === 0 && 'Free '}
                                        </span>
                                        <span className={styles.effect}>
                                            {activity.effect?.stamina === 'full' ? t('effect_full') : t('effect_stamina', { amount: activity.effect?.stamina })}
                                        </span>
                                        <span> • {t('duration', { seconds: activity.duration })}</span>
                                    </div>
                                </div>
                                <div className={styles.actionArea}>
                                    {isResting ? (
                                        <div className={styles.progressBarContainer}>
                                            <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
                                        </div>
                                    ) : (
                                        <>
                                            <XPButton
                                                onClick={() => startRest(activity)}
                                                disabled={isDisabled}
                                                style={{ minWidth: '80px' }}
                                            >
                                                {cooldown > 0 ? `${cooldown}s` : t('start')}
                                            </XPButton>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </WindowFrame>
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={t('title')}
                content={t('help_content')}
            />
        </>
    );
};

export default RestWindow;
