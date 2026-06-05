import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getPendingInvitations,
    acceptInvitation,
    declineInvitation,
} from "@/api/invitations";

import { toast } from "sonner";

export const usePendingInvitations = () => {
    return useQuery({
        queryKey: ["pendingInvitations"],
        queryFn: getPendingInvitations,
    });
};

export const useAcceptInvitation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: acceptInvitation,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["pendingInvitations"],
            });
            queryClient.invalidateQueries({
                queryKey: ["trips"],
            });
            toast.success("Invitation accepted!");
        },
        onError: () => {
            toast.error("Failed to accept invitation. Please try again.");
        },
    });
};

export const useDeclineInvitation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: declineInvitation,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["pendingInvitations"],
            });
            toast.success("Invitation declined.");
        },
        onError: () => {
            toast.error("Failed to decline invitation. Please try again.");
        },
    });
};
