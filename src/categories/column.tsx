"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { format } from "date-fns";
import type { ICategory } from "../types/category";

export interface Category {
    id: number;
    name: string;
    createdAt: string;
}
interface Props {
    onEdit : (category: ICategory) => void;
    onDelete : (category: ICategory) => void;
}

export const columns = ({onEdit , onDelete} : Props) : ColumnDef<ICategory>[] => [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        header: "Category Name",
        cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
        header: "Created At",
        accessorKey: "createdAt", // Good practice to include the key
        cell: ({ row }) => {
            const date = row.original.createdAt;
            return (
                <div className="font-medium">
                    {date ? format(new Date(date), "MM/dd/yyyy hh:mm:ss") : "N/A"}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            console.log('row', row)
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={ () => onEdit(row.original)}>
                            <SquarePen /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onClick={ () => onDelete(row.original)}>
                            <Trash2 className="text-red-500" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];