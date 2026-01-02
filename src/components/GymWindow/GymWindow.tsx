import React from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import XPButton from '../XPButton/XPButton';
import HelpModal from '../HelpModal/HelpModal';
import { useGameState } from '../../hooks/useGameState';
import { GYM_ACTIVITIES } from '../../lib/game/constants/index';
import styles from './GymWindow.module.css';

interface GymWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onReset?: () => void;
}

const GymWindow: React.FC<GymWindowProps> = ({ isOpen, onClose, onReset }) => {
    const { state, updateState } = useGameState();
    const t = useTranslations('Gym');
    const [isHelpOpen, setIsHelpOpen] = React.useState(false);

    if (!isOpen) return null;

    const handleActivity = (activity: typeof GYM_ACTIVITIES[0]) => {
        if (state.money >= activity.cost) {
            const updates: any = {
                money: state.money - activity.cost,
                stamina: Math.min(100, state.stamina + activity.stamina),
                health: Math.max(-100, state.health + (activity.health || 0)),
            };

            // Some activities also improve mood (like yoga)
            if (activity.mood) {
                updates.mood = Math.min(100, state.mood + activity.mood);
            }

            updateState(updates);
        }
    };

    return (
        <>
            <WindowFrame title={t('title')} onCloseClick={onClose} onResetClick={onReset} onHelpClick={() => setIsHelpOpen(true)} width="450px">
                <div style={{ padding: '10px' }}>
                    <div style={{ marginBottom: '15px', padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                        <strong>{t('current_stamina')}: {Math.floor(state.stamina)}</strong>
                    </div>

                    <h3>{t('activities')}</h3>
                    {GYM_ACTIVITIES.map((activity) => (
                        <div key={activity.id} className={styles.itemRow}>
                            <div className={styles.itemInfo}>
                                <span className={styles.itemName}>{activity.name}</span>
                                <span className={styles.itemCost}>
                                    {t('cost', { amount: activity.cost })}
                                    {' (+' + activity.stamina + ' ' + t('stamina') + ')'}
                                    {activity.mood && (' (+' + activity.mood + ' ' + t('mood') + ')')}
                                </span>
                            </div>
                            <XPButton
                                onClick={() => handleActivity(activity)}
                                disabled={state.money < activity.cost}
                            >
                                {t('do')}
                            </XPButton>
                        </div>
                    ))}
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

export default GymWindow;
