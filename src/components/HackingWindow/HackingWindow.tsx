"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import WindowFrame from '../WindowFrame/WindowFrame';
import styles from './HackingWindow.module.css';
import { useTranslations } from 'next-intl';
import { useGameState } from '@/hooks/useGameState';
import { useAudio } from '@/hooks/useAudio';
import { HACKING_TARGETS, HackingTarget } from '@/lib/game/constants/hacking';
import { formatNumberWithSuffix } from '@/lib/game/utils/number-formatter';
import { calculateDynamicPrice } from '@/lib/game/utils/economy';
import StatBadge from '../StatBadge/StatBadge';

interface HackingWindowProps {
    isOpen: boolean;
    onClose: () => void;
    isFocused: boolean;
    onFocus: () => void;
    lines: string[];
    setLines: React.Dispatch<React.SetStateAction<string[]>>;
}

const HackingWindow: React.FC<HackingWindowProps> = ({
    isOpen,
    onClose,
    isFocused,
    onFocus,
    lines,
    setLines,
}) => {
    const t = useTranslations();
    const { state, updateState } = useGameState();
    const audio = useAudio();

    const [isHacking, setIsHacking] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);

    // Calculate dynamic targets based on game inflation
    const dynamicTargets = useMemo(() => {
        return HACKING_TARGETS.map(target => ({
            ...target,
            reward: calculateDynamicPrice(target.reward, state),
            fine: calculateDynamicPrice(target.fine, state),
        }));
    }, [state]);

    useEffect(() => {
        if (!isOpen) return;

        const hasModem = state.computer.modem !== 'modem_none';

        if (lines.length === 0) {
            if (!hasModem) {
                setLines([
                    t('Hacking.system_init'),
                    t('Hacking.no_modem_error')
                ]);
            } else {
                setLines([
                    t('Hacking.system_init'),
                    t('Hacking.connection_established'),
                    t('Hacking.welcome_operator'),
                    t('Hacking.choose_target')
                ]);
            }
        }
    }, [isOpen, t, setLines, state.computer.modem]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [lines]);

    const addLine = (line: string) => {
        setLines(prev => [...prev.slice(-50), line]);
    };

    const handleExecute = async (target: HackingTarget) => {
        if (isHacking || state.money < target.fine || state.computer.modem === 'modem_none') {
            return;
        }

        setIsHacking(true);
        setLines([]);
        onFocus();
        audio.playClick();

        addLine(`${t('Hacking.prompt')}${t('Hacking.executing', { target: t(`Hacking.targets_${target.id}`) })}`);

        const phases = [
            t('Hacking.accessing', { target: t(`Hacking.targets_${target.id}`) }),
            t('Hacking.decrypting'),
            t('Hacking.bypassing'),
            t('Hacking.capturing')
        ];

        for (const phase of phases) {
            addLine(phase);
            await new Promise(r => setTimeout(r, target.duration * 250));
        }

        const success = Math.random() > target.risk;

        if (success) {
            addLine(`${t('Hacking.success', { amount: formatNumberWithSuffix(target.reward) })}`);
            updateState({
                money: state.money + target.reward,
                mood: Math.min(state.maxMood, state.mood + 5)
            });
            audio.playLevelUp();
        } else {
            addLine(t('Hacking.failure_wrap', { text: t('Hacking.failure', { amount: formatNumberWithSuffix(target.fine) }) }));
            updateState({
                money: Math.max(0, state.money - target.fine),
                mood: Math.max(0, state.mood - 10)
            });
            audio.playError();
        }

        setIsHacking(false);
    };

    if (!isOpen) return null;

    return (
        <WindowFrame
            id="hacking"
            title={t('Hacking.title')}
            onCloseClick={onClose}
            width="600px"
            height="600px"
            isFocused={isFocused}
            onFocus={onFocus}
        >
            <div className={styles.container} onClick={onFocus}>
                <div className={styles.terminalOutput} ref={terminalRef}>
                    {lines.map((line, i) => (
                        <div key={i} className={`${styles.line} ${line.includes('SUCCESS') ? styles.success : ''} ${line.includes('TRACE') ? styles.failure : ''}`}>
                            <span className={styles.prompt}>{line.startsWith(t('Hacking.prompt')) ? '' : t('Hacking.prompt')}</span>
                            {line}
                        </div>
                    ))}
                    {isHacking && <div className={styles.line}>{t('Hacking.running')}</div>}
                </div>

                {!isHacking && state.computer.modem !== 'modem_none' && (
                    <div className={styles.inputArea}>
                        <div className={styles.targetGrid}>
                            {dynamicTargets.map(target => (
                                <div
                                    key={target.id}
                                    className={`${styles.targetCard} ${state.money < target.fine || state.computer.modem === 'modem_none' ? styles.disabled : ''}`}
                                    onClick={() => handleExecute(target)}
                                >
                                    <div className={styles.targetName}>{t(`Hacking.targets_${target.id}`)}</div>
                                    <div className={styles.targetStats}>
                                        <div className={styles.statRow}>
                                            <span className={styles.statLabel}>{t('Hacking.risk')}:</span>
                                            <span className={styles.statValue}>{(target.risk * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className={styles.statRow}>
                                            <span className={styles.statLabel}>{t('Hacking.reward')}:</span>
                                            <StatBadge stat="MONEY" value={formatNumberWithSuffix(target.reward)} />
                                        </div>
                                        <div className={`${styles.statRow} ${state.money < target.fine ? styles.insufficient : ''}`}>
                                            <span className={styles.statLabel}>{t('Hacking.fine')}:</span>
                                            <StatBadge
                                                stat="MONEY"
                                                value={formatNumberWithSuffix(target.fine)}
                                                className={state.money < target.fine ? styles.insufficientValue : ''}
                                            />
                                        </div>
                                        <div className={styles.statRow}>
                                            <span className={styles.statLabel}>{t('Hacking.duration')}:</span>
                                            <StatBadge stat="TIME" value={`${target.duration}s`} />
                                        </div>
                                    </div>
                                    {state.money < target.fine && (
                                        <div className={styles.insufficientFundsLabel}>
                                            {t('Hacking.insufficient_funds')}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </WindowFrame>
    );
};

export default HackingWindow;
