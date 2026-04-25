import { createOrder } from "@/services/order.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createOrder,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },

        onError: (error) => {
            console.log("Failed to create order", error);
        },
    });
}; 