import { create } from "zustand";

export interface Product {
    _id: string;
    name: string;
    // backend may return price as number or string; keep flexible
    price?: number | string;
    image?: string;
    category?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: any;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export interface CreateProductPayload {
    name: string;
    price: number;
    image: string;
}

export interface ProductStore {
    products: Product[];
    setProducts: (products: Product[]) => void;
    createProduct: (newProduct: CreateProductPayload) => Promise<ApiResponse>;
    fetchProducts: () => Promise<void>;
    deleteProduct: (pid: string) => Promise<ApiResponse>;
    updateProduct: (pid: string, updatedProduct: Partial<CreateProductPayload>) => Promise<ApiResponse>;
}

export const useProductStore = create<ProductStore>((set) => ({
    products: [],
    setProducts: (products: Product[]) => set({ products }),
    createProduct: async (newProduct: CreateProductPayload): Promise<ApiResponse> => {
        if (!newProduct.name || !newProduct.image || !newProduct.price) {
            return { success: false, message: 'Please fill in all fields.' };
        }
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
        });
        const data: ApiResponse<Product> = await res.json();
        if (data.data) {
            set((state) => ({ products: [...state.products, data.data as Product] }));
        }
        return { success: true, message: 'Product created successfully' };
    },
    fetchProducts: async (): Promise<void> => {
        const res = await fetch('/api/products');
        const data: ApiResponse<Product[]> = await res.json();
        if (data.data) {
            set({ products: data.data });
        }
    },
    deleteProduct: async (pid: string): Promise<ApiResponse> => {
        const res = await fetch(`/api/products/${pid}`, {
            method: 'DELETE',
        });
        const data: ApiResponse = await res.json();
        if (!data.success) return { success: false, message: data.message };

        // update the ui immediately, without needing a refresh
        set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
        return { success: true, message: data.message };
    },
    updateProduct: async (pid: string, updatedProduct: Partial<CreateProductPayload>): Promise<ApiResponse> => {
        const res = await fetch(`/api/products/${pid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        });
        const data: ApiResponse<Product> = await res.json();
        if (!data.success) return { success: false, message: data.message };

        // update the ui immediately, without needing a refresh
        set((state) => ({
            products: state.products.map((product) => (product._id === pid ? (data.data as Product) : product)),
        }));

        return { success: true, message: data.message };
    },
}));