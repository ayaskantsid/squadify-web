import { Skeleton } from "@/components/ui/skeleton";

export const TripDetailsSkeleton = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Back button skeleton */}
            <Skeleton className="h-5 w-28" />

            {/* Header card skeleton */}
            <div className="rounded-xl border p-5 sm:p-6 space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-4 w-44" />
                <div className="flex gap-6">
                    <div className="space-y-1">
                        <Skeleton className="h-7 w-24" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-7 w-12" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
                <div className="flex gap-2 pt-1">
                    <Skeleton className="h-8 w-28 rounded-md" />
                    <Skeleton className="h-8 w-32 rounded-md" />
                </div>
            </div>

            {/* Settlement section skeleton */}
            <div className="space-y-3">
                <Skeleton className="h-5 w-36" />
                <div className="rounded-xl border p-4 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-44" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>
            </div>

            {/* Participants section skeleton */}
            <div className="space-y-3">
                <Skeleton className="h-5 w-24" />
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 rounded-lg border p-3"
                        >
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-1.5">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-3 w-36" />
                            </div>
                            <Skeleton className="h-5 w-14 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Expenses section skeleton */}
            <div className="space-y-3">
                <Skeleton className="h-5 w-20" />
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="flex items-start gap-3 rounded-lg border p-3.5"
                        >
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
