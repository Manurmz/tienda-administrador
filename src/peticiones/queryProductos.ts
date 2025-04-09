import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Producto } from "../types/productos";

const URL = import.meta.env.VITE_URL_DATOS || "http://localhost:8787/api";

// Claves de consulta centralizadas
const queryKeys = {
    productos: ['productos'] as const
};

// Funciones de API extraídas
const api = {
    fetchProductos: async (): Promise<Producto[]> => {
        const response = await axios.get(`${URL}/tienda/productos`);
        return response.data;
    },

    addProducto: async (newProduct: Omit<Producto, 'id' | 'created_at'>): Promise<Producto> => {
        const response = await axios.post(`${URL}/tienda/producto`, newProduct);
        return response.data;
    },

    updateProducto: async (updatedProduct: Partial<Producto>) => {
        const response = await axios.put(
            `${URL}/tienda/producto/${updatedProduct.producto}`, 
            updatedProduct
        );
        return response.data.message;
    }
};

// Hooks
export const useProductos = () => {
    return useQuery<Producto[], Error>({
        queryKey: queryKeys.productos,
        queryFn: api.fetchProductos,
        staleTime: 1000 * 60 * 30,
    });
};

export const useAddProducto = () => {
    const queryClient = useQueryClient();
    
    return useMutation<Producto, Error, Omit<Producto, 'id' | 'created_at'>>({
        mutationFn: api.addProducto,
        onSuccess: (newProduct) => {
            queryClient.setQueryData<Producto[]>(queryKeys.productos, (old = []) => [
                ...old,
                newProduct
            ]);
        }
    });
};

export const useUpdateProducto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: api.updateProducto,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.productos });
        },
    });
};

export const useUpdateProductoCarrusel = () => {
    const queryClient = useQueryClient();

    const optimisticUpdate = (
        old: Producto[] = [], 
        updatedProduct: Partial<Producto>
    ): Producto[] => {
        return old.map(product =>
            product.id === updatedProduct.id
                ? { ...product, ...updatedProduct }
                : product
        );
    };

    return useMutation({
        mutationFn: api.updateProducto,
        onMutate: async (updatedProduct: Partial<Producto>) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.productos });
            const previousProductos = queryClient.getQueryData<Producto[]>(queryKeys.productos);

            if (previousProductos && updatedProduct.id) {
                queryClient.setQueryData<Producto[]>(
                    queryKeys.productos,
                    (old) => optimisticUpdate(old, updatedProduct)
                );
            }

            return { previousProductos };
        },
        onError: (_, __, context) => {
            if (context?.previousProductos) {
                queryClient.setQueryData(queryKeys.productos, context.previousProductos);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.productos });
        }
    });
};
