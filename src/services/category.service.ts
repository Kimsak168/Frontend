import api from "./lib/axios";

export interface CategoryPayload {
    name: string;
}

export const getCategories = async (
    search?: string,
    page: number = 1,
    limit: number = 10
) => {
    return await api.get("/api/v1/categories", {
        params: {
            search: search || "",
            page,
            limit,
        },
    });
};
export const getCategoriesList = async () => {
    return await api.get("/api/v1/categories/list")
};

export const createCategory = async (request: CategoryPayload) => {
    return await api.post("/api/v1/categories", request)
};
export const updateCategory = async (id: number, request: CategoryPayload) => {
    return await api.put(`/api/v1/categories/${id}`, request)
};
export const deleteCategory = async (id?: number) => {
    return await api.delete(`/api/v1/categories/${id}`)
};
