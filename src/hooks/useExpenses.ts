import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExpenses, createExpense, deleteExpense, updateExpense } from "@/api/expenses";
import { toast } from "sonner";

export const useExpenses = (tripId: string) => {
    return useQuery({
        queryKey: ["expenses", tripId],
        queryFn: () => getExpenses(tripId),
        enabled: !!tripId,
    });
};

export const useCreateExpense = (tripId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses", tripId] });
            queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
            queryClient.invalidateQueries({ queryKey: ["balances", tripId] });
            queryClient.invalidateQueries({ queryKey: ["settlements", tripId] });
            toast.success("Expense added successfully!");
        },
        onError: () => {
            toast.error("Failed to add expense. Please try again.");
        },
    });
};

export const useUpdateExpense = (tripId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses", tripId] });
            queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
            queryClient.invalidateQueries({ queryKey: ["balances", tripId] });
            queryClient.invalidateQueries({ queryKey: ["settlements", tripId] });
            toast.success("Expense updated successfully!");
        },
        onError: () => {
            toast.error("Failed to update expense. Please try again.");
        },
    });
};

export const useDeleteExpense = (tripId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses", tripId] });
            queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
            queryClient.invalidateQueries({ queryKey: ["balances", tripId] });
            queryClient.invalidateQueries({ queryKey: ["settlements", tripId] });
            toast.success("Expense deleted successfully.");
        },
        onError: () => {
            toast.error("Failed to delete expense. Please try again.");
        },
    });
};
