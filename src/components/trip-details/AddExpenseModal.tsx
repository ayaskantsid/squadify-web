import { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt, AlignLeft, DollarSign, User, Calendar, Split, CheckSquare } from "lucide-react";
import type { Participant } from "@/types/participant";
import { useCreateExpense, useUpdateExpense } from "@/hooks/useExpenses";
import type { Expense } from "@/types/expense";

const expenseSchema = z.object({
    description: z.string().max(100, "Description is too long").optional(),
    amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
    expenseDate: z.string().min(1, "Date is required"),
    paidBy: z.string().min(1, "Paid By is required"),
    isCustomSplit: z.boolean().default(false),
    splits: z.array(
        z.object({
            participantId: z.string(),
            name: z.string().optional(),
            selected: z.boolean(),
            share: z.coerce.number().min(0).optional(),
        })
    ).optional()
}).refine(data => {
    if (data.isCustomSplit && data.splits) {
        const selectedSplits = data.splits.filter(s => s.selected);
        const totalSplitAmount = selectedSplits.reduce((acc, s) => acc + (s.share || 0), 0);
        // Compare with a small epsilon for float safety
        return Math.abs(totalSplitAmount - data.amount) < 0.01;
    }
    return true;
}, {
    message: "The sum of all selected participants' splits must exactly equal the total expense amount.",
    path: ["splits"]
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

type AddExpenseModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tripId: string;
    participants: Participant[];
    currentUserId?: string;
    expenseToEdit?: Expense;
};

// Helper to convert date to YYYY-MM-DD string
const toDateInputValue = (date: Date) => {
    return date.toISOString().split("T")[0];
};

export const AddExpenseModal = ({
    open,
    onOpenChange,
    tripId,
    participants,
    currentUserId,
    expenseToEdit,
}: AddExpenseModalProps) => {
    const { mutate: createExpense, isPending: isCreating } = useCreateExpense(tripId);
    const { mutate: updateExpense, isPending: isUpdating } = useUpdateExpense(tripId);

    const isPending = isCreating || isUpdating;
    const isEditMode = !!expenseToEdit;

    const acceptedParticipants = participants.filter((p) => p.status === "accepted" && p.userId);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseSchema) as any,
        defaultValues: {
            description: "",
            amount: undefined as unknown as number,
            expenseDate: toDateInputValue(new Date()),
            paidBy: "",
            isCustomSplit: false,
            splits: [],
        },
    });

    const { fields } = useFieldArray({
        control,
        name: "splits",
    });

    const isCustomSplit = useWatch({ control, name: "isCustomSplit" });
    const splitsWatch = useWatch({ control, name: "splits" });
    const amountWatch = useWatch({ control, name: "amount" });

    // Initialize form when opened or expenseToEdit changes
    useEffect(() => {
        if (open) {
            let initialSplits;
            let isCustomSplit = false;

            if (expenseToEdit && expenseToEdit.splits && expenseToEdit.splits.length > 0) {
                // Determine if custom split based on splitType or fallback to inference
                if (expenseToEdit.splitType === "custom") {
                    isCustomSplit = true;
                } else if (expenseToEdit.splitType === "equal") {
                    isCustomSplit = false;
                } else {
                    // Fallback inference: if shares are not all equal, OR not all accepted participants are included, it's custom
                    const firstShare = expenseToEdit.splits[0].share;
                    const allEqual = expenseToEdit.splits.every(s => Math.abs(s.share - firstShare) < 0.01);
                    const includesAllParticipants = expenseToEdit.splits.length === acceptedParticipants.length;
                    isCustomSplit = !allEqual || !includesAllParticipants;
                }

                initialSplits = acceptedParticipants.map(p => {
                    const existingSplit = expenseToEdit.splits?.find(s => {
                        const sId = typeof s.participantId === 'object' ? s.participantId._id : s.participantId;
                        return sId === p._id;
                    });
                    return {
                        participantId: p._id,
                        name: p.userId?.displayName || p.userId?.email || "Unknown User",
                        selected: !!existingSplit,
                        share: existingSplit ? existingSplit.share : 0,
                    };
                });
            } else {
                initialSplits = acceptedParticipants.map(p => ({
                    participantId: p._id,
                    name: p.userId?.displayName || p.userId?.email || "Unknown User",
                    selected: true,
                    share: 0,
                }));
            }

            const currentUserParticipant = acceptedParticipants.find(p => p.userId?._id === currentUserId);

            // Resolve paidBy: expenseToEdit.paidBy can be an object or string
            let paidById = currentUserParticipant?._id || "";
            if (expenseToEdit?.paidBy) {
                paidById = typeof expenseToEdit.paidBy === "object" ? (expenseToEdit.paidBy as any)._id : expenseToEdit.paidBy;
            }

            reset({
                description: expenseToEdit?.description || "",
                amount: expenseToEdit?.amount || undefined,
                expenseDate: expenseToEdit?.expenseDate
                    ? toDateInputValue(new Date(expenseToEdit.expenseDate))
                    : toDateInputValue(new Date()),
                paidBy: paidById,
                isCustomSplit: isCustomSplit,
                splits: initialSplits,
            });
        }
    }, [open, currentUserId, reset, participants, expenseToEdit]); // Include participants in deps if they update

    const onSubmit = (data: ExpenseFormValues) => {
        let finalSplits: { participantId: string; share: number }[] | undefined = undefined;

        if (data.isCustomSplit && data.splits) {
            finalSplits = data.splits
                .filter(s => s.selected)
                .map(s => ({
                    participantId: s.participantId,
                    share: s.share || 0,
                }));
        }

        const payload = {
            description: data.description,
            amount: data.amount,
            expenseDate: data.expenseDate,
            paidBy: data.paidBy,
            ...(finalSplits && finalSplits.length > 0 ? { splits: finalSplits } : { splits: [] }) // send empty array to clear splits if switched back to equal
        };

        if (isEditMode) {
            updateExpense(
                {
                    expenseId: expenseToEdit._id,
                    data: payload
                },
                {
                    onSuccess: () => {
                        handleOpenChange(false);
                    },
                }
            );
        } else {
            createExpense(
                {
                    tripId,
                    ...payload
                },
                {
                    onSuccess: () => {
                        handleOpenChange(false);
                    },
                }
            );
        }
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) reset();
        onOpenChange(nextOpen);
    };

    // Calculate dynamic totals for custom splits
    const totalAmount = amountWatch || 0;
    const currentSplitTotal = (splitsWatch || [])
        .filter(s => s.selected)
        .reduce((sum, s) => sum + (Number(s.share) || 0), 0);
    const isSplitValid = Math.abs(currentSplitTotal - totalAmount) < 0.01;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md overflow-hidden max-h-[90vh] flex flex-col">
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 animate-orb-slow pointer-events-none">
                    <div className="relative opacity-50">
                        <div className="absolute -left-5 -top-1 w-8 h-12 bg-primary/5 rounded-[50%]" />
                        <div className="absolute -left-5 -bottom-1 w-8 h-12 bg-primary/5 rounded-[50%]" />
                        <div className="w-24 h-16 bg-primary/5 rounded-[50%]" />
                    </div>
                </div>

                <DialogHeader className="relative z-10 shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <Receipt className="h-5 w-5 text-primary" />
                        {isEditMode ? "Edit Expense" : "Add Expense"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode ? "Update details for this expense." : "Record a new expense for this trip."}
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 pr-1 -mr-1">
                    <form id="add-expense-form" onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 relative z-10 py-1">

                        {/* Expense Name */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                                    <AlignLeft className="h-3.5 w-3.5 text-primary" />
                                </div>
                                Expense Name
                                <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                            </Label>
                            <Input
                                id="description"
                                placeholder="e.g. Dinner, Taxi, Hotel"
                                className="h-11"
                                {...register("description")}
                            />
                            {errors.description && (
                                <p className="text-xs text-destructive">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* Amount & Date */}
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-2 min-w-0">
                                <Label htmlFor="amount" className="flex items-center gap-2 text-sm font-medium">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                                        <DollarSign className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    Total Amount (₹)
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="h-11"
                                    {...register("amount")}
                                />
                                {errors.amount && (
                                    <p className="text-xs text-destructive">
                                        {errors.amount.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 min-w-0">
                                <Label htmlFor="expenseDate" className="flex items-center gap-2 text-sm font-medium">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                                        <Calendar className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    Date
                                </Label>
                                <Input
                                    id="expenseDate"
                                    type="date"
                                    className="h-11 w-full appearance-none m-0 max-w-[100%]"
                                    {...register("expenseDate")}
                                />
                                {errors.expenseDate && (
                                    <p className="text-xs text-destructive">
                                        {errors.expenseDate.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Paid By */}
                        <div className="space-y-2">
                            <Label htmlFor="paidBy" className="flex items-center gap-2 text-sm font-medium">
                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                                    <User className="h-3.5 w-3.5 text-primary" />
                                </div>
                                Paid By
                            </Label>
                            <select
                                id="paidBy"
                                className="flex h-11 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                {...register("paidBy")}
                            >
                                <option value="" disabled>Select a participant</option>
                                {acceptedParticipants.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.userId?._id === currentUserId
                                            ? "Me"
                                            : p.userId?.displayName || p.userId?.email || "Unknown User"}
                                    </option>
                                ))}
                            </select>
                            {errors.paidBy && (
                                <p className="text-xs text-destructive">
                                    {errors.paidBy.message}
                                </p>
                            )}
                        </div>

                        {/* Custom Split Toggle */}
                        <div className="pt-2">
                            <label className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 shrink-0">
                                    <Split className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1 space-y-0.5">
                                    <p className="text-sm font-medium">Custom Split</p>
                                    <p className="text-xs text-muted-foreground">Split unequally among specific members</p>
                                </div>
                                <div className="shrink-0 flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded border-primary/50 text-primary focus:ring-primary accent-primary"
                                        {...register("isCustomSplit")}
                                    />
                                </div>
                            </label>
                        </div>

                        {/* Custom Splits Fields */}
                        {isCustomSplit && (
                            <div className="space-y-3 pt-2 pl-2 border-l-2 border-muted">
                                <div className="flex justify-between items-center px-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Participants
                                    </p>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Share (₹)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    {fields.map((field, index) => {
                                        const isSelected = splitsWatch?.[index]?.selected;
                                        const name = splitsWatch?.[index]?.name || "User";

                                        return (
                                            <div key={field.id} className="flex items-center gap-3">
                                                <label className="flex flex-1 items-center gap-2.5 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-primary/50 text-primary focus:ring-primary accent-primary"
                                                        {...register(`splits.${index}.selected` as const)}
                                                    />
                                                    <span className={`text-sm truncate ${!isSelected ? 'text-muted-foreground line-through opacity-70' : 'font-medium'}`}>
                                                        {name}
                                                    </span>
                                                </label>

                                                <div className="w-24 shrink-0">
                                                    {isSelected ? (
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                            className="h-9 text-right"
                                                            {...register(`splits.${index}.share` as const)}
                                                        />
                                                    ) : (
                                                        <div className="h-9 w-full rounded-md border border-dashed border-muted flex items-center justify-end px-3 text-muted-foreground/50 text-sm">
                                                            -
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Splits Totals & Validation */}
                                <div className={`flex items-center justify-between p-3 rounded-md mt-4 ${isSplitValid ? 'bg-primary/5 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                                    <span className="text-sm font-medium">Allocated Total:</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold">
                                            ₹{currentSplitTotal.toFixed(2)} / ₹{(Number(totalAmount) || 0).toFixed(2)}
                                        </span>
                                        {isSplitValid ? (
                                            <CheckSquare className="h-4 w-4" />
                                        ) : (
                                            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-destructive/20">
                                                Diff: ₹{Math.abs(Number(totalAmount) - currentSplitTotal).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {errors.splits && (
                                    <p className="text-xs text-destructive text-center font-medium px-2">
                                        {errors.splits.message}
                                    </p>
                                )}
                            </div>
                        )}
                    </form>
                </div>

                <DialogFooter className="gap-2 sm:gap-4 pt-4 mt-2 border-t shrink-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" form="add-expense-form" disabled={isPending || (isCustomSplit && !isSplitValid)}>
                        {isPending ? (isEditMode ? "Saving..." : "Adding...") : (isEditMode ? "Save Changes" : "Add Expense")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
