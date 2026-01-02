"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import Image from "next/image";
import styles from "./page.module.css";
import WindowFrame from "@/components/WindowFrame/WindowFrame";
import Panel from "@/components/Panel/Panel";
import XPButton from "@/components/XPButton/XPButton";
import Taskbar from "@/components/Taskbar/Taskbar";
import OnboardingModal from "@/components/OnboardingModal/OnboardingModal";
import ResetModal from "@/components/ResetModal/ResetModal";
import { useGameState } from "@/hooks/useGameState";

export default function Home() {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const { state, updateState, resetState, isInitialized } = useGameState();
    const t = useTranslations('Game');

    const handleReset = () => {
        resetState();
        setIsResetOpen(false);
        // Force a full reload to ensure all components reset correctly
        window.location.href = window.location.origin + window.location.pathname;
    };

    const handleWork = () => {
        updateState({
            money: state.money + 10,
            satiety: state.satiety - 2,
        });
    };

    if (!isInitialized) {
        return null; // or a loading screen
    }

    return (
        <div className={styles.container}>
            <div className={styles.desktopArea}>
                <WindowFrame
                    title={t('me_and_my_computer')}
                    width="800px"
                    onHelpClick={() => setIsHelpOpen(true)}
                    onCloseClick={() => setIsResetOpen(true)}
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
                                    <XPButton variant="primary" onClick={handleWork}>{t('buttons.job')}</XPButton>
                                    <XPButton variant="primary">{t('buttons.apartment')}</XPButton>
                                    <XPButton variant="primary">{t('buttons.entertainment')}</XPButton>
                                    <XPButton variant="primary">{t('buttons.hobby')}</XPButton>
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
                                    <XPButton variant="primary">{t('buttons.shop')}</XPButton>
                                </div>
                            </div>
                        </div>

                        {/* Main Dashboard (Right) */}
                        <div className={styles.dashboardGrid}>
                            {/* Top Summary Bar */}
                            <div className={styles.topBar}>
                                <div className={styles.summaryPanel}>
                                    <StatRow label={t('money')} value={state.money.toString()} />
                                    <StatRow label={t('status')} value={t(`values.${state.status}`)} />
                                    <StatRow label={t('mood')} value={state.mood.toString()} />
                                    <StatRow label={t('satiety')} value={state.satiety.toString()} />
                                </div>
                            </div>

                            {/* Main Info Grid */}
                            <div className={styles.panelGrid}>
                                <Panel label={t('panels.personal_status')}>
                                    <StatRow label={t('job')} value={t(`values.${state.job}`)} />
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
            </div>
            <Taskbar date="13/1/26" time="7:00" />
            <OnboardingModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
            <ResetModal
                isOpen={isResetOpen}
                onConfirm={handleReset}
                onCancel={() => setIsResetOpen(false)}
            />
        </div>
    );
}

function StatRow({ label, value }: { label: string; value: string }) {
    return (
        <div className={styles.statRow}>
            <span className={styles.statLabel}>{label}</span>
            <span className={styles.statValue}>{value}</span>
        </div>
    );
}
