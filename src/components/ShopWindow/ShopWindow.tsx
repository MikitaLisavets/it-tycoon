import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import HelpModal from '../HelpModal/HelpModal';
import ListOption from '../ListOption/ListOption';
import Tabs, { TabContent } from '../Tabs/Tabs';
import StatList from '../StatList/StatList';
import { useGameState } from '../../hooks/useGameState';
import { useActionableItem } from '../../hooks/useActionableItem';
import styles from './ShopWindow.module.css';
import { FOOD_ITEMS, FURNITURE_ITEMS, CLOTHES_ITEMS } from '@/lib/game/constants/shop';
import { ActionableItem } from '@/lib/game/types';

interface ShopWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onReset?: () => void;
    isFocused?: boolean;
    onFocus?: () => void;
}

type Tab = 'food' | 'furniture' | 'clothes';

const ShopWindow: React.FC<ShopWindowProps> = ({ isOpen, onClose, onReset, isFocused, onFocus }) => {
    const { state } = useGameState();
    const t = useTranslations('Shop');
    const gt = useTranslations('Game');
    const [isHelpOpen, setIsHelpOpen] = React.useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('food');

    const tabList = [
        { id: 'food', label: t('food') },
        { id: 'furniture', label: t('furniture') },
        { id: 'clothes', label: t('clothes') },
    ] as const;

    const {
        handleAction,
        getCooldown,
        canAfford,
        progress,
        delayedActivityId,
        isAnyInProgress,
        getDynamicPrice
    } = useActionableItem();

    if (!isOpen) return null;

    const renderList = (items: ActionableItem[]) => {
        return items.map((item) => {
            const cooldown = getCooldown(item);
            const isDelayed = delayedActivityId === item.id;
            const isBlocked = isAnyInProgress && !isDelayed;
            const isDisabled = isBlocked || (cooldown > 0) || !canAfford(item);

            return (
                <ListOption
                    key={item.id}
                    title={t(item.id)}
                    subtitle={
                        <div className={styles.subtitle}>
                            <StatList
                                type="cost"
                                data={{
                                    ...item.cost,
                                    money: item.cost?.money ? getDynamicPrice(item.cost.money) : undefined
                                }}
                                title={gt('cost')}
                            />
                            <StatList
                                type="effect"
                                data={item.effect}
                                title={gt('effects')}
                            />
                        </div>
                    }
                    actionLabel={!isDelayed ? (cooldown > 0 ? `${cooldown}s` : t('buy')) : undefined}
                    onAction={!isDelayed ? () => handleAction(item) : undefined}
                    actionDisabled={isDisabled}
                    actionContent={
                        isDelayed && (
                            <div className={styles.progressBarContainer}>
                                <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
                            </div>
                        )
                    }
                />
            );
        });
    };


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

                <TabContent>
                    {activeTab === 'food' && renderList(FOOD_ITEMS)}
                    {activeTab === 'furniture' && renderList(FURNITURE_ITEMS)}
                    {activeTab === 'clothes' && renderList(CLOTHES_ITEMS)}
                </TabContent>
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
