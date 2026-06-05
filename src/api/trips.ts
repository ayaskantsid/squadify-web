import api from "./apiClient";
import type { Trip } from "@/types/trip";

export interface GetTripsResponse {
    trips: Trip[];
    totalCount: number;
    hasMore: boolean;
}

export const getTrips = async (): Promise<Trip[]> => {
    const response = await api.get<GetTripsResponse>("/api/trips");
    return response.data.trips;
};

export const getTripById = async (tripId: string): Promise<Trip> => {
    const response = await api.get<Trip>(`/api/trips/${tripId}`);
    return response.data;
};

export const createTrip = async (data: {
    name: string;
    description?: string;
    startDate: string;
    endDate?: string;
}): Promise<Trip> => {
    const response = await api.post<{ trip: Trip }>("/api/trips", data);
    return response.data.trip;
};

export const updateTrip = async ({
    tripId,
    data,
}: {
    tripId: string;
    data: { name?: string; description?: string; startDate?: string; endDate?: string };
}): Promise<Trip> => {
    const response = await api.put<Trip>(`/api/trips/${tripId}`, data);
    return response.data;
};

export const deleteTrip = async (tripId: string): Promise<void> => {
    await api.delete(`/api/trips/${tripId}`);
};
