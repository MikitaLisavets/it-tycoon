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
    const t = useTranslations('Game.hacking');
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
        const hasModem = state.computer.modem !== 'modem_none';

        if (!hasModem) {
            setLines([
                t('system_init'),
                t('no_modem_error')
            ]);
            return;
        } else {
            setLines([
                t('system_init'),
                t('connection_established'),
                t('welcome_operator'),
                t('choose_target')
            ]);
        }

        if (isOpen && lines.length === 0) {
            setLines([
                t('system_init'),
                t('connection_established'),
                t('welcome_operator'),
                t('choose_target')
            ]);
        }
    }, [isOpen, lines.length, t, setLines, state.computer.modem]);

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
        setLines([]); // Clear terminal log when a NEW hack starts
        onFocus();
        audio.playClick();

        addLine(`${t('prompt')}${t('executing', { target: t(`targets.${target.id}`) })}`);

        const phases = [
            t('accessing', { target: t(`targets.${target.id}`) }),
            t('decrypting'),
            t('bypassing'),
            t('capturing')
        ];

        for (const phase of phases) {
            addLine(phase);
            await new Promise(r => setTimeout(r, target.duration * 250));
        }

        const success = Math.random() > target.risk;

        if (success) {
            addLine(`${t('success', { amount: formatNumberWithSuffix(target.reward) })}`);
            updateState({
                money: state.money + target.reward,
                mood: Math.min(state.maxMood, state.mood + 5)
            });
            audio.playLevelUp();
        } else {
            addLine(t('failure_wrap', { text: t('failure', { amount: formatNumberWithSuffix(target.fine) }) }));
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
            title={t('title')}
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
                            <span className={styles.prompt}>{line.startsWith(t('prompt')) ? '' : t('prompt')}</span>
                            {line}
                        </div>
                    ))}
                    {isHacking && <div className={styles.line}>{t('running')}</div>}
                </div>

                {!isHacking && (
                    <div className={styles.inputArea}>
                        <div className={styles.targetGrid}>
                            {dynamicTargets.map(target => (
                                <div
                                    key={target.id}
                                    className={`${styles.targetCard} ${state.money < target.fine || state.computer.modem === 'modem_none' ? styles.disabled : ''}`}
                                    onClick={() => handleExecute(target)}
                                >
                                    <div className={styles.targetName}>{t(`targets.${target.id}`)}</div>
                                    <div className={styles.targetStats}>
                                        <div className={styles.statRow}>
                                            <span className={styles.statLabel}>{t('risk')}:</span>
                                            <span className={styles.statValue}>{(target.risk * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className={styles.statRow}>
                                            <span className={styles.statLabel}>{t('reward')}:</span>
                                            <StatBadge stat="MONEY" value={formatNumberWithSuffix(target.reward)} />
                                        </div>
                                        <div className={`${styles.statRow} ${state.money < target.fine ? styles.insufficient : ''}`}>
                                            <span className={styles.statLabel}>{t('fine')}:</span>
                                            <StatBadge
                                                stat="MONEY"
                                                value={formatNumberWithSuffix(target.fine)}
                                                className={state.money < target.fine ? styles.insufficientValue : ''}
                                            />
                                        </div>
                                        <div className={styles.statRow}>
                                            <span className={styles.statLabel}>{t('duration')}:</span>
                                            <StatBadge stat="TIME" value={`${target.duration}s`} />
                                        </div>
                                    </div>
                                    {state.money < target.fine && (
                                        <div className={styles.insufficientFundsLabel}>
                                            {t('insufficient_funds')}
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
