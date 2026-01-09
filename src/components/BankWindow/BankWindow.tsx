import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import WindowFrame from '../WindowFrame/WindowFrame';
import HelpModal from '../HelpModal/HelpModal';
import { useAudio } from '@/hooks/useAudio';
import { useGameState } from '../../hooks/useGameState';
import { CREDIT_OPTIONS, DEPOSIT_OPTIONS, CREDIT_WARNING_DAYS } from '@/lib/game/constants/banking';
import { CreditRecord, DepositRecord, GameDate } from '@/lib/game/types';
import { formatNumberWithSuffix } from '@/lib/game/utils/number-formatter';
import styles from './BankWindow.module.css';

interface BankWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onReset?: () => void;
    isFocused?: boolean;
    onFocus?: () => void;
}

type Tab = 'credits' | 'deposits';

// Helper to compare game dates
function compareDates(a: GameDate, b: GameDate): number {
    const aVal = a.year * 10000 + a.month * 100 + a.day;
    const bVal = b.year * 10000 + b.month * 100 + b.day;
    return aVal - bVal;
}

// Calculate due date from current date + term days
function calculateDueDate(currentDate: GameDate, termDays: number): GameDate {
    let day = currentDate.day + termDays;
    let month = currentDate.month;
    let year = currentDate.year;

    while (day > 30) {
        day -= 30;
        month += 1;
        if (month > 12) {
            month = 1;
            year += 1;
        }
    }

    return { day, month, year, hour: 0, minute: 0 };
}

// Days remaining until due date
function daysUntilDue(currentDate: GameDate, dueDate: GameDate): number {
    const currentDays = currentDate.year * 360 + currentDate.month * 30 + currentDate.day;
    const dueDays = dueDate.year * 360 + dueDate.month * 30 + dueDate.day;
    return dueDays - currentDays;
}

// Generate unique ID
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

