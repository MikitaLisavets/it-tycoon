// Banking Constants

export interface CreditOption {
    id: string;
    amount: number;
    termDays: number;     // Duration in game days
    interestRate: number; // Percentage (e.g., 10 for 10%)
}

export interface DepositOption {
    id: string;
    minAmount: number;
    interestRate: number; // Monthly percentage
    name: string;
}

export const CREDIT_OPTIONS: CreditOption[] = [
    {
        id: 'small_credit',
        amount: 500,
        termDays: 30,
        interestRate: 10,
    },
    {
        id: 'medium_credit',
        amount: 2000,
        termDays: 60,
        interestRate: 15,
    },
    {
        id: 'large_credit',
        amount: 10000,
        termDays: 90,
        interestRate: 20,
    },
];

export const DEPOSIT_OPTIONS: DepositOption[] = [
    {
        id: 'savings',
        name: 'Savings Account',
        minAmount: 100,
        interestRate: 2, // 2% monthly
    },
    {
        id: 'term_deposit',
        name: 'Term Deposit',
        minAmount: 500,
        interestRate: 5, // 5% monthly
    },
];

// How often interest is calculated (in game days)
export const DEPOSIT_INTEREST_PERIOD_DAYS = 30;

// Warning threshold - days before credit due date to warn
export const CREDIT_WARNING_DAYS = 3;
