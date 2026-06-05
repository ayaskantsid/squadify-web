import { useQuery } from "@tanstack/react-query";
import { getSettlement } from "@/api/balances";

export const useSettlement = (tripId: string) => {
    return useQuery({
        queryKey: ["balances", tripId],
        queryFn: () => getSettlement(tripId),
        enabled: !!tripId,
    });
};
