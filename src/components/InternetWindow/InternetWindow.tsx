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
    const t = useTranslations('Internet');
    const { state, updateState } = useGameState();
    const [currentCategory, setCurrentCategory] = useState<SoftwareCategory>('home');
    const audio = useAudio();

    if (!isOpen) return null;

    const hasModem = state.computer.modem !== 'modem_none';
    const computerLevel = calculateComputerLevel(state.computer);

    const handleClick = (category: SoftwareCategory) => {
        audio.playClick();
        setCurrentCategory(category);
    }

    const handleBuy = (item: SoftwareItem) => {
        const moneyCost = item.cost?.money || 0;
        if (state.money >= moneyCost) {
            const currentSoftware = state.software[item.category];
            let updatedSoftware;

            if (Array.isArray(currentSoftware)) {
                updatedSoftware = [...currentSoftware, item.id];
            } else {
                updatedSoftware = item.id;
            }

            updateState({
                money: state.money - moneyCost,
                software: {
                    ...state.software,
                    [item.category]: updatedSoftware
                }
            });
        }
    };

    const getSoftwareLevel = (id: string, category: keyof typeof SOFTWARES) => {
        const items = SOFTWARES[category];
        if (!items) return -1;
        return items.findIndex(i => i.id === id);
    };

    const isOwned = (item: SoftwareItem) => {
        const currentData = state.software[item.category];

        if (Array.isArray(currentData)) {
            return currentData.includes(item.id);
        }

        // For linear categories like system
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

        const moneyCost = item.cost?.money || 0;
        const affordable = state.money >= moneyCost;

        if (Array.isArray(currentData)) {
            // Can buy if not already owned
            return !currentData.includes(item.id) && affordable && levelReqMet && osReqMet;
        }

        // Linear (system): can buy if level > current level
        const currentLevel = getSoftwareLevel(currentData, item.category);
        const itemLevel = getSoftwareLevel(item.id, item.category);
        return itemLevel > currentLevel && affordable && levelReqMet && osReqMet;
    }

    const renderSoftwareGrid = (category: SoftwareCategory) => {
        // Handle antivirus category mapping to programs
        let items: SoftwareItem[] = [];
        if (category === 'home') {
            items = [];
        } else {
            // @ts-ignore - indexing with SoftwareType is now safe since we added antivirus to GameState
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
                    if (!Array.isArray(currentData)) {
                        const currentLevel = getSoftwareLevel(currentData, item.category);
                        const itemLevel = getSoftwareLevel(item.id, item.category);
                        ownedLower = itemLevel <= currentLevel;
                    }

                    return (
                        <div key={item.id} className={styles.productCard}>
                            <div className={styles.productIcon}>
                                <div className={`${styles.iconBox} ${styles[item.category]}`}>
                                    {category === 'system' ? <img src="/icons/os.png" alt="" width={32} height={32} /> : null}
                                    {category === 'programs' || category === 'antivirus' ? <img src="/icons/programs.png" alt="" width={32} height={32} /> : null}
                                </div>
                            </div>
                            <div className={styles.productInfo}>
                                <div className={styles.productName}>{t(`shop.items.${item.id}`)}</div>
                                {item.cost?.money !== undefined && item.cost.money > 0 && (
                                    <div className={styles.productPrice}>
                                        {t('shop.price', { amount: item.cost.money })}
                                    </div>
                                )}
                            </div>
                            <div className={styles.productAction}>
                                {installed ? (
                                    <div className={styles.installedBadge}>{t('shop.installed')}</div>
                                ) : ownedLower ? (
                                    <div className={styles.ownedBadge}>{t('shop.owned')}</div>
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
                                        <XPButton
                                            className={styles.buyBtn}
                                            disabled={!canBuy(item)}
                                            onClick={() => handleBuy(item)}
                                            actionSound="purchase"
                                        >
                                            {t('shop.buy')}
                                        </XPButton>
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
            title={t('title')}
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
                        <span className={styles.addressLabel}>{t('address')}:</span>
                        <div className={styles.addressInputContainer}>
                            <input
                                type="text"
                                className={styles.addressInput}
                                value="http://www.mikiapps.com"
                                readOnly
                            />
                            <button className={styles.goButton}>{t('go')}</button>
                        </div>
                    </div>
                </div>

                <div className={styles.contentArea}>
                    {!hasModem ? (
                        <div className={styles.errorPage}>
                            <h1 className={styles.errorTitle}>{t('error_title')}</h1>
                            <div className={styles.errorContent}>
                                <p>{t('error_desc')}</p>
                                <hr className={styles.errorDivider} />
                                <p className={styles.errorSuggestion}>{t('error_suggestion')}</p>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.shopContainer}>
                            {/* Header */}
                            <div className={styles.shopHeader}>
                                <div className={styles.logo}>{t('shop.title')}</div>
                                <div className={styles.marqueeContainer}>
                                    <div className={styles.marqueeContent}>{t('shop.subtitle')}</div>
                                </div>
                            </div>

                            <div className={styles.shopBody}>
                                {/* Sidebar */}
                                <div className={styles.shopSidebar}>
                                    <ul className={styles.sidebarLinks}>
                                        <li className={currentCategory === 'home' ? styles.activeLink : ''} onClick={() => handleClick('home')}>{t('shop.home')}</li>
                                        <li className={currentCategory === 'system' ? styles.activeLink : ''} onClick={() => handleClick('system')}>{t('shop.system')}</li>
                                        <li className={currentCategory === 'programs' ? styles.activeLink : ''} onClick={() => handleClick('programs')}>{t('shop.programs')}</li>
                                        <li className={currentCategory === 'antivirus' ? styles.activeLink : ''} onClick={() => handleClick('antivirus')}>{t('shop.antivirus')}</li>
                                        <li className={currentCategory === 'games' ? styles.activeLink : ''} onClick={() => handleClick('games')}>{t('shop.games')}</li>
                                    </ul>
                                </div>

                                {/* Main Content */}
                                <div className={styles.shopMain}>
                                    {currentCategory === 'home' && (
                                        <div className={styles.homePage}>
                                            <h2>{t('welcome_title')}</h2>
                                            <p>{t('shop.hero_text')}</p>
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
                                {t('shop.copy')}
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.statusBar}>
                    <span>{hasModem ? t('status_done') : t('status_error')}</span>
                </div>
            </div>
        </WindowFrame>
    );
};

export default InternetWindow;
