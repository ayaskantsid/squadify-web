export type Expense = {
    _id: string;
    tripId: string;
    description: string;
    amount: number;
    currency: string;
    paidBy: {
        _id: string;
        displayName: string;
        email: string;
    } | string;
    createdAt: string;
    updatedAt: string;
};
