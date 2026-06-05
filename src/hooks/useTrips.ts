import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTrips, getTripById, createTrip, updateTrip, deleteTrip } from "@/api/trips";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useTrips = () => {
    return useQuery({
        queryKey: ["trips"],
        queryFn: getTrips,
    });
};

export const useTrip = (tripId: string) => {
    return useQuery({
        queryKey: ["trip", tripId],
        queryFn: () => getTripById(tripId),
        enabled: !!tripId,
    });
};

export const useCreateTrip = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: createTrip,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trips"] });
            toast.success("Trip created successfully!");
            navigate("/");
        },
        onError: () => {
            toast.error("Failed to create trip. Please try again.");
        },
    });
};

export const useUpdateTrip = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: updateTrip,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["trip", variables.tripId] });
            queryClient.invalidateQueries({ queryKey: ["trips"] });
            toast.success("Trip updated successfully!");
            navigate(`/trips/${variables.tripId}`);
        },
        onError: () => {
            toast.error("Failed to update trip. Please try again.");
        },
    });
};

export const useDeleteTrip = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: deleteTrip,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trips"] });
            toast.success("Trip deleted successfully!");
            navigate("/");
        },
        onError: () => {
            toast.error("Failed to delete trip. Please try again.");
        },
    });
};
