import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Plus, RefreshCw, Mail } from "lucide-react";
import { useTrips } from "@/hooks/useTrips";
import { usePendingInvitations } from "@/hooks/useInvitations";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TripCard } from "@/components/dashboard/TripCard";
import { InvitationCard } from "@/components/dashboard/InvitationCard";
import { EmptyTrips } from "@/components/dashboard/EmptyTrips";

export const DashboardPage = () => {
    const navigate = useNavigate();

    const {
        data: trips,
        isLoading: tripsLoading,
        isError: tripsError,
        refetch: refetchTrips,
    } = useTrips();

    const {
        data: invitations,
        isLoading: invitationsLoading,
    } = usePendingInvitations();

    const isLoading = tripsLoading || invitationsLoading;

    const pendingInvitations =
        invitations?.filter((i) => i.status === "invited") ?? [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <DashboardHeader
                tripCount={trips?.length ?? 0}
                isLoading={isLoading}
            />

            {/* Error state */}
            {tripsError && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 shrink-0">
                        <AlertCircle className="h-4.5 w-4.5 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                            Failed to load trips
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Something went wrong. Please try again.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetchTrips()}
                    >
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        Retry
                    </Button>
                </div>
            )}

            {/* Pending Invitations */}
            {isLoading && (
                <section className="space-y-3">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                </section>
            )}

            {!isLoading && pendingInvitations.length > 0 && (
                <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Pending Invitations
                        <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {pendingInvitations.length}
                        </span>
                    </h2>

                    <div className="grid gap-3">
                        {pendingInvitations.map(
                            (invitation) => (
                                <InvitationCard
                                    key={invitation.invitationId}
                                    invitation={invitation}
                                />
                            )
                        )}
                    </div>
                </section>
            )}

            {/* Trips */}
            {isLoading && (
                <section className="space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <div className="grid gap-3 sm:grid-cols-2">
                        {[1, 2, 3].map((i) => (
                            <Skeleton
                                key={i}
                                className="h-28 w-full rounded-xl"
                            />
                        ))}
                    </div>
                </section>
            )}

            {!isLoading && !tripsError && (
                <>
                    {(trips?.length ?? 0) === 0 ? (
                        <EmptyTrips />
                    ) : (
                        <section className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-foreground">
                                    My Trips
                                </h2>
                                <Button
                                    onClick={() => navigate("/trips/new")}
                                    size="sm"
                                    variant="ghost"
                                    className="text-xs"
                                >
                                    <Plus className="h-3.5 w-3.5 mr-1" />
                                    New Trip
                                </Button>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {trips!.map((trip) => (
                                    <TripCard
                                        key={trip._id}
                                        trip={trip}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
};
