import { TrendingUp, TrendingDown, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/auth/AuthContext";
import type { BalanceResponse } from "@/types/balance";

type SettlementSummaryProps = {
    settlement: BalanceResponse | undefined;
    isLoading: boolean;
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Math.abs(amount));
};

export const SettlementSummary = ({ settlement, isLoading }: SettlementSummaryProps) => {
    const { squadfishUser } = useAuth();

    if (isLoading || !settlement) return null;

    const userBalance = settlement.balances?.find(
        (b) => b.userId === squadfishUser?._id
    );
    const balance = userBalance?.balance ?? 0;
    const isPositive = balance > 0;
    const isSettled = balance === 0;

    const hasSettlements = settlement.settlements && settlement.settlements.length > 0;

    return (
        <section className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Settlement Summary</h2>

            <Card className="border-primary/15 overflow-hidden">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Your Balance
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                        {isSettled ? (
                            <>
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                <span className="text-lg font-bold text-emerald-600">
                                    Settled up
                                </span>
                            </>
                        ) : isPositive ? (
                            <>
                                <TrendingUp className="h-5 w-5 text-emerald-500" />
                                <span className="text-lg font-bold text-emerald-600">
                                    You are owed {formatCurrency(balance)}
                                </span>
                            </>
                        ) : (
                            <>
                                <TrendingDown className="h-5 w-5 text-red-500" />
                                <span className="text-lg font-bold text-red-500">
                                    You owe {formatCurrency(balance)}
                                </span>
                            </>
                        )}
                    </div>
                </CardHeader>

                {hasSettlements && (
                    <CardContent className="pt-0">
                        <div className="border-t pt-3 space-y-2.5">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Recommended Settlements
                            </p>
                            {settlement.settlements.map((s, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 text-sm rounded-lg bg-muted/50 px-3 py-2"
                                >
                                    <span className="font-medium text-foreground truncate">
                                        {s.from.displayName}
                                    </span>
                                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                    <span className="font-medium text-foreground truncate">
                                        {s.to.displayName}
                                    </span>
                                    <span className="ml-auto font-semibold text-foreground shrink-0">
                                        {formatCurrency(s.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                )}

                {!hasSettlements && !isSettled && (
                    <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground">
                            No settlement recommendations yet.
                        </p>
                    </CardContent>
                )}

                {isSettled && !hasSettlements && (
                    <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground">
                            Everyone is settled up. 🎉
                        </p>
                    </CardContent>
                )}
            </Card>
        </section>
    );
};
