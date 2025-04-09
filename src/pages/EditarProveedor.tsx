import { useParams, useNavigate } from "react-router";
import { useState, useEffect, useMemo } from "react";
import { useProveedores, useUpdateProveedor } from "../peticiones/queryProveedores";
import { Proveedor } from "../types/proveedores";

export default function EditarProveedor() {
  const { proveedorId, productoNombre } = useParams<{ proveedorId: string, productoNombre: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Proveedor>>({
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

  const { data: proveedores = [], isLoading, error } = useProveedores();
  const { mutate: updateProveedor } = useUpdateProveedor();

  useEffect(() => {
    if (proveedores.length > 0 && proveedorId) {
      const proveedor = proveedores.find(p => p.id === parseInt(proveedorId));
      if (proveedor) {
        setFormData({
          id: proveedor.id,
          nombre: proveedor.nombre,
          precio_compra_lote: proveedor.precio_compra_lote,
          unidades_por_lote: proveedor.unidades_por_lote,
          anotaciones: proveedor.anotaciones,
        });
      }
    }
  }, [proveedores, proveedorId]);

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
      updateProveedor({ 
        id: formData.id,
        nombre: formData.nombre!,
        precio_compra_lote: formData.precio_compra_lote!,
        unidades_por_lote: formData.unidades_por_lote!,
        precio_unitario: precio_unitario!,
        anotaciones: formData.anotaciones!
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(`/editar-producto/${formData.id_producto}`);
  };

  if (isLoading && !formData.nombre) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error al cargar el proveedor</div>;
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
          {productoNombre || 'Editar Proveedor'}
        </h2>
        <div className="w-8"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Producto
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre ?? ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre del producto"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio de Compra por Lote
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

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleCancel}
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
    </div>
  );
}
