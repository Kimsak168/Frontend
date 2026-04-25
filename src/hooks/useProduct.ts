import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, deleteProductImage, fetchProduct, updateProduct, uploadProductImage } from "../services/product.service";
import type { ProductSchema } from "../Products/ProductForm";
export const useProducts = (search?: string , page?: number, limit?: number , categoryId?: number) => {
    return useQuery({
        queryKey: ["products", search, page, limit, categoryId],
        queryFn: () => fetchProduct(search, page, limit, categoryId ),
    });
}
export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProduct,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },

        onError: (error) => {
            console.log("Failed to create product", error);
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: ProductSchema }) =>
            updateProduct(id, request),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },

        onError: (error) => {
            console.log("Failed to update product", error);
        },
    });
};
export const useUploadProductImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: File }) =>
            uploadProductImage(id, request),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },

        onError: (error) => {
            console.log("Failed to upload product Image", error);
        },
    });
};
export const useDeleteProductImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteProductImage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error) => {
            console.log("Failed to delete product image", error);
        },
    });
};
