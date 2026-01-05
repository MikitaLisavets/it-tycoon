import React from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import HelpModal from '../HelpModal/HelpModal';
import StatBadge from '../StatBadge/StatBadge';
import ListOption from '../ListOption/ListOption';
import { useGameState } from '../../hooks/useGameState';
import styles from './ShopWindow.module.css';
import { FOOD_ITEMS } from '@/lib/game/constants/supermarket';

interface ShopWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onReset?: () => void;
    isFocused?: boolean;
    onFocus?: () => void;
}

const ShopWindow: React.FC<ShopWindowProps> = ({ isOpen, onClose, onReset, isFocused, onFocus }) => {
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
            <WindowFrame
                id="shop_window"
                title={t('title')}
                onCloseClick={onClose}
                onResetClick={onReset}
                onHelpClick={() => setIsHelpOpen(true)}
                width="400px"
                isFocused={isFocused}
                onFocus={onFocus}
            >
                <div style={{ padding: '0 10px' }}>
                    <h3 style={{ margin: '10px 0' }}>{t('food')}</h3>
                    <div className={styles.itemList}>
                        {FOOD_ITEMS.map((item) => (
                            <ListOption
                                key={item.id}
                                title={item.name}
                                subtitle={
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
                                }
                                actionLabel={t('buy')}
                                onAction={() => handleBuy(item)}
                                actionDisabled={state.money < item.cost}
                            />
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
