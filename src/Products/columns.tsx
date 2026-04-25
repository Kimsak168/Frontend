"use client";

import { Badge } from "../components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import type { IProduct } from "@/types/Product";

interface Props {
    onEdit: (product: IProduct) => void;
}
export const columns = ({ onEdit }: Props): ColumnDef<IProduct>[] => [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        header: "Image",
        cell: ({ row }) => (
            <div>
                <img
                    className="aspect-square w-[100px] h-[100px]"
                    src={row.original.productImage?.[0]?.imageUrl ?? "/image.png"}
                />
            </div>
        ),
    },
    {
        accessorKey: "name",
        header: "Product Name",
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }: { row: Row<IProduct> }) => (
            <div className="text-green-500 font-medium">${row.original.price}</div>
        ),
    },
    {
        accessorKey: "qty",
        header: "Quantity",
        cell: ({ row }: { row: Row<IProduct> }) => (
            <div className="text-blue-500 font-medium">{row.original.qty}</div>
        ),
    },
    {
        header: "Category",
        cell: ({ row }: { row: Row<IProduct> }) => (
            <Badge className="bg-blue-500 text-white">
                {row.original.category?.name || "No Category"}
            </Badge>
        ),
    },
    {
        id: "actions",
        cell: ({ row }: { row: Row<IProduct> }) => {
            const product = row.original;
            console.log("Product in actions column", product);

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <MoreHorizontal size={18} />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Detail</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(product)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];