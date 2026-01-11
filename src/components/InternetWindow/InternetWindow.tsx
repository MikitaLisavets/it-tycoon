import React, { useState } from 'react';
import WindowFrame from '../WindowFrame/WindowFrame';
import styles from './InternetWindow.module.css';
import { useTranslations } from 'next-intl';
import { useGameState } from '@/hooks/useGameState';
import { SOFTWARES, SoftwareCategory, SoftwareItem } from '@/lib/game/constants/software';
import XPButton from '../XPButton/XPButton';
import { useAudio } from '@/hooks/useAudio';
import { calculateComputerLevel } from '@/lib/game/utils/hardware';
import Requirements from '../Requirements/Requirements';
import StatBadge from '../StatBadge/StatBadge';
import { calculateDynamicPrice } from '@/lib/game/utils/economy';
import StatList from '../StatList/StatList';
import {
    SolitaireIcon,
    NotepadIcon,
    OfficeIcon,
    CodeEditorIcon,
    WebWalletIcon,
    InvestorIcon,
    WinampIcon,
    AntivirusIcon,
    OSIcon
} from '../Icons/AppIcons';

interface InternetWindowProps {
    isOpen: boolean;
    onClose: () => void;
    isFocused: boolean;
    onFocus: () => void;
}


const InternetWindow: React.FC<InternetWindowProps> = ({
    isOpen,
    onClose,
    isFocused,
    onFocus,
}) => {
    const t = useTranslations();
    const { state, updateState } = useGameState();
    const [currentCategory, setCurrentCategory] = useState<SoftwareCategory>('home');
    const [installingItemId, setInstallingItemId] = useState<string | null>(null);
    const [installProgress, setInstallProgress] = useState(0);
    const audio = useAudio();

    const handleClick = (category: SoftwareCategory) => {
        audio.playClick();
        setCurrentCategory(category);
    }

    const handleBuy = (item: SoftwareItem) => {
        if (installingItemId) return;

        const basePrice = item.cost?.money || 0;
        const dynamicPrice = calculateDynamicPrice(basePrice, state);

        if (state.stats.money >= dynamicPrice) {
            // Deduct money immediately
            updateState({
                stats: {
                    ...state.stats,
                    money: state.stats.money - dynamicPrice
                }
            });

            if (item.duration && item.duration > 0) {
                setInstallingItemId(item.id);
                setInstallProgress(0);
            } else {
                completePurchase(item);
            }
        }
    };

    const completePurchase = (item: SoftwareItem) => {
        const currentSoftware = state.software[item.category];
        let updatedSoftware;
        let updatedOwnedSystems = state.software.ownedSystems || []; // Ensure array exists

        if (item.category === 'system') {
            updatedSoftware = item.id; // Set as current active system
            if (!updatedOwnedSystems.includes(item.id)) {
                updatedOwnedSystems = [...updatedOwnedSystems, item.id];
            }
        } else if (Array.isArray(currentSoftware)) {
            updatedSoftware = [...currentSoftware, item.id];
        } else {
            updatedSoftware = item.id;
        }

        updateState({
            software: {
                ...state.software,
                [item.category]: updatedSoftware,
                ownedSystems: updatedOwnedSystems
            }
        });
    };

    // Helper to switch active system from owned list
    const handleUseSystem = (item: SoftwareItem) => {
        if (state.software.system === item.id) return; // Already current

        updateState({
            software: {
                ...state.software,
                system: item.id
            }
        });
        audio.playClick();
    };

    // Installation Timer
    React.useEffect(() => {
        if (!installingItemId) return;

        // Find the item to get its duration
        let targetItem: SoftwareItem | undefined;
        for (const cat in SOFTWARES) {
            const found = SOFTWARES[cat as keyof typeof SOFTWARES].find(i => i.id === installingItemId);
            if (found) {
                targetItem = found;
                break;
            }
        }

        if (!targetItem || !targetItem.duration) {
            setInstallingItemId(null);
            return;
        }

        const durationMs = targetItem.duration * 1000;
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const percent = Math.min(100, (elapsed / durationMs) * 100);
            setInstallProgress(percent);

            if (percent >= 100) {
                clearInterval(interval);
                completePurchase(targetItem!);
                setInstallingItemId(null);
                setInstallProgress(0);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [installingItemId]);


    if (!isOpen) return null;

    const hasModem = state.computer.modem !== 'modem_none';
    const computerLevel = calculateComputerLevel(state.computer);

    const getSoftwareLevel = (id: string, category: keyof typeof SOFTWARES) => {
        const items = SOFTWARES[category];
        if (!items) return -1;
        return items.findIndex(i => i.id === id);
    };

    const isOwned = (item: SoftwareItem) => {
        const currentData = state.software[item.category];

        if (item.category === 'system') {
            return state.software.ownedSystems?.includes(item.id);
        }

        if (Array.isArray(currentData)) {
            return currentData.includes(item.id);
        }

        const currentLevel = getSoftwareLevel(currentData, item.category);
        const itemLevel = getSoftwareLevel(item.id, item.category);
        return itemLevel <= currentLevel;
    };

    const isInstalled = (item: SoftwareItem) => {
        const currentData = state.software[item.category];
        if (Array.isArray(currentData)) {
            return currentData.includes(item.id);
        }
        return currentData === item.id;
    };

    // Helper check: can only buy if level > current installed level AND computer level is enough
    const canBuy = (item: SoftwareItem) => {
        const currentData = state.software[item.category];
        const levelReqMet = computerLevel >= (item.requirements?.computerTier || 0);

        // OS requirement check
        let osReqMet = true;
        if (item.requirements?.system) {
            const currentOS = state.software.system;
            const currentOSLevel = getSoftwareLevel(currentOS, 'system');
            const requiredOSLevel = getSoftwareLevel(item.requirements.system, 'system');
            osReqMet = currentOSLevel >= requiredOSLevel;
        }

        const basePrice = item.cost?.money || 0;
        const dynamicPrice = calculateDynamicPrice(basePrice, state);
        const affordable = state.stats.money >= dynamicPrice;

        if (item.category === 'system') {
            // Can buy if NOT owned yet
            return !state.software.ownedSystems?.includes(item.id) && affordable && levelReqMet;
        }

        if (Array.isArray(currentData)) {
            // Can buy if not already owned
            return !currentData.includes(item.id) && affordable && levelReqMet && osReqMet;
        }

        // Linear (other categories): can buy if level > current level
        const currentLevel = getSoftwareLevel(currentData, item.category);
        const itemLevel = getSoftwareLevel(item.id, item.category);
        return itemLevel > currentLevel && affordable && levelReqMet && osReqMet;
    }

    const getIconForSoftware = (id: string, category: SoftwareCategory) => {
        if (category === 'system') return <OSIcon />;
        if (category === 'antivirus') return <AntivirusIcon />;

        switch (id) {
            case 'solitaire': return <SolitaireIcon />;
            case 'software_notepad': return <NotepadIcon />;
            case 'software_office': return <OfficeIcon />;
            case 'software_code_editor': return <CodeEditorIcon />;
            case 'software_web_wallet': return <WebWalletIcon />;
            case 'software_investor': return <InvestorIcon />;
            case 'software_winamp': return <WinampIcon />;
            default:
                // Fallback based on category if ID doesn't match specific icons
                if (category === 'games') return <SolitaireIcon />; // Placeholder for generic game
                return <NotepadIcon />; // Generic fallback
        }
    };

    const renderSoftwareGrid = (category: SoftwareCategory) => {
        // Handle antivirus category mapping to programs
        let items: SoftwareItem[] = [];
        if (category === 'home') {
            items = [];
        } else {
            // @ts-ignore
            items = SOFTWARES[category];
        }

        if (!items) return null;

        return (
            <div className={styles.productGrid}>
                {items.filter(i => i.id !== 'none').map((item) => {
                    const installed = isInstalled(item);
                    const owned = isOwned(item);
                    const currentData = state.software[item.category];

                    let ownedLower = false;
                    if (item.category !== 'system' && !Array.isArray(currentData)) {
                        const currentLevel = getSoftwareLevel(currentData, item.category);
                        const itemLevel = getSoftwareLevel(item.id, item.category);
                        ownedLower = itemLevel <= currentLevel;
                    }

                    // For System: Owned but not active -> Use button
                    const showUseButton = item.category === 'system' && owned && !installed;
                    const showDisabledOverlay = !canBuy(item) && !owned && !ownedLower && !installed;

                    return (
                        <div key={item.id} className={`${styles.productCard} ${showDisabledOverlay ? 'striped-disabled-overlay' : ''}`}>
                            <div className={styles.productIcon}>
                                <div className={`${styles.iconBox} ${styles[item.category]}`}>
                                    {getIconForSoftware(item.id, item.category)}
                                </div>
                            </div>
                            <div className={styles.productInfo}>
                                <div className={styles.productName}>{t(`Values.${item.id}`)}</div>
                                {item.cost?.money !== undefined && item.cost.money > 0 && !owned && (
                                    <StatList
                                        type="cost"
                                        withoutIcon
                                        data={{ money: calculateDynamicPrice(item.cost.money, state) }}
                                        title={t('Common.cost')}
                                    />
                                )}
                            </div>
                            <div className={styles.productAction}>
                                {installed ? (
                                    <div className={styles.installedBadge}>{t('Common.installed')}</div>
                                ) : showUseButton ? (
                                    <XPButton
                                        className={styles.buyBtn}
                                        onClick={() => handleUseSystem(item)}
                                    >
                                        {t('Common.use')}
                                    </XPButton>
                                ) : owned || ownedLower ? (
                                    <div className={styles.ownedBadge}>{t('Common.owned')}</div>
                                ) : installingItemId === item.id ? (
                                    <div className={styles.installingStatus}>
                                        <div className={styles.installLabel}>
                                            {installProgress < 50 ? t('Internet.downloading') : t('Internet.installing')}
                                        </div>
                                        <div className={styles.progressBarContainer}>
                                            <div
                                                className={styles.progressBarFill}
                                                style={{ width: `${installProgress}%` }}
                                            />
                                        </div>
                                        <div className={styles.installPercent}>{Math.floor(installProgress)}%</div>
                                    </div>
                                ) : (
                                    <div className={styles.purchaseBlock}>
                                        <div className={styles.requirementsWrapper}>
                                            {(item.requirements?.computerTier !== undefined || item.requirements?.system !== undefined) && (
                                                <Requirements
                                                    requirements={{
                                                        computerTier: item.requirements?.computerTier,
                                                        system: item.requirements?.system
                                                    }}
                                                    className={styles.badgeLayout}
                                                    showTitle={true}
                                                />
                                            )}
                                        </div>
                                        <div className={styles.buyActionGroup}>
                                            {(() => {
                                                const basePrice = item.cost?.money || 0;
                                                const dynamicPrice = calculateDynamicPrice(basePrice, state);
                                                const affordable = state.stats.money >= dynamicPrice;
                                                const levelReqMet = computerLevel >= (item.requirements?.computerTier || 0);

                                                let osReqMet = true;
                                                if (item.requirements?.system) {
                                                    const currentOS = state.software.system;
                                                    const currentOSLevel = getSoftwareLevel(currentOS, 'system');
                                                    const requiredOSLevel = getSoftwareLevel(item.requirements.system, 'system');
                                                    osReqMet = currentOSLevel >= requiredOSLevel;
                                                }

                                                const techReqsMet = levelReqMet && osReqMet;

                                                return (
                                                    <>
                                                        {!affordable && techReqsMet && (
                                                            <div className={styles.notEnoughMoney}>
                                                                {t('Internet.not_enough_money')}
                                                            </div>
                                                        )}
                                                        <XPButton
                                                            className={styles.buyBtn}
                                                            disabled={!canBuy(item) || !!installingItemId}
                                                            onClick={() => handleBuy(item)}
                                                            actionSound="purchase"
                                                        >
                                                            {t('Common.buy')}
                                                        </XPButton>
                                                    </>
                                                );
                                            })()}
                                            {item.duration !== undefined && item.duration > 0 && (
                                                <div className={styles.durationBadgeWrapper}>
                                                    <StatBadge
                                                        stat="TIME"
                                                        value={`${item.duration}s`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <WindowFrame
            id="internet"
            title={t('Internet.title')}
            onCloseClick={onClose}
            onHelpClick={() => { }}
            width="700px"
            height="600px"
            isFocused={isFocused}
            onFocus={onFocus}
        >
            <div className={styles.browserContainer}>
                <div className={styles.toolbar}>
                    <div className={styles.addressBar}>
                        <span className={styles.addressLabel}>{t('Internet.address')}:</span>
                        <div className={styles.addressInputContainer}>
                            <input
                                type="text"
                                className={styles.addressInput}
                                value="http://www.mikiapps.com"
                                readOnly
                            />
                            <button className={styles.goButton}>{t('Internet.go')}</button>
                        </div>
                    </div>
                </div>

                <div className={styles.contentArea}>
                    {!hasModem ? (
                        <div className={styles.errorPage}>
                            <h1 className={styles.errorTitle}>{t('Internet.error_title')}</h1>
                            <div className={styles.errorContent}>
                                <p>{t('Internet.error_desc')}</p>
                                <hr className={styles.errorDivider} />
                                <p className={styles.errorSuggestion}>{t('Internet.error_modem')}</p>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.shopContainer}>
                            {/* Header */}
                            <div className={styles.shopHeader}>
                                <div className={styles.logo}>{t('Internet.store_title')}</div>
                                <div className={styles.marqueeContainer}>
                                    <div className={styles.marqueeContent}>{t('Internet.store_subtitle')}</div>
                                </div>
                            </div>

                            <div className={styles.shopBody}>
                                {/* Sidebar */}
                                <div className={styles.shopSidebar}>
                                    <ul className={styles.sidebarLinks}>
                                        <li className={currentCategory === 'home' ? styles.activeLink : ''} onClick={() => handleClick('home')}>{t('Internet.home')}</li>
                                        <li className={currentCategory === 'system' ? styles.activeLink : ''} onClick={() => handleClick('system')}>{t('Internet.cat_system')}</li>
                                        <li className={currentCategory === 'programs' ? styles.activeLink : ''} onClick={() => handleClick('programs')}>{t('Internet.cat_software')}</li>
                                        <li className={currentCategory === 'antivirus' ? styles.activeLink : ''} onClick={() => handleClick('antivirus')}>{t('Internet.cat_security')}</li>
                                        <li className={currentCategory === 'games' ? styles.activeLink : ''} onClick={() => handleClick('games')}>{t('Internet.cat_games')}</li>
                                    </ul>
                                </div>

                                {/* Main Content */}
                                <div className={styles.shopMain}>
                                    {currentCategory === 'home' && (
                                        <div className={styles.homePage}>
                                            <h2>{t('Internet.welcome')}</h2>
                                            <p>{t('Internet.hero_text')}</p>
                                            <div className={styles.heroImage}>
                                                💿
                                            </div>
                                        </div>
                                    )}
                                    {currentCategory === 'system' && renderSoftwareGrid('system')}
                                    {currentCategory === 'programs' && renderSoftwareGrid('programs')}
                                    {currentCategory === 'antivirus' && renderSoftwareGrid('antivirus')}
                                    {currentCategory === 'games' && renderSoftwareGrid('games')}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className={styles.shopFooter}>
                                {t('Internet.copy')}
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.statusBar}>
                    <span>{hasModem ? t('Internet.status_done') : t('Internet.status_error')}</span>
                </div>
            </div>
        </WindowFrame>
    );
};

export default InternetWindow;
