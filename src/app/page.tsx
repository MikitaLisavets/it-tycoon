"use client";

import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import Image from "next/image";
import styles from "./page.module.css";
import WindowFrame from "@/components/WindowFrame/WindowFrame";
import Panel from "@/components/Panel/Panel";
import XPButton from "@/components/XPButton/XPButton";
import Taskbar from "@/components/Taskbar/Taskbar";
import OnboardingModal from "@/components/OnboardingModal/OnboardingModal";
import ResetModal from "@/components/ResetModal/ResetModal";
import ShopWindow from "@/components/ShopWindow/ShopWindow";
import JobWindow from "@/components/JobWindow/JobWindow";
import EntertainmentWindow from "@/components/EntertainmentWindow/EntertainmentWindow";
import GymWindow from "@/components/GymWindow/GymWindow";
import GameOverModal from "@/components/GameOverModal/GameOverModal";
import { useGameState } from "@/hooks/useGameState";
import { STAT_ICONS } from "@/lib/game/constants/index";

export default function Home() {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const { state, updateState, resetState, isInitialized } = useGameState();
    const t = useTranslations('Game');
    const [activeWindow, setActiveWindow] = useState<string | null>(null);
    const [hasTriggeredOnboarding, setHasTriggeredOnboarding] = useState(false);

    const formatTime = (h: number, m: number) => `${h}:${m.toString().padStart(2, '0')}`;
    const formatDate = (d: number, m: number, y: number) => `${d}/${m}/${y}`;

    // Auto-onboarding for first time visit
    useEffect(() => {
        if (isInitialized && !hasTriggeredOnboarding) {
            const hasSeen = localStorage.getItem('it-tycoon-onboarding-seen');
            if (!hasSeen) {
                setIsHelpOpen(true);
            }
            setHasTriggeredOnboarding(true);
        }
    }, [isInitialized, hasTriggeredOnboarding]);

    const handleCloseOnboarding = () => {
        setIsHelpOpen(false);
        localStorage.setItem('it-tycoon-onboarding-seen', 'true');
    };

    const handleReset = () => {
        resetState();
        setIsResetOpen(false);
        setActiveWindow(null);
        setIsHelpOpen(false);
    };

    if (!isInitialized) {
        return null; // or a loading screen
    }

    return (
        <div className={styles.container}>
            <div className={styles.desktopArea}>
                <WindowFrame
                    title={t('window_title')}
                    width="800px"
                    onHelpClick={() => setIsHelpOpen(true)}
                    onCloseClick={() => setIsResetOpen(true)}
                    onResetClick={() => setIsResetOpen(true)}
                >
                    <div className={styles.mainContent}>
                        {/* XP Sidebar (Left) */}
                        <div className={styles.xpSidebar}>
                            {/* Lifestyle Tasks */}
                            <div className={styles.taskBox}>
                                <div className={styles.taskHeader}>
                                    <span className={styles.taskLabel}>{t('groups.lifestyle')}</span>
                                </div>
                                <div className={styles.taskContent}>
                                    <XPButton variant="primary" onClick={() => setActiveWindow('job')}>{t('buttons.job')}</XPButton>
                                    <XPButton variant="primary">{t('buttons.apartment')}</XPButton>
                                    <XPButton variant="primary" onClick={() => setActiveWindow('entertainment')}>{t('buttons.entertainment')}</XPButton>
                                    <XPButton variant="primary" onClick={() => setActiveWindow('gym')}>{t('buttons.hobby')}</XPButton>
                                    <XPButton variant="primary">{t('buttons.education')}</XPButton>
                                </div>
                            </div>

                            {/* System Tasks */}
                            <div className={styles.taskBox}>
                                <div className={styles.taskHeader}>
                                    <span className={styles.taskLabel}>{t('groups.system')}</span>
                                </div>
                                <div className={styles.taskContent}>
                                    <XPButton variant="primary">{t('buttons.computer')}</XPButton>
                                    <XPButton variant="primary">{t('buttons.programs')}</XPButton>
                                    <XPButton variant="primary">{t('buttons.internet')}</XPButton>
                                    <XPButton variant="primary">{t('buttons.hacking')}</XPButton>
                                </div>
                            </div>

                            {/* Services Tasks */}
                            <div className={styles.taskBox}>
                                <div className={styles.taskHeader}>
                                    <span className={styles.taskLabel}>{t('groups.services')}</span>
                                </div>
                                <div className={styles.taskContent}>
                                    <XPButton variant="primary">{t('buttons.bank')}</XPButton>
                                    <XPButton variant="primary" onClick={() => setActiveWindow('shop')}>{t('buttons.shop')}</XPButton>
                                </div>
                            </div>
                        </div>

                        {/* Main Dashboard (Right) */}
                        <div className={styles.dashboardGrid}>
                            {/* Top Summary Bar */}
                            <div className={styles.topBar}>
                                <div className={styles.summaryPanel}>
                                    <StatRow label={t('money')} value={Math.floor(state.money).toString()} icon={STAT_ICONS.MONEY.icon} iconColor={STAT_ICONS.MONEY.color} />
                                    <StatRow label={t('mood')} value={Math.floor(state.mood).toString()} icon={STAT_ICONS.MOOD.icon} iconColor={STAT_ICONS.MOOD.color} />
                                    <StatRow label={t('health')} value={Math.floor(state.health).toString()} icon={STAT_ICONS.HEALTH.icon} iconColor={STAT_ICONS.HEALTH.color} />
                                    <StatRow label={t('stamina')} value={Math.floor(state.stamina).toString()} icon={STAT_ICONS.STAMINA.icon} iconColor={STAT_ICONS.STAMINA.color} />
                                </div>
                            </div>

                            {/* Main Info Grid */}
                            <div className={styles.panelGrid}>
                                <Panel label={t('panels.personal_status')}>
                                    <StatRow label={t('job')} value={t(`values.${state.job}`) /* Should use mapped job title eventually */} />
                                    <StatRow label={t('education')} value={t(`values.${state.education}`)} />
                                    <StatRow label={t('english')} value={t(`values.${state.english}`)} />
                                </Panel>

                                <Panel label={t('panels.computer')}>
                                    <StatRow label={t('monitor')} value={t(`values.${state.computer.monitor}`)} />
                                    <StatRow label={t('printer')} value={t(`values.${state.computer.printer}`)} />
                                    <StatRow label={t('scanner')} value={t(`values.${state.computer.scanner}`)} />
                                    <StatRow label={t('modem')} value={t(`values.${state.computer.modem}`)} />
                                    <hr style={{ border: 0, borderTop: '1px solid #ACA899', margin: '2px 0' }} />
                                    <StatRow label={t('cpu')} value={t(`values.${state.computer.cpu}`)} />
                                    <StatRow label={t('hdd')} value={t(`values.${state.computer.hdd}`)} />
                                    <StatRow label={t('cd_rom')} value={t(`values.${state.computer.cd_rom}`)} />
                                    <StatRow label={t('ram')} value={t(`values.${state.computer.ram}`)} />
                                    <StatRow label={t('sound')} value={t(`values.${state.computer.sound}`)} />
                                    <StatRow label={t('video')} value={t(`values.${state.computer.video}`)} />
                                </Panel>

                                <Panel label={t('panels.my_life')}>
                                    <StatRow label={t('rooms')} value={state.life.rooms.toString()} />
                                    <StatRow label={t('furniture')} value={t(`values.${state.life.furniture}`)} />
                                    <StatRow label={t('kitchen')} value={t(`values.${state.life.kitchen}`)} />
                                    <StatRow label={t('bathroom')} value={t(`values.${state.life.bathroom}`)} />
                                    <StatRow label={t('clothes')} value={t(`values.${state.life.clothes}`)} />
                                    <StatRow label={t('car')} value={t(`values.${state.life.car}`)} />
                                </Panel>

                                <Panel label={t('panels.programs')}>
                                    <StatRow label={t('system')} value={t(`values.${state.programs.system}`)} />
                                    <StatRow label={t('office')} value={t(`values.${state.programs.office}`)} />
                                    <StatRow label={t('graphics')} value={t(`values.${state.programs.graphics}`)} />
                                    <StatRow label={t('antivirus')} value={t(`values.${state.programs.antivirus}`)} />
                                </Panel>

                                <Panel label={t('panels.internet')}>
                                    <StatRow label={t('access')} value={t(`values.${state.internet.access}`)} />
                                </Panel>

                                <Panel label={t('panels.education')}>
                                    <div>{t('school')}</div>
                                    <StatRow label={t(state.educationState.school)} value={`${t('cost')} 0`} />
                                    <div>{t('english')}</div>
                                    <StatRow label={t(state.educationState.english)} value={`${t('cost')} 0`} />
                                    <div>{t('courses')}</div>
                                    <StatRow label={t(state.educationState.courses)} value={`${t('cost')} 0`} />
                                </Panel>
                            </div>
                        </div>
                    </div>

                </WindowFrame>

                {/* Inner windows rendered outside main window for full-page movement */}
                <ShopWindow isOpen={activeWindow === 'shop'} onClose={() => setActiveWindow(null)} onReset={() => setIsResetOpen(true)} />
                <JobWindow isOpen={activeWindow === 'job'} onClose={() => setActiveWindow(null)} onReset={() => setIsResetOpen(true)} />
                <EntertainmentWindow isOpen={activeWindow === 'entertainment'} onClose={() => setActiveWindow(null)} onReset={() => setIsResetOpen(true)} />
                <GymWindow isOpen={activeWindow === 'gym'} onClose={() => setActiveWindow(null)} onReset={() => setIsResetOpen(true)} />
            </div>
            <Taskbar
                date={formatDate(state.date.day, state.date.month, state.date.year)}
                time={formatTime(state.date.hour, state.date.minute)}
            />
            <OnboardingModal isOpen={isHelpOpen} onClose={handleCloseOnboarding} />
            <ResetModal
                isOpen={isResetOpen}
                onConfirm={handleReset}
                onCancel={() => setIsResetOpen(false)}
            />
            <GameOverModal
                isOpen={state.gameOver}
                onRestart={handleReset}
            />
        </div>
    );
}

function StatRow({ label, value, icon, iconColor }: { label: string; value: string; icon?: string; iconColor?: string }) {
    return (
        <div className={styles.statRow}>
            <span className={styles.statLabel}>
                {icon && <span className={styles.statIcon} style={{ color: iconColor }}>{icon} </span>}
                {label}
            </span>
            <span className={styles.statValue}>{value}</span>
        </div>
    );
}
