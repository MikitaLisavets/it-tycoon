import React from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import XPButton from '../XPButton/XPButton';
import HelpModal from '../HelpModal/HelpModal';
import StatBadge from '../StatBadge/StatBadge';
import { useGameState } from '../../hooks/useGameState';
import { JOBS, HARDWARE_TIERS, STAT_ICONS } from '../../lib/game/constants/index';
import { JobId, Job } from '../../lib/game/types';
import styles from './JobWindow.module.css';

interface JobWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onReset?: () => void;
}

interface MoneyPopup {
    id: number;
    amount: number;
}

const JobWindow: React.FC<JobWindowProps> = ({ isOpen, onClose, onReset }) => {
    const { state, updateState } = useGameState();
    const t = useTranslations('Job');
    const gt = useTranslations('Game');
    const [isHelpOpen, setIsHelpOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [moneyPopups, setMoneyPopups] = React.useState<MoneyPopup[]>([]);

    // ... (rest of the component logic remains same)

    // (Skipping to render section for brevity in this replace call, but ensuring full component structure is maintained in actual implementation)
    // I will only replace the relevant section to avoid huge diffs if possible, 
    // but the instruction says "replace content" so I'll be careful.
    // Actually I'll use target content to be precise.


    // Use a ref for the audio to avoid reloading on every render
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            audioRef.current = new Audio('/sfx/coin.mp3');
        }
    }, []);

    React.useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = (state.volume / 100) * 0.3;
        }
    }, [state.volume]);

    if (!isOpen) return null;

    const currentJob = JOBS[state.job];

    const calculateComputerTier = () => {
        const components = Object.values(state.computer);
        if (components.length === 0) return 0;
        const tiers = components.map(comp => HARDWARE_TIERS[comp] || 0);
        return Math.min(...tiers);
    };

    const jobLevel = state.jobLevels[state.job] || 0;
    const jobExp = state.jobExp[state.job] || 0;
    const expToNext = (jobLevel + 1) * 10;
    const isMaxLevel = jobLevel >= 10;

    const baseIncome = currentJob?.income || 0;
    const bonusIncome = Math.floor(baseIncome * (jobLevel * 0.1));
    const totalIncome = baseIncome + bonusIncome;

    const handleWork = () => {
        if (currentJob && currentJob.id !== 'none') {
            const healthCost = currentJob.cost?.health || 0;
            const moodCost = currentJob.cost?.mood || 0;
            const staminaCost = currentJob.cost?.stamina || 0;

            if (state.health >= healthCost && (state.mood >= moodCost) && state.stamina >= staminaCost) {
                // Play sound
                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch(e => console.log('Audio play failed:', e));
                }

                // Trigger animations
                setIsAnimating(true);
                setTimeout(() => setIsAnimating(false), 150);

                const popupId = Date.now();
                setMoneyPopups(prev => [...prev, { id: popupId, amount: totalIncome }]);
                setTimeout(() => {
                    setMoneyPopups(prev => prev.filter(p => p.id !== popupId));
                }, 800);

                // Exp and Level logic
                let newExp = jobExp + 1;
                let newLevel = jobLevel;

                if (!isMaxLevel && newExp >= expToNext) {
                    newExp = 0;
                    newLevel = Math.min(10, jobLevel + 1);
                }

                updateState({
                    money: state.money + totalIncome,
                    health: state.health - healthCost,
                    mood: state.mood - moodCost,
                    stamina: state.stamina - staminaCost,
                    jobExp: { ...state.jobExp, [state.job]: isMaxLevel ? jobExp : newExp },
                    jobLevels: { ...state.jobLevels, [state.job]: newLevel }
                });
            }
        }
    };

    const checkRequirements = (jobId: JobId) => {
        const job = JOBS[jobId];
        if (!job || !job.requirements) return true;
        const reqs = job.requirements;

        if (reqs.education && state.education !== reqs.education) {
            // Check if user has higher education than required? 
            // For now assume strict match or hierarchical check if needed. 
            // Usually if I have University I can do College jobs.
            // But let's stick to strict match first or improve logic.
            // Actually 'none' < 'school' < 'college' < 'university'.
            const levels = ['none', 'school', 'college', 'university'];
            if (levels.indexOf(state.education) < levels.indexOf(reqs.education)) return false;
        }

        if (reqs.computerTier !== undefined) {
            if (calculateComputerTier() < reqs.computerTier) return false;
        }

        if (reqs.previousJob && state.job !== reqs.previousJob) {
            return false;
        }

        if (reqs.mood && state.mood < reqs.mood) {
            return false;
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

        if (reqs.education) requirementsList.push(`${gt('education')} ${gt(`values.${reqs.education}`)}`);
        if (reqs.computerTier !== undefined) requirementsList.push(`${t('computer_tier')} ${reqs.computerTier}`);
        if (reqs.previousJob) requirementsList.push(`${t('previous_job')}: ${gt(`values.${reqs.previousJob}`)}`);
        if (reqs.mood) requirementsList.push(`${gt('mood')} ${reqs.mood}`);

        if (requirementsList.length === 0) return null;
        return (
            <div className={styles.requirements}>
                <span className={styles.reqTitle}>{t('requirements')}:</span>
                <ul className={styles.reqList}>
                    {requirementsList.map((req, index) => (
                        <li key={index}>{req}</li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <>
            <WindowFrame title={t('title')} onCloseClick={onClose} onResetClick={onReset} onHelpClick={() => setIsHelpOpen(true)} width="400px">
                <div className={styles.container}>
                    <div className={styles.currentJobWrapper}>
                        <div className={styles.currentJobSection}>
                            <h3>
                                {t('current_job', { job: gt(`values.${state.job}`) })}
                                {state.job !== 'none' && <span className={styles.levelBadge}>{t('level')} {jobLevel}</span>}
                            </h3>
                            {state.job !== 'none' && (
                                <>
                                    <p>
                                        {t('income_manual', { income: totalIncome })}
                                        {jobLevel > 0 && <span className={styles.bonusText}>(+{bonusIncome})</span>}
                                    </p>
                                    <div className={styles.expContainer}>
                                        <div className={styles.expInfo}>
                                            <span>{t('experience')}</span>
                                            <span>{isMaxLevel ? t('max_level') : `${jobExp}/${expToNext}`}</span>
                                        </div>
                                        <div className={styles.expBar}>
                                            <div
                                                className={styles.expBarFill}
                                                style={{ width: isMaxLevel ? '100%' : `${(jobExp / expToNext) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {currentJob?.cost && (
                                <div className={styles.costs}>
                                    <span>{gt('cost')} </span>
                                    {currentJob.cost.health && <StatBadge stat="HEALTH" value={currentJob.cost.health} prefix="-" label={gt('health').replace(':', '')} />}
                                    {currentJob.cost.mood && <StatBadge stat="MOOD" value={currentJob.cost.mood} prefix="-" label={gt('mood').replace(':', '')} />}
                                    {currentJob.cost.stamina && <StatBadge stat="STAMINA" value={currentJob.cost.stamina} prefix="-" label={gt('stamina').replace(':', '')} />}
                                </div>
                            )}
                        </div>

                        {currentJob && currentJob.id !== 'none' && (
                            <div className={styles.workContainer}>
                                {moneyPopups.map(popup => (
                                    <div key={popup.id} className={styles.floatingMoney}>
                                        +${popup.amount}
                                    </div>
                                ))}
                                <XPButton
                                    onClick={handleWork}
                                    disabled={
                                        (currentJob.cost?.health ? state.health < currentJob.cost.health : false) ||
                                        (currentJob.cost?.mood ? state.mood < currentJob.cost.mood : false) ||
                                        (currentJob.cost?.stamina ? state.stamina < currentJob.cost.stamina : false)
                                    }
                                    className={`${styles.workButton} ${isAnimating ? styles.workButtonAnimating : ''}`}
                                >
                                    {t('work_now')}
                                </XPButton>
                                {((currentJob.cost?.health ? state.health < currentJob.cost.health : false) ||
                                    (currentJob.cost?.mood ? state.mood < currentJob.cost.mood : false) ||
                                    (currentJob.cost?.stamina ? state.stamina < currentJob.cost.stamina : false)) && (
                                        <div className={styles.workError}>
                                            {currentJob.cost?.health && state.health < currentJob.cost.health
                                                ? t('error_low_health')
                                                : currentJob.cost?.stamina && state.stamina < currentJob.cost.stamina
                                                    ? gt('stamina').replace(':', '') + ' low!'
                                                    : t('error_low_mood')}
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>

                    <hr className={styles.divider} />

                    <h4 className={styles.availableTitle}>{t('available_jobs')}</h4>
                    <div className={styles.jobList}>
                        {Object.entries(JOBS)
                            .filter(([key]) => key !== 'none') // Filter out current job and 'none'
                            .map(([key, job]) => {
                                const jobId = key as JobId;
                                const canApply = checkRequirements(jobId);

                                return (
                                    <div key={jobId} className={styles.jobItem}>
                                        <div className={styles.jobInfo}>
                                            <span className={styles.jobTitle}>{gt(`values.${job.id}`)}</span>
                                            <span className={styles.jobIncome}>${job.income}</span>
                                            {renderRequirements(jobId)}
                                        </div>
                                        {key !== state.job ? (
                                            <XPButton
                                                onClick={() => handleApply(jobId)}
                                                disabled={!canApply}
                                            >
                                                {t('apply')}
                                            </XPButton>
                                        ) : (
                                            <p>{t('current_job', { job: gt(`values.${state.job}`) })}</p>
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
