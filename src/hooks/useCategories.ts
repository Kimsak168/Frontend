
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCategory, getCategories, getCategoriesList, updateCategory } from "../services/category.service";
import { createCategory } from "../services/category.service";


export const useCategories = (search?: string, page?: number, limit?: number) => {
  return useQuery({
    queryKey: ["categories", search, page, limit],
    queryFn: () => getCategories(search, page, limit),
  });
};
export const useCategoriesList = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesList(),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"]});
    },
  });
};
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:({id ,request} : {id: number, request: any}) => updateCategory(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"]});
    },
  });
};
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id?: number; }) =>
      deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};