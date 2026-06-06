import api from "./apiClient";
import type { SquadfishUser } from "@/types/user";

export const initUser = async (displayName?: string | null): Promise<SquadfishUser> => {
    const response = await api.post<SquadfishUser>("/api/auth/me", {
        displayName,
    });
    return response.data;
};
