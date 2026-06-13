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

export type ScannedReceiptData = {
    description: string;
    amount: number;
    date: string; // "YYYY-MM-DD"
};

export const scanReceipt = async (file: File): Promise<ScannedReceiptData> => {
    const formData = new FormData();
    formData.append("receipt", file);
    const response = await api.post<{ success: boolean } & ScannedReceiptData>(
        "/api/expenses/scan-receipt",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
    return {
        description: response.data.description,
        amount: response.data.amount,
        date: response.data.date,
    };
};

export type ScanQuota = {
    userLimit: number;
    userUsed: number;
    userRemaining: number;
    canScan: boolean;
    resetsAt: string;
};

export const getScanQuota = async (): Promise<ScanQuota> => {
    const response = await api.get<{ success: boolean } & ScanQuota>(
        "/api/expenses/scan-receipt/quota"
    );
    return {
        userLimit: response.data.userLimit,
        userUsed: response.data.userUsed,
        userRemaining: response.data.userRemaining,
        canScan: response.data.canScan,
        resetsAt: response.data.resetsAt,
    };
};
