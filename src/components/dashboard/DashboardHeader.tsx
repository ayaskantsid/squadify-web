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
