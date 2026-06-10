import {
    CalendarDays,
    Receipt,
    Plus,
    Pencil,
    Trash2,
    ArrowLeft,
    HandCoins,
    PenLine,
    Scan
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Trip } from "@/types/trip";

type TripHeaderProps = {
    trip: Trip;
    isAdmin: boolean;
    onAddExpense: () => void;
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
                {/* Decorative elements - Abstract fishes */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 animate-orb-slow">
                    <div className="relative">
                        {/* Tail */}
                        <div className="absolute -left-5 -top-1 w-8 h-12 bg-primary/5 rounded-[50%]" />
                        <div className="absolute -left-5 -bottom-1 w-8 h-12 bg-primary/5 rounded-[50%]" />
                        {/* Body */}
                        <div className="w-24 h-16 bg-primary/5 rounded-[50%]" />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 animate-orb-slow-reverse">
                    <div className="relative">
                        {/* Tail */}
                        <div className="absolute -right-3 top-0 w-6 h-10 bg-primary/3 rounded-[50%]" />
                        <div className="absolute -right-3 bottom-0 w-6 h-10 bg-primary/3 rounded-[50%]" />
                        {/* Body */}
                        <div className="w-20 h-14 bg-primary/3 rounded-[50%]" />
                    </div>
                </div>

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
                            <p className="text-xs text-muted-foreground">{trip.noOfExpenses === 1 ? "Expense" : "Expenses"}</p>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Button size="sm" onClick={() => navigate(`/trips/${trip._id}/settlement`)}>
                            <HandCoins className="h-4 w-4 mr-1.5" />
                            Settle Up
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" className="hidden sm:inline-flex">
                                    <Plus className="h-4 w-4 mr-1.5" />
                                    Add Expense
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={onAddExpense}>
                                    <PenLine className="mr-2 h-4 w-4" />
                                    <span>Add Expense</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {}}>
                                    <Scan className="mr-2 h-4 w-4" />
                                    <span>Scan receipt</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
