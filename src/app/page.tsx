"use client";

import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import styles from "./page.module.css";
import WindowFrame from "@/components/WindowFrame/WindowFrame";
import Panel from "@/components/Panel/Panel";
import XPButton from "@/components/XPButton/XPButton";
import Taskbar from "@/components/Taskbar/Taskbar";
import OnboardingModal from "@/components/OnboardingModal/OnboardingModal";
import ResetModal from "@/components/ResetModal/ResetModal";
import ShopWindow from "@/components/ShopWindow/ShopWindow";
import JobWindow from "@/components/JobWindow/JobWindow";
import ActivitiesWindow from "@/components/ActivitiesWindow/ActivitiesWindow";
import GameOverModal from "@/components/GameOverModal/GameOverModal";
import BootScreen from "@/components/BootScreen/BootScreen";
import Notification from "@/components/Notification/Notification";
import { useGameState } from "@/hooks/useGameState";
import { STAT_ICONS, GAME_CONSTANTS } from "@/lib/game/constants/index";
import { formatNumberWithSuffix } from "@/lib/game/utils/number-formatter";

export default function Home() {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const { state, resetState, isInitialized } = useGameState();
    const t = useTranslations('Game');
    const tNotification = useTranslations('Notifications');
    const [activeWindow, setActiveWindow] = useState<string | null>(null);
    const [hasTriggeredOnboarding, setHasTriggeredOnboarding] = useState(false);
    const [notification, setNotification] = useState<{ title: string; message: string; type: 'warning' | 'info'; id: number } | null>(null);
    const [notificationQueue, setNotificationQueue] = useState<{ title: string; message: string; type: 'warning' | 'info'; id: number }[]>([]);
    const [lastWarnings, setLastWarnings] = useState<{ health: number; mood: number }>({ health: 0, mood: 0 });
    const [isBooting, setIsBooting] = useState(true);
    const formatTime = (h: number, m: number) => `${h}:${m.toString().padStart(2, '0')}`;
    const formatDate = (d: number, m: number, y: number) => `${d}/${m}/${y}`;

    // Notification Queue Processor
    useEffect(() => {
        if (!notification && notificationQueue.length > 0) {
            const next = notificationQueue[0];
            setNotification(next);
            setNotificationQueue(prev => prev.slice(1));
        }
    }, [notification, notificationQueue]);

    // Notification Logic (Generator)
    useEffect(() => {
        if (!isInitialized) return;

        const now = Date.now();
        const COOLDOWN = 60000; // 1 minute cooldown for same warning

        // Check Health
        if (state.health < GAME_CONSTANTS.CRITICAL_THRESHOLD && now - lastWarnings.health > COOLDOWN) {
            setNotificationQueue(prev => [...prev, {
                id: now,
                title: tNotification('low_health_title'),
                message: tNotification('low_health'),
                type: 'warning'
            }]);
            setLastWarnings(prev => ({ ...prev, health: now }));
        }

        // Check Mood
        if (state.mood < GAME_CONSTANTS.CRITICAL_THRESHOLD && now - lastWarnings.mood > COOLDOWN) {
            setNotificationQueue(prev => [...prev, {
                id: now + 1, // Ensure distinct ID if same tick
                title: tNotification('low_mood_title'),
                message: tNotification('low_mood'),
                type: 'warning'
            }]);
            setLastWarnings(prev => ({ ...prev, mood: now }));
        }
    }, [state.health, state.mood, isInitialized, lastWarnings, t]);

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
        setIsBooting(true);
        setIsResetOpen(false);
        setActiveWindow(null);
        setIsHelpOpen(false);
        resetState();
    };

    const handleBootComplete = () => {
        setIsBooting(false);
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
                                    <XPButton variant="primary" onClick={() => setActiveWindow('activities')}>{t('buttons.activities')}</XPButton>
                                    <XPButton variant="primary" onClick={() => setActiveWindow('shop')}>{t('buttons.shop')}</XPButton>
                                    <XPButton variant="primary" disabled>{t('buttons.education')}</XPButton>
                                </div>
                            </div>

                            {/* System Tasks */}
                            <div className={styles.taskBox}>
                                <div className={styles.taskHeader}>
                                    <span className={styles.taskLabel}>{t('groups.system')}</span>
                                </div>
                                <div className={styles.taskContent}>
                                    <XPButton variant="primary" disabled>{t('buttons.computer')}</XPButton>
                                    <XPButton variant="primary" disabled>{t('buttons.programs')}</XPButton>
                                    <XPButton variant="primary" disabled>{t('buttons.internet')}</XPButton>
                                    <XPButton variant="primary" disabled>{t('buttons.hacking')}</XPButton>
                                </div>
                            </div>

                            {/* Services Tasks */}
                            <div className={styles.taskBox}>
                                <div className={styles.taskHeader}>
                                    <span className={styles.taskLabel}>{t('groups.services')}</span>
                                </div>
                                <div className={styles.taskContent}>
                                    <XPButton variant="primary" disabled>{t('buttons.bank')}</XPButton>
                                </div>
                            </div>
                        </div>

                        {/* Main Dashboard (Right) */}
                        <div className={styles.dashboardGrid}>
                            {/* Top Summary Bar */}
                            <div className={styles.topBar}>
                                <div className={styles.summaryPanel}>
                                    <StatRow label={t('money')} value={formatNumberWithSuffix(state.money)} icon={STAT_ICONS.MONEY.icon} iconColor={STAT_ICONS.MONEY.color} />
                                    <StatRow
                                        label={t('mood')}
                                        value={`${Math.floor(state.mood)}/${state.maxMood}`}
                                        icon={STAT_ICONS.MOOD.icon}
                                        iconColor={STAT_ICONS.MOOD.color}
                                        isCritical={state.mood < GAME_CONSTANTS.CRITICAL_THRESHOLD}
                                    />
                                    <StatRow
                                        label={t('health')}
                                        value={`${Math.floor(state.health)}/${state.maxHealth}`}
                                        icon={STAT_ICONS.HEALTH.icon}
                                        iconColor={STAT_ICONS.HEALTH.color}
                                        isCritical={state.health < GAME_CONSTANTS.CRITICAL_THRESHOLD}
                                    />
                                    <StatRow label={t('stamina')} value={`${Math.floor(state.stamina)}/${state.maxStamina}`} icon={STAT_ICONS.STAMINA.icon} iconColor={STAT_ICONS.STAMINA.color} />
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
                <ActivitiesWindow isOpen={activeWindow === 'activities'} onClose={() => setActiveWindow(null)} onReset={() => setIsResetOpen(true)} />
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
            {notification && (
                <Notification
                    key={notification.id}
                    title={notification.title}
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <BootScreen isBooting={isBooting} onBootComplete={handleBootComplete} />
        </div>
    );
}

function StatRow({ label, value, icon, iconColor, isCritical }: { label: string; value: string; icon?: string; iconColor?: string; isCritical?: boolean }) {
    return (
        <div className={`${styles.statRow} ${isCritical ? styles.critical : ''}`}>
            <span className={styles.statLabel}>
                {icon && <span className={styles.statIcon} style={{ color: iconColor }}>{icon} </span>}
                {label}
            </span>
            <span className={styles.statValue}>{value}</span>
        </div>
    );
}
