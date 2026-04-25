"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCreateCategory } from "@/hooks/useCategories";
import { toast } from "sonner"
import type { ICategory } from "../types/category";
import { useEffect } from "react";
import { useUpdateCategory } from "../hooks/useCategories";


const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
});

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    category?: ICategory;
}

export function CategoryForm({ open, setOpen, category }: Props) {
    const { mutate: createCategoryMutate } = useCreateCategory();
    const { mutate: updateCategoryMutate } = useUpdateCategory();
    const form = useForm({
        defaultValues: {
            name: category?.name ?? "",
        },
        validators: {
            onSubmit: formSchema,
        },

        onSubmit: async ({ value }) => {
            console.log("value", value);
            if (category) {
                updateCategoryMutate(
                    { id: category.id, request: value },
                    {
                        onSuccess: () => {
                            toast.success("Category updated successfully")
                            setOpen(false)
                            form.reset()
                        }
                    }
                )
            }
            else {
                createCategoryMutate(value, {
                    onSuccess: () => {
                        toast.success("Category created successfully")
                        setOpen(false)
                        form.reset()
                    }
                })
            }

        }
    });
    useEffect(() => {
        if (category) {
            form.setFieldValue("name", category.name);
        } else {
            form.reset();
        }
    }, [category]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{category ? "Edit" : "Create"} Category</DialogTitle>
                    <DialogDescription>
                        Make changes to your category here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form
                    id="category-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <FieldGroup>
                        <form.Field
                            name="name"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Category Name</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="Enter category name"
                                            autoComplete="off"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        />
                    </FieldGroup>
                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" form="category-form">{category ? "Update" : "Create"} Category</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        // <Card className="w-full sm:max-w-md">
        //   <CardHeader>
        //     <CardTitle>Category</CardTitle>
        //     <CardDescription>
        //       Category information detail
        //     </CardDescription>
        //   </CardHeader>
        //   <CardContent>
        //     <form
        //       id="bug-report-form"
        //       onSubmit={(e) => {
        //         e.preventDefault()
        //         form.handleSubmit()
        //       }}
        //     >
        //       <FieldGroup>
        //         <form.Field
        //           name="name"
        //           children={(field) => {
        //             const isInvalid =
        //               field.state.meta.isTouched && !field.state.meta.isValid
        //             return (
        //               <Field data-invalid={isInvalid}>
        //                 <FieldLabel htmlFor={field.name}>Category Name</FieldLabel>
        //                 <Input
        //                   id={field.name}
        //                   name={field.name}
        //                   value={field.state.value}
        //                   onBlur={field.handleBlur}
        //                   onChange={(e) => field.handleChange(e.target.value)}
        //                   aria-invalid={isInvalid}
        //                   placeholder="Enter category name"
        //                   autoComplete="off"
        //                 />
        //                 {isInvalid && (
        //                   <FieldError errors={field.state.meta.errors} />
        //                 )}
        //               </Field>
        //             )
        //           }}
        //         />

        //       </FieldGroup>
        //     </form>
        //   </CardContent>
        //   <CardFooter>
        //     <Field orientation="horizontal">
        //       <Button type="button" variant="outline" onClick={() => form.reset()}>
        //         Reset
        //       </Button>
        //       <Button type="submit" form="bug-report-form">
        //         Submit
        //       </Button>
        //     </Field>
        //   </CardFooter>
        // </Card>
    );
}