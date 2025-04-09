import { useState } from "react";
import { Link } from "react-router";
import { useProductos } from "../peticiones/queryProductos";
import Tarjeta from "../components/Tarjeta";
import BotonRegresar from "../components/BotonRegresar";

export default function EditarInventario() {
    const [filtro, setFiltro] = useState("");
    const { data: productos, isLoading, isError } = useProductos();

    const productosFiltrados = productos?.filter(producto =>
        producto.producto.toLowerCase().includes(filtro.toLowerCase()) ||
        (producto.anotaciones && producto.anotaciones.toLowerCase().includes(filtro.toLowerCase()))
    ) || [];

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-6">
                <BotonRegresar />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold">Editar Inventario</h1>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Buscar por producto o anotaciones..."
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />

                    <Link
                        to="/agregar-producto"
                        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition whitespace-nowrap text-center"
                    >
                        + Agregar Producto
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center text-gray-500 py-8 border rounded-lg bg-gray-50">
                    Cargando productos...
                </div>
            ) : isError ? (
                <div className="text-center text-red-500 py-8 border rounded-lg bg-red-50">
                    Error al cargar los productos
                </div>
            ) : productosFiltrados.length === 0 ? (
                <div className="text-center text-gray-500 py-8 border rounded-lg bg-gray-50">
                    No se encontraron productos con ese criterio de búsqueda
                </div>
            ) : (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {productosFiltrados.map((producto) => (
                        <Tarjeta
                            key={producto.id}
                            producto={producto}
                        />
                    ))}
                </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                <Link
                    to="/"
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition text-center"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}
