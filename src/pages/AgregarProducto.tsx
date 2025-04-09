import { useState } from "react";
import { Producto } from "../types/productos";
import { useAddProducto } from "../peticiones/queryProductos";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

export default function AgregarProducto() {
  const [formData, setFormData] = useState<Omit<Producto, 'id' | 'created_at'>>({
    producto: '',
    precio_tienda: null,
    precio_tianguis: null,
    anotaciones: null,
  });

  const navigate = useNavigate();
  const { mutate: addProducto, isPending } = useAddProducto();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value !== '' ? (name.includes('precio') ? parseFloat(value) || null : value) : null
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProducto(formData, {
      onSuccess: () => {
        alert('Producto agregado exitosamente');
        navigate('/editar-inventario');
      },
      onError: (error) => {
        console.error('Error adding product:', error);
        alert('Error al agregar el producto');
      }
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md relative">
      <button
        onClick={handleGoBack}
        className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <FaArrowLeft className="mr-1" /> Regresar
        </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center mt-10">Agregar Nuevo Producto</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Producto
          </label>
          <input
            type="text"
            name="producto"
            value={formData.producto}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre del producto"
            required
          />
    </div>

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

        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isPending
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isPending ? 'Agregando...' : 'Agregar Producto'}
        </button>
      </form>
    </div>
  );
}
