import { useCategories, useDeleteCategory } from "../hooks/useCategories";
import { DataTable } from "../components/data-table";
import { columns } from "../categories/column";
import { CategoryForm } from "../categories/CategoryForm";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import type { ICategory } from "../types/category";
import ConfirmDelete from "../categories/ConfirmDelete";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { useDebounce } from 'use-debounce';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useNavigate } from "react-router-dom";
import { FieldLabel } from "@/components/ui/field";
import { getAccessToken } from "@/utils/tokenStorage";

const Category = () => {
    const { mutate: deleteCategoryMutate } = useDeleteCategory();
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const [limit, setLimit] = useState(10);
    const [isOpen, setIsOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const [value] = useDebounce(searchInput, 500);
    console.log("Debounced value:", value);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { data: categoryData,} = useCategories(value, page, limit);
    const [category, setCategory] = useState<ICategory | undefined>(undefined);
    const pagination = categoryData?.data?.pagination;
    const handleEdit = (category: ICategory) => {
        setCategory(category);
        setIsOpen(true);
    };

    const onDelete = (category: ICategory) => {
        setCategory(category);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        deleteCategoryMutate(
            { id: category?.id },
            {
                onSuccess: () => {
                    toast.success("Category deleted successfully");
                    setIsDeleteOpen(false);
                },
            }
        );
    };
    useEffect(() => {
        const accessToken = getAccessToken();
        if (!accessToken) {
            navigate("/login");
        }
    }, [navigate]);
    return (
        <div>
            <div className="flex justify-between gap-4">
                <Input value={searchInput}
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                        setPage(1);
                    }} placeholder="Search categories..." className="mb-4 w-2xl" />
                <Button onClick={() => {
                    setCategory(undefined);
                    setIsOpen(true);
                }} className="mb-4">
                    Create Category
                </Button>

            </div>

            <DataTable
                columns={columns({
                    onEdit: handleEdit,
                    onDelete: onDelete,
                })}
                data={categoryData?.data || []}
            />

            <CategoryForm open={isOpen} setOpen={setIsOpen} category={category} />

            <ConfirmDelete
                isOpen={isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
                category={category}
                confirmDelete={confirmDelete}
            />
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2  mt-4 w-full">
                    <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
                    <Select defaultValue="10" onValueChange={(value) => setLimit(Number(value))}>
                        <SelectTrigger className="w-20" id="select-rows-per-page">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="start">
                            <SelectGroup>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Pagination className="flex justify-end mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={() => setPage(pagination?.prevPage)} />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive>
                                2
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext onClick={() => setPage(pagination?.nextPage)} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export default Category;