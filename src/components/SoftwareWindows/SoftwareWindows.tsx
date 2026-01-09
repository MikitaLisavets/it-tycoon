import React from 'react';
import WindowFrame from '../WindowFrame/WindowFrame';
import styles from './SoftwareWindows.module.css';

interface SoftwareWindowProps {
    isOpen: boolean;
    onClose: () => void;
    isFocused?: boolean;
    onFocus?: () => void;
}

export const NotepadWindow: React.FC<SoftwareWindowProps> = ({ isOpen, onClose, isFocused, onFocus }) => {
    if (!isOpen) return null;

    return (
        <WindowFrame
            id="notepad"
            title="Notepad"
            onCloseClick={onClose}
            width="400px"
            height="320px"
            minWidth="280px"
            isFocused={isFocused}
            onFocus={onFocus}
        >
            <div className={styles.container}>
                <textarea
                    className={styles.textArea}
                    defaultValue="Dear Diary, today I bought a new computer..."
                    spellCheck={false}
                />
            </div>
        </WindowFrame>
    );
};

export const OfficeWindow: React.FC<SoftwareWindowProps> = ({ isOpen, onClose, isFocused, onFocus }) => {
    if (!isOpen) return null;

    return (
        <WindowFrame
            id="office"
            title="EasyOffice 2000"
            onCloseClick={onClose}
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
                        Times New Roman
                    </div>
                </div>
                <div className={styles.officePage}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>QUARTERLY REPORT</h2>
                    <p style={{ lineHeight: '1.6' }}>Profit is up by 200%. Everything is going great. Our market share is expanding rapidly across all sectors.</p>
                </div>
            </div>
        </WindowFrame>
    );
};

export const CodeEditorWindow: React.FC<SoftwareWindowProps> = ({ isOpen, onClose, isFocused, onFocus }) => {
    if (!isOpen) return null;

    return (
        <WindowFrame
            id="code_editor"
            title="Code Editor Pro"
            onCloseClick={onClose}
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
                    &nbsp;&nbsp;<span className={styles.comment}>// Making progress</span><br />
                    &nbsp;&nbsp;<span className={styles.keyword}>const</span> status = <span className={styles.string}>"Running"</span>;<br />
                    <br />
                    &nbsp;&nbsp;<span className={styles.function}>console</span>.<span className={styles.function}>log</span>(<span className={styles.string}>"Hello World"</span>);<br />
                    &nbsp;&nbsp;<span className={styles.keyword}>return</span> status;<br />
                    {'}'});
                </div>
            </div>
        </WindowFrame>
    );
};

export const WebWalletWindow: React.FC<SoftwareWindowProps> = ({ isOpen, onClose, isFocused, onFocus }) => {
    if (!isOpen) return null;

    return (
        <WindowFrame
            id="web_wallet"
            title="Web Wallet"
            onCloseClick={onClose}
            width="350px"
            height="460px"
            minWidth="280px"
            isFocused={isFocused}
            onFocus={onFocus}
        >
            <div className={styles.walletContainer}>
                <div className={styles.walletHeader}>
                    <div className={styles.balanceTitle}>Total Balance</div>
                    <div className={styles.balanceValue}>
                        $1,234.56
                        <span>+12.5%</span>
                    </div>
                </div>
                <div className={styles.walletContent}>
                    <div className={styles.sectionTitle}>Recent Transactions</div>
                    <div className={styles.transactionList}>
                        <div className={styles.transactionItem}>
                            <div className={styles.txInfo}>
                                <span className={styles.txLabel}>Ad Revenue</span>
                                <span className={styles.txDate}>Today, 10:42 AM</span>
                            </div>
                            <span className={styles.txAmount} style={{ color: '#4caf50' }}>+$50.00</span>
                        </div>
                        <div className={styles.transactionItem}>
                            <div className={styles.txInfo}>
                                <span className={styles.txLabel}>External Transfer</span>
                                <span className={styles.txDate}>Yesterday, 08:15 PM</span>
                            </div>
                            <span className={styles.txAmount} style={{ color: '#f44336' }}>-$100.00</span>
                        </div>
                        <div className={styles.transactionItem}>
                            <div className={styles.txInfo}>
                                <span className={styles.txLabel}>Service Fee</span>
                                <span className={styles.txDate}>Jan 08, 02:30 PM</span>
                            </div>
                            <span className={styles.txAmount} style={{ color: '#f44336' }}>-$0.05</span>
                        </div>
                    </div>
                </div>
            </div>
        </WindowFrame>
    );
};

export const InvestorWindow: React.FC<SoftwareWindowProps> = ({ isOpen, onClose, isFocused, onFocus }) => {
    if (!isOpen) return null;

    return (
        <WindowFrame
            id="investor"
            title="Investor Dashboard"
            onCloseClick={onClose}
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
                            <h4>Portfolio Value</h4>
                            <div className={styles.assetPrice}>$124,560.00</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '12px', color: '#28a745', fontWeight: 'bold' }}>+$12,450 (10.2%)</div>
                            <div style={{ fontSize: '10px', color: '#888' }}>Last 30 Days</div>
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
                        <div className={styles.statLabel}>S&P 500</div>
                        <div className={styles.statValue}>+2.45%</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Nasdaq</div>
                        <div className={styles.statValue}>+3.12%</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Tech Stocks</div>
                        <div className={styles.statValue} style={{ color: '#f44336' }}>-0.85%</div>
                    </div>
                </div>
            </div>
        </WindowFrame>
    );
};
