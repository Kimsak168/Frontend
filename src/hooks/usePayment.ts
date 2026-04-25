
import { checkTransaction, createPaymentMutate } from "@/services/payment.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const useCreatePayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPaymentMutate,
        onSuccess: () => {
            toast.success("Payment created successfully");
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
        onError: (error: Error) => {
            toast.error("Failed to created payment");
            console.log("Failed to create payment", error);
        },
    });
};
export const useCheckTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: checkTransaction,
        onSuccess: () => {
            toast.success("Transaction checked successfully");
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
        onError: (error: Error) => {
            toast.error("Failed to check transaction");
            console.log("Failed to check transaction", error);
        },
    });
};