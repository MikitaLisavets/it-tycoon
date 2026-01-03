import React from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import XPButton from '../XPButton/XPButton';
import HelpModal from '../HelpModal/HelpModal';
import StatBadge from '../StatBadge/StatBadge';
import { useGameState } from '../../hooks/useGameState';
import { FOOD_ITEMS, STAT_ICONS } from '../../lib/game/constants/index';
import styles from './ShopWindow.module.css';

interface ShopWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onReset?: () => void;
}

const ShopWindow: React.FC<ShopWindowProps> = ({ isOpen, onClose, onReset }) => {
    const { state, updateState } = useGameState();
    const t = useTranslations('Shop');
    const gt = useTranslations('Game');
    const [isHelpOpen, setIsHelpOpen] = React.useState(false);

    if (!isOpen) return null;

    const handleBuy = (item: typeof FOOD_ITEMS[0]) => {
        if (state.money >= item.cost) {
            updateState({
                money: state.money - item.cost,
                health: Math.min(state.maxHealth, Math.max(0, state.health + item.health)),
                stamina: item.stamina ? Math.min(state.maxStamina, state.stamina + item.stamina) : state.stamina
            });
        }
    };

    return (
        <>
            <WindowFrame title={t('title')} onCloseClick={onClose} onResetClick={onReset} onHelpClick={() => setIsHelpOpen(true)} width="400px">
                <div style={{ padding: '10px' }}>
                    <h3 style={{ marginBottom: '10px' }}>{t('food')}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {FOOD_ITEMS.map((item) => (
                            <div key={item.id} className={styles.itemRow}>
                                <div className={styles.itemInfo}>
                                    <span className={styles.itemName}>{item.name}</span>
                                    <div style={{ fontSize: '0.85em', color: '#666', marginTop: '2px', display: 'flex', gap: '8px' }}>
                                        <span style={{ fontWeight: 'bold' }}>{t('cost', { amount: item.cost })}</span>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            {item.health !== 0 && (
                                                <StatBadge
                                                    stat="HEALTH"
                                                    value={item.health}
                                                    prefix={item.health > 0 ? '+' : ''}
                                                />
                                            )}
                                            {item.stamina && item.stamina !== 0 && (
                                                <StatBadge
                                                    stat="STAMINA"
                                                    value={item.stamina}
                                                    prefix={item.stamina > 0 ? '+' : ''}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <XPButton
                                    onClick={() => handleBuy(item)}
                                    disabled={state.money < item.cost}
                                >
                                    {t('buy')}
                                </XPButton>
                            </div>
                        ))}
                    </div>
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

export default ShopWindow;
