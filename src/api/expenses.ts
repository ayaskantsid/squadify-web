import api from "./apiClient";
import type { Expense } from "@/types/expense";

export const getExpenses = async (tripId: string): Promise<Expense[]> => {
    const response = await api.get<Expense[]>(`/api/expenses/trip/${tripId}`);
    return response.data;
};

export const createExpense = async (data: {
    tripId: string;
    description?: string;
    amount: number;
    expenseDate: string;
    splits?: { participantId: string; share: number }[];
    paidBy: string;
}): Promise<Expense> => {
    const response = await api.post<Expense>("/api/expenses", data);
    return response.data;
};

export const updateExpense = async ({
    expenseId,
    data,
}: {
    expenseId: string;
    data: { description?: string; amount?: number; expenseDate?: string; splits?: { participantId: string; share: number }[], paidBy?: string };
}): Promise<Expense> => {
    const response = await api.put<Expense>(`/api/expenses/${expenseId}`, data);
    return response.data;
};

export const deleteExpense = async (expenseId: string): Promise<void> => {
    await api.delete(`/api/expenses/${expenseId}`);
};
