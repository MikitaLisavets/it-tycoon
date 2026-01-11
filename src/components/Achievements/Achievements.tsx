"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { ACHIEVEMENT_ICONS } from '@/components/Icons/AchievementIcons';
import styles from './Achievements.module.css';
import { useGameState } from '@/hooks/useGameState';
import { useState } from 'react';

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
    const [lastInteractedId, setLastInteractedId] = useState<string | null>(null);
    const [tilt, setTilt] = useState<{ id: string | null; x: number; y: number }>({ id: null, x: 0, y: 0 });

    const unlockedAchievements = state.achievements || [];

    const handleBadgeClick = (id: string) => {
        // Removed sound on click as requested
        setLastInteractedId(null);
        setTimeout(() => setLastInteractedId(id), 10);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Normalize coordinates to -1 to 1 range
        const xPercent = (x / rect.width - 0.5) * 2;
        const yPercent = (y / rect.height - 0.5) * 2;

        // Max tilt: 25 degrees
        setTilt({
            id,
            x: -yPercent * 25, // rotateX depends on y mouse position
            y: xPercent * 25   // rotateY depends on x mouse position
        });
    };

    const handleMouseLeave = () => {
        setTilt({ id: null, x: 0, y: 0 });
    };

    return (
        <div className={styles.badgeGrid}>
            {ACHIEVEMENT_LIST.map((id) => {
                const Icon = ACHIEVEMENT_ICONS[id];
                const isUnlocked = unlockedAchievements.includes(id);

                const badgeTilt = (tilt.id === id && isUnlocked) ? tilt : { x: 0, y: 0 };
                const tiltStyle = isUnlocked ? {
                    transform: `perspective(100px) rotateX(${badgeTilt.x}deg) rotateY(${badgeTilt.y}deg) scale(${tilt.id === id ? 1.15 : 1})`,
                    transition: tilt.id === id ? 'none' : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
                } : {};

                return (
                    <div
                        key={id}
                        className={styles.badgeWrapper}
                        onClick={() => isUnlocked && handleBadgeClick(id)}
                        onMouseMove={(e) => isUnlocked && handleMouseMove(e, id)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div
                            className={`
                                ${styles.badge} 
                                ${!isUnlocked ? styles.locked : styles.unlocked}
                                ${lastInteractedId === id ? styles.interacted : ''}
                            `}
                            style={tiltStyle}
                        >
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
