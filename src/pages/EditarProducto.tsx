import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useProductos, useUpdateProducto } from "../peticiones/queryProductos";
import { Producto } from "../types/productos";
import TablaProveedores from "./proveedores/TablaProveedores";

export default function EditarProducto() {
  const { productoNombre } = useParams<{ productoNombre: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Producto>>({
    producto: '',
    precio_tienda: null,
    precio_tianguis: null,
    anotaciones: null,
  });

  const { data: productos = [], isLoading, error } = useProductos();
  const { mutate: updateProducto } = useUpdateProducto();

  useEffect(() => {
    if (productos.length > 0 && productoNombre) {
      const producto = productos.find(p => p.producto === productoNombre);
      if (producto) {
        setFormData({
          producto: producto.producto,
          precio_tienda: producto.precio_tienda,
          precio_tianguis: producto.precio_tianguis,
          anotaciones: producto.anotaciones,
          id: producto.id
        });
      }
    }
  }, [productos, productoNombre]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value !== '' ? (name.includes('precio') ? parseFloat(value) || null : value) : null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      updateProducto({
        producto: formData.producto,
        precio_tienda: formData.precio_tienda,
        precio_tianguis: formData.precio_tianguis,
        anotaciones: formData.anotaciones
      });
    }
    //navigate(-1);
  };

  const handleAgregarProveedor = () =>{
    console.log('agregar Proveedor');
    navigate(`/editar-producto/${productoNombre}/agregarProveedor`)
    
  }

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading && !formData.producto) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error al cargar el producto</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          &larr; Regresar
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {formData.producto || 'Editar Producto'}
        </h2>
        <div className="w-8"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Tienda
          </label>
          <input
            type="number"
            name="precio_tienda"
            step="0.01"
            value={formData.precio_tienda ?? ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Tianguis
          </label>
          <input
            type="number"
            name="precio_tianguis"
            step="0.01"
            value={formData.precio_tianguis ?? ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anotaciones
          </label>
          <textarea
            name="anotaciones"
            value={formData.anotaciones ?? ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
            placeholder="Notas importantes..."
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
      <TablaProveedores/>
      <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 mt-10 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleAgregarProveedor}
          >
            Agregar Proveedor
          </button>
    </div>
  );
}
