import api from "./apiClient";
import type { BalanceResponse } from "@/types/balance";

export const getSettlement = async (tripId: string): Promise<BalanceResponse> => {
    const response = await api.get<BalanceResponse>(`/api/balances/trip/${tripId}`);
    return response.data;
};
