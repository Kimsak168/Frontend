export interface IProduct  {
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
export interface IProductImage {
    id: number;
    productId: number;
    imageUrl: string;
    fileName: string
}