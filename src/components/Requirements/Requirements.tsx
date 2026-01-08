import React from 'react';
import { useTranslations } from 'next-intl';
import { useGameState } from '../../hooks/useGameState';
import { calculateComputerLevel } from '../../lib/game/utils/hardware';
import StatBadge from '../StatBadge/StatBadge';
import { EducationId, JobId } from '../../lib/game/types';
import { SOFTWARES } from '../../lib/game/constants/software';
import styles from './Requirements.module.css';

export interface RequirementsProps {
    requirements: {
        education?: EducationId;
        computerTier?: number;
        previousJob?: JobId;
        mood?: number;
        system?: string;
    };
    title?: string;
    className?: string;
    showTitle?: boolean;
    onlyUnmet?: boolean;
}

const Requirements: React.FC<RequirementsProps> = ({
    requirements,
    title,
    className = '',
    showTitle = true,
    onlyUnmet = false
}) => {
    const { state } = useGameState();
    const t = useTranslations('Job');
    const gt = useTranslations('Game');
    const it = useTranslations('Internet');

    const computerLevel = calculateComputerLevel(state.computer);

    const checkRequirement = (type: keyof RequirementsProps['requirements']) => {
        const val = requirements[type];
        if (val === undefined) return true;

        switch (type) {
            case 'education':
                const levels: EducationId[] = ['none', 'school', 'college', 'university'];
                return levels.indexOf(state.education) >= levels.indexOf(val as EducationId);
            case 'computerTier':
                return computerLevel >= (val as number);
            case 'previousJob':
                return (state.jobLevels[val as JobId] || 0) >= 10;
            case 'mood':
                return state.mood >= (val as number);
            case 'system':
                const currentSystemId = state.software.system;
                const currentLevel = SOFTWARES.system.findIndex(i => i.id === currentSystemId);
                const requiredLevel = SOFTWARES.system.findIndex(i => i.id === (val as string));
                return currentLevel >= requiredLevel;
            default:
                return true;
        }
    };

    const requirementNodes = [];

    if (requirements.education) {
        requirementNodes.push({
            id: 'education',
            met: checkRequirement('education'),
            content: `${gt('education')} ${gt(`values.${requirements.education}`)}`
        });
    }

    if (requirements.computerTier !== undefined) {
        requirementNodes.push({
            id: 'computer',
            met: checkRequirement('computerTier'),
            content: `${t('computer_tier')} ${requirements.computerTier}`
        });
    }

    if (requirements.previousJob) {
        requirementNodes.push({
            id: 'previousJob',
            met: checkRequirement('previousJob'),
            content: t('previous_job_max_level', { job: gt(`values.${requirements.previousJob}`) })
        });
    }

    if (requirements.mood) {
        requirementNodes.push({
            id: 'mood',
            met: checkRequirement('mood'),
            content: <StatBadge stat="MOOD" value={requirements.mood} label={gt('mood')} />
        });
    }

    if (requirements.system) {
        requirementNodes.push({
            id: 'system',
            met: checkRequirement('system'),
            content: `${it('shop.system')} ${it(`shop.items.${requirements.system}`)}`
        });
    }

    if (requirementNodes.length === 0) return null;

    const filteredNodes = onlyUnmet ? requirementNodes.filter(n => !n.met) : requirementNodes;

    if (filteredNodes.length === 0) return null;

    return (
        <div className={`${styles.requirements} ${className}`}>
            {showTitle && <span className={styles.reqTitle}>{title || t('requirements')}:</span>}
            <ul className={styles.reqList}>
                {filteredNodes.map((node) => (
                    <li
                        key={node.id}
                    >
                        <div className={`${styles.checkbox} ${node.met ? styles.tick : styles.cross}`} />
                        <span className={styles.reqContent}>{node.content}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Requirements;
