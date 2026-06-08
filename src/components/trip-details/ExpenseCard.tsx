import { Trash2, Calendar, MoreVertical, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Expense } from "@/types/expense";
import type { Participant } from "@/types/participant";

type ExpenseCardProps = {
    expense: Expense;
    participants: Participant[];
    currentUserId: string | undefined;
    isAdmin: boolean;
    onDelete: (expenseId: string) => void;
    onEdit?: (expense: Expense) => void;
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
    if (!paidBy) return "Unknown";

    // If paidBy is a populated object
    if (typeof paidBy === "object" && paidBy !== null) {
        return paidBy._id === currentUserId ? "You" : paidBy.displayName;
    }

    // If paidBy is a string (participant ID), find from participants
    const participant = participants.find((p) => p._id === paidBy);
    if (participant?.userId) {
        return participant.userId._id === currentUserId
            ? "You"
            : participant.userId.displayName || participant.userId.email;
    }

    return "Unknown";
};

export const ExpenseCard = ({
    expense,
    participants,
    currentUserId,
    isAdmin,
    onDelete,
    onEdit,
    isDeleting,
}: ExpenseCardProps) => {
    const paidByName = getPaidByName(expense.paidBy, participants, currentUserId);
    const paidById = expense.paidBy ? (typeof expense.paidBy === "object" ? (expense.paidBy as any)._id : expense.paidBy) : null;
    const canDelete = isAdmin || (paidById && paidById === currentUserId);

    return (
        <div className="group flex items-start gap-3 rounded-lg border bg-card p-3.5 transition-colors hover:bg-muted/30">
            {/* Amount badge */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="text-xs font-bold">
                    ₹
                </span>
            </div>

            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground truncate">
                        {expense.description}
                    </p>
                    <p className="text-sm font-bold text-foreground shrink-0">
                        {formatCurrency(expense.amount, "INR")}
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
                        {formatDate(expense.expenseDate || expense.createdAt)}
                    </div>
                </div>
            </div>

            {canDelete && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground shrink-0 -mr-1"
                            disabled={isDeleting}
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(expense)} className="cursor-pointer">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                            onClick={() => onDelete(expense._id)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
};