const BankWindow: React.FC<BankWindowProps> = ({ isOpen, onClose, onReset, isFocused, onFocus }) => {
    const { state, updateState } = useGameState();
    const audio = useAudio();
    const t = useTranslations();
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('credits');
    const [depositAmounts, setDepositAmounts] = useState<Record<string, string>>({});

    if (!isOpen) return null;

    const handleTakeCredit = (optionId: string) => {
        // Restriction: Only one active credit allowed
        if (state.banking.credits.length > 0) return;

        const option = CREDIT_OPTIONS.find(o => o.id === optionId);
        if (!option) return;

        const totalDue = option.amount * (1 + option.interestRate / 100);
        const newCredit: CreditRecord = {
            id: generateId(),
            amount: option.amount,
            totalDue,
            interestRate: option.interestRate,
            takenAt: { ...state.date },
            dueDate: calculateDueDate(state.date, option.termDays),
            termDays: option.termDays,
        };

        updateState({
            money: state.money + option.amount,
            banking: {
                ...state.banking,
                credits: [...state.banking.credits, newCredit],
            },
        });
    };

    const handleRepayCredit = (creditId: string) => {
        const credit = state.banking.credits.find(c => c.id === creditId);
        if (!credit) return;

        if (state.money < credit.totalDue) return; // Can't afford

        updateState({
            money: state.money - credit.totalDue,
            banking: {
                ...state.banking,
                credits: state.banking.credits.filter(c => c.id !== creditId),
            },
        });
    };

    const handleDeposit = (optionId: string) => {
        // Restriction: Only one active deposit allowed
        if (state.banking.deposits.length > 0) return;

        const option = DEPOSIT_OPTIONS.find(o => o.id === optionId);
        if (!option) return;

        const amount = parseFloat(depositAmounts[optionId] || '0');
        if (isNaN(amount) || amount < option.minAmount || amount > state.money) return;

        const newDeposit: DepositRecord = {
            id: generateId(),
            amount,
            interestRate: option.interestRate,
            startDate: { ...state.date },
            accumulatedInterest: 0,
        };

        updateState({
            money: state.money - amount,
            banking: {
                ...state.banking,
                deposits: [...state.banking.deposits, newDeposit],
            },
        });
        setDepositAmounts(prev => ({ ...prev, [optionId]: '' }));
    };

    const handleWithdraw = (depositId: string) => {
        const deposit = state.banking.deposits.find(d => d.id === depositId);
        if (!deposit) return;

        const totalAmount = deposit.amount + deposit.accumulatedInterest;

        updateState({
            money: state.money + totalAmount,
            banking: {
                ...state.banking,
                deposits: state.banking.deposits.filter(d => d.id !== depositId),
            },
        });
    };

    const formatDate = (date: GameDate) => `${date.day}/${date.month}/${date.year}`;

    const tabList = [
        { id: 'credits' as const, label: t('Bank.tab_credits') },
        { id: 'deposits' as const, label: t('Bank.tab_deposits') },
    ];

    return (
        <>
            <WindowFrame
                id="bank_window"
                title={t('Bank.title')}
                onCloseClick={onClose}
                onResetClick={onReset}
                onHelpClick={() => setIsHelpOpen(true)}
                width="500px"
                isFocused={isFocused}
                onFocus={onFocus}
            >
                <div className={styles.atmContainer}>
                    <div className={styles.atmScreen}>
                        {/* Balance Display */}
                        <div className={styles.balanceDisplay}>
                            <span className={styles.balanceLabel}>{t('Bank.balance')}:</span>
                            <span className={styles.balanceValue}>${formatNumberWithSuffix(state.money)}</span>
                        </div>

                        <div className={styles.tabsContainer}>
                            {tabList.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`${styles.atmTab} ${activeTab === tab.id ? styles.atmTabActive : ''}`}
                                    onClick={() => {
                                        audio.playClick();
                                        setActiveTab(tab.id);
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className={styles.content}>
                            {activeTab === 'credits' && (
                                <div className={styles.terminalSection}>
                                    <div className={styles.sectionHeader}>{t('Bank.available_credits')}</div>

                                    {/* Active Credits */}
                                    {state.banking.credits.length > 0 && (
                                        <div className={styles.activeSection}>
                                            <div className={styles.activeTitle}>{t('Bank.active_credits')}</div>
                                            {state.banking.credits.map(credit => {
                                                const remaining = daysUntilDue(state.date, credit.dueDate);
                                                const isWarning = remaining <= CREDIT_WARNING_DAYS;
                                                const canRepay = state.money >= credit.totalDue;

                                                return (
                                                    <div
                                                        key={credit.id}
                                                        className={`${styles.activeItem} ${isWarning ? styles.warning : ''}`}
                                                    >
                                                        <div className={styles.activeItemInfo}>
                                                            <div className={styles.activeItemTitle}>
                                                                ${formatNumberWithSuffix(credit.totalDue)} {t('Bank.due')}
                                                            </div>
                                                            <div className={`${styles.activeItemDetails} ${isWarning ? styles.dueSoon : ''}`}>
                                                                {t('Bank.due_date')}: {formatDate(credit.dueDate)} ({remaining} {t('Bank.days_left')})
                                                            </div>
                                                        </div>
                                                        <button
                                                            className={styles.repayButton}
                                                            onClick={() => {
                                                                audio.playClick();
                                                                handleRepayCredit(credit.id);
                                                            }}
                                                            disabled={!canRepay}
                                                        >
                                                            {t('Bank.repay_now')}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {CREDIT_OPTIONS.map(option => {
                                        const hasActiveCredit = state.banking.credits.length > 0;
                                        return (
                                            <div key={option.id} className={`${styles.optionCard} ${hasActiveCredit ? styles.disabledOption : ''}`}>
                                                <div className={styles.optionInfo}>
                                                    <div className={styles.optionTitle}>
                                                        ${formatNumberWithSuffix(option.amount)}
                                                    </div>
                                                    <div className={styles.optionDetails}>
                                                        <span className={styles.optionDetail}>
                                                            <span>{t('Bank.term')}:</span> {option.termDays} {t('Bank.days')}
                                                        </span>
                                                        <span className={styles.optionDetail}>
                                                            <span>{t('Bank.interest')}:</span> {option.interestRate}%
                                                        </span>
                                                        <span className={styles.optionDetail}>
                                                            <span>{t('Bank.repay')}:</span> ${formatNumberWithSuffix(option.amount * (1 + option.interestRate / 100))}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    className={styles.actionButton}
                                                    onClick={() => {
                                                        audio.playClick();
                                                        handleTakeCredit(option.id);
                                                    }}
                                                    disabled={hasActiveCredit}
                                                >
                                                    {t('Bank.take_credit')}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {activeTab === 'deposits' && (
                                <div className={styles.terminalSection}>
                                    <div className={styles.sectionHeader}>{t('Bank.deposit_options')}</div>

                                    {/* Active Deposits */}
                                    {state.banking.deposits.length > 0 && (
                                        <div className={styles.activeSection}>
                                            <div className={styles.activeTitle}>{t('Bank.active_deposits')}</div>
                                            {state.banking.deposits.map(deposit => {
                                                const total = deposit.amount + deposit.accumulatedInterest;

                                                return (
                                                    <div key={deposit.id} className={styles.activeItem}>
                                                        <div className={styles.activeItemInfo}>
                                                            <div className={styles.activeItemTitle}>
                                                                ${formatNumberWithSuffix(total)}
                                                            </div>
                                                            <div className={styles.activeItemDetails}>
                                                                {t('Bank.principal')}: ${formatNumberWithSuffix(deposit.amount)}{' '}|{' '}
                                                                {t('Bank.interest_earned')}: ${formatNumberWithSuffix(deposit.accumulatedInterest)}
                                                            </div>
                                                        </div>
                                                        <button
                                                            className={styles.repayButton}
                                                            onClick={() => {
                                                                audio.playClick();
                                                                handleWithdraw(deposit.id);
                                                            }}
                                                        >
                                                            {t('Bank.withdraw')}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {state.banking.deposits.length === 0 && (
                                        <div className={styles.emptyState}>{t('Bank.no_deposits')}</div>
                                    )}

                                    {DEPOSIT_OPTIONS.map(option => {
                                        const inputAmount = parseFloat(depositAmounts[option.id] || '0');
                                        const canDeposit = inputAmount >= option.minAmount && inputAmount <= state.money;
                                        const hasActiveDeposit = state.banking.deposits.length > 0;
                                        return (
                                            <div key={option.id} className={`${styles.optionCard} ${hasActiveDeposit ? styles.disabledOption : ''}`}>
                                                <div className={styles.optionInfo}>
                                                    <div className={styles.optionTitle}>{t(`Bank.${option.id}`)}</div>
                                                    <div className={styles.optionDetails}>
                                                        <span className={styles.optionDetail}>
                                                            <span>{t('Bank.min')}:</span> ${option.minAmount}
                                                        </span>
                                                        <span className={styles.optionDetail}>
                                                            <span>{t('Bank.monthly_interest')}:</span> {option.interestRate}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={styles.depositInput}>
                                                    <input
                                                        type="number"
                                                        className={styles.inputField}
                                                        placeholder={`${t('Bank.amount')}...`}
                                                        value={depositAmounts[option.id] || ''}
                                                        onChange={(e) => setDepositAmounts(prev => ({ ...prev, [option.id]: e.target.value }))}
                                                        min={option.minAmount}
                                                        max={state.money}
                                                        disabled={hasActiveDeposit}
                                                    />
                                                    <button
                                                        className={styles.actionButton}
                                                        onClick={() => {
                                                            audio.playClick();
                                                            handleDeposit(option.id);
                                                        }}
                                                        disabled={!canDeposit || hasActiveDeposit}
                                                    >
                                                        {t('Bank.deposit')}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </WindowFrame>

            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title={t('Bank.title')}
                content={t('Bank.help_content')}
            />
        </>
    );
};

export default BankWindow;
