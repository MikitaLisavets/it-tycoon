import React from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import XPButton from '../XPButton/XPButton';
import HelpModal from '../HelpModal/HelpModal';
import { useGameState } from '../../hooks/useGameState';
import { JOBS, HARDWARE_TIERS } from '../../lib/game/constants/index';
import { JobId } from '../../lib/game/types';
import styles from './JobWindow.module.css';

interface JobWindowProps {
    isOpen: boolean;
    onClose: () => void;
}

const JobWindow: React.FC<JobWindowProps> = ({ isOpen, onClose }) => {
    const { state, updateState } = useGameState();
    const t = useTranslations('Job');
    const gt = useTranslations('Game');
    const [isHelpOpen, setIsHelpOpen] = React.useState(false);

    if (!isOpen) return null;

    const currentJob = JOBS[state.job];

    const calculateComputerTier = () => {
        const components = Object.values(state.computer);
        if (components.length === 0) return 0;

        // The overall tier is the minimum tier of any component
        const tiers = components.map(comp => HARDWARE_TIERS[comp] || 0);
        return Math.min(...tiers);
    };

    const handleWork = () => {
        // Manual work
        if (currentJob && currentJob.type === 'manual') {
            const energyCost = currentJob.cost?.health || 0;
            if (state.health >= energyCost && state.mood >= 1) {
                updateState({
                    money: state.money + currentJob.income,
                    health: state.health - energyCost,
                    mood: state.mood - 1,
                });
            }
        }
    };

    const checkRequirements = (jobId: JobId) => {
        const job = JOBS[jobId];
        if (!job || !job.requirements) return true;

        const reqs = job.requirements;

        if (reqs.money && state.money < reqs.money) return false;
        if (reqs.health && state.health < reqs.health) return false;
        if (reqs.stamina && state.stamina < reqs.stamina) return false;
        if (reqs.education && state.education !== reqs.education) return false;

        if (reqs.computerTier !== undefined) {
            if (calculateComputerTier() < reqs.computerTier) return false;
        }

        return true;
    };

    const handleApply = (jobId: JobId) => {
        if (checkRequirements(jobId)) {
            updateState({ job: jobId });
        }
    };

    const renderRequirements = (jobId: JobId) => {
        const job = JOBS[jobId];
        if (!job || !job.requirements) return null;

        const reqs = job.requirements;
        const requirementsList = [];

        if (reqs.education) requirementsList.push(`${gt('education')}: ${gt(`values.${reqs.education}`)}`);
        if (reqs.money) requirementsList.push(`${gt('money')} ${reqs.money}`);
        if (reqs.health) requirementsList.push(`${gt('health')} ${reqs.health}`);
        if (reqs.stamina) requirementsList.push(`${gt('stamina')} ${reqs.stamina}`);
        if (reqs.computerTier !== undefined) requirementsList.push(`${t('computer_tier')} ${reqs.computerTier}`);

        if (requirementsList.length === 0) return null;

        return (
            <div className={styles.requirements}>
                <span className={styles.reqTitle}>{t('requirements')}:</span>
                <span className={styles.reqList}>{requirementsList.join(', ')}</span>
            </div>
        );
    };

    return (
        <>
            <WindowFrame title={t('title')} onCloseClick={onClose} onHelpClick={() => setIsHelpOpen(true)} width="400px">
                <div className={styles.container}>
                    <div className={styles.currentJobSection}>
                        <h3>{t('current_job', { job: gt(`values.${state.job}`) })}</h3>
                        {currentJob && <p>{t('type', { type: t(currentJob.type) })}</p>}
                        <p>{currentJob?.type === 'manual'
                            ? t('income_manual', { income: currentJob.income })
                            : currentJob?.type === 'passive'
                                ? t('income_passive', { income: currentJob.income })
                                : ''}
                        </p>
                    </div>

                    {currentJob?.type === 'manual' && (
                        <XPButton onClick={handleWork} disabled={state.health < (currentJob.cost?.health || 0)}>
                            {t('work_now')}
                        </XPButton>
                    )}

                    <hr className={styles.divider} />

                    <h4 className={styles.availableTitle}>{t('available_jobs')}</h4>
                    <div className={styles.jobList}>
                        {Object.entries(JOBS).map(([key, job]) => {
                            const jobId = key as JobId;
                            const isCurrent = jobId === state.job;
                            const canApply = checkRequirements(jobId);

                            return (
                                <div key={jobId} className={styles.jobItem}>
                                    <div className={styles.jobInfo}>
                                        <span className={styles.jobTitle}>{job.title} ({t(job.type)})</span>
                                        {!isCurrent && renderRequirements(jobId)}
                                    </div>
                                    {!isCurrent && (
                                        <XPButton
                                            onClick={() => handleApply(jobId)}
                                            disabled={!canApply}
                                        >
                                            {t('apply')}
                                        </XPButton>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </WindowFrame>
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={t('title')}
                content={t('help_content')}
            />
        </>
    );
};

export default JobWindow;
