import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import StatBadge from '../StatBadge/StatBadge';
import ListOption from '../ListOption/ListOption';
import Tabs, { TabContent } from '../Tabs/Tabs';
import StatList from '../StatList/StatList';
import ProgressBar from '../ProgressBar/ProgressBar';
import { useGameState } from '../../hooks/useGameState';
import { useActionableItem } from '../../hooks/useActionableItem';
import { REST_ACTIVITIES, FUN_ITEMS, GYM_ACTIVITIES } from '../../lib/game/constants/index';
import styles from './ActivitiesWindow.module.css';
import { ActionableItem } from '@/lib/game/types';

import HelpModal from '../HelpModal/HelpModal';

interface ActivitiesWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onReset?: () => void;
    isFocused?: boolean;
    onFocus?: () => void;
}

type Tab = 'rest' | 'entertainment' | 'gym';

const ActivitiesWindow: React.FC<ActivitiesWindowProps> = ({ isOpen, onClose, onReset, isFocused, onFocus }) => {
    const t = useTranslations();
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('rest');

    const {
        handleAction,
        getCooldown,
        canAfford,
        progress,
        delayedActivityId,
        isAnyInProgress,
        getDynamicPrice
    } = useActionableItem();

    const renderActivityList = (activityList: ActionableItem[], namespace: string) => {
        return activityList.map(activity => {
            const cooldown = getCooldown(activity);
            const isDelayed = delayedActivityId === activity.id;
            const isBlocked = isAnyInProgress && !isDelayed;
            const isDisabled = isBlocked || (cooldown > 0) || !canAfford(activity);

            return (
                <ListOption
                    key={activity.id}
                    title={t(`${namespace}.${activity.id}`)}
                    subtitle={
                        <div className={styles.subtitle}>
                            <StatList
                                type="cost"
                                data={{
                                    ...activity.cost,
                                    money: activity.cost?.money ? getDynamicPrice(activity.cost.money) : undefined
                                }}
                                title={t('Common.cost')}
                                isFree={!activity.cost?.money && !activity.cost?.health && !activity.cost?.stamina && !activity.cost?.mood}
                                freeLabel={t('Common.free')}
                            />
                            <StatList
                                type="effect"
                                data={activity.effect}
                                title={t('Common.effects')}
                            />
                        </div>
                    }
                    actionLabel={!isDelayed ? (cooldown > 0 ? `${cooldown}s` : t('Common.start')) : undefined}
                    onAction={!isDelayed ? () => handleAction(activity) : undefined}
                    actionSound={(!!activity.cost?.money && activity.cost.money > 0) ? 'purchase' : 'click'}
                    actionDisabled={isDisabled}
                    disabledOverlay={isDisabled && !isDelayed}
                    actionContent={
                        <div className={styles.actionContent}>
                            {isDelayed && (
                                <ProgressBar progress={progress} height="12px" />
                            )}

                            {activity.duration && (
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <StatBadge stat="TIME" value={`${activity.duration}s`} />
                                </div>
                            )}
                        </div>
                    }
                />
            );
        })
    }

    const tabList = [
        { id: 'rest', label: t('Activities.tab_rest') },
        { id: 'entertainment', label: t('Activities.tab_entertainment') },
        { id: 'gym', label: t('Activities.tab_gym') },
    ] as const;

    if (!isOpen) return null;

    return (
        <>
            <WindowFrame
                id="activities_window"
                title={t('Activities.title')}
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

                    {activeTab === 'rest' && (
                        <>
                            {renderActivityList(REST_ACTIVITIES, 'Rest')}
                        </>
                    )}

                    {activeTab === 'entertainment' && (
                        <>
                            {renderActivityList(FUN_ITEMS, 'Entertainment')}
                        </>
                    )}

                    {activeTab === 'gym' && (
                        <>
                            {renderActivityList(GYM_ACTIVITIES, 'Gym')}
                        </>
                    )}

                </TabContent>
            </WindowFrame>
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={t('Activities.title')}
                content={t('Activities.help_content')}
            />
        </>
    );
};

export default ActivitiesWindow;
