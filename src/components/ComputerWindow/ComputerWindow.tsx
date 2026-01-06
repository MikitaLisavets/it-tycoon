import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import ListOption from '../ListOption/ListOption';
import Tabs from '../Tabs/Tabs';
import StatList from '../StatList/StatList';
import { useGameState } from '../../hooks/useGameState';
import styles from './ComputerWindow.module.css';
import { HARDWARE_COMPONENTS } from '@/lib/game/constants/hardware';
import { calculateComputerLevel } from '@/lib/game/utils/hardware';

interface ComputerWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onReset?: () => void;
    isFocused?: boolean;
    onFocus?: () => void;
}

type Category = keyof typeof HARDWARE_COMPONENTS;

const ComputerWindow: React.FC<ComputerWindowProps> = ({ isOpen, onClose, onReset, isFocused, onFocus }) => {
    const { state, updateState } = useGameState();
    const t = useTranslations('Computer');
    const gt = useTranslations('Game');
    const [activeTab, setActiveTab] = useState<Category>('cpu');

    const currentLevel = useMemo(() => calculateComputerLevel(state.computer), [state.computer]);

    if (!isOpen) return null;

    const handleBuy = (category: Category, partId: string, price: number) => {
        if (state.money < price) return;

        updateState({
            money: state.money - price,
            computer: {
                ...state.computer,
                [category]: partId
            }
        });
    };

    const categories = Object.keys(HARDWARE_COMPONENTS) as Category[];
    const tabList = categories.map(cat => ({
        id: cat,
        label: t(`categories.${cat}`)
    }));

    const currentLevelClass = styles[`levelBadge_${currentLevel as 0 | 1 | 2 | 3 | 4 | 5}`] || '';

    const renderParts = () => {
        const parts = HARDWARE_COMPONENTS[activeTab] || [];
        return (
            <div className={styles.partsList}>
                {parts.map((part) => {
                    const isOwned = state.computer[activeTab as keyof typeof state.computer] === part.id;
                    const canAfford = state.money >= part.price;
                    const isFree = part.price === 0;
                    const levelClass = styles[`levelBadge_${part.level as 0 | 1 | 2 | 3 | 4 | 5}`] || '';

                    return (
                        <ListOption
                            key={part.id}
                            title={
                                <span className={styles.partTitle}>
                                    <span className={`${styles.levelBadge} ${levelClass}`}>
                                        Lv.{part.level}
                                    </span>
                                    {t(`parts.${part.id}`)}
                                </span>
                            }
                            subtitle={
                                <div className={styles.subtitle}>
                                    {!isOwned && part.price > 0 && (
                                        <StatList
                                            type="cost"
                                            data={{ money: part.price }}
                                            title={gt('cost')}
                                        />
                                    )}
                                </div>
                            }
                            actionLabel={isOwned ? t('mounted') : (isFree ? t('starting') : t('buy'))}
                            onAction={(!isOwned && !isFree) ? () => handleBuy(activeTab, part.id, part.price) : undefined}
                            actionDisabled={isOwned || isFree || !canAfford}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <WindowFrame
            id="computer_window"
            title={t('title')}
            onCloseClick={onClose}
            onResetClick={onReset}
            width="520px"
            isFocused={isFocused}
            onFocus={onFocus}
        >
            <Tabs
                tabs={tabList}
                activeTab={activeTab}
                onTabChange={(id) => setActiveTab(id as Category)}
            />

            <div className={styles.content}>
                <div className={styles.summary}>
                    <div className={styles.summaryRow}>
                        <span>{t('current_computer_level')}:</span>
                        <span className={`${styles.levelBadge} ${currentLevelClass}`}>Level {currentLevel}</span>
                    </div>
                </div>

                {renderParts()}
            </div>
        </WindowFrame>
    );
};

export default ComputerWindow;
