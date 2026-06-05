import api from "./apiClient";
import type { Participant } from "@/types/participant";

export const getParticipants = async (tripId: string): Promise<Participant[]> => {
    const response = await api.get<Participant[]>(`/api/participants/trip/${tripId}`);
    return response.data;
};

export const inviteParticipant = async (data: {
    tripId: string;
    email: string;
}): Promise<{ message: string; participant: Participant }> => {
    const response = await api.post<{ message: string; participant: Participant }>(
        "/api/participants/invite",
        data
    );
    return response.data;
};

export const removeParticipant = async (participantId: string): Promise<void> => {
    await api.delete(`/api/participants/${participantId}`);
};
