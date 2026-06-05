import api from "./apiClient";
import type { SquadifyUser } from "@/types/user";

export const initUser = async (displayName?: string | null): Promise<SquadifyUser> => {
    const response = await api.post<SquadifyUser>("/api/auth/me", {
        displayName,
    });
    return response.data;
};
