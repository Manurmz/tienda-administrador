export type Producto = {
    id: number;
    created_at: string | Date;
    producto: string;
    precio_tienda: number | null;
    anotaciones: string | null;
    precio_tianguis: number | null;
};