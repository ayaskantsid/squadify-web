import { useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, RefreshCw, ShieldX, SearchX, Receipt, UserPlus, Users, Plus, Trash2, PenLine, Scan } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/auth/AuthContext";
import { useTrip, useDeleteTrip } from "@/hooks/useTrips";
import { useParticipants, useInviteParticipant, useRemoveParticipant } from "@/hooks/useParticipants";
import { useExpenses, useDeleteExpense } from "@/hooks/useExpenses";
import type { Expense } from "@/types/expense";
import { TripHeader } from "@/components/trip-details/TripHeader";
import { ParticipantCard } from "@/components/trip-details/ParticipantCard";
import { ExpenseCard } from "@/components/trip-details/ExpenseCard";
import { InviteMemberModal } from "@/components/trip-details/InviteMemberModal";
import { TripDetailsSkeleton } from "@/components/trip-details/TripDetailsSkeleton";
import { AddExpenseModal } from "@/components/trip-details/AddExpenseModal";
import { scanReceipt } from "@/api/expenses";
import type { ScannedReceiptData } from "@/api/expenses";
import type { AxiosError } from "axios";

export const TripDetailsPage = () => {
    const { tripId } = useParams<{ tripId: string }>();
    const navigate = useNavigate();
    const { squadfishUser } = useAuth();

    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState<Expense | undefined>(undefined);
    const [scannedData, setScannedData] = useState<ScannedReceiptData | undefined>(undefined);
    const [isScanning, setIsScanning] = useState(false);
    const receiptInputRef = useRef<HTMLInputElement>(null);

    // --- Data fetching (parallel) ---
    const {
        data: trip,
        isLoading: tripLoading,
        isError: tripError,
        error: tripErrorObj,
        refetch: refetchTrip,
    } = useTrip(tripId!);

    const {
        data: participants,
        isLoading: participantsLoading,
    } = useParticipants(tripId!);

    const {
        data: expenses,
        isLoading: expensesLoading,
    } = useExpenses(tripId!);



    // --- Mutations ---
    const inviteMutation = useInviteParticipant();
    const removeMutation = useRemoveParticipant(tripId!);
    const deleteExpenseMutation = useDeleteExpense(tripId!);
    const deleteTripMutation = useDeleteTrip();

    // --- Derived state ---
    const isAdmin = participants?.some(
        (p) => p.userId?._id === squadfishUser?._id && p.role === "admin"
    ) ?? false;

    const acceptedParticipants = participants?.filter((p) => p.status === "accepted") ?? [];
    const pendingParticipants = participants?.filter((p) => p.status === "invited") ?? [];

    const participantCount = participants?.length ?? 0;

    // --- Error handling ---
    const errorStatus = (tripErrorObj as AxiosError)?.response?.status;

    if (tripLoading) {
        return <TripDetailsSkeleton />;
    }

    if (tripError) {
        if (errorStatus === 403) {
            return (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                        <ShieldX className="h-7 w-7 text-destructive" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-foreground">
                            Access Denied
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            You do not have access to this trip. You may need to accept an
                            invitation first.
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => navigate("/")}>
                        Back to Dashboard
                    </Button>
                </div>
            );
        }

        if (errorStatus === 404) {
            return (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <SearchX className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-foreground">
                            Trip Not Found
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            This trip doesn't exist or may have been deleted.
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => navigate("/")}>
                        Back to Dashboard
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="h-7 w-7 text-destructive" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-foreground">
                        Something went wrong
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        We couldn't load this trip. Please try again.
                    </p>
                </div>
                <Button variant="outline" onClick={() => refetchTrip()}>
                    <RefreshCw className="h-4 w-4 mr-1.5" />
                    Retry
                </Button>
            </div>
        );
    }

    if (!trip) return null;

    // --- Handlers ---
    const handleInvite = (email: string) => {
        inviteMutation.mutate(
            { tripId: tripId!, email: email },
            { onSuccess: () => setInviteModalOpen(false) }
        );
    };

    const handleRemoveParticipant = (participantId: string) => {
        removeMutation.mutate(participantId);
    };

    const handleDeleteExpense = (expenseId: string) => {
        deleteExpenseMutation.mutate(expenseId);
    };

    const handleDeleteTrip = () => {
        deleteTripMutation.mutate(tripId!);
    };

    const handleAddExpense = () => {
        setExpenseToEdit(undefined);
        setScannedData(undefined);
        setAddExpenseModalOpen(true);
    };

    const handleEditExpense = (expense: Expense) => {
        setExpenseToEdit(expense);
        setScannedData(undefined);
        setAddExpenseModalOpen(true);
    };

    const handleScanReceipt = useCallback(() => {
        receiptInputRef.current?.click();
    }, []);

    const handleReceiptFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Reset input so the same file can be picked again later
        e.target.value = "";

        setIsScanning(true);
        try {
            const result = await scanReceipt(file);
            setScannedData(result);
            setExpenseToEdit(undefined);
            setAddExpenseModalOpen(true);
        } catch {
            toast.error("Unable to read receipt.", {
                description: "Try another photo or add the expense manually.",
            });
        } finally {
            setIsScanning(false);
        }
    }, []);

    return (
        <div className="space-y-6 pb-20 sm:pb-6">
            {/* Hidden receipt file input */}
            <input
                ref={receiptInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleReceiptFileChange}
                aria-hidden="true"
            />

            {/* Scanning overlay */}
            {isScanning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-8 shadow-xl text-center">
                        <div className="relative">
                            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                                <Scan className="h-7 w-7 text-primary animate-pulse" />
                            </div>
                            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold text-foreground">Scanning receipt...</p>
                            <p className="text-sm text-muted-foreground">This will just take a moment</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 1. Trip Header */}
            <TripHeader
                trip={trip}
                isAdmin={isAdmin}
                onAddExpense={handleAddExpense}
                onScanReceipt={handleScanReceipt}
                onDeleteTrip={() => setDeleteDialogOpen(true)}
            />



            {/* 3. Participants Section */}
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Participants
                        {participants && (
                            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                {participants.length}
                            </span>
                        )}
                    </h2>
                    {isAdmin && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setInviteModalOpen(true)}
                            className="text-xs"
                        >
                            <UserPlus className="h-3.5 w-3.5 mr-1" />
                            Invite
                        </Button>
                    )}
                </div>

                {participantsLoading ? (
                    <div className="space-y-2">
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className="h-16 rounded-lg border bg-muted/30 animate-pulse"
                            />
                        ))}
                    </div>
                ) : participants && participants.length > 0 ? (
                    <div className="space-y-2">
                        {/* Accepted first, then pending */}
                        {acceptedParticipants.map((p) => (
                            <ParticipantCard
                                key={p._id}
                                participant={p}
                                isAdmin={isAdmin}
                                currentUserId={squadfishUser?._id}
                                onRemove={handleRemoveParticipant}
                                isRemoving={removeMutation.isPending}
                            />
                        ))}
                        {pendingParticipants.length > 0 && (
                            <>
                                <p className="text-xs text-muted-foreground pt-1">
                                    Pending Invitations
                                </p>
                                {pendingParticipants.map((p) => (
                                    <ParticipantCard
                                        key={p._id}
                                        participant={p}
                                        isAdmin={isAdmin}
                                        currentUserId={squadfishUser?._id}
                                        onRemove={handleRemoveParticipant}
                                        isRemoving={removeMutation.isPending}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed p-6 text-center">
                        <Users className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No participants yet.</p>
                        {isAdmin && (
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => setInviteModalOpen(true)}
                                className="mt-1 text-xs"
                            >
                                Invite your first member
                            </Button>
                        )}
                    </div>
                )}
            </section>

            {/* 4. Expenses Section */}
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Receipt className="h-4 w-4" />
                        Expenses
                        {expenses && (
                            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                {expenses.length}
                            </span>
                        )}
                    </h2>
                </div>

                {expensesLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-[72px] rounded-lg border bg-muted/30 animate-pulse"
                            />
                        ))}
                    </div>
                ) : expenses && expenses.length > 0 ? (
                    <div className="space-y-2">
                        {expenses.map((expense) => (
                            <ExpenseCard
                                key={expense._id}
                                expense={expense}
                                participants={participants ?? []}
                                currentUserId={squadfishUser?._id}
                                isAdmin={isAdmin}
                                onDelete={handleDeleteExpense}
                                onEdit={handleEditExpense}
                                isDeleting={deleteExpenseMutation.isPending}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed p-6 text-center">
                        <Receipt className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                            No expenses yet.
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Add your first expense to get started.
                        </p>
                    </div>
                )}
            </section>

            {/* Sticky mobile Add Expense button */}
            <div className="fixed bottom-18 right-4 sm:hidden z-40">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size="lg"
                            className="rounded-full h-14 w-14 shadow-lg shadow-primary/25"
                            disabled={isScanning}
                        >
                            <Plus className="h-6 w-6" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={10}>
                        <DropdownMenuItem onClick={handleAddExpense}>
                            <PenLine className="mr-2 h-4 w-4" />
                            <span>Add Expense</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleScanReceipt}>
                            <Scan className="mr-2 h-4 w-4" />
                            <span>Scan Receipt</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Invite Member Modal */}
            <InviteMemberModal
                open={inviteModalOpen}
                onOpenChange={setInviteModalOpen}
                onInvite={handleInvite}
                isPending={inviteMutation.isPending}
            />

            {/* Add/Edit Expense Modal */}
            <AddExpenseModal
                open={addExpenseModalOpen}
                onOpenChange={(open) => {
                    setAddExpenseModalOpen(open);
                    if (!open) {
                        setExpenseToEdit(undefined);
                        setScannedData(undefined);
                    }
                }}
                tripId={tripId!}
                participants={participants ?? []}
                currentUserId={squadfishUser?._id}
                expenseToEdit={expenseToEdit}
                scannedData={scannedData}
            />

            {/* Delete Trip Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <Trash2 className="h-5 w-5" />
                            Delete Trip
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{trip.name}</strong>?
                            {participantCount > 1 && (
                                <span className="block mt-1.5 text-destructive/80">
                                    This will also remove all {participantCount - 1} participant{participantCount - 1 > 1 ? "s" : ""} and their data.
                                </span>
                            )}
                            <span className="block mt-1.5">This action cannot be undone.</span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deleteTripMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteTrip}
                            disabled={deleteTripMutation.isPending}
                        >
                            {deleteTripMutation.isPending ? "Deleting..." : "Delete Trip"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
