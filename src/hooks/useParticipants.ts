import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getParticipants, inviteParticipant, removeParticipant } from "@/api/participants";
import { toast } from "sonner";

export const useParticipants = (tripId: string) => {
    return useQuery({
        queryKey: ["participants", tripId],
        queryFn: () => getParticipants(tripId),
        enabled: !!tripId,
    });
};

export const useInviteParticipant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: inviteParticipant,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["participants", variables.tripId] });
            toast.success("Invitation sent successfully!");
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message || "Failed to send invitation. Please try again.";
            toast.error(message);
        },
    });
};

export const useRemoveParticipant = (tripId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeParticipant,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["participants", tripId] });
            toast.success("Participant removed successfully.");
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message || "Failed to remove participant. Please try again.";
            toast.error(message);
        },
    });
};
