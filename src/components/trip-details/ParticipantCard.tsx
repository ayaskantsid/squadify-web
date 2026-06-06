import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Participant } from "@/types/participant";

type ParticipantCardProps = {
    participant: Participant;
    isAdmin: boolean;
    currentUserId: string | undefined;
    onRemove: (participantId: string) => void;
    isRemoving: boolean;
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const roleBadgeVariant = (role: string) => {
    return role === "admin" ? "default" : "secondary";
};

const statusBadgeVariant = (status: string) => {
    switch (status) {
        case "accepted":
            return "outline" as const;
        case "invited":
            return "secondary" as const;
        case "declined":
            return "destructive" as const;
        default:
            return "secondary" as const;
    }
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

export const ParticipantCard = ({
    participant,
    isAdmin,
    currentUserId,
    onRemove,
    isRemoving,
}: ParticipantCardProps) => {
    const displayName =
        participant.userId?.displayName ?? participant.email ?? "Unknown User";
    const email = participant.userId?.email ?? participant.email ?? "";
    const isCurrentUser = participant.userId?._id === currentUserId;
    const canRemove =
        isAdmin && !isCurrentUser && participant.role !== "admin";

    return (
        <div className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/30">
            <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback
                    className={`text-xs font-semibold ${getAvatarColor(displayName)}`}
                >
                    {getInitials(displayName)}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">
                        {displayName}
                        {isCurrentUser && (
                            <span className="text-muted-foreground font-normal"> (You)</span>
                        )}
                    </p>
                </div>
                <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
                <Badge
                    variant={roleBadgeVariant(participant.role)}
                    className="text-[10px] px-1.5 py-0 capitalize"
                >
                    {participant.role}
                </Badge>
            </div>

            {canRemove && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => onRemove(participant._id)}
                    disabled={isRemoving}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            )}
        </div>
    );
};
