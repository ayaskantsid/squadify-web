import { useQuery } from "@tanstack/react-query";
import { getSettlement, getSettlementData } from "@/api/balances";

export const useSettlement = (tripId: string) => {
    return useQuery({
        queryKey: ["balances", tripId],
        queryFn: () => getSettlement(tripId),
        enabled: !!tripId,
    });
};

export const useSettlementData = (tripId: string) => {
    return useQuery({
        queryKey: ["settlements", tripId],
        queryFn: () => getSettlementData(tripId),
        enabled: !!tripId,
        staleTime: 0,
    });
};
