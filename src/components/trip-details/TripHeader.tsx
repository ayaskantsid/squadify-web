import {
    CalendarDays,
    Receipt,
    Plus,
    UserPlus,
    Pencil,
    Trash2,
    ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Trip } from "@/types/trip";

type TripHeaderProps = {
    trip: Trip;
    isAdmin: boolean;
    onAddExpense: () => void;
    onInviteMember: () => void;
    onDeleteTrip: () => void;
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const TripHeader = ({
    trip,
    isAdmin,
    onAddExpense,
    onInviteMember,
    onDeleteTrip,
}: TripHeaderProps) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-4">
            {/* Back navigation */}
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors -ml-1"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to trips
            </button>

            {/* Hero card */}
            <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary/5 via-background to-primary/[0.02] p-5 sm:p-6">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/3 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative space-y-4">
                    {/* Title area */}
                    <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-3">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                                {trip.name}
                            </h1>
                            {isAdmin && (
                                <Badge variant="default" className="shrink-0 text-[10px]">
                                    Admin
                                </Badge>
                            )}
                        </div>
                        {trip.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {trip.description}
                            </p>
                        )}
                    </div>

                    {/* Date range */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        <span>
                            {formatDate(trip.startDate)}
                            {trip.endDate && ` — ${formatDate(trip.endDate)}`}
                        </span>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="space-y-0.5">
                            <p className="text-lg sm:text-xl font-bold text-foreground">
                                {formatCurrency(trip.totalExpense ?? 0)}
                            </p>
                            <p className="text-xs text-muted-foreground">Total Spent</p>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                                <Receipt className="h-4 w-4 text-muted-foreground" />
                                <p className="text-lg sm:text-xl font-bold text-foreground">
                                    {trip.noOfExpenses ?? 0}
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">Expenses</p>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Button size="sm" onClick={onAddExpense}>
                            <Plus className="h-4 w-4 mr-1.5" />
                            Add Expense
                        </Button>
                        {isAdmin && (
                            <Button size="sm" variant="outline" onClick={onInviteMember}>
                                <UserPlus className="h-4 w-4 mr-1.5" />
                                Invite Member
                            </Button>
                        )}
                        {isAdmin && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => navigate(`/trips/${trip._id}/edit`)}
                            >
                                <Pencil className="h-4 w-4 mr-1.5" />
                                Edit
                            </Button>
                        )}
                        {isAdmin && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={onDeleteTrip}
                            >
                                <Trash2 className="h-4 w-4 mr-1.5" />
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
