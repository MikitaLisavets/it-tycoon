import WindowFrame from '../WindowFrame/WindowFrame';
import HelpModal from '../HelpModal/HelpModal';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import ProgressBar from '../ProgressBar/ProgressBar';
import { AntivirusIcon } from '../Icons/AppIcons';
import styles from './SoftwareWindows.module.css';
import XPButton from '../XPButton/XPButton';

interface SoftwareWindowProps {
    isOpen: boolean;
    onClose: () => void;
    isFocused?: boolean;
    onFocus?: () => void;
    onWin?: () => void;
    isProtected?: boolean;
}

export const NotepadWindow: React.FC<SoftwareWindowProps> = ({ isOpen, onClose, isFocused, onFocus }) => {
    const t = useTranslations();
    if (!isOpen) return null;

    const [isHelpOpen, setIsHelpOpen] = useState(false);
    return (
        <>
            <WindowFrame
                id="notepad"
                title={t('Software.notepad_title')}
                onCloseClick={onClose}
                onHelpClick={() => setIsHelpOpen(true)}
                width="400px"
                height="320px"
                minWidth="280px"
                isFocused={isFocused}
                onFocus={onFocus}
            >
                <div className={styles.container}>
                    <textarea
                        className={styles.textArea}
                        defaultValue={t('Software.notepad_content')}
                        spellCheck={false}
                    />
                </div>
            </WindowFrame>
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={t('Software.notepad_title')}
                content={t('Software.notepad_help_content')}
            />
        </>
    );
};

export const OfficeWindow: React.FC<SoftwareWindowProps> = ({ isOpen, onClose, isFocused, onFocus }) => {
    const t = useTranslations();
    if (!isOpen) return null;

    const [isHelpOpen, setIsHelpOpen] = useState(false);
    return (
        <>
            <WindowFrame
                id="office"
                title={t('Software.office_title')}
                onCloseClick={onClose}
                onHelpClick={() => setIsHelpOpen(true)}
                width="600px"
                height="500px"
                minWidth="320px"
                isFocused={isFocused}
                onFocus={onFocus}
            >
                <div className={styles.officeContainer}>
                    <div className={styles.toolbar}>
                        <div className={styles.toolbarGroup}>
                            <div className={styles.toolbarButton}><b>B</b></div>
                            <div className={styles.toolbarButton}><i>I</i></div>
                            <div className={styles.toolbarButton}><u>U</u></div>
                        </div>
                        <div className={styles.toolbarGroup}>
                            <div className={styles.toolbarButton} style={{ fontSize: '14px' }}>≡</div>
                            <div className={styles.toolbarButton} style={{ fontSize: '14px' }}>≣</div>
                            <div className={styles.toolbarButton} style={{ fontSize: '14px' }}>≣</div>
                        </div>
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', fontSize: '11px', paddingRight: '8px' }}>
                            {t('Software.office_font')}
                        </div>
                    </div>
                    <div className={styles.officePage} contentEditable>
                        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{t('Software.office_report')}</h2>
                        <p style={{ lineHeight: '1.6' }}>{t('Software.office_content')}</p>
                    </div>
                </div>
            </WindowFrame>
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={t('Software.office_title')}
                content={t('Software.office_help_content')}
            />
        </>
    );
};

export const CodeEditorWindow: React.FC<SoftwareWindowProps> = ({ isOpen, onClose, isFocused, onFocus }) => {
    const t = useTranslations();
    if (!isOpen) return null;

    const [isHelpOpen, setIsHelpOpen] = useState(false);
    return (
        <>
            <WindowFrame
                id="code_editor"
                title={t('Software.code_editor_title')}
                onCloseClick={onClose}
                onHelpClick={() => setIsHelpOpen(true)}
                width="600px"
                height="400px"
                minWidth="300px"
                isFocused={isFocused}
                onFocus={onFocus}
            >
                <div className={styles.editorContainer}>
                    <div className={styles.lineNumbers}>
                        1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10
                    </div>
                    <div className={styles.codeArea}>
                        <span className={styles.keyword}>import</span> react <span className={styles.keyword}>from</span> <span className={styles.string}>'react'</span>;<br />
                        <br />
                        <span className={styles.keyword}>const</span> <span className={styles.function}>itTycoon</span> = () ={'>'} ({'{'})<br />
                        &nbsp;&nbsp;<span className={styles.comment}>{t('Software.code_editor_comment')}</span><br />
                        &nbsp;&nbsp;<span className={styles.keyword}>const</span> status = <span className={styles.string}>"Running"</span>;<br />
                        <br />
                        &nbsp;&nbsp;<span className={styles.function}>console</span>.<span className={styles.function}>log</span>(<span className={styles.string}>"Hello World"</span>);<br />
                        &nbsp;&nbsp;<span className={styles.keyword}>return</span> status;<br />
                        {'}'});
                    </div>
                </div>
            </WindowFrame>
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={t('Software.code_editor_title')}
                content={t('Software.code_editor_help_content')}
            />
        </>
    );
};

