import React from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import XPButton from '../XPButton/XPButton';
import HelpModal from '../HelpModal/HelpModal';
import StatBadge from '../StatBadge/StatBadge';
import ListOption from '../ListOption/ListOption';
import StatList from '../StatList/StatList';
import { useGameState } from '../../hooks/useGameState';
import { JOBS, HARDWARE_LEVELS, STAT_ICONS } from '../../lib/game/constants/index';
import { calculateLevelIncome, calculateLevelBonus } from '../../lib/game/utils/income-scaling';
import { calculateComputerLevel } from '../../lib/game/utils/hardware';
import { formatNumberWithSuffix } from '../../lib/game/utils/number-formatter';
import { JobId, Job } from '../../lib/game/types';
import ProgressBar from '../ProgressBar/ProgressBar';
import styles from './JobWindow.module.css';
import Requirements from '../Requirements/Requirements';

import { useAudio } from '../../hooks/useAudio';

interface JobWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onReset?: () => void;
    isFocused?: boolean;
    onFocus?: () => void;
}

interface MoneyPopup {
    id: number;
    amount: number;
}

const JobWindow: React.FC<JobWindowProps> = ({ isOpen, onClose, onReset, isFocused, onFocus }) => {
    const { state, updateState } = useGameState();
    const t = useTranslations();
    const [isHelpOpen, setIsHelpOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [moneyPopups, setMoneyPopups] = React.useState<MoneyPopup[]>([]);
    const { playCoin, playLevelUp } = useAudio();

    if (!isOpen) return null;

    const currentJob = JOBS[state.job];


    const computerLevel = calculateComputerLevel(state.computer);

    const jobLevel = state.jobLevels[state.job] || 0;
    const jobExp = state.jobExp[state.job] || 0;
    const expToNext = (jobLevel + 1) * 10;
    const isMaxLevel = jobLevel >= 10;

    const baseIncome = currentJob?.income || 0;
    const bonusIncome = calculateLevelBonus(baseIncome, jobLevel);
    const totalIncome = calculateLevelIncome(baseIncome, jobLevel);

    const handleWork = () => {
        if (currentJob && currentJob.id !== 'none') {
            const healthCost = currentJob.cost?.health || 0;
            const moodCost = currentJob.cost?.mood || 0;
            const staminaCost = currentJob.cost?.stamina || 0;

            if (state.health >= healthCost && (state.mood >= moodCost) && state.stamina >= staminaCost) {
                // Play sound
                playCoin();

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

                    // Play level up sound
                    playLevelUp();
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
            const levels = ['none', 'school', 'college', 'university'];
            if (levels.indexOf(state.education) < levels.indexOf(reqs.education)) return false;
        }

        if (reqs.software) {
            if (!state.software.programs.includes(reqs.software)) return false;
        }

        if (reqs.previousJob) {
            if (state.job !== reqs.previousJob) return false;
            // CHECK FOR LEVEL 10
            if ((state.jobLevels[reqs.previousJob] || 0) < 10) return false;
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

    const getLevelClass = (level: number) => {
        if (level <= 0) return 'levelBadge_0';
        const levelKey = `levelBadge_${Math.min(10, level)}`;
        return styles[levelKey] || '';
    };

    return (
        <>
            <WindowFrame
                id="job_window"
                title={t('Job.title')}
                onCloseClick={onClose}
                onResetClick={onReset}
                onHelpClick={() => setIsHelpOpen(true)}
                width="480px"
                isFocused={isFocused}
                onFocus={onFocus}
            >
                <div className={styles.container}>
                    <div className={styles.currentJobWrapper}>
                        <div className={styles.currentJobSection}>
                            <h3>
                                <span className={styles.jobTitle}>{t('Job.current_job')}: {t(`Values.${state.job}`)}</span>
                                {state.job !== 'none' && <span className={`${styles.levelBadge} ${getLevelClass(jobLevel)}`}>{t('Common.level')} {jobLevel}</span>}
                            </h3>
                            {state.job !== 'none' && (
                                <>
                                    <p>
                                        {t('Job.income', { income: formatNumberWithSuffix(totalIncome) })}
                                        {jobLevel > 0 && <span className={styles.bonusText}>(+{formatNumberWithSuffix(bonusIncome)})</span>}
                                    </p>
                                    <div className={styles.expContainer}>
                                        <div className={styles.expInfo}>
                                            <span>{t('Job.experience')}</span>
                                            <span>{isMaxLevel ? t('Job.max_level') : `${jobExp}/${expToNext}`}</span>
                                        </div>
                                        <ProgressBar
                                            progress={isMaxLevel ? 100 : (jobExp / expToNext) * 100}
                                            height="12px"
                                            variant="green"
                                        />
                                    </div>
                                </>
                            )}

                            {currentJob?.cost && (
                                <StatList
                                    type="cost"
                                    data={currentJob.cost}
                                    title={t('Common.cost')}
                                />
                            )}
                        </div>

                        {currentJob && currentJob.id !== 'none' && (
                            <div className={styles.workContainer}>
                                {moneyPopups.map(popup => (
                                    <div key={popup.id} className={styles.floatingMoney}>
                                        +${formatNumberWithSuffix(popup.amount)}
                                    </div>
                                ))}
                                <XPButton
                                    onClick={handleWork}
                                    actionSound="coin"
                                    disabled={
                                        (currentJob.cost?.health ? state.health < currentJob.cost.health : false) ||
                                        (currentJob.cost?.mood ? state.mood < currentJob.cost.mood : false) ||
                                        (currentJob.cost?.stamina ? state.stamina < currentJob.cost.stamina : false)
                                    }
                                    className={`${styles.workButton} ${isAnimating ? styles.workButtonAnimating : ''}`}
                                >
                                    {t('Job.work_now')}
                                </XPButton>
                                {((currentJob.cost?.health ? state.health < currentJob.cost.health : false) ||
                                    (currentJob.cost?.mood ? state.mood < currentJob.cost.mood : false) ||
                                    (currentJob.cost?.stamina ? state.stamina < currentJob.cost.stamina : false)) && (
                                        <div className={styles.workError}>
                                            {currentJob.cost?.health && state.health < currentJob.cost.health
                                                ? t('Job.error_low_health')
                                                : currentJob.cost?.stamina && state.stamina < currentJob.cost.stamina
                                                    ? t('Stats.stamina').replace(':', '') + ' low!'
                                                    : t('Job.error_low_mood')}
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>

                    <hr className={styles.divider} />

                    <h4 className={styles.availableTitle}>{t('Job.available_jobs')}</h4>
                    <div className={styles.jobList}>
                        {Object.entries(JOBS)
                            .filter(([key]) => key !== 'none')
                            .map(([key, job]) => {
                                const jobId = key as JobId;
                                const canApply = checkRequirements(jobId);

                                // Calculate income at current level for this job
                                const currentJobLevel = state.jobLevels[jobId] || 0;
                                const baseJobIncome = job.income;
                                const totalJobIncome = calculateLevelIncome(baseJobIncome, currentJobLevel);

                                return (
                                    <ListOption
                                        key={jobId}
                                        title={t(`Values.${job.id}`)}
                                        subtitle={
                                            <span className={styles.jobIncome}>
                                                <StatBadge
                                                    stat="MONEY"
                                                    value={formatNumberWithSuffix(totalJobIncome)}
                                                />
                                                {currentJobLevel > 0 && (
                                                    <span className={`${styles.bonusText} ${getLevelClass(currentJobLevel)}`} style={currentJobLevel > 0 ? { color: 'white', padding: '1px 4px', borderRadius: '2px', fontSize: '0.7em', verticalAlign: 'middle', marginLeft: '4px' } : {}}>
                                                        Lv.{currentJobLevel}
                                                    </span>
                                                )}
                                            </span>
                                        }
                                        extra={job.requirements && <Requirements requirements={job.requirements} />}
                                        actionLabel={key !== state.job ? t('Job.apply') : undefined}
                                        onAction={key !== state.job ? () => handleApply(jobId) : undefined}
                                        actionDisabled={!canApply}
                                        actionContent={
                                            key === state.job && (
                                                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '12px' }}>{t('Job.current_job', { job: '' })}</p>
                                            )
                                        }
                                    />
                                );
                            })}
                    </div>
                </div>
            </WindowFrame>
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={t('Job.title')}
                content={t('Job.help_content')}
            />
        </>
    );
};

export default JobWindow;
