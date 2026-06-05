export type Settlement = {
    from: { _id: string; displayName: string };
    to: { _id: string; displayName: string };
    amount: number;
};

export type BalanceEntry = {
    userId: string;
    displayName: string;
    balance: number;
};

export type BalanceResponse = {
    totalSpent: number;
    balances: BalanceEntry[];
    settlements: Settlement[];
};
