import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, Mail, RefreshCw } from "lucide-react";
import { usePendingInvitations } from "@/hooks/useInvitations";
import { InvitationCard } from "@/components/dashboard/InvitationCard";

export const InvitationsPage = () => {
    const {
        data: invitations,
        isLoading,
        isError,
        refetch,
    } = usePendingInvitations();

    const pendingInvitations =
        invitations?.filter((i) => i.status === "invited") ?? [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Invitations
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your trip invitations
                </p>
            </div>

            {/* Error */}
            {isError && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                            Failed to load invitations
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                    >
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        Retry
                    </Button>
                </div>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton
                            key={i}
                            className="h-36 w-full rounded-lg"
                        />
                    ))}
                </div>
            )}

            {/* Empty */}
            {!isLoading &&
                !isError &&
                pendingInvitations.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <Mail className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground mb-1">
                            No pending invitations
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-[280px]">
                            When someone invites you to a trip,
                            it will appear here.
                        </p>
                    </div>
                )}

            {/* Invitations list */}
            {!isLoading &&
                !isError &&
                pendingInvitations.length > 0 && (
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
                )}
        </div>
    );
};
