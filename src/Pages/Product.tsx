import { DataTable } from "../components/data-table";
import { columns } from "../Products/columns";
import { Spinner } from "../components/ui/spinner";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { ProductForm } from "../Products/ProductForm";

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

import { useProducts } from "../hooks/useProduct";
import { FieldLabel } from "../components/ui/field";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "@/utils/tokenStorage";
import type { IProduct } from "@/types/Product";

const Product = () => {
        const [page, setPage] = useState(1);
        const navigate = useNavigate();
        const [open, setOpen] = useState(false);
        const [searchInput, setSearchInput] = useState("");
        const [search, setSearch] = useState("");
        const [value] = useDebounce(searchInput, 500);
        const [product, setProduct] = useState<IProduct | undefined>(undefined);
        const [limit, setLimit] = useState(10);

        const handleEdit = (product: IProduct) => {
                console.log("Edit product", product);
                setProduct(product);
                setOpen(true);
        };

        const { data: productData, isLoading } = useProducts(search || value, page, limit);
        const pagination = productData?.data?.pagination;

        if (isLoading) {
                return (
                        <div className="flex items-center justify-center">
                                <Spinner />
                        </div>
                );
        }

        const handleSearch = () => {
                console.log("Search input", searchInput);
                setSearch(searchInput);
        };
        const accessToken = getAccessToken();
        if (!accessToken) {
                navigate("/login");
        }

        return (
                <div>
                        <div className="flex gap-x-4 mb-4">
                                <Input value={searchInput}
                                        className="max-w-xs"
                                        onChange={(e) => setSearchInput(e.target.value)}
                                />
                                <Button onClick={handleSearch}>Search</Button>
                        </div>

                        <Button onClick={() => {
                                setProduct(undefined);
                                setOpen(true);
                        }}>Create Product</Button>
                        <ProductForm open={open} setOpen={setOpen} product={product} />


                        <DataTable
                                columns={columns({ onEdit: handleEdit })}
                                data={productData?.data || []}
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
                                                        <PaginationPrevious
                                                                onClick={() => {
                                                                        if (pagination?.prevPage) setPage(pagination.prevPage);
                                                                }}
                                                        />
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
                                                        <PaginationNext
                                                                onClick={() => {
                                                                        if (pagination?.nextPage) setPage(pagination.nextPage);
                                                                }}
                                                        />
                                                </PaginationItem>
                                        </PaginationContent>
                                </Pagination>
                        </div>
                </div>
        );
};

export default Product;