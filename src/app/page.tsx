"use client";

import { useState, useEffect, ReactNode, useCallback } from "react";
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
import MinesweeperWindow from "@/components/MinesweeperWindow/MinesweeperWindow";
import HackingWindow from "@/components/HackingWindow/HackingWindow";
import { useGameState } from "@/hooks/useGameState";
import { useNotification } from "@/hooks/useNotification";
import { STAT_ICONS, GAME_CONSTANTS } from "@/lib/game/constants/index";
import { EDUCATION_TRACKS } from "@/lib/game/constants/education";
import { SolitaireIcon, MinesweeperIcon, NotepadIcon, OfficeIcon, CodeEditorIcon, WebWalletIcon, InvestorIcon, WinampIcon, AntivirusIcon } from "@/components/Icons/AppIcons";
import { NotepadWindow, OfficeWindow, CodeEditorWindow, WebWalletWindow, InvestorWindow, AntivirusWindow } from "@/components/SoftwareWindows/SoftwareWindows";
import { calculateComputerLevel } from "@/lib/game/utils/hardware";
import { formatNumberWithSuffix } from "@/lib/game/utils/number-formatter";
import { useWindowManager } from "@/hooks/useWindowManager";
import { useDesktopWallpaper } from "@/hooks/useDesktopWallpaper";
import { useDesktopNotifications } from "@/hooks/useDesktopNotifications";
import { useGoalTracker } from "@/hooks/useGoalTracker";
import GoalsList from "@/components/GoalsList/GoalsList";
import Achievements from "@/components/Achievements/Achievements";

export default function Home() {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const { state, updateState, resetState, isInitialized, setIsPaused } = useGameState();
    const { notification, showNotification, dismissNotification, clearNotifications } = useNotification();
    const t = useTranslations();

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
    useGoalTracker();

    const [hasTriggeredOnboarding, setHasTriggeredOnboarding] = useState(false);
    const [isBooting, setIsBooting] = useState(true);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

    // Pause game loop when any modal/overlay is active
    useEffect(() => {
        const shouldPause = isBooting || isHelpOpen || state.gameOver;
        setIsPaused(shouldPause);
    }, [isBooting, isHelpOpen, state.gameOver, setIsPaused]);
    const [hackingLogs, setHackingLogs] = useState<string[]>([]);

    const formatTime = (h: number, m: number) => `${h}:${m.toString().padStart(2, '0')}`;
    const formatDate = (d: number, m: number, y: number) => `${d}/${m}/${y}`;

    const desktopShortcuts: ShortcutData[] = [
        {
            id: 'winamp',
            label: t('Winamp.title'),
            icon: <WinampIcon />
        },
        ...(state.software.games.includes('solitaire') ? [{
            id: 'solitaire',
            label: t('Values.solitaire'),
            icon: <SolitaireIcon />
        }] : []),
        ...(state.software.games.includes('minesweeper') ? [{
            id: 'minesweeper',
            label: t('Values.minesweeper'),
            icon: <MinesweeperIcon />
        }] : []),
        ...(state.software.programs.includes('software_office') ? [{
            id: 'software_office',
            label: t('Values.software_office'),
            icon: <OfficeIcon />
        }] : []),
        ...(state.software.programs.includes('software_notepad') ? [{
            id: 'software_notepad',
            label: t('Values.software_notepad'),
            icon: <NotepadIcon />
        }] : []),
        ...(state.software.programs.includes('software_code_editor') ? [{
            id: 'software_code_editor',
            label: t('Values.software_code_editor'),
            icon: <CodeEditorIcon />
        }] : []),
        ...(state.software.programs.includes('software_web_wallet') ? [{
            id: 'software_web_wallet',
            label: t('Values.software_web_wallet'),
            icon: <WebWalletIcon />
        }] : []),
        ...(state.software.programs.includes('software_investor') ? [{
            id: 'software_investor',
            label: t('Values.software_investor'),
            icon: <InvestorIcon />
        }] : []),
        ...(state.software.antivirus !== 'none' ? [{
            id: 'software_antivirus',
            label: t('Software.antivirus_title'),
            icon: <AntivirusIcon />
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
        clearNotifications();
        resetState();
    };

    const handleBootComplete = useCallback(() => {
        setIsBooting(false);
    }, []);

    const currentDays = state.date.year * 360 + state.date.month * 30 + state.date.day;
    const isAntivirusProtected = state.software.antivirus !== 'none' && (state.software.protectionUntilDay || 0) > currentDays;

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
                            } else if (id === 'minesweeper') {
                                toggleWindow('minesweeper');
                            } else if (id.startsWith('software_')) {
                                toggleWindow(id);
                            }
                        }}
                    />
                </div>

                <WindowFrame
                    title={t('Dashboard.title')}
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
                                    <span className={styles.taskLabel}>{t('Dashboard.group_lifestyle')}</span>
                                </div>
                                <div className={styles.taskContent}>
                                    <XPButton variant="primary" onClick={() => toggleWindow('job')}>{t('Dashboard.btn_job')}</XPButton>
                                    <XPButton variant="primary" onClick={() => toggleWindow('activities')}>{t('Dashboard.btn_activities')}</XPButton>
                                    <XPButton variant="primary" onClick={() => toggleWindow('shop')}>{t('Dashboard.btn_shop')}</XPButton>
                                    <XPButton variant="primary" onClick={() => toggleWindow('education')}>{t('Dashboard.btn_education')}</XPButton>
                                </div>
                            </div>

                            {/* System Tasks */}
                            <div className={styles.taskBox}>
                                <div className={styles.taskHeader}>
                                    <span className={styles.taskLabel}>{t('Dashboard.group_system')}</span>
                                </div>
                                <div className={styles.taskContent}>
                                    <XPButton variant="primary" onClick={() => toggleWindow('computer')}>{t('Dashboard.btn_computer')}</XPButton>
                                    <XPButton variant="primary" onClick={() => toggleWindow('applications')}>{t('Dashboard.btn_applications')}</XPButton>
                                    <XPButton variant="primary" onClick={() => toggleWindow('internet')}>{t('Dashboard.btn_internet')}</XPButton>
                                    <XPButton variant="primary" onClick={() => toggleWindow('hacking')}>{t('Dashboard.btn_hacking')}</XPButton>
                                </div>
                            </div>

                            {/* Services Tasks */}
                            <div className={styles.taskBox}>
                                <div className={styles.taskHeader}>
                                    <span className={styles.taskLabel}>{t('Dashboard.group_services')}</span>
                                </div>
                                <div className={styles.taskContent}>
                                    <XPButton variant="primary" onClick={() => toggleWindow('bank')}>{t('Dashboard.btn_bank')}</XPButton>
                                </div>
                            </div>
                        </div>

                        {/* Main Dashboard (Right) */}
                        <div className={styles.dashboardGrid}>
                            {/* Top Summary Bar */}
                            <div className={styles.topBar}>
                                <div className={styles.summaryPanel}>
                                    <StatRow label={t('Stats.money')} value={formatNumberWithSuffix(state.stats.money)} icon={STAT_ICONS.MONEY.icon} iconColor={STAT_ICONS.MONEY.color} />
                                    <StatRow
                                        label={t('Stats.mood')}
                                        value={`${Math.floor(state.stats.mood)}/${state.stats.maxMood}`}
                                        icon={STAT_ICONS.MOOD.icon}
                                        iconColor={STAT_ICONS.MOOD.color}
                                        isCritical={state.stats.mood < GAME_CONSTANTS.CRITICAL_THRESHOLD}
                                    />
                                    <StatRow
                                        label={t('Stats.health')}
                                        value={`${Math.floor(state.stats.health)}/${state.stats.maxHealth}`}
                                        icon={STAT_ICONS.HEALTH.icon}
                                        iconColor={STAT_ICONS.HEALTH.color}
                                        isCritical={state.stats.health < GAME_CONSTANTS.CRITICAL_THRESHOLD}
                                    />
                                    <StatRow label={t('Stats.stamina')} value={`${Math.floor(state.stats.stamina)}/${state.stats.maxStamina}`} icon={STAT_ICONS.STAMINA.icon} iconColor={STAT_ICONS.STAMINA.color} />
                                </div>
                            </div>

                            {/* Main Info Grid */}
                            <div className={styles.panelGrid}>
                                <Panel label={t('Dashboard.panel_personal')}>
                                    <StatRow label={t('Stats.job')} value={t(`Values.${state.job.id}`) /* Should use mapped job title eventually */} />
                                    <StatRow label={t('Stats.education')} value={t(`Values.${state.stats.education}`)} />
                                </Panel>

                                <Panel label={t('Dashboard.panel_education')}>
                                    <>
                                        <StatRow label={t('Values.school')} value={state.educationProgress.completedTracks.includes('school') ? t('Education.completed') : (state.educationProgress.activeTrackId === 'school' ? `${state.educationProgress.currentPartIndex + 1}/${EDUCATION_TRACKS.find(tr => tr.id === 'school')?.parts.length}` : t('Values.none'))} />
                                        {state.educationProgress.activeTrackId === 'school' && state.educationProgress.status !== 'idle' && (
                                            <EducationProgressBar onToggle={() => toggleWindow('education')} />
                                        )}
                                    </>
                                    <>
                                        <StatRow label={t('Values.college')} value={state.educationProgress.completedTracks.includes('college') ? t('Education.completed') : (state.educationProgress.activeTrackId === 'college' ? `${state.educationProgress.currentPartIndex + 1}/${EDUCATION_TRACKS.find(tr => tr.id === 'college')?.parts.length}` : t('Values.none'))} />
                                        {state.educationProgress.activeTrackId === 'college' && state.educationProgress.status !== 'idle' && (
                                            <EducationProgressBar onToggle={() => toggleWindow('education')} />
                                        )}
                                    </>
                                    <>
                                        <StatRow label={t('Values.university')} value={state.educationProgress.completedTracks.includes('university') ? t('Education.completed') : (state.educationProgress.activeTrackId === 'university' ? `${state.educationProgress.currentPartIndex + 1}/${EDUCATION_TRACKS.find(tr => tr.id === 'university')?.parts.length}` : t('Values.none'))} />
                                        {state.educationProgress.activeTrackId === 'university' && state.educationProgress.status !== 'idle' && (
                                            <EducationProgressBar onToggle={() => toggleWindow('education')} />
                                        )}
                                    </>
                                </Panel>

                                <Panel label={t('Dashboard.panel_computer')}>
                                    <StatRow label={t('Stats.monitor')} value={t(`Values.${state.computer.monitor}`)} />
                                    <StatRow label={t('Stats.cpu')} value={t(`Values.${state.computer.cpu}`)} />
                                    <StatRow label={t('Stats.hdd')} value={t(`Values.${state.computer.hdd}`)} />
                                    <StatRow label={t('Stats.ram')} value={t(`Values.${state.computer.ram}`)} />
                                    <StatRow label={t('Stats.video')} value={t(`Values.${state.computer.video}`)} />
                                    <StatRow label={t('Stats.modem')} value={t(`Values.${state.computer.modem}`)} />
                                    <hr style={{ border: 0, borderTop: '1px solid #ACA899', margin: '2px 0' }} />
                                    <StatRow
                                        label={t('Computer.overall_level')}
                                        value={<LevelBadge level={calculateComputerLevel(state.computer)} text="Level" />}
                                    />
                                </Panel>

                                <Panel label={t('Dashboard.panel_system')}>
                                    <StatRow label={t('Stats.access')} value={t(`Values.${state.internet.access}`)} />
                                    <StatRow label={t('Stats.system')} value={t(`Values.${state.software.system}`)} />
                                    <StatRow
                                        label={t('Stats.programs')}
                                        value={state.software.programs.length > 0
                                            ? state.software.programs.map(p => t(`Values.${p}`)).join(', ')
                                            : t('Values.none')}
                                    />
                                    <StatRow
                                        label={t('Stats.antivirus')}
                                        value={state.software.antivirus !== 'none'
                                            ? (isAntivirusProtected
                                                ? <span style={{ color: '#28a745', fontWeight: 'bold' }}>{t('Software.antivirus_protected')}</span>
                                                : <span style={{ color: '#f44336', fontWeight: 'bold' }}>{t('Software.antivirus_vulnerable')}</span>)
                                            : t('Values.none')}
                                    />
                                    <StatRow
                                        label={t('Stats.games')}
                                        value={state.software.games.length > 0
                                            ? state.software.games.map(g => t(`Values.${g}`)).join(', ')
                                            : t('Values.none')}
                                    />
                                </Panel>

                                <Panel label={t('Dashboard.panel_goals')}>
                                    <GoalsList />
                                </Panel>

                                <Panel label={t('Dashboard.panel_achievements')}>
                                    <Achievements />
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
                        if (id.startsWith('software_')) toggleWindow(id);
                    }}
                />
                <SolitaireWindow
                    isOpen={openWindows.includes('solitaire')}
                    onClose={() => closeWindow('solitaire')}
                    isFocused={focusedWindow === 'solitaire'}
                    onFocus={() => setFocusedWindow('solitaire')}
                />
                <MinesweeperWindow
                    isOpen={openWindows.includes('minesweeper')}
                    onClose={() => closeWindow('minesweeper')}
                    isFocused={focusedWindow === 'minesweeper'}
                    onFocus={() => setFocusedWindow('minesweeper')}
                />
                <InternetWindow
                    isOpen={openWindows.includes('internet')}
                    onClose={() => closeWindow('internet')}
                    isFocused={focusedWindow === 'internet'}
                    onFocus={() => setFocusedWindow('internet')}
                />
                <HackingWindow
                    isOpen={openWindows.includes('hacking')}
                    onClose={() => closeWindow('hacking')}
                    isFocused={focusedWindow === 'hacking'}
                    onFocus={() => setFocusedWindow('hacking')}
                    lines={hackingLogs}
                    setLines={setHackingLogs}
                />
                <NotepadWindow
                    isOpen={openWindows.includes('software_notepad')}
                    onClose={() => closeWindow('software_notepad')}
                    isFocused={focusedWindow === 'software_notepad'}
                    onFocus={() => setFocusedWindow('software_notepad')}
                />
                <OfficeWindow
                    isOpen={openWindows.includes('software_office')}
                    onClose={() => closeWindow('software_office')}
                    isFocused={focusedWindow === 'software_office'}
                    onFocus={() => setFocusedWindow('software_office')}
                />
                <CodeEditorWindow
                    isOpen={openWindows.includes('software_code_editor')}
                    onClose={() => closeWindow('software_code_editor')}
                    isFocused={focusedWindow === 'software_code_editor'}
                    onFocus={() => setFocusedWindow('software_code_editor')}
                />
                <WebWalletWindow
                    isOpen={openWindows.includes('software_web_wallet')}
                    onClose={() => closeWindow('software_web_wallet')}
                    isFocused={focusedWindow === 'software_web_wallet'}
                    onFocus={() => setFocusedWindow('software_web_wallet')}
                />
                <InvestorWindow
                    isOpen={openWindows.includes('software_investor')}
                    onClose={() => closeWindow('software_investor')}
                    isFocused={focusedWindow === 'software_investor'}
                    onFocus={() => setFocusedWindow('software_investor')}
                />
                <AntivirusWindow
                    isOpen={openWindows.includes('software_antivirus')}
                    onClose={() => closeWindow('software_antivirus')}
                    isFocused={focusedWindow === 'software_antivirus'}
                    onFocus={() => setFocusedWindow('software_antivirus')}
                    isProtected={isAntivirusProtected}
                    onWin={() => {
                        const currentDays = state.date.year * 360 + state.date.month * 30 + state.date.day;
                        updateState({
                            software: {
                                ...state.software,
                                protectionUntilDay: currentDays + GAME_CONSTANTS.ANTI_VIRUS_PROTECTION_DAYS
                            }
                        });
                    }}
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
    const t = useTranslations();
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
    }, [state.educationProgress, state.gameOver]);

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
