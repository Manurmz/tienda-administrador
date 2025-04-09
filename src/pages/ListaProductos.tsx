import { useState } from "react";
import { Link } from "react-router";
import BotonRegresar from "../components/BotonRegresar";
import { useProductos } from "../peticiones/queryProductos";
import { Producto } from "../types/productos";

export default function ListaProductos() {
    const { data: productos = [], isLoading, error } = useProductos();
    const [filtro, setFiltro] = useState("");

    const productosFiltrados = productos.filter((producto: Producto) =>
        producto.producto.toLowerCase().includes(filtro.toLowerCase())
    );

    if (isLoading) return <div>Cargando productos...</div>;
    if (error) return <div>Error: {(error as Error).message}</div>;

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto min-h-screen bg-gray-50">
            <div className="mb-4 sm:mb-6">
                <BotonRegresar />
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 font-[Roboto]">
                    Lista de Productos
                </h1>

                <div className="mb-4 sm:mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 rounded-lg border border-gray-300 
                                      focus:outline-none focus:ring-2 focus:ring-blue-500 
                                      focus:border-transparent transition-all"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                        <svg 
                            className="absolute left-3 top-2.5 sm:top-3.5 h-5 w-5 sm:h-6 sm:w-6 text-gray-400"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                {productosFiltrados.length === 0 ? (
                    <div className="text-center text-gray-500 py-6 sm:py-8 rounded-lg bg-gray-100">
                        <span className="text-lg sm:text-xl">🎯</span>
                        <p className="mt-2">No se encontraron productos</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg shadow-sm">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-gray-600 font-medium uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-gray-600 font-medium uppercase tracking-wider">
                                        Precio
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-gray-600 font-medium uppercase tracking-wider">
                                        Precio de Tianguis
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {productosFiltrados.map((producto: Producto) => (
                                    <tr 
                                        key={producto.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">
                                            {producto.producto}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">
                                            <span className="font-medium text-blue-600">
                                                ${producto.precio_tienda?.toFixed(2) ?? 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700">
                                            <span className="font-medium text-green-600">
                                                ${producto.precio_tianguis?.toFixed(2) ?? 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="mt-4 sm:mt-6 flex justify-end">
                <Link
                    to="/"
                    className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 text-white 
                              rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 
                              focus:ring-offset-2 focus:ring-gray-500 transition-all
                              shadow-md hover:shadow-lg"
                >
                    <svg 
                        className="w-4 sm:w-5 h-4 sm:h-5 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                    </svg>
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}