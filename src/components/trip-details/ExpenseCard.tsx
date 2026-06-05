import { Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Expense } from "@/types/expense";
import type { Participant } from "@/types/participant";

type ExpenseCardProps = {
    expense: Expense;
    participants: Participant[];
    currentUserId: string | undefined;
    isAdmin: boolean;
    onDelete: (expenseId: string) => void;
    isDeleting: boolean;
};

const formatCurrency = (amount: number, currency: string) => {
    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${currency} ${amount.toFixed(2)}`;
    }
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const getPaidByName = (
    paidBy: Expense["paidBy"],
    participants: Participant[],
    currentUserId: string | undefined
): string => {
    // If paidBy is a populated object
    if (typeof paidBy === "object" && paidBy !== null) {
        return paidBy._id === currentUserId ? "You" : paidBy.displayName;
    }

    // If paidBy is a string (user ID), find from participants
    const participant = participants.find((p) => p.userId?._id === paidBy);
    if (participant?.userId) {
        return participant.userId._id === currentUserId
            ? "You"
            : participant.userId.displayName;
    }

    return "Unknown";
};

export const ExpenseCard = ({
    expense,
    participants,
    currentUserId,
    isAdmin,
    onDelete,
    isDeleting,
}: ExpenseCardProps) => {
    const paidByName = getPaidByName(expense.paidBy, participants, currentUserId);
    const paidById = typeof expense.paidBy === "object" ? expense.paidBy._id : expense.paidBy;
    const canDelete = isAdmin || paidById === currentUserId;

    return (
        <div className="group flex items-start gap-3 rounded-lg border bg-card p-3.5 transition-colors hover:bg-muted/30">
            {/* Amount badge */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="text-xs font-bold">
                    {expense.currency === "INR" ? "₹" : expense.currency.charAt(0)}
                </span>
            </div>

            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground truncate">
                        {expense.description}
                    </p>
                    <p className="text-sm font-bold text-foreground shrink-0">
                        {formatCurrency(expense.amount, expense.currency)}
                    </p>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">
                        Paid by{" "}
                        <span className="font-medium text-foreground/80">
                            {paidByName}
                        </span>
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <Calendar className="h-3 w-3" />
                        {formatDate(expense.createdAt)}
                    </div>
                </div>
            </div>

            {canDelete && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDelete(expense._id)}
                    disabled={isDeleting}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            )}
        </div>
    );
};
