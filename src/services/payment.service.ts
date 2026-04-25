import api from "./lib/axios";

export const createPaymentMutate = async (orderId: number) => {
    return await api.post(`/api/v1/payments/${orderId}`);
};
export const checkTransaction = async (tranId: string) => {
    if (!tranId) throw new Error("Missing tranId");
    return await api.post(`/api/v1/payments/${tranId}/check`, {});
};