"use client";

import { useState, useEffect, ReactNode } from "react";
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
import EducationWindow from "@/components/EducationWindow/EducationWindow";
import BankWindow from "@/components/BankWindow/BankWindow";
import ComputerWindow from "@/components/ComputerWindow/ComputerWindow";
import GameOverModal from "@/components/GameOverModal/GameOverModal";
import BootScreen from "@/components/BootScreen/BootScreen";
import Notification from "@/components/Notification/Notification";
import DesktopContextMenu from "@/components/DesktopContextMenu/DesktopContextMenu";
import ProgressBar from "@/components/ProgressBar/ProgressBar";
import DesktopGrid, { ShortcutData } from "@/components/DesktopGrid/DesktopGrid";
import WinampWindow from "@/components/WinampWindow/WinampWindow";
import ApplicationWindow from "@/components/ApplicationWindow/ApplicationWindow";
import InternetWindow from "@/components/InternetWindow/InternetWindow";
import LevelBadge from "@/components/LevelBadge/LevelBadge";
import SolitaireWindow from "@/components/SolitaireWindow/SolitaireWindow";
import { useGameState } from "@/hooks/useGameState";
import { useNotification } from "@/hooks/useNotification";
import { STAT_ICONS, GAME_CONSTANTS } from "@/lib/game/constants/index";
import { EDUCATION_TRACKS } from "@/lib/game/constants/education";
import { SolitaireIcon } from "@/components/Icons/AppIcons";
import { calculateComputerLevel } from "@/lib/game/utils/hardware";
import { formatNumberWithSuffix } from "@/lib/game/utils/number-formatter";
import { useWindowManager } from "@/hooks/useWindowManager";
import { useDesktopWallpaper } from "@/hooks/useDesktopWallpaper";
import { useDesktopNotifications } from "@/hooks/useDesktopNotifications";

export default function Home() {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const { state, updateState, resetState, isInitialized } = useGameState();
    const { notification, showNotification, dismissNotification } = useNotification();
    const t = useTranslations('Game');
    const tWinamp = useTranslations('Winamp');
    const tComputer = useTranslations('Computer');

    // Custom Hooks
    const {
        openWindows,
        focusedWindow,
        setFocusedWindow,
        toggleWindow,
        closeWindow,
        resetWindows
    } = useWindowManager(isInitialized, state.gameOver);

    const {
        backgroundImage,
        handleFileChange,
        resetBackground
    } = useDesktopWallpaper(isInitialized);

    useDesktopNotifications(
        state,
        isInitialized,
        showNotification,
        dismissNotification,
        updateState
    );

    const [hasTriggeredOnboarding, setHasTriggeredOnboarding] = useState(false);
    const [isBooting, setIsBooting] = useState(true);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

    const formatTime = (h: number, m: number) => `${h}:${m.toString().padStart(2, '0')}`;
    const formatDate = (d: number, m: number, y: number) => `${d}/${m}/${y}`;

    const winampIcon = (
        <div style={{ fontSize: '24px' }}>⚡</div>
    );

    const desktopShortcuts: ShortcutData[] = [
        {
            id: 'winamp',
            label: tWinamp('title'),
            icon: winampIcon
        },
        ...(state.software.games.includes('solitaire') ? [{
            id: 'solitaire',
            label: t('values.solitaire'),
            icon: <SolitaireIcon />
        }] : [])
    ];

    // Auto-onboarding for first time visit
    useEffect(() => {
        if (isInitialized && !hasTriggeredOnboarding) {
            const storageKey = `${GAME_CONSTANTS.GAME_NAME}-onboarding-seen`;
            const hasSeen = localStorage.getItem(storageKey);
            if (!hasSeen) {
                setIsHelpOpen(true);
            }
            setHasTriggeredOnboarding(true);
        }
    }, [isInitialized, hasTriggeredOnboarding]);

    const handleContextMenu = (e: React.MouseEvent) => {
        if (e.target !== e.currentTarget) return;
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    const handleCloseOnboarding = () => {
        setIsHelpOpen(false);
        const storageKey = `${GAME_CONSTANTS.GAME_NAME}-onboarding-seen`;
        localStorage.setItem(storageKey, 'true');
    };

    const handleReset = () => {
        setIsBooting(true);
        setIsResetOpen(false);
        resetWindows();
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
        <div
            className={styles.container}
            style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
        >
            <div className={styles.desktopArea} onContextMenu={handleContextMenu}>
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="wallpaper-upload"
                    onChange={handleFileChange}
                />

                {/* Desktop Icons */}
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, zIndex: 1, pointerEvents: 'none' }}>
                    <DesktopGrid
                        shortcuts={desktopShortcuts}
                        onIconDoubleClick={(id) => {
                            if (id === 'winamp') {
                                toggleWindow('winamp');
                            } else if (id === 'solitaire') {
                                toggleWindow('solitaire');
                            }
                        }}
                    />
                </div>

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
                                    <XPButton variant="primary" onClick={() => toggleWindow('job')}>{t('buttons.job')}</XPButton>
                                    <XPButton variant="primary" onClick={() => toggleWindow('activities')}>{t('buttons.activities')}</XPButton>
                                    <XPButton variant="primary" onClick={() => toggleWindow('shop')}>{t('buttons.shop')}</XPButton>
                                    <XPButton variant="primary" onClick={() => toggleWindow('education')}>{t('buttons.education')}</XPButton>
                                </div>
                            </div>

                            {/* System Tasks */}
                            <div className={styles.taskBox}>
                                <div className={styles.taskHeader}>
                                    <span className={styles.taskLabel}>{t('groups.system')}</span>
                                </div>
                                <div className={styles.taskContent}>
                                    <XPButton variant="primary" onClick={() => toggleWindow('computer')}>{t('buttons.computer')}</XPButton>
                                    <XPButton variant="primary" onClick={() => toggleWindow('applications')}>{t('buttons.applications')}</XPButton>
                                    <XPButton variant="primary" onClick={() => toggleWindow('internet')}>{t('buttons.internet')}</XPButton>
                                    {/* <XPButton variant="primary" disabled>{t('buttons.hacking')}</XPButton> */}
                                </div>
                            </div>

                            {/* Services Tasks */}
                            <div className={styles.taskBox}>
                                <div className={styles.taskHeader}>
                                    <span className={styles.taskLabel}>{t('groups.services')}</span>
                                </div>
                                <div className={styles.taskContent}>
                                    <XPButton variant="primary" onClick={() => toggleWindow('bank')}>{t('buttons.bank')}</XPButton>
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
                                    <StatRow label={t('monitor')} value={tComputer(`parts.${state.computer.monitor}`)} />
                                    <StatRow label={t('cpu')} value={tComputer(`parts.${state.computer.cpu}`)} />
                                    <StatRow label={t('hdd')} value={tComputer(`parts.${state.computer.hdd}`)} />
                                    <StatRow label={t('ram')} value={tComputer(`parts.${state.computer.ram}`)} />
                                    <StatRow label={t('video')} value={tComputer(`parts.${state.computer.video}`)} />
                                    <StatRow label={t('modem')} value={tComputer(`parts.${state.computer.modem}`)} />
                                    <hr style={{ border: 0, borderTop: '1px solid #ACA899', margin: '2px 0' }} />
                                    <StatRow
                                        label={tComputer('current_computer_level')}
                                        value={<LevelBadge level={calculateComputerLevel(state.computer)} text="Level" />}
                                    />
                                </Panel>

                                <Panel label={t('panels.my_life')}>
                                    <StatRow label={t('rooms')} value={state.life.rooms.toString()} />
                                    <StatRow label={t('furniture')} value={t(`values.${state.life.furniture}`)} />
                                    <StatRow label={t('kitchen')} value={t(`values.${state.life.kitchen}`)} />
                                    <StatRow label={t('bathroom')} value={t(`values.${state.life.bathroom}`)} />
                                    <StatRow label={t('clothes')} value={t(`values.${state.life.clothes}`)} />
                                    <StatRow label={t('car')} value={t(`values.${state.life.car}`)} />
                                </Panel>

                                <Panel label={t('panels.system')}>
                                    <StatRow label={t('system')} value={t(`values.${state.software.system}`)} />
                                    <StatRow
                                        label={t('programs')}
                                        value={state.software.programs.length > 0
                                            ? state.software.programs.map(p => t(`values.${p}`)).join(', ')
                                            : t('values.none')}
                                    />
                                    <StatRow label={t('antivirus')} value={state.software.antivirus !== 'none' ? t(`values.${state.software.antivirus}`) : t('values.none')} />
                                    <StatRow
                                        label={t('games')}
                                        value={state.software.games.length > 0
                                            ? state.software.games.map(g => t(`values.${g}`)).join(', ')
                                            : t('values.none')}
                                    />
                                </Panel>

                                <Panel label={t('panels.internet')}>
                                    <StatRow label={t('access')} value={t(`values.${state.internet.access}`)} />
                                </Panel>

                                <Panel label={t('panels.education')}>
                                    <>
                                        <StatRow label={t('Education.school')} value={state.educationProgress.completedTracks.includes('school') ? t('Education.completed') : (state.educationProgress.activeTrackId === 'school' ? `${state.educationProgress.currentPartIndex + 1}/${EDUCATION_TRACKS.find(tr => tr.id === 'school')?.parts.length}` : t('values.none'))} />
                                        {state.educationProgress.activeTrackId === 'school' && state.educationProgress.status !== 'idle' && (
                                            <EducationProgressBar onToggle={() => toggleWindow('education')} />
                                        )}
                                    </>
                                    <>
                                        <StatRow label={t('Education.college')} value={state.educationProgress.completedTracks.includes('college') ? t('Education.completed') : (state.educationProgress.activeTrackId === 'college' ? `${state.educationProgress.currentPartIndex + 1}/${EDUCATION_TRACKS.find(tr => tr.id === 'college')?.parts.length}` : t('values.none'))} />
                                        {state.educationProgress.activeTrackId === 'college' && state.educationProgress.status !== 'idle' && (
                                            <EducationProgressBar onToggle={() => toggleWindow('education')} />
                                        )}
                                    </>
                                    <>
                                        <StatRow label={t('Education.university')} value={state.educationProgress.completedTracks.includes('university') ? t('Education.completed') : (state.educationProgress.activeTrackId === 'university' ? `${state.educationProgress.currentPartIndex + 1}/${EDUCATION_TRACKS.find(tr => tr.id === 'university')?.parts.length}` : t('values.none'))} />
                                        {state.educationProgress.activeTrackId === 'university' && state.educationProgress.status !== 'idle' && (
                                            <EducationProgressBar onToggle={() => toggleWindow('education')} />
                                        )}
                                    </>
                                </Panel>
                            </div>
                        </div>
                    </div>
                </WindowFrame>

                {/* Inner windows rendered outside main window for full-page movement */}
                <ShopWindow
                    isOpen={openWindows.includes('shop')}
                    onClose={() => closeWindow('shop')}
                    onReset={() => setIsResetOpen(true)}
                    isFocused={focusedWindow === 'shop'}
                    onFocus={() => setFocusedWindow('shop')}
                />
                <JobWindow
                    isOpen={openWindows.includes('job')}
                    onClose={() => closeWindow('job')}
                    onReset={() => setIsResetOpen(true)}
                    isFocused={focusedWindow === 'job'}
                    onFocus={() => setFocusedWindow('job')}
                />
                <ActivitiesWindow
                    isOpen={openWindows.includes('activities')}
                    onClose={() => closeWindow('activities')}
                    onReset={() => setIsResetOpen(true)}
                    isFocused={focusedWindow === 'activities'}
                    onFocus={() => setFocusedWindow('activities')}
                />
                <EducationWindow
                    isOpen={openWindows.includes('education')}
                    onClose={() => closeWindow('education')}
                    onReset={() => setIsResetOpen(true)}
                    isFocused={focusedWindow === 'education'}
                    onFocus={() => setFocusedWindow('education')}
                />
                <BankWindow
                    isOpen={openWindows.includes('bank')}
                    onClose={() => closeWindow('bank')}
                    onReset={() => setIsResetOpen(true)}
                    isFocused={focusedWindow === 'bank'}
                    onFocus={() => setFocusedWindow('bank')}
                />
                <ComputerWindow
                    isOpen={openWindows.includes('computer')}
                    onClose={() => closeWindow('computer')}
                    onReset={() => setIsResetOpen(true)}
                    isFocused={focusedWindow === 'computer'}
                    onFocus={() => setFocusedWindow('computer')}
                />
                <WinampWindow
                    isOpen={openWindows.includes('winamp')}
                    onClose={() => closeWindow('winamp')}
                    isFocused={focusedWindow === 'winamp'}
                    onFocus={() => setFocusedWindow('winamp')}
                />
                <ApplicationWindow
                    isOpen={openWindows.includes('applications')}
                    onClose={() => closeWindow('applications')}
                    isFocused={focusedWindow === 'applications'}
                    onFocus={() => setFocusedWindow('applications')}
                    onOpenApp={(id) => {
                        if (id === 'winamp') toggleWindow('winamp');
                        if (id === 'solitaire') toggleWindow('solitaire');
                    }}
                />
                <SolitaireWindow
                    isOpen={openWindows.includes('solitaire')}
                    onClose={() => closeWindow('solitaire')}
                    isFocused={focusedWindow === 'solitaire'}
                    onFocus={() => setFocusedWindow('solitaire')}
                />
                <InternetWindow
                    isOpen={openWindows.includes('internet')}
                    onClose={() => closeWindow('internet')}
                    isFocused={focusedWindow === 'internet'}
                    onFocus={() => setFocusedWindow('internet')}
                />
            </div >
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
                reason={state.gameOverReason}
            />
            {
                notification && (
                    <Notification
                        key={notification.id}
                        title={notification.title}
                        message={notification.message}
                        type={notification.type}
                        badge={notification.badge}
                        onClose={dismissNotification}
                    />
                )
            }
            <BootScreen isBooting={isBooting} onBootComplete={handleBootComplete} />
            {
                contextMenu && (
                    <DesktopContextMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        onClose={() => setContextMenu(null)}
                        onChangeWallpaper={() => document.getElementById('wallpaper-upload')?.click()}
                        onResetWallpaper={resetBackground}
                    />
                )
            }
        </div >
    );
}

function StatRow({ label, value, icon, iconColor, isCritical }: { label: string; value: string | ReactNode; icon?: ReactNode; iconColor?: string; isCritical?: boolean }) {
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

function EducationProgressBar({ onToggle }: { onToggle: () => void }) {
    const { state } = useGameState();
    const t = useTranslations('Game');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const { status, activeTrackId, currentPartIndex, startTime } = state.educationProgress;

        if (status === 'studying' && activeTrackId && startTime && !state.gameOver) {
            const track = EDUCATION_TRACKS.find(t => t.id === activeTrackId);
            if (!track) return;
            const part = track.parts[currentPartIndex];
            const durationMs = part.duration * 1000;

            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const percent = Math.min(100, (elapsed / durationMs) * 100);
                setProgress(percent);
            }, 100);

            return () => clearInterval(interval);
        }
    }, [state.educationProgress]);

    if (state.educationProgress.status === 'quiz') {
        return (
            <div className={styles.examPending} onClick={onToggle}>
                {t('Education.exam_pending')}
            </div>
        );
    }

    if (state.educationProgress.status !== 'studying') return null;

    return (
        <ProgressBar progress={progress} height="12px" text={`${Math.floor(progress)}%`} />
    );
}
