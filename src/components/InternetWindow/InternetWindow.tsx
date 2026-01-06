import React, { useState } from 'react';
import WindowFrame from '../WindowFrame/WindowFrame';
import styles from './InternetWindow.module.css';
import { useTranslations } from 'next-intl';
import { useGameState } from '@/hooks/useGameState';
import { SOFTWARES, SoftwareItem, SOFTWARE_LEVELS } from '@/lib/game/constants/software';
import XPButton from '../XPButton/XPButton';
import { useAudio } from '@/hooks/useAudio';

interface InternetWindowProps {
    isOpen: boolean;
    onClose: () => void;
    isFocused: boolean;
    onFocus: () => void;
}

type ShopCategory = 'home' | 'system' | 'office' | 'graphics' | 'antivirus' | 'games';

const InternetWindow: React.FC<InternetWindowProps> = ({
    isOpen,
    onClose,
    isFocused,
    onFocus,
}) => {
    const t = useTranslations('Internet');
    const { state, updateState } = useGameState();
    const [currentCategory, setCurrentCategory] = useState<ShopCategory>('home');
    const audio = useAudio();

    if (!isOpen) return null;

    const hasModem = state.computer.modem !== 'modem_none';

    const handleClick = (category: ShopCategory) => {
        audio.playClick();
        setCurrentCategory(category);
    }

    const handleBuy = (item: SoftwareItem) => {
        if (state.money >= item.price) {
            updateState({
                money: state.money - item.price,
                programs: {
                    ...state.programs,
                    [item.category]: item.id
                }
            });
        }
    };

    const isOwned = (item: SoftwareItem) => {
        const currentId = state.programs[item.category];
        const currentLevel = SOFTWARE_LEVELS[currentId] || 0;
        return item.level <= currentLevel; // Consider owned if current installed version differs but level makes it obsolete? 
        // Actually, let's keep it simple: owned if exactly installed OR lower level? 
        // Usually you buy upgrades. Let's say "Installed" if currentId === item.id.
        // "Outdated" if item.level < currentLevel ??
    };

    const isInstalled = (item: SoftwareItem) => {
        return state.programs[item.category] === item.id;
    };

    // Helper check: can only buy if level > current installed level
    const canBuy = (item: SoftwareItem) => {
        const currentId = state.programs[item.category];
        const currentLevel = SOFTWARE_LEVELS[currentId] || 0;
        return item.level > currentLevel && state.money >= item.price;
    }

    const renderSoftwareGrid = (category: 'system' | 'office' | 'graphics' | 'antivirus' | 'games') => {
        const items = SOFTWARES[category];
        return (
            <div className={styles.productGrid}>
                {items.filter(i => i.id !== 'none').map((item) => {
                    const installed = isInstalled(item);
                    const currentId = state.programs[item.category];
                    const currentLevel = SOFTWARE_LEVELS[currentId] || 0;
                    const ownedLower = item.level <= currentLevel;

                    return (
                        <div key={item.id} className={styles.productCard}>
                            <div className={styles.productIcon}>
                                {/* Placeholder Icon */}
                                <div className={`${styles.iconBox} ${styles[item.category]}`}>
                                    {category === 'antivirus' ? '🛡️' : category === 'graphics' ? '🎨' : category === 'office' ? '📝' : '💻'}
                                </div>
                            </div>
                            <div className={styles.productInfo}>
                                <div className={styles.productName}>{t(`shop.items.${item.id}`)}</div>
                                <div className={styles.productPrice}>{t('shop.price', { amount: item.price })}</div>
                                {installed ? (
                                    <div className={styles.installedBadge}>{t('shop.owned')}</div>
                                ) : ownedLower ? (
                                    <div className={styles.ownedBadge}>{t('shop.owned')}</div>
                                ) : (
                                    <button
                                        className={styles.buyBtn}
                                        disabled={state.money < item.price}
                                        onClick={() => handleBuy(item)}
                                    >
                                        {t('shop.buy')}
                                    </button>
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
            width="800px"
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
                                        <li className={currentCategory === 'office' ? styles.activeLink : ''} onClick={() => handleClick('office')}>{t('shop.office')}</li>
                                        <li className={currentCategory === 'graphics' ? styles.activeLink : ''} onClick={() => handleClick('graphics')}>{t('shop.graphics')}</li>
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
                                    {currentCategory === 'office' && renderSoftwareGrid('office')}
                                    {currentCategory === 'graphics' && renderSoftwareGrid('graphics')}
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
