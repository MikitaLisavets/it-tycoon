import React from 'react';
import {
    MoneyIcon,
    MoodIcon,
    HealthIcon,
    StaminaIcon,
    TimeIcon,
    LevelIcon
} from '../../../components/Icons/StatIcons';

export const STAT_ICONS = {
    MONEY: { icon: <MoneyIcon />, color: 'var(--stat-money)' },
    MOOD: { icon: <MoodIcon />, color: 'var(--stat-mood)' },
    HEALTH: { icon: <HealthIcon />, color: 'var(--stat-health)' },
    STAMINA: { icon: <StaminaIcon />, color: 'var(--stat-stamina)' },
    TIME: { icon: <TimeIcon />, color: 'var(--stat-time)' },
    LEVEL: { icon: <LevelIcon />, color: 'var(--xp-blue-title)' },
};
