import React from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import XPButton from '../XPButton/XPButton';
import HelpModal from '../HelpModal/HelpModal';
import { useGameState } from '../../hooks/useGameState';
import { FOOD_ITEMS } from '../../lib/game/constants/index';
import styles from './ShopWindow.module.css';

interface ShopWindowProps {
    isOpen: boolean;
    onClose: () => void;
}

const ShopWindow: React.FC<ShopWindowProps> = ({ isOpen, onClose }) => {
    const { state, updateState } = useGameState();
    const t = useTranslations('Shop');
    const [isHelpOpen, setIsHelpOpen] = React.useState(false);

    if (!isOpen) return null;

    const handleBuy = (item: typeof FOOD_ITEMS[0]) => {
        if (state.money >= item.cost) {
            updateState({
                money: state.money - item.cost,
                health: Math.min(100, state.health + item.health),
            });
        }
    };

    return (
        <>
            <WindowFrame title={t('title')} onCloseClick={onClose} onHelpClick={() => setIsHelpOpen(true)} width="400px">
                <div style={{ padding: '10px' }}>
                    <h3>{t('food')}</h3>
                    {FOOD_ITEMS.map((item) => (
                        <div key={item.id} className={styles.itemRow}>
                            <div className={styles.itemInfo}>
                                <span className={styles.itemName}>{item.name}</span>
                                <span className={styles.itemCost}>{t('cost', { amount: item.cost })} (+{item.health} {t('health')})</span>
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
