import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import HelpModal from '../HelpModal/HelpModal';
import ListOption from '../ListOption/ListOption';
import Tabs from '../Tabs/Tabs';
import StatList from '../StatList/StatList';
import { useGameState } from '../../hooks/useGameState';
import styles from './ShopWindow.module.css';
import { FOOD_ITEMS } from '@/lib/game/constants/supermarket';
import { FoodItem } from '@/lib/game/types';

interface ShopWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onReset?: () => void;
    isFocused?: boolean;
    onFocus?: () => void;
}

type Tab = 'food';

const ShopWindow: React.FC<ShopWindowProps> = ({ isOpen, onClose, onReset, isFocused, onFocus }) => {
    const { state, updateState } = useGameState();
    const t = useTranslations('Shop');
    const gt = useTranslations('Game');
    const [isHelpOpen, setIsHelpOpen] = React.useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('food');

    if (!isOpen) return null;

    const handleBuy = (item: FoodItem) => {
        if (state.money >= item.cost) {
            updateState({
                money: state.money - item.cost,
                health: Math.min(state.maxHealth, Math.max(0, state.health + item.health)),
                stamina: item.stamina ? Math.min(state.maxStamina, state.stamina + item.stamina) : state.stamina
            });
        }
    };

    const renderShopList = (items: FoodItem[]) => {
        return items.map((item) => (
            <ListOption
                key={item.id}
                title={item.name}
                subtitle={
                    <div className={styles.subtitle}>
                        <StatList
                            type="cost"
                            data={{ money: item.cost }}
                            title={gt('cost')}
                        />
                        <StatList
                            type="effect"
                            data={{ health: item.health, stamina: item.stamina }}
                            title={gt('effects')}
                        />
                    </div>
                }
                actionLabel={t('buy')}
                onAction={() => handleBuy(item)}
                actionDisabled={state.money < item.cost}
            />
        ));
    };

    const tabList = [
        { id: 'food', label: t('food') },
    ] as const;

    return (
        <>
            <WindowFrame
                id="shop_window"
                title={t('title')}
                onCloseClick={onClose}
                onResetClick={onReset}
                onHelpClick={() => setIsHelpOpen(true)}
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
                    {activeTab === 'food' && renderShopList(FOOD_ITEMS)}
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
