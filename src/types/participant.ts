export type Participant = {
    _id: string;
    userId: {
        _id: string;
        displayName: string;
        email: string;
        phoneNumber?: string;
    } | null;
    email?: string;
    tripId: string;
    role: "admin" | "participant";
    status: "invited" | "accepted" | "declined";
    invitedAt: string;
    acceptedAt?: string;
    declinedAt?: string;
};
