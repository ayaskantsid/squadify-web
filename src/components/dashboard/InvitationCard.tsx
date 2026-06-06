import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, UserCircle } from "lucide-react";
import {
    useAcceptInvitation,
    useDeclineInvitation,
} from "@/hooks/useInvitations";
import type { PendingInvitation } from "@/types/invitation";

type InvitationCardProps = {
    invitation: PendingInvitation;
};

export const InvitationCard = ({
    invitation,
}: InvitationCardProps) => {
    const accept = useAcceptInvitation();
    const decline = useDeclineInvitation();

    const isLoading =
        accept.isPending || decline.isPending;

    return (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.04] to-transparent overflow-hidden">
            <CardHeader className="pb-1.5">
                <CardTitle className="text-base font-semibold">
                    {invitation.tripName}
                </CardTitle>
                {invitation.tripDescription && (
                    <CardDescription className="line-clamp-2 mt-1">
                        {invitation.tripDescription}
                    </CardDescription>
                )}
            </CardHeader>

            <CardContent className="pb-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <UserCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>
                        Invited by{" "}
                        <span className="font-medium text-foreground/80">
                            {invitation.invitedBy.displayName}
                        </span>
                    </span>
                </div>
            </CardContent>

            <CardFooter className="gap-2 py-3">
                <Button
                    size="sm"
                    onClick={() =>
                        accept.mutate(invitation.invitationId)
                    }
                    disabled={isLoading}
                    className="flex-1"
                >
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                        decline.mutate(invitation.invitationId)
                    }
                    disabled={isLoading}
                    className="flex-1"
                >
                    <X className="h-4 w-4 mr-1" />
                    Decline
                </Button>
            </CardFooter>
        </Card>
    );
};
