import React from 'react';
import { useTranslations } from 'next-intl';
import StatBadge from '../StatBadge/StatBadge';
import { Cost, Effect } from '@/lib/game/types';
import styles from './StatList.module.css';
import { formatNumberWithSuffix } from '@/lib/game/utils/number-formatter';

interface StatListProps {
    type: 'cost' | 'effect';
    data?: Cost | Effect;
    title?: string;
    isFree?: boolean;
    freeLabel?: string;
}

const StatList: React.FC<StatListProps> = ({ type, data, title, isFree, freeLabel }) => {
    const t = useTranslations();

    if (!data && !isFree) return null;

    const hasValues = data && Object.values(data).some(v => v !== undefined && v !== 0);

    return (
        <div className={styles.statListSection}>
            {title && (
                <span className={`${styles.label} ${type === 'cost' ? styles.costTitle : styles.effectTitle}`}>
                    {title}: {isFree && !hasValues && freeLabel ? <span className={styles.free}>{freeLabel}</span> : null}
                </span>
            )}
            {hasValues && (
                <ul className={`${styles.uiList} ${type === 'cost' ? styles.costList : styles.effectList}`}>
                    {/* Money */}
                    {data.money ? (
                        <li className={styles.uiListItem}>
                            <StatBadge
                                stat="MONEY"
                                value={typeof data.money === 'number' ? formatNumberWithSuffix(data.money) : data.money}
                            />
                        </li>
                    ) : null}
                    {/* Max Money - if ever needed */}

                    {/* Max Health */}
                    {'maxHealth' in data && data.maxHealth ? (
                        <li className={styles.uiListItem}>
                            <StatBadge
                                stat="HEALTH"
                                value={data.maxHealth}
                                label={`${t('Common.max')} ${t('Stats.health')}`}
                            />
                        </li>
                    ) : null}

                    {/* Health */}
                    {data.health ? (
                        <li className={styles.uiListItem}>
                            {data.health === 'full' ? (
                                <StatBadge stat="HEALTH" value={freeLabel || 'Full'} label={t('Stats.health')} />
                            ) : (
                                <StatBadge
                                    stat="HEALTH"
                                    value={data.health}

                                    label={t('Stats.health')}
                                />
                            )}
                        </li>
                    ) : null}

                    {/* Max Stamina */}
                    {'maxStamina' in data && data.maxStamina ? (
                        <li className={styles.uiListItem}>
                            <StatBadge
                                stat="STAMINA"
                                value={data.maxStamina}
                                label={`${t('Common.max')} ${t('Stats.stamina')}`}
                            />
                        </li>
                    ) : null}

                    {/* Stamina */}
                    {data.stamina ? (
                        <li className={styles.uiListItem}>
                            {data.stamina === 'full' ? (
                                <StatBadge stat="STAMINA" value={freeLabel || 'Full'} label={t('Stats.stamina')} />
                            ) : (
                                <StatBadge
                                    stat="STAMINA"
                                    value={data.stamina}

                                    label={t('Stats.stamina')}
                                />
                            )}
                        </li>
                    ) : null}

                    {/* Max Mood */}
                    {'maxMood' in data && data.maxMood ? (
                        <li className={styles.uiListItem}>
                            <StatBadge
                                stat="MOOD"
                                value={data.maxMood}
                                label={`${t('Common.max')} ${t('Stats.mood')}`}
                            />
                        </li>
                    ) : null}

                    {/* Mood */}
                    {data.mood ? (
                        <li className={styles.uiListItem}>
                            {data.mood === 'full' ? (
                                <StatBadge stat="MOOD" value={freeLabel || 'Full'} label={t('Stats.mood')} />
                            ) : (
                                <StatBadge
                                    stat="MOOD"
                                    value={data.mood}

                                    label={t('Stats.mood')}
                                />
                            )}
                        </li>
                    ) : null}
                </ul>
            )}
        </div>
    );
};

export default StatList;
