import { useAuth } from "@/auth/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

type DashboardHeaderProps = {
    tripCount: number;
    isLoading: boolean;
};

export const DashboardHeader = ({
    tripCount,
    isLoading,
}: DashboardHeaderProps) => {
    const { squadfishUser } = useAuth();

    const firstName =
        squadfishUser?.displayName?.split(" ")[0] ?? "there";

    if (isLoading) {
        return (
            <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary/5 via-background to-primary/[0.02] p-5 sm:p-6">
                <div className="space-y-3">
                    <Skeleton className="h-8 w-52" />
                    <Skeleton className="h-4 w-36" />
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary/5 via-background to-primary/[0.02] p-5 sm:p-6">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-primary/3 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Hi {firstName} 👋
                </h1>
                <p className="text-sm text-muted-foreground mt-1.5">
                    {tripCount === 0
                        ? "No trips yet — let's plan one!"
                        : `You are part of ${tripCount} ${tripCount === 1 ? "trip" : "trips"}`}
                </p>
            </div>
        </div>
    );
};
