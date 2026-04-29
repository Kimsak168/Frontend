"use client";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "../components/ui/button";

import {
    Field,
    FieldContent,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "../components/ui/field";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import { useCategoriesList } from "../hooks/useCategories";
import type { ICategory } from "../types/category";
import { useCreateProduct, useDeleteProductImage, useUpdateProduct, useUploadProductImage } from "../hooks/useProduct";
import { Input } from "../components/ui/input";
import { useEffect } from "react";
import { Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { IProduct, IProductImage } from "@/types/Product";


const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().min(0, "Price must be 0 or more"),
    categoryId: z.number().min(1, "Category is required"),
    qty: z.number().int().min(0, "Quantity must be 0 or more"),
});

export type ProductSchema = z.infer<typeof productSchema>;

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    product?: IProduct;
}

export function ProductForm({ open, setOpen, product }: Props) {
    const { data } = useCategoriesList();
    console.log("fetched category", data);
    const categories = data?.data ?? [];
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [deletedFiles, setDeletedFiles] = useState<number[]>([]);
    const { mutate: createProduct } = useCreateProduct();
    const { mutate: updateProductMutate } = useUpdateProduct();
    const { mutate: uploadProductImageMutate } = useUploadProductImage();
    const { mutate: deleteProductImageMutate } = useDeleteProductImage();

    const form = useForm({
        defaultValues: {
            name: product?.name ?? "",
            price: product?.price ? Number(product?.price) : 0,
            categoryId: product?.category?.id ?? 0,
            qty: product?.qty ?? 0,
        },
        validators: {
            onSubmit: productSchema,
        },
        onSubmit: async ({ value }) => {
            if (product) {
                updateProductMutate(
                    { id: product.id, request: value },
                    {
                        onSuccess: (res) => {
                            if (res.data?.id) {
                                uploadedFiles.map((file) => uploadProductImageMutate({ id: res.data.id, request: file }))
                            }
                            deletedFiles.map(imageId => deleteProductImageMutate(imageId))
                            setOpen(false);
                            setUploadedFiles([]);
                            form.reset();
                        },
                    }
                );
            } else {
                createProduct(value, {
                    onSuccess: (res) => {
                        if (res.data.id) {
                            uploadProductImageMutate({ id: res.data.id, request: uploadedFiles[0] })
                        }
                        setOpen(false);
                        setUploadedFiles([]);
                        form.reset();
                    },
                });
            }
        },
    });
    useEffect(() => {
        if (product) {
            form.setFieldValue("name", product.name);
            form.setFieldValue("price", Number(product.price));
            form.setFieldValue("qty", product.qty);
            form.setFieldValue("categoryId", product.category?.id ?? 0);
        } else {
            form.reset();
        }
    }, [product]);
    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;

        const newFiles = Array.from(files);
        setUploadedFiles((prev) => [...prev, ...newFiles]);

        // Simulate upload progress for each file
    };

    const handleBoxClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        handleFileSelect(e.dataTransfer.files);
    };

    const removeFile = (filename: string) => {
        setUploadedFiles((prev) => prev.filter((file) => file.name !== filename));
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{product ? "Update" : "Create"} Product Form</DialogTitle>
                    <DialogDescription>Product Information Detail</DialogDescription>
                </DialogHeader>
                <form
                    id="product-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <FieldGroup className="gap-2 p-0">
                        <form.Field
                            name="name"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <form.Field
                                name="price"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) =>
                                                    field.handleChange(e.target.valueAsNumber)
                                                }
                                                aria-invalid={isInvalid}
                                                type={"number"}
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                            <form.Field
                                name="qty"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Qty</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) =>
                                                    field.handleChange(e.target.valueAsNumber)
                                                }
                                                aria-invalid={isInvalid}
                                                type={"number"}
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                        </div>
                        <div className="col-span-2">
                            <form.Field
                                name="categoryId"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid} className="w-full">
                                            <FieldContent>
                                                <FieldLabel htmlFor="form-tanstack-select-language">
                                                    Category
                                                </FieldLabel>

                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors} />
                                                )}
                                            </FieldContent>
                                            <Select
                                                name={field.name}
                                                value={String(field.state.value)}
                                                onValueChange={(val) => field.handleChange(Number(val))}
                                            >
                                                <SelectTrigger
                                                    id="form-tanstack-select-language"
                                                    aria-invalid={isInvalid}
                                                    className="w-full"
                                                >
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent position="item-aligned">
                                                    {categories.map((category: ICategory) => (
                                                        <SelectItem
                                                            key={category.id}
                                                            value={String(category.id)}
                                                        >
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    );
                                }}
                            />
                        </div>
                        <div className="mt-3">
                            <div
                                className="border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer"
                                onClick={handleBoxClick}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <div className="mb-2 bg-muted rounded-full p-3">
                                    <Upload className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <p className="text-pretty text-sm font-medium text-foreground">
                                    Upload a project image
                                </p>
                                <p className="text-pretty text-sm text-muted-foreground mt-1">
                                    or,{" "}
                                    <label
                                        htmlFor="fileUpload"
                                        className="text-primary hover:text-primary/90 font-medium cursor-pointer"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        click to browse
                                    </label>{" "}
                                    (4MB max)
                                </p>
                                <input
                                    type="file"
                                    id="fileUpload"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileSelect(e.target.files)}
                                />
                            </div>
                        </div>

                        {product?.productImage && product.productImage?.length > 0 && (
                            <div className="space-y-2">
                                {product.productImage
                                    .filter((image) => !deletedFiles.includes(image.id))
                                    .map(
                                        (image: IProductImage, index: number) => (
                                            <div
                                                key={index}
                                                className="border border-border rounded-lg p-2 flex flex-col"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-18 h-14 bg-muted rounded-sm flex items-center justify-center self-start row-span-2 overflow-hidden">
                                                        <img
                                                            src={image.imageUrl}
                                                            alt={image.fileName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    <div className="flex-1 pr-1">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm text-foreground truncate max-w-[250px]">
                                                                    {image.fileName}
                                                                </span>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                className="bg-transparent! hover:text-red-500"
                                                                type="button"
                                                                onClick={() => {
                                                                    setDeletedFiles((prev) => [...prev, image.id])
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    )}
                            </div>
                        )}

                        <div
                            className={cn(
                                "px-6 pb-5 space-y-3",
                                uploadedFiles.length > 0 ? "mt-4" : ""
                            )}
                        >
                            {uploadedFiles.map((file, index) => {
                                const imageUrl = URL.createObjectURL(file);

                                return (
                                    <div
                                        className="border border-border rounded-lg p-2 flex flex-col"
                                        key={file.name + index}
                                        onLoad={() => {
                                            return () => URL.revokeObjectURL(imageUrl);
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-18 h-14 bg-muted rounded-sm flex items-center justify-center self-start row-span-2 overflow-hidden">
                                                <img
                                                    src={imageUrl}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 pr-1">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-foreground truncate max-w-[250px]">
                                                            {file.name}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                                                            {Math.round(file.size / 1024)} KB
                                                        </span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        className="bg-transparent! hover:text-red-500"
                                                        onClick={() => removeFile(file.name)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </FieldGroup>
                </form>
                <DialogFooter>
                    <Field orientation="horizontal" className="flex justify-end">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button className="bg-blue-500" type="submit" form="product-form">
                            Save
                        </Button>
                    </Field>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

