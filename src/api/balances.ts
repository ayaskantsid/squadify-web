import api from "./apiClient";
import type { BalanceResponse, SettlementResponse } from "@/types/balance";

export const getSettlement = async (tripId: string): Promise<BalanceResponse> => {
    const response = await api.get<BalanceResponse>(`/api/balances/${tripId}`);
    return response.data;
};

export const getSettlementData = async (tripId: string): Promise<SettlementResponse> => {
    const response = await api.get<SettlementResponse>(`/api/balances/${tripId}/settlements`);
    return response.data;
};
