export type PendingInvitation = {
    invitationId: string;
    tripId: string;
    tripName: string;
    invitedBy: {
        _id: string;
        displayName: string;
        email: string;
    };
    status: string;
};
