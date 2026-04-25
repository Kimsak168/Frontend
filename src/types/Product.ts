export type IProduct = {
    id: number;
    name: string;
    qty: number;
    price: number;
    isActive: boolean;
    category?: {
        id: number;
        name: string;
    };
    productImage? : IProductImage[]
};
export type IProductImage = {
    id: number;
    productId: number;
    imageUrl: string;
    fileName: string
}