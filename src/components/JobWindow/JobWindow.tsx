import React from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import XPButton from '../XPButton/XPButton';
import { useGameState } from '../../hooks/useGameState';
import { JOBS } from '../../lib/game/constants/index';
import styles from './JobWindow.module.css';

interface JobWindowProps {
    isOpen: boolean;
    onClose: () => void;
}

const JobWindow: React.FC<JobWindowProps> = ({ isOpen, onClose }) => {
    const { state, updateState } = useGameState();
    const t = useTranslations('Job');

    if (!isOpen) return null;

    const currentJob = JOBS[state.job];

    const handleWork = () => {
        // Manual work
        if (currentJob.type === 'manual') {
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

    return (
        <WindowFrame title={t('title')} onCloseClick={onClose} width="400px">
            <div className={styles.container}>
                <div className={styles.currentJobSection}>
                    <h3>{t('current_job', { job: currentJob?.title || state.job })}</h3>
                    <p>{t('type', { type: t(currentJob?.type) })}</p>
                    <p>{currentJob?.type === 'manual'
                        ? t('income_manual', { income: currentJob?.income })
                        : t('income_passive', { income: currentJob?.income })}
                    </p>
                </div>

                {currentJob?.type === 'manual' && (
                    <XPButton onClick={handleWork} disabled={state.health < (currentJob.cost?.health || 0)}>
                        {t('work_now')}
                    </XPButton>
                )}

                <hr className={styles.divider} />

                <h4 className={styles.availableTitle}>{t('available_jobs')}</h4>
                {/* Check list if we want to show job listing to switch jobs */}
                {Object.entries(JOBS).map(([key, job]) => (
                    <div key={key} className={styles.jobItem}>
                        <span>{job.title} ({t(job.type)})</span>
                        {/* Logic to switch status/job? Usually requires requirements */}
                        {key !== state.job && (
                            <XPButton disabled={true}>{t('apply')}</XPButton>
                        )}
                    </div>
                ))}
            </div>
        </WindowFrame>
    );
};

export default JobWindow;
