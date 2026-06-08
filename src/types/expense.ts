export type Expense = {
    _id: string;
    tripId: string;
    description: string;
    amount: number;
    expenseDate: string;
    splitType?: "equal" | "custom" | string;
    splits?: { 
        participantId: string | { _id: string }; 
        share: number 
    }[];
    paidBy: {
        _id: string;
        displayName: string;
        email: string;
    } | string;
    createdAt: string;
    updatedAt: string;
};
