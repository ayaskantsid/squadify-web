export type Trip = {
    _id: string;
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    totalExpense?: number;
    noOfExpenses?: number;
};
