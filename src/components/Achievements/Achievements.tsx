"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import Panel from '@/components/Panel/Panel';
import { ACHIEVEMENT_ICONS } from '@/components/Icons/AchievementIcons';
import styles from './Achievements.module.css';
import { useGameState } from '@/hooks/useGameState';

const ACHIEVEMENT_LIST = [
    'first_job',
    'hardware_pro',
    'solitaire_pro',
    'university_grad',
    'millionaire',
    'career_master',
    'hacker_pro',
    'survivor'
];

const Achievements: React.FC = () => {
    const t = useTranslations();
    const { state } = useGameState();
    const unlockedAchievements = state.achievements || [];

    return (
        <div className={styles.badgeGrid}>
            {ACHIEVEMENT_LIST.map((id) => {
                const Icon = ACHIEVEMENT_ICONS[id];
                const isUnlocked = unlockedAchievements.includes(id);

                return (
                    <div key={id} className={styles.badgeWrapper}>
                        <div className={`${styles.badge} ${!isUnlocked ? styles.locked : ''}`}>
                            {Icon && <Icon size={48} />}
                        </div>
                        <div className={`${styles.tooltip} ${isUnlocked ? styles.unlockedTooltip : ''}`}>
                            {t(`Achievements.${id}.title`)}
                            {!isUnlocked && <div style={{ fontSize: '8px', marginTop: '2px' }}>{t(`Achievements.${id}.hint`)}</div>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Achievements;
