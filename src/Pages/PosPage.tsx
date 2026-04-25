"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Trash2,
    QrCode,
    PlusIcon,
    MinusIcon
} from "lucide-react";
import { useProducts } from "@/hooks/useProduct";
import { useCategories } from "@/hooks/useCategories";
import type { ICategory } from "@/types/category";
import { toast } from "sonner";
import type { ICart } from "@/types/Cart";
import type { IProduct } from "@/types/Product";
import SharedDialog from "@/components/SharedDialog";
import { useCreateOrder } from "@/hooks/useOrder";
import type { OrderPayload } from "@/services/order.service";
import { Input } from "@/components/ui/input";
import { useCheckTransaction, useCreatePayment } from "@/hooks/usePayment";
import { useSearchParams } from "react-router-dom";





export default function PosPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [cartItems, setCartItems] = useState<ICart[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
        undefined,
    );

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { data: productData } = useProducts(
        searchText,
        1,
        50,
        selectedCategory,
    );
    const { data: categoryData } = useCategories();
    const { mutate: checkTransactionMutate } = useCheckTransaction();
    const products = (productData?.data as IProduct[]) ?? [];
    const categories = (categoryData?.data as ICategory[]) ?? [];
    const allCategories = [
        {
            id: undefined,
            name: "All",
        },
        ...categories,
    ];
    const addToCart = (product: IProduct) => {
        console.log("add to order clicked");
        if (product.qty <= 0) {
            toast.warning("Product out of stock");
            return;
        }

        setCartItems((prev) => {
            const existingItem = prev.find((item) => item.id === product.id);

            if (existingItem) {
                if (existingItem.qty >= existingItem.stock) {
                    console.log("add to order clicked");
                    toast.warning("Product out of stock");
                    return prev;
                }

                return prev.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
                );
            }

            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name,
                    category: product.category?.name || "Uncategorized",
                    price: Number(product.price),
                    imageUrl: product.productImage?.[0]?.imageUrl || "/placeholder.svg",
                    stock: product.qty,
                    qty: 1,
                },
            ];
        });
    };

    const removeFromCart = (id: number) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    }

    const updateQty = (id: number, qty: number) => {
        if (qty <= 0) {
            removeFromCart(id);
            return;
        }

        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        qty: qty > item.stock ? item.stock : qty,
                    }
                    : item
            )
        );
    };


    const subtotal = cartItems.reduce((sum, item) =>
        sum + item.price * item.qty, 0);
    const total = subtotal;
    const { mutate: createOrder } = useCreateOrder();
    const { mutate: createPaymentMutate } = useCreatePayment();
    const handPlaceOrder = () => {
        setLoading(true);
        const payload: OrderPayload = {
            discount: 0,
            items: cartItems.map((item) => ({
                productId: item.id,
                qty: item.qty,
            })),
        }
        createOrder(payload, {
            onSuccess: (res) => {
                const orderId = res.data.id
                createPaymentMutate(orderId, {
                    onSuccess: (res) => {
                        if (res.data) {
                            const payway = res?.data?.payway;
                            if (!payway) {
                                console.error("Invalid payway response:", res.data);
                                toast.error("Payment data missing");
                                return;
                            }
                            const form = document.createElement("form");
                            form.id = "aba_merchant_request";
                            form.method = payway.method;
                            form.action = payway.action;
                            form.target = payway.target;
                            Object.entries(payway.fields).forEach(([key, value]) => {
                                const input = document.createElement("input");
                                input.type = "hidden";
                                input.name = key;
                                input.value = String(value);
                                form.appendChild(input);
                            });

                            document.body.appendChild(form);

                            setIsOpen(false);
                            AbaPayway?.checkout();
                            
                        }
                    }
                })
                // toast.success("Order placed successfully");
                // setCartItems([]);
                // setIsOpen(false);
                // setIsSuccess(true);
            },
            onSettled: () => {
                setLoading(false);
            }
        })
    }