export const WebWalletWindow: React.FC<SoftwareWindowProps> = ({ isOpen, onClose, isFocused, onFocus }) => {
    const t = useTranslations();
    if (!isOpen) return null;

    const [isHelpOpen, setIsHelpOpen] = useState(false);
    return (
        <>
            <WindowFrame
                id="web_wallet"
                title={t('Software.web_wallet_title')}
                onCloseClick={onClose}
                onHelpClick={() => setIsHelpOpen(true)}
                width="350px"
                height="460px"
                minWidth="280px"
                isFocused={isFocused}
                onFocus={onFocus}
            >
                <div className={styles.walletContainer}>
                    <div className={styles.walletHeader}>
                        <div className={styles.balanceTitle}>{t('Software.web_wallet_balance')}</div>
                        <div className={styles.balanceValue}>
                            $1,234.56
                            <span>+12.5%</span>
                        </div>
                    </div>
                    <div className={styles.walletContent}>
                        <div className={styles.sectionTitle}>{t('Software.web_wallet_recent')}</div>
                        <div className={styles.transactionList}>
                            <div className={styles.transactionItem}>
                                <div className={styles.txInfo}>
                                    <span className={styles.txLabel}>{t('Software.web_wallet_ad_revenue')}</span>
                                    <span className={styles.txDate}>{t('Software.web_wallet_today')}, 10:42 AM</span>
                                </div>
                                <span className={styles.txAmount} style={{ color: '#4caf50' }}>+$50.00</span>
                            </div>
                            <div className={styles.transactionItem}>
                                <div className={styles.txInfo}>
                                    <span className={styles.txLabel}>{t('Software.web_wallet_transfer')}</span>
                                    <span className={styles.txDate}>{t('Software.web_wallet_yesterday')}, 08:15 PM</span>
                                </div>
                                <span className={styles.txAmount} style={{ color: '#f44336' }}>-$100.00</span>
                            </div>
                            <div className={styles.transactionItem}>
                                <div className={styles.txInfo}>
                                    <span className={styles.txLabel}>{t('Software.web_wallet_fee')}</span>
                                    <span className={styles.txDate}>Jan 08, 02:30 PM</span>
                                </div>
                                <span className={styles.txAmount} style={{ color: '#f44336' }}>-$0.05</span>
                            </div>
                        </div>
                    </div>
                </div>
            </WindowFrame>
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={t('Software.web_wallet_title')}
                content={t('Software.web_wallet_help_content')}
            />
        </>
    );
};

export const InvestorWindow: React.FC<SoftwareWindowProps> = ({ isOpen, onClose, isFocused, onFocus }) => {
    const t = useTranslations();
    if (!isOpen) return null;

    const [isHelpOpen, setIsHelpOpen] = useState(false);
    return (
        <>
            <WindowFrame
                id="investor"
                title={t('Software.investor_title')}
                onCloseClick={onClose}
                onHelpClick={() => setIsHelpOpen(true)}
                width="520px"
                height="500px"
                minWidth="300px"
                isFocused={isFocused}
                onFocus={onFocus}
            >
                <div className={styles.investorContainer}>
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <div className={styles.assetInfo}>
                                <h4>{t('Software.investor_portfolio')}</h4>
                                <div className={styles.assetPrice}>$124,560.00</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '12px', color: '#28a745', fontWeight: 'bold' }}>+$12,450 (10.2%)</div>
                                <div style={{ fontSize: '10px', color: '#888' }}>{t('Software.investor_period')}</div>
                            </div>
                        </div>
                        <div className={styles.chartArea}>
                            <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none">
                                <path
                                    d="M0 45 L10 40 L20 42 L30 35 L40 38 L50 25 L60 28 L70 15 L80 18 L90 5 L100 8"
                                    stroke="#28a745"
                                    fill="none"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className={styles.grid}>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>{t('Software.investor_sp500')}</div>
                            <div className={styles.statValue}>+2.45%</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>{t('Software.investor_nasdaq')}</div>
                            <div className={styles.statValue}>+3.12%</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>{t('Software.investor_tech')}</div>
                            <div className={styles.statValue} style={{ color: '#f44336' }}>-0.85%</div>
                        </div>
                    </div>
                </div>
            </WindowFrame>
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={t('Software.investor_title')}
                content={t('Software.investor_help_content')}
            />
        </>
    );
};

export const AntivirusWindow: React.FC<SoftwareWindowProps> = ({ isOpen, onClose, isFocused, onFocus, onWin, isProtected }) => {
    const t = useTranslations();
    const [isScanning, setIsScanning] = useState(false);
    const [caughtCount, setCaughtCount] = useState(0);
    const [lastScan, setLastScan] = useState<string | null>(null);
    const [viruses, setViruses] = useState<{ id: number; x: number; y: number }[]>([]);
    const [timeLeft, setTimeLeft] = useState(20);
    const [gameStatus, setGameStatus] = useState<'idle' | 'scanning' | 'won' | 'lost'>('idle');
    const totalToCatch = 15;

    const handleScan = useCallback(() => {
        setIsScanning(true);
        setCaughtCount(0);
        setViruses([]);
        setTimeLeft(20);
        setGameStatus('scanning');
    }, []);

    const spawnVirus = useCallback(() => {
        if (!isScanning) return;
        const id = Math.random();
        const x = Math.random() * 90; // percentage
        const y = Math.random() * 85; // percentage
        setViruses(prev => [...prev.slice(-4), { id, x, y }]); // Keep max 5 viruses on screen
    }, [isScanning]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isScanning && caughtCount < totalToCatch && timeLeft > 0) {
            timer = setInterval(spawnVirus, 600); // Slightly faster spawn since we have 10s for 15 bugs
        }
        return () => clearInterval(timer);
    }, [isScanning, spawnVirus, caughtCount, timeLeft]);

    // Timer effect
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isScanning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setGameStatus('lost');
                        setIsScanning(false);
                        setViruses([]);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isScanning, timeLeft]);

    // Win condition effect
    useEffect(() => {
        if (isScanning && caughtCount >= totalToCatch) {
            setIsScanning(false);
            setViruses([]);
            setLastScan(new Date().toLocaleString());
            setGameStatus('won');
            onWin?.();
        }
    }, [isScanning, caughtCount, totalToCatch, onWin]);

    const handleCatch = (id: number) => {
        setViruses(prev => prev.filter(v => v.id !== id));
        setCaughtCount(prev => prev + 1);
    };

    if (!isOpen) return null;

    const progress = (caughtCount / totalToCatch) * 100;

    const [isHelpOpen, setIsHelpOpen] = useState(false);
    return (
        <>
            <WindowFrame
                id="antivirus"
                title={t('Software.antivirus_title')}
                onCloseClick={onClose}
                onHelpClick={() => setIsHelpOpen(true)}
                width="400px"
                height="420px"
                minWidth="300px"
                isFocused={isFocused}
                onFocus={onFocus}
            >
                <div className={styles.antivirusContainer}>
                    <div className={styles.avStatusArea}>
                        <div className={styles.avIconShield}>
                            <AntivirusIcon />
                        </div>
                        <div className={styles.avStatusInfo}>
                            <h3>{t('Software.antivirus_status')}: {isProtected || gameStatus === 'won' ? t('Software.antivirus_protected') : gameStatus === 'scanning' ? t('Software.antivirus_scanning') : t('Software.antivirus_vulnerable')}</h3>
                            <div className={styles.avStatusDetail}>
                                {isProtected ? t('Software.antivirus_protected') : lastScan ? `${t('Software.antivirus_last_scan')}: ${lastScan}` : t('Software.antivirus_vulnerable')}
                            </div>
                        </div>
                    </div>
                    <div className={styles.avMainActions}>
                        {gameStatus !== 'scanning' && (
                            <div className={styles.avButtonGroup}>
                                <XPButton onClick={handleScan}>
                                    {t('Software.antivirus_btn_scan')}
                                </XPButton>
                            </div>
                        )}

                        {gameStatus === 'scanning' && (
                            <div className={styles.avScanningArea}>
                                <div className={styles.avScanningHeader}>
                                    <div className={styles.avScanningText}>
                                        {t('Software.antivirus_game_start')}
                                    </div>
                                    <div className={`${styles.avTimer} ${timeLeft <= 3 ? styles.avTimerLow : ''}`}>
                                        {timeLeft}s
                                    </div>
                                </div>
                                <div className={styles.avGameArea}>
                                    {viruses.map(v => (
                                        <div
                                            key={v.id}
                                            className={styles.avVirus}
                                            style={{ left: `${v.x}%`, top: `${v.y}%` }}
                                            onClick={() => handleCatch(v.id)}
                                        >
                                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                                <path d="M19,7H16.89A6,6 0 0,0 12,2A6,6 0 0,0 7.11,7H5V9H7.11L5.84,10.27L7.25,11.68L9,9.93V14.07L7.25,15.82L5.84,14.41L4.43,15.82L5.7,17.09L3.5,19.29L4.91,20.7L7.11,18.5H16.89L19.09,20.7L20.5,19.29L18.3,17.09L19.57,15.82L18.16,14.41L16.75,15.82L15,14.07V9.93L16.75,11.68L18.16,10.27L16.89,9H19V7M14,12H10V9H14V12Z" />
                                            </svg>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.avFooter}>
                                    <span>{t('Software.antivirus_threats_found', { count: caughtCount })} / {totalToCatch}</span>
                                    <div className={styles.avProgressBarContainer} style={{ width: '60%' }}>
                                        <ProgressBar progress={progress} variant="green" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {gameStatus === 'won' && (
                            <div className={styles.avResultSuccess}>
                                ✓ {t('Software.antivirus_game_complete')}
                            </div>
                        )}

                        {gameStatus === 'lost' && (
                            <div className={styles.avResultFailure}>
                                ⚠ {t('Software.antivirus_game_failed')}
                            </div>
                        )}
                    </div>
                </div>
            </WindowFrame>
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={t('Software.antivirus_title')}
                content={t('Software.antivirus_help_content')}
            />
        </>
    );
};
