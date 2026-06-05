import api from "./apiClient";
import type { PendingInvitation } from "@/types/invitation";

export const getPendingInvitations = async (): Promise<PendingInvitation[]> => {
    const response = await api.get<PendingInvitation[]>(
        "/api/participants/invitations/pending"
    );
    return response.data;
};

export const acceptInvitation = async (
    invitationId: string
): Promise<void> => {
    await api.patch("/api/participants/invitations/accept", { invitationId });
};

export const declineInvitation = async (
    invitationId: string
): Promise<void> => {
    await api.patch("/api/participants/invitations/reject", { invitationId });
};
