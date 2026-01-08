import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import ListOption from '../ListOption/ListOption';
import Tabs from '../Tabs/Tabs';
import StatList from '../StatList/StatList';
import { useGameState } from '../../hooks/useGameState';
import { useAudio } from '../../hooks/useAudio';
import styles from './ComputerWindow.module.css';
import { HARDWARE_COMPONENTS } from '@/lib/game/constants/hardware';
import { calculateComputerLevel } from '@/lib/game/utils/hardware';
import LevelBadge from '../LevelBadge/LevelBadge';

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
    const { playClick, playPurchase } = useAudio();
    const [activeTab, setActiveTab] = useState<Category>('cpu');

    const handleTabChange = (id: string) => {
        setActiveTab(id as Category);
        playClick();
    };

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



    const renderParts = () => {
        const currentPartId = state.computer[activeTab as keyof typeof state.computer];
        const currentPart = (HARDWARE_COMPONENTS[activeTab] as any[]).find(p => p.id === currentPartId);
        const currentLevel = currentPart?.level || 0;

        // Show all parts to display progression history
        const parts = HARDWARE_COMPONENTS[activeTab] || [];

        const installedIndex = parts.findIndex(p => state.computer[activeTab as keyof typeof state.computer] === p.id);

        return (
            <div className={styles.partsList}>
                {parts.map((part, index) => {
                    const isOwned = index === installedIndex;
                    const canAfford = state.money >= part.price;
                    const isFree = part.price === 0;
                    const isPrecedingInstalled = index === installedIndex - 1;

                    return (
                        <ListOption
                            key={part.id}
                            className={`${isOwned ? styles.installedRow : ''}`}
                            title={
                                <span className={styles.partTitle}>
                                    <LevelBadge level={part.level} text="Lv." />
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
                            actionLabel={isOwned ? null : (part.level < currentLevel ? null : (isFree ? t('starting') : t('buy')))}
                            onAction={(!isOwned && !isFree && part.level >= currentLevel) ? () => handleBuy(activeTab, part.id, part.price) : undefined}
                            actionSound={(!isOwned && !isFree && part.level >= currentLevel) ? 'purchase' : 'click'}
                            actionDisabled={(isOwned || isFree || !canAfford) && part.level >= currentLevel}
                            actionContent={isOwned && (
                                <div className={styles.checkmarkIcon}>
                                    <div className={styles.checkmark} />
                                </div>
                            )}
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
                onTabChange={handleTabChange}
            />

            <div className={styles.content}>
                <div className={styles.summary}>
                    <div className={styles.summaryRow}>
                        <span>{t('current_computer_level')}:</span>
                        <LevelBadge level={currentLevel} text="Level" />
                    </div>
                </div>

                {renderParts()}
            </div>
        </WindowFrame>
    );
};

export default ComputerWindow;
