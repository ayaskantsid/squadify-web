import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    TrendingUp,
    TrendingDown,
    Users,
    Wallet,
    HandCoins,
    AlertCircle,
    RefreshCw,
    PartyPopper,
    Calculator,
    Receipt,
    CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrip } from "@/hooks/useTrips";
import { useSettlementData } from "@/hooks/useBalances";
import type { SettlementBalanceEntry, ParticipantStat } from "@/types/balance";

// --- Helpers ---

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(Math.abs(amount));
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const avatarColors = [
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
];

const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
};

const getFirstName = (name: string) => name.split(" ")[0];

// --- Sub-components ---

const SettlementSkeleton = () => (
    <div className="space-y-6 pb-20 sm:pb-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-5 w-28" />
        <div className="space-y-2">
            {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
        </div>
        <Skeleton className="h-5 w-40" />
        <div className="space-y-2">
            {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
        </div>
        <Skeleton className="h-5 w-36" />
        <div className="space-y-2">
            {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
        </div>
    </div>
);

type BalanceCardProps = {
    entry: SettlementBalanceEntry;
    maxAbsBalance: number;
};

const BalanceCard = ({ entry, maxAbsBalance }: BalanceCardProps) => {
    const isPositive = entry.balance > 0;
    const isZero = entry.balance === 0;
    const barWidth = maxAbsBalance > 0 ? (Math.abs(entry.balance) / maxAbsBalance) * 100 : 0;

    return (
        <div className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/30">
            {/* Avatar */}
            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getAvatarColor(entry.name)}`}
            >
                {getInitials(entry.name)}
            </div>

            {/* Name + bar */}
            <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground truncate">
                        {entry.name}
                    </p>
                    <div className="flex items-center gap-1.5 shrink-0">
                        {!isZero && (
                            isPositive ? (
                                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                            )
                        )}
                        <span
                            className={`text-sm font-bold ${isZero
                                    ? "text-muted-foreground"
                                    : isPositive
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-red-600 dark:text-red-400"
                                }`}
                        >
                            {isZero
                                ? "Settled"
                                : `${isPositive ? "+" : "−"} ${formatCurrency(entry.balance)}`}
                        </span>
                    </div>
                </div>

                {/* Balance bar */}
                {!isZero && (
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${isPositive
                                    ? "bg-emerald-500/70"
                                    : "bg-red-500/70"
                                }`}
                            style={{ width: `${Math.max(barWidth, 4)}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

type SpendingCardProps = {
    stat: ParticipantStat;
    maxSpent: number;
    totalGroupSpent: number;
};

const SpendingCard = ({ stat, maxSpent, totalGroupSpent }: SpendingCardProps) => {
    const barWidth = maxSpent > 0 ? (stat.totalSpent / maxSpent) * 100 : 0;
    const spendPercent = totalGroupSpent > 0 ? (stat.totalSpent / totalGroupSpent) * 100 : 0;

    return (
        <div className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/30">
            {/* Avatar */}
            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getAvatarColor(stat.name)}`}
            >
                {getInitials(stat.name)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground truncate">
                        {stat.name}
                    </p>
                    <span className="text-sm font-bold text-foreground shrink-0">
                        {formatCurrency(stat.totalSpent)}
                    </span>
                </div>

                {/* Spending bar */}
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                        className="h-full rounded-full bg-primary/60 transition-all duration-500"
                        style={{ width: `${Math.max(barWidth, 4)}%` }}
                    />
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Receipt className="h-3 w-3" />
                        {stat.paymentCount} {stat.paymentCount === 1 ? "payment" : "payments"}
                    </span>
                    <span className="text-muted-foreground/50">•</span>
                    <span>{Math.round(spendPercent)}% of total</span>
                </div>
            </div>
        </div>
    );
};

// --- Main page ---

export const SettlementPage = () => {
    const { tripId } = useParams<{ tripId: string }>();
    const navigate = useNavigate();

    const {
        data: trip,
        isLoading: tripLoading,
    } = useTrip(tripId!);

    const {
        data: settlement,
        isLoading: settlementLoading,
        isError: settlementError,
        refetch: refetchSettlement,
    } = useSettlementData(tripId!);

    const isLoading = tripLoading || settlementLoading;

    // --- Derived values ---
    const balances = settlement?.balanceBeforeSettlement ?? [];
    const participantStats = settlement?.participantStats ?? [];
    const settlements = settlement?.settlements ?? [];
    const participantCount = balances.length;

    // Compute totals from participantStats (source of truth)
    const totalGroupSpent = participantStats.reduce((sum, s) => sum + s.totalSpent, 0);
    const totalPayments = participantStats.reduce((sum, s) => sum + s.paymentCount, 0);
    const perPersonAvg = participantCount > 0 ? totalGroupSpent / participantCount : 0;
    const allSettled = settlements.length === 0;

    // For balance bar scaling
    const maxAbsBalance = balances.reduce(
        (max, b) => Math.max(max, Math.abs(b.balance)),
        0
    );

    // For spending bar scaling
    const maxSpent = participantStats.reduce(
        (max, s) => Math.max(max, s.totalSpent),
        0
    );

    // Sort: positive (gets back) first descending, then negative (owes) ascending
    const sortedBalances = [...balances].sort((a, b) => b.balance - a.balance);

    // Sort stats: highest spender first
    const sortedStats = [...participantStats].sort((a, b) => b.totalSpent - a.totalSpent);

    // --- Error state ---
    if (settlementError) {
        return (
            <div className="space-y-6 pb-20 sm:pb-6">
                <button
                    onClick={() => navigate(`/trips/${tripId}`)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors -ml-1"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to trip
                </button>

                <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                        <AlertCircle className="h-7 w-7 text-destructive" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-foreground">
                            Something went wrong
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            We couldn't load settlement data. Please try again.
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => refetchSettlement()}>
                        <RefreshCw className="h-4 w-4 mr-1.5" />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    // --- Loading state ---
    if (isLoading) {
        return (
            <div className="space-y-6 pb-20 sm:pb-6">
                <button
                    onClick={() => navigate(`/trips/${tripId}`)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors -ml-1"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to trip
                </button>
                <SettlementSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 sm:pb-6">
            {/* 1. Back Navigation */}
            <button
                onClick={() => navigate(`/trips/${tripId}`)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors -ml-1"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to trip
            </button>

            {/* 2. Summary Hero Card */}
            <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary/5 via-background to-primary/[0.02] p-5 sm:p-6">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 animate-orb-slow">
                    <div className="relative">
                        <div className="absolute -left-5 -top-1 w-8 h-12 bg-primary/5 rounded-[50%]" />
                        <div className="absolute -left-5 -bottom-1 w-8 h-12 bg-primary/5 rounded-[50%]" />
                        <div className="w-24 h-16 bg-primary/5 rounded-[50%]" />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 animate-orb-slow-reverse">
                    <div className="relative">
                        <div className="absolute -right-3 top-0 w-6 h-10 bg-primary/3 rounded-[50%]" />
                        <div className="absolute -right-3 bottom-0 w-6 h-10 bg-primary/3 rounded-[50%]" />
                        <div className="w-20 h-14 bg-primary/3 rounded-[50%]" />
                    </div>
                </div>

                <div className="relative space-y-4">
                    <div className="space-y-1">
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <HandCoins className="h-6 w-6" />
                            Settlement
                        </h1>
                        {trip && (
                            <p className="text-sm text-muted-foreground">
                                {trip.name}
                            </p>
                        )}
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                        <div className="space-y-0.5">
                            <p className="text-lg sm:text-xl font-bold text-foreground">
                                {formatCurrency(totalGroupSpent)}
                            </p>
                            <p className="text-xs text-muted-foreground">Total Spent</p>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <p className="text-lg sm:text-xl font-bold text-foreground">
                                    {participantCount}
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {participantCount === 1 ? "Person" : "People"}
                            </p>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                                <Calculator className="h-4 w-4 text-muted-foreground" />
                                <p className="text-lg sm:text-xl font-bold text-foreground">
                                    {formatCurrency(perPersonAvg)}
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">Per Person</p>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <p className="text-lg sm:text-xl font-bold text-foreground">
                                    {totalPayments}
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {totalPayments === 1 ? "Payment" : "Payments"}
                            </p>
                        </div>
                    </div>

                    {/* Optimization message */}
                    {!allSettled && (
                        <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/10 px-3 py-2">
                            <Wallet className="h-4 w-4 text-primary shrink-0" />
                            <p className="text-xs text-foreground/80">
                                Only <span className="font-bold text-foreground">{settlements.length}</span>{" "}
                                {settlements.length === 1 ? "payment" : "payments"} needed to settle everyone up!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. All-Settled Celebration */}
            {allSettled && (
                <Card className="border-emerald-200 dark:border-emerald-800/50 overflow-hidden">
                    <CardContent className="p-6 sm:p-8 text-center space-y-3">
                        <div className="flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                <PartyPopper className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <h2 className="text-lg font-bold text-foreground">
                            Everyone is settled! 🎉
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            All balances are squared away. No payments needed.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* 4. Balances Section */}
            {balances.length > 0 && (
                <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        Balances
                        <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {balances.length}
                        </span>
                    </h2>

                    <div className="space-y-2">
                        {sortedBalances.map((entry) => (
                            <BalanceCard
                                key={entry.participantId}
                                entry={entry}
                                maxAbsBalance={maxAbsBalance}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* 5. Spending Breakdown */}
            {participantStats.length > 0 && (
                <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Receipt className="h-4 w-4" />
                        Spending Breakdown
                        <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {participantStats.length}
                        </span>
                    </h2>

                    <div className="space-y-2">
                        {sortedStats.map((stat) => (
                            <SpendingCard
                                key={stat.participantId}
                                stat={stat}
                                maxSpent={maxSpent}
                                totalGroupSpent={totalGroupSpent}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* 6. Settle Up Plan */}
            {settlements.length > 0 && (
                <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <HandCoins className="h-4 w-4" />
                        Settle Up Plan
                        <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {settlements.length}
                        </span>
                    </h2>

                    <div className="space-y-2">
                        {settlements.map((s, i) => (
                            <Card
                                key={i}
                                className="overflow-hidden border-primary/10 hover:border-primary/20 transition-colors"
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        {/* From */}
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <div
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getAvatarColor(s.from)}`}
                                            >
                                                {getInitials(s.from)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {getFirstName(s.from)}
                                                </p>
                                                <p className="text-xs text-red-500 dark:text-red-400">
                                                    pays
                                                </p>
                                            </div>
                                        </div>

                                        {/* Arrow + Amount */}
                                        <div className="flex flex-col items-center shrink-0 gap-0.5">
                                            <span className="text-sm font-bold text-foreground">
                                                {formatCurrency(s.amount)}
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                        </div>

                                        {/* To */}
                                        <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                                            <div className="min-w-0 text-right">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {getFirstName(s.to)}
                                                </p>
                                                <p className="text-xs text-emerald-500 dark:text-emerald-400">
                                                    receives
                                                </p>
                                            </div>
                                            <div
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getAvatarColor(s.to)}`}
                                            >
                                                {getInitials(s.to)}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};
