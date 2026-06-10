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

// --- New settlement endpoint types ---

export type SettlementBalanceEntry = {
    participantId: string;
    name: string;
    balance: number;
};

export type SettlementTransaction = {
    from: string;
    fromId: string;
    to: string;
    toId: string;
    amount: number;
};

export type ParticipantStat = {
    participantId: string;
    name: string;
    totalSpent: number;
    paymentCount: number;
};

export type SettlementResponse = {
    balanceBeforeSettlement: SettlementBalanceEntry[];
    participantStats: ParticipantStat[];
    settlements: SettlementTransaction[];
};
