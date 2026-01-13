import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import HelpModal from '../HelpModal/HelpModal';
import ListOption from '../ListOption/ListOption';
import Tabs, { TabContent } from '../Tabs/Tabs';
import StatList from '../StatList/StatList';
import { useActionableItem } from '../../hooks/useActionableItem';
import styles from './ShopWindow.module.css';
import { FOOD_ITEMS, MEDICINE, LIFESTYLE, PERFORMANCE } from '@/lib/game/constants/shop';
import { ActionableItem } from '@/lib/game/types';

interface ShopWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onReset?: () => void;
    isFocused?: boolean;
    onFocus?: () => void;
}

type Tab = 'food' | 'medicine' | 'lifestyle' | 'performance';

const ShopWindow: React.FC<ShopWindowProps> = ({ isOpen, onClose, onReset, isFocused, onFocus }) => {
    const t = useTranslations();
    const [isHelpOpen, setIsHelpOpen] = React.useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('food');

    const tabList = [
        { id: 'food', label: t('Shop.tab_food') },
        { id: 'medicine', label: t('Shop.tab_medicine') },
        { id: 'lifestyle', label: t('Shop.tab_lifestyle') },
        { id: 'performance', label: t('Shop.tab_performance') },
    ] as const;

    const {
        handleAction,
        getCooldown,
        isPurchased,
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
            const isPurchasedItem = item.isOneTime && isPurchased(item);
            const isDelayed = delayedActivityId === item.id;
            const isBlocked = isAnyInProgress && !isDelayed;
            const isDisabled = isBlocked || (cooldown > 0) || !canAfford(item) || isPurchasedItem;

            let actionLabel: string | undefined = undefined;
            if (!isDelayed) {
                if (isPurchasedItem) {
                    actionLabel = t('Common.owned');
                } else if (cooldown > 0) {
                    actionLabel = `${cooldown}s`;
                } else {
                    actionLabel = t('Common.buy');
                }
            }

            return (
                <ListOption
                    key={item.id}
                    title={t(`Values.${item.id}`)}
                    subtitle={
                        <div className={styles.subtitle}>
                            <StatList
                                type="cost"
                                data={{
                                    ...item.cost,
                                    money: item.cost?.money ? getDynamicPrice(item.cost.money) : undefined
                                }}
                                title={t('Common.cost')}
                            />
                            <StatList
                                type="effect"
                                data={item.effect}
                                title={t('Common.effects')}
                            />
                        </div>
                    }
                    actionLabel={actionLabel}
                    onAction={!isDelayed && !isPurchasedItem ? () => handleAction(item) : undefined}
                    actionSound={(!!item.cost?.money && item.cost.money > 0) ? 'purchase' : 'click'}
                    actionDisabled={isDisabled}
                    disabledOverlay={isDisabled && !isDelayed}
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
                title={t('Shop.title')}
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
                    {activeTab === 'medicine' && renderList(MEDICINE)}
                    {activeTab === 'lifestyle' && renderList(LIFESTYLE)}
                    {activeTab === 'performance' && renderList(PERFORMANCE)}
                </TabContent>
            </WindowFrame>
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={t('Shop.title')}
                content={t('Shop.help_content')}
            />
        </>
    );
};

export default ShopWindow;
