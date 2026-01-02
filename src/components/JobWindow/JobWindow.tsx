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

interface MoneyPopup {
    id: number;
    amount: number;
}

const JobWindow: React.FC<JobWindowProps> = ({ isOpen, onClose }) => {
    const { state, updateState } = useGameState();
    const t = useTranslations('Job');
    const gt = useTranslations('Game');
    const [isHelpOpen, setIsHelpOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [moneyPopups, setMoneyPopups] = React.useState<MoneyPopup[]>([]);

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

    const handleWork = () => {
        if (currentJob && currentJob.type === 'manual') {
            const energyCost = currentJob.cost?.health || 0;
            if (state.health >= energyCost && state.mood >= 1) {
                // Play sound
                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch(e => console.log('Audio play failed:', e));
                }

                // Trigger animations
                setIsAnimating(true);
                setTimeout(() => setIsAnimating(false), 150);

                const popupId = Date.now();
                setMoneyPopups(prev => [...prev, { id: popupId, amount: currentJob.income }]);
                setTimeout(() => {
                    setMoneyPopups(prev => prev.filter(p => p.id !== popupId));
                }, 800);

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
                        <h3>{t('current_job', { job: currentJob?.title || gt(`values.${state.job}` as any) })}</h3>
                        {currentJob && <p>{t('type', { type: t(currentJob.type) })}</p>}
                        <p>{currentJob?.type === 'manual'
                            ? t('income_manual', { income: currentJob.income })
                            : currentJob?.type === 'passive'
                                ? t('income_passive', { income: currentJob.income })
                                : ''}
                        </p>
                    </div>

                    {currentJob?.type === 'manual' && (
                        <div className={styles.workContainer}>
                            {moneyPopups.map(popup => (
                                <div key={popup.id} className={styles.floatingMoney}>
                                    +${popup.amount}
                                </div>
                            ))}
                            <XPButton
                                onClick={handleWork}
                                disabled={state.health < (currentJob.cost?.health || 0)}
                                className={`${styles.workButton} ${isAnimating ? styles.workButtonAnimating : ''}`}
                            >
                                {t('work_now')}
                            </XPButton>
                        </div>
                    )}

                    <hr className={styles.divider} />

                    <h4 className={styles.availableTitle}>{t('available_jobs')}</h4>
                    <div className={styles.jobList}>
                        {Object.entries(JOBS)
                            .filter(([key]) => key !== state.job) // Filter out current job
                            .map(([key, job]) => {
                                const jobId = key as JobId;
                                const canApply = checkRequirements(jobId);

                                return (
                                    <div key={jobId} className={styles.jobItem}>
                                        <div className={styles.jobInfo}>
                                            <span className={styles.jobTitle}>{job.title} ({t(job.type)})</span>
                                            {renderRequirements(jobId)}
                                        </div>
                                        <XPButton
                                            onClick={() => handleApply(jobId)}
                                            disabled={!canApply}
                                        >
                                            {t('apply')}
                                        </XPButton>
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
