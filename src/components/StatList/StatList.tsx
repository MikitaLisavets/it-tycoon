import React from 'react';
import { useTranslations } from 'next-intl';
import StatBadge from '../StatBadge/StatBadge';
import { Cost, Effect } from '@/lib/game/types';
import styles from './StatList.module.css';

interface StatListProps {
    type: 'cost' | 'effect';
    data?: Cost | Effect;
    title?: string;
    isFree?: boolean;
    freeLabel?: string;
}

const StatList: React.FC<StatListProps> = ({ type, data, title, isFree, freeLabel }) => {
    const gt = useTranslations('Game');

    if (!data && !isFree) return null;

    const hasValues = data && Object.values(data).some(v => v !== undefined && v !== 0);

    return (
        <div className={styles.statListSection}>
            {title && (
                <span className={`${styles.label} ${type === 'cost' ? styles.costTitle : styles.effectTitle}`}>
                    {title} {isFree && !hasValues && freeLabel ? <span className={styles.free}>{freeLabel}</span> : null}
                </span>
            )}
            {hasValues && (
                <ul className={`${styles.uiList} ${type === 'cost' ? styles.costList : styles.effectList}`}>
                    {/* Money */}
                    {data.money ? (
                        <li className={styles.uiListItem}>
                            <StatBadge
                                stat="MONEY"
                                value={data.money}
                                prefix={type === 'cost' ? '-' : '+'}
                                label={gt('money')}
                            />
                        </li>
                    ) : null}

                    {/* Health */}
                    {data.health ? (
                        <li className={styles.uiListItem}>
                            {data.health === 'full' ? (
                                <StatBadge stat="HEALTH" value={freeLabel || 'Full'} />
                            ) : (
                                <StatBadge
                                    stat="HEALTH"
                                    value={data.health}
                                    prefix={type === 'cost' ? '-' : '+'}
                                    label={gt('health')}
                                />
                            )}
                        </li>
                    ) : null}

                    {/* Stamina */}
                    {data.stamina ? (
                        <li className={styles.uiListItem}>
                            {data.stamina === 'full' ? (
                                <StatBadge stat="STAMINA" value={freeLabel || 'Full'} />
                            ) : (
                                <StatBadge
                                    stat="STAMINA"
                                    value={data.stamina}
                                    prefix={type === 'cost' ? '-' : '+'}
                                    label={gt('stamina')}
                                />
                            )}
                        </li>
                    ) : null}

                    {/* Mood */}
                    {data.mood ? (
                        <li className={styles.uiListItem}>
                            {data.mood === 'full' ? (
                                <StatBadge stat="MOOD" value={freeLabel || 'Full'} />
                            ) : (
                                <StatBadge
                                    stat="MOOD"
                                    value={data.mood}
                                    prefix={type === 'cost' ? '-' : '+'}
                                    label={gt('mood')}
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
