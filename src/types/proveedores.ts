export type Proveedor = {
    id: number; // Número entero que identifica el registro
    created_at: string; // Fecha y hora en formato ISO 8601
    id_producto: number; // Identificador del producto
    nombre: string; // Nombre del producto
    precio_compra_lote: number | null; // Precio total del lote
    unidades_por_lote: number | null; // Cantidad de unidades en el lote
    precio_unitario: number | null; // Precio por unidad
    anotaciones: string | null; // Notas adicionales o comentarios
  };