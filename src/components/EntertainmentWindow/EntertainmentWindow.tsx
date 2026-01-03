import React from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import XPButton from '../XPButton/XPButton';
import HelpModal from '../HelpModal/HelpModal';
import { useGameState } from '../../hooks/useGameState';
import { FUN_ITEMS } from '../../lib/game/constants/index';
import styles from './EntertainmentWindow.module.css';

interface EntertainmentWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onReset?: () => void;
}

const EntertainmentWindow: React.FC<EntertainmentWindowProps> = ({ isOpen, onClose, onReset }) => {
    const { state, updateState } = useGameState();
    const t = useTranslations('Entertainment');
    const [isHelpOpen, setIsHelpOpen] = React.useState(false);

    if (!isOpen) return null;

    const handleActivity = (item: typeof FUN_ITEMS[0]) => {
        if (state.money >= item.cost) {
            updateState({
                money: state.money - item.cost,
                mood: Math.min(state.maxMood, state.mood + item.mood),
            });
        }
    };

    return (
        <>
            <WindowFrame title={t('title')} onCloseClick={onClose} onResetClick={onReset} onHelpClick={() => setIsHelpOpen(true)} width="400px">
                <div style={{ padding: '10px' }}>
                    <h3>{t('activities')}</h3>
                    {FUN_ITEMS.map((item) => (
                        <div key={item.id} className={styles.itemRow}>
                            <div className={styles.itemInfo}>
                                <span className={styles.itemName}>{item.name}</span>
                                <span className={styles.itemCost}>
                                    {item.cost > 0 ? t('cost', { amount: item.cost }) : t('free')} (+{item.mood} {t('mood')})
                                </span>
                            </div>
                            <XPButton
                                onClick={() => handleActivity(item)}
                                disabled={state.money < item.cost}
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

export default EntertainmentWindow;
