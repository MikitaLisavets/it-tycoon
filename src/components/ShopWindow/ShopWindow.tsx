import React from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import XPButton from '../XPButton/XPButton';
import { useGameState } from '../../hooks/useGameState';
import { FOOD_ITEMS } from '../../lib/game/constants';
import styles from './ShopWindow.module.css';

interface ShopWindowProps {
    isOpen: boolean;
    onClose: () => void;
}

const ShopWindow: React.FC<ShopWindowProps> = ({ isOpen, onClose }) => {
    const { state, updateState } = useGameState();
    const t = useTranslations('Shop');

    if (!isOpen) return null;

    const handleBuy = (item: typeof FOOD_ITEMS[0]) => {
        if (state.money >= item.cost) {
            updateState({
                money: state.money - item.cost,
                satiety: Math.min(100, state.satiety + item.satiety),
                // Buying food might restore mood too?
            });
        }
    };

    return (
        <WindowFrame title={t('title')} onCloseClick={onClose} width="400px">
            <div style={{ padding: '10px' }}>
                <h3>{t('food')}</h3>
                {FOOD_ITEMS.map((item) => (
                    <div key={item.id} className={styles.itemRow}>
                        <div className={styles.itemInfo}>
                            <span className={styles.itemName}>{item.name}</span>
                            <span className={styles.itemCost}>{t('cost', { amount: item.cost })} (+{item.satiety} {t('satiety')})</span>
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
        </WindowFrame>
    );
};

export default ShopWindow;
