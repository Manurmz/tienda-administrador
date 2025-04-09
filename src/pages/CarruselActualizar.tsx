import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { useProductos, useUpdateProductoCarrusel } from "../peticiones/queryProductos";
import { Producto } from "../types/productos";

export default function EditarProducto() {
  const navigate = useNavigate();
  const { productoId } = useParams();
  const [formData, setFormData] = useState<Partial<Producto>>({
    producto: '',
    precio_tienda: null,
    precio_tianguis: null,
    anotaciones: null,
  });

  const { data: productos = [], isLoading, error } = useProductos();
  const { mutate: updateProducto } = useUpdateProductoCarrusel();

  useEffect(() => {
    if (productos.length > 0 && productoId) {
      const productId = parseInt(productoId);
      const producto = productos.find(p => p.id === productId);
      if (producto) {
        setFormData({
          ...producto,
          id: producto.id
        });
      } else if (productId > 0) {
        const firstProduct = productos[0];
        if (firstProduct) {
          navigate(`/actualizarTodo/${firstProduct.id}`);
        }
      }
    }
  }, [productoId, productos, navigate]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value !== '' ? 
        (name.includes('precio') ? parseFloat(value) || null : 
         name === 'id' ? parseInt(value) || null : 
         value) : 
        null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) return;

    updateProducto(formData, {
      onSuccess: () => {
        siguienteProducto();
      }
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const siguienteProducto = () => {
    if (!productos.length) return;

    const currentIndex = productos.findIndex(p => p.id === formData.id);
    if (currentIndex === -1) return;

    const nextIndex = (currentIndex + 1) % productos.length;
    navigate(`/actualizarTodo/${productos[nextIndex].id}`);
  };

  const handleButtonId = () => {
    if (!formData.id) return;

    const productExists = productos.some(p => p.id === formData.id);
    if (productExists) {
      navigate(`/actualizarTodo/${formData.id}`);
    } else {
      const firstProduct = productos[0];
      if (firstProduct) {
        navigate(`/actualizarTodo/${firstProduct.id}`);
      }
    }
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

        <div className="flex space-x-4 mt-15">
          <button
            type="button"
            onClick={siguienteProducto}
            className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Siguiente
          </button>
        </div>
        <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2 flex-1">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                ID:
                </label>
                <input
                type="number"
                name="id"
                step="1"
                value={formData.id ?? ''}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese ID"
                />
            </div>
            
            <button
                type="button"
                onClick={handleButtonId}
                className="h-10 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Buscar
            </button>
            </div>
      </form>
    </div>
  );
}
