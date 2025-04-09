import axios from "axios";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { Proveedor } from "../types/proveedores";

const URL = import.meta.env.VITE_URL_DATOS; 

const queryClient = new QueryClient();

const fetchProveedores = async(): Promise<Proveedor[]> => {
    try {
        const response = await axios.get(`${URL}/proveedores`);
        return response.data;
    } catch (error) {
        console.error('Hubo un error en la peticion', error);
        throw error;
    }
};

const addProveedor = async (proveedor: Partial<Proveedor>): Promise<Proveedor> => {
    try {
        console.log(proveedor);
        
        const response = await axios.post(
            `${URL}/proveedores`,
            proveedor
        );
        return response.data;
    } catch (error) {
        console.error('Error al agregar proveedor:', error);
        throw error;
    }
};

const updateProveedor = async (proveedor: Partial<Proveedor>): Promise<Proveedor> => {
    try {
        const response = await axios.put(
            `${URL}/proveedores/${proveedor.id}`,
            proveedor
        );
        return response.data;
    } catch (error) {
        console.error('Error al actualizar proveedor:', error);
        throw error;
    }
};
    
export const useProveedores = () => {
    return useQuery<Proveedor[], Error>({
        queryKey: ['proveedores'],
        queryFn: fetchProveedores,
        staleTime: 1000 * 60 * 30
    });
};
 
export const useAddProveedor = () => {
    return useMutation<Proveedor, Error, Partial<Proveedor>>({
        mutationFn: addProveedor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['proveedores'] });
        },
        onError: (error) => {
            console.error('Error adding proveedor:', error);
        }
    });
};

export const useUpdateProveedor = () => {
    return useMutation<Proveedor, Error, Partial<Proveedor>>({
        mutationFn: updateProveedor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['proveedores'] });
        },
        onError: (error) => {
            console.error('Error updating proveedor:', error);
        }
    });
};