useEffect(() => {
    const tranId =
        searchParams.get("tranId") ||
        searchParams.get("tran_id") ||
        searchParams.get("payment_ref");

    if (!tranId) return;

    checkTransactionMutate(tranId, {
        onSuccess: () => {
            setSearchParams({});
        },
    });
}, [searchParams, checkTransactionMutate, setSearchParams]);
    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                setIsSuccess(false);
            }, 3000); // 3 seconds

            return () => clearTimeout(timer); // cleanup
        }
    }, [isSuccess]);
    useEffect(() => {
        const timer = setTimeout(() => { }, 5000); // delay 5 sec

        return () => clearTimeout(timer);
    }, [searchText]);

    return (
        <div>
            <div className="flex h-screen">
                {/* Left Sidebar */}

                {/* Main Content */}
                <div className="flex flex-1 flex-col">
                    {/* Header */}
                    <div className="border-b p-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-semibold">Categories</h1>
                            <div className="flex items-center gap-2">
                                <ChevronLeft className="text-muted-foreground h-5 w-5" />
                                <ChevronRight className="text-muted-foreground h-5 w-5" />
                            </div>
                        </div>
                    </div>
                    <div className="border-b bg-white p-4">
                        <div className="max-w-md">
                            <Input
                                type="text"
                                placeholder="Search product..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="h-11 rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="border-b p-4">
                        <div className="flex gap-4 overflow-x-auto">
                            {allCategories.map((category, index) => (
                                <div
                                    key={index}
                                    className="hover:bg-muted flex min-w-[80px] cursor-pointer flex-col items-center rounded-lg p-2"
                                    onClick={() => setSelectedCategory(category.id)}>
                                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-2xl">
                                        {category.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-muted-foreground text-center text-xs">{category.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Menu Items Grid */}
                    <div className="flex-1 overflow-auto bg-slate-50 p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.map((item: IProduct) => (
                                <Card
                                    key={item.id}
                                    className="group cursor-pointer overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                                    onClick={() => addToCart(item)}
                                >
                                    <CardContent className="p-0">
                                        <div className="relative">
                                            <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                                                <img
                                                    src={item.productImage?.[0]?.imageUrl ?? "/no-image.png"}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>

                                            <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                                                Stock {item.qty}
                                            </div>
                                        </div>


                                        <div className="space-y-3 p-4">
                                            <div className="space-y-1">
                                                <h3 className="line-clamp-1 text-base font-bold text-slate-900">
                                                    {item.name}
                                                </h3>
                                                <p className="line-clamp-1 text-sm text-slate-500">
                                                    {item?.category?.name || "Uncategorized"}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                        Price
                                                    </p>
                                                    <p className="text-xl font-bold text-blue-600">
                                                        ${item.price}
                                                    </p>
                                                </div>

                                                <div className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-blue-700">
                                                    Add
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Right Sidebar - Order Summary */}
                <div className="flex w-80 flex-col border-l">
                    <div className="border-b p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Plus className="text-muted-foreground h-4 w-4" />
                                <Trash2 className="text-muted-foreground h-4 w-4" type="button"
                                    onClick={() => setCartItems([])} />
                            </div>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 py-1">
                        <div className="space-y-3 p-2">
                            {cartItems.map((item: ICart, index: number) => (
                                <div
                                    key={`${item.id}-${index}`}
                                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                                >
                                    {/* Image */}
                                    <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-slate-100">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                                            {item.name}
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            {item.category}
                                        </p>
                                        <p className="text-sm font-medium text-blue-600">
                                            ${item.price}
                                        </p>
                                    </div>

                                    {/* Right side */}
                                    <div className="flex flex-col items-end gap-2">
                                        <p className="text-sm font-bold text-slate-900">
                                            ${(item.price * item.qty).toFixed(2)}
                                        </p>

                                        <div className="flex items-center gap-1">
                                            {/* minus */}
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-7 w-7"
                                                onClick={() => updateQty(item.id, item.qty - 1)}
                                            >
                                                <MinusIcon className="h-3 w-3" />
                                            </Button>

                                            <span className="w-6 text-center text-sm font-medium">
                                                {item.qty}
                                            </span>

                                            {/* plus */}
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-7 w-7"
                                                onClick={() => updateQty(item.id, item.qty + 1)}
                                            >
                                                <PlusIcon className="h-3 w-3" />
                                            </Button>

                                            {/* delete */}
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="h-7 w-7 ml-1"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="border-t p-4">
                        <div className="mb-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>{subtotal.toFixed(2)}$</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>{total.toFixed(2)}$</span>
                            </div>
                        </div>

                        <div className="mb-4 grid grid-cols-3 gap-2">
                            <Button
                                variant="outline"
                                className="flex h-auto flex-col items-center bg-transparent p-4">
                                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                                    <span className="font-semibold text-green-600">$</span>
                                </div>
                                <span className="text-xs">Cash</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex h-auto flex-col items-center bg-transparent p-4">
                                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                                    <QrCode className="h-4 w-4 text-purple-600" />
                                </div>
                                <span className="text-xs">Scan</span>
                            </Button>
                        </div>

                        <Button className="w-full bg-blue-600 py-3 text-white hover:bg-blue-700"
                            onClick={() => setIsOpen(true)}>
                            Checkout ${total.toFixed(2)}
                        </Button>
                    </div>
                </div>
            </div>
            <SharedDialog
                open={isOpen}
                setOpen={setIsOpen}
                isCancel={true}
                title="Order Summary"
                desc="This is success"
            >
                <div className="space-y-4">
                    {cartItems.map((item: ICart, index: number) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                            <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-slate-100">
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="flex-1 space-y-1">
                                <h4 className="text-base font-semibold text-slate-900">
                                    {item.name}
                                </h4>

                                <p className="text-sm text-slate-500">
                                    {item.category}
                                </p>

                                <div className="flex items-center gap-3 pt-1">
                                    <p className="text-sm font-medium text-red-500">
                                        ${item.price}
                                    </p>
                                    <span className="text-sm text-slate-400">×</span>
                                    <p className="text-sm font-medium text-slate-700">
                                        {item.qty}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-lg font-bold text-slate-900">
                                    ${(item.price * item.qty).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <span className="text-base font-medium text-slate-600">
                        Total
                    </span>
                    <p className="text-xl font-bold text-slate-900">
                        ${total.toFixed(2)}
                    </p>
                </div>

                <Button onClick={handPlaceOrder} type="button" className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-base font-semibold text-white hover:bg-blue-700">
                    Please Order
                </Button>
            </SharedDialog>
            <SharedDialog
                open={isSuccess}
                setOpen={setIsSuccess}
                isCancel={true}
                title="Order Success"
            >
                <div className="py-6">
                    <p className="text-center text-lg font-semibold text-green-600">
                        Order successfully placed
                    </p>
                </div>
            </SharedDialog>
        </div>
    );
}