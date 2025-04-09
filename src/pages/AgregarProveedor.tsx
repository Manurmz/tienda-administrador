import { useState, useMemo } from "react";
import { Proveedor } from "../types/proveedores";
import { useNavigate, useParams } from "react-router";
import { useProductos } from "../peticiones/queryProductos";
import { useAddProveedor } from "../peticiones/queryProveedores";
import { FaArrowLeft } from "react-icons/fa";

export default function AgregarProveedor() {
  const [formData, setFormData] = useState<Partial<Proveedor>>({
    id_producto: 0,
    nombre: '',
    precio_compra_lote: null,
    unidades_por_lote: null,
    anotaciones: null,
  });

  const precio_unitario = useMemo(() => {
    if (formData.precio_compra_lote && formData.unidades_por_lote) {
      return formData.precio_compra_lote / formData.unidades_por_lote;
    }
    return null;
  }, [formData.precio_compra_lote, formData.unidades_por_lote]);
  const { data: productos = [] } = useProductos();
  const { productoNombre } = useParams();
  const { mutate: addProveedor } = useAddProveedor();

  const producto = productos.find(p => p.producto === productoNombre);
  const productoId = producto?.id;
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value !== '' ? (name.includes('precio') || name.includes('unidades') ? parseFloat(value) || null : value) : null
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      id_producto: Number(productoId),
      precio_unitario: precio_unitario
    };

    if (dataToSubmit.id_producto != 0) {
      addProveedor(dataToSubmit);
    }
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

      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center mt-10">Agregar Nuevo Proveedor</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Proveedor
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre del proveedor"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio del Lote
          </label>
          <input
            type="number"
            name="precio_compra_lote"
            step="0.01"
            value={formData.precio_compra_lote ?? ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unidades por Lote
          </label>
          <input
            type="number"
            name="unidades_por_lote"
            value={formData.unidades_por_lote ?? ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Unitario (Calculado)
          </label>
          <input
            type="text"
            readOnly
            value={precio_unitario ? precio_unitario.toFixed(2) : ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            placeholder="Se calcula automáticamente"
          />
          <p className="text-xs text-gray-500 mt-1">
            Calculado: Precio de compra / Unidades por lote
          </p>
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
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Agregar Proveedor
        </button>
      </form>
    </div>
  );
}