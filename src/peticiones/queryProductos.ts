import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Producto } from "../types/productos";

const URL = import.meta.env.VITE_URL_DATOS || "http://localhost:8787/api";

const fetchProductos = async (): Promise<Producto[]> => {
    try {
        const response = await axios.get(`${URL}/tienda/productos`);
        return response.data;
    } catch (error) {
        console.error('Error fetching productos:', error);
        throw error;
    }
};

const addProducto = async (newProduct: Omit<Producto, 'id' | 'created_at'>): Promise<Producto> => {
    try {
        const response = await axios.post(`${URL}/tienda/producto`, newProduct);
        return response.data;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

const updateProducto = async (updatedProduct: Partial<Producto>) => {
    try {
        const response = await axios.put(`${URL}/tienda/producto/${updatedProduct.producto}`, updatedProduct);
        console.log("response : ", response.data.message);
        return response.data.message;    
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const useProductos = () => {
    return useQuery<Producto[], Error>({
        queryKey: ['productos'],
        queryFn: fetchProductos,
        staleTime: 1000 * 60 * 30,
    });
};

export const useAddProducto = () => {
    const queryClient = useQueryClient();
    
    return useMutation<Producto, Error, Omit<Producto, 'id' | 'created_at'>>({
        mutationFn: addProducto,
        onSuccess: (newProduct) => {
            queryClient.setQueryData<Producto[]>(['productos'], (old = []) => [
                ...old,
                newProduct
            ]);
        }
    });
};

export const useUpdateProducto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProducto,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productos'] });
        },
    });
};

export const useUpdateProductoCarrusel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProducto,
        onMutate: async (updatedProduct: Partial<Producto>) => {
            await queryClient.cancelQueries({ queryKey: ['productos'] });
            const previousProductos = queryClient.getQueryData<Producto[]>(['productos']);

            if (previousProductos && updatedProduct.id) {
                queryClient.setQueryData<Producto[]>(['productos'], (old) => {
                    if (!old) return [];
                    return old.map(product =>
                        product.id === updatedProduct.id
                            ? { ...product, ...updatedProduct }
                            : product
                    );
                });
            }

            return { previousProductos };
        },
        onError: (err, updatedProduct, context) => {
            if (context?.previousProductos) {
                queryClient.setQueryData(['productos'], context.previousProductos);
            }
        },
    });
};
