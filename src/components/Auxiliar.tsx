import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { Producto } from "../types/productos";

export default function EditarProducto() {
  const navigate = useNavigate();
  const { productoNombre } = useParams<{ productoNombre: string }>();
  const [producto, setProducto] = useState<Partial<Producto>>({
    producto: '',
    precio_tienda: null,
    precio_tianguis: null,
    anotaciones: null
  });

  const [inputValues, setInputValues] = useState({
    precio_tienda: '',
    precio_tianguis: '',
    anotaciones: ''
  });

  const [isFocused, setIsFocused] = useState({
    precio_tienda: false,
    precio_tianguis: false,
    anotaciones: false
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const URL = import.meta.env.VITE_URL_DATOS || "http://localhost:8787/api";

  useEffect(() => {
    const fetchProducto = async () => {
      if (!productoNombre) return;

        try {
        setIsLoading(true);
        const response = await axios.get(`${URL}/tienda/producto/${productoNombre}`);

        if (response.status !== 200) {
          throw new Error('Error al obtener el producto');
        }

        const productData = response.data;
          setProducto(productData);
          setInputValues({
            precio_tienda: productData.precio_tienda?.toString() || '',
            precio_tianguis: productData.precio_tianguis?.toString() || '',
            anotaciones: productData.anotaciones || ''
          });
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('No se pudo cargar el producto');
      } finally {
        setIsLoading(false);
}
      };
    fetchProducto();
  }, [productoNombre, URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    const updatedProduct = {
      ...producto,
      precio_tienda: inputValues.precio_tienda ? Number(inputValues.precio_tienda) : null,
      precio_tianguis: inputValues.precio_tianguis ? Number(inputValues.precio_tianguis) : null,
      anotaciones: inputValues.anotaciones || null
    };

      await axios.put(`${URL}/tienda/producto/${productoNombre}`, updatedProduct);
      navigate(-1);
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Error al guardar los cambios');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFocus = (field: keyof typeof isFocused) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
    if (!inputValues[field]) {
      setInputValues(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: keyof typeof isFocused) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  if (isLoading) {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  if (error) {
  return (
      <div className="p-6 text-center text-red-500">
        {error}
          <button
            onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-md"
          >
          Volver
          </button>
    </div>
  );
}

  return (
    <div className="p-6 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Editar Producto</h2>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Producto: <span className="font-normal">{producto.producto}</span>
          </h3>
        </div>

        <div className="relative">
          <label
            className={`absolute left-3 transition-all duration-200 ${
              isFocused.precio_tienda || inputValues.precio_tienda
                ? 'text-xs -top-3 bg-white px-1 text-blue-500'
                : 'top-2 text-gray-500'
            }`}
          >
            Precio Tienda
          </label>
          <input
            type="number"
            name="precio_tienda"
            value={inputValues.precio_tienda}
            onChange={handleChange}
            onFocus={() => handleFocus('precio_tienda')}
            onBlur={() => handleBlur('precio_tienda')}
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            step="0.01"
          />
        </div>

        <div className="relative">
          <label
            className={`absolute left-3 transition-all duration-200 ${
              isFocused.precio_tianguis || inputValues.precio_tianguis
                ? 'text-xs -top-3 bg-white px-1 text-blue-500'
                : 'top-2 text-gray-500'
            }`}
          >
            Precio Tianguis
          </label>
          <input
            type="number"
            name="precio_tianguis"
            value={inputValues.precio_tianguis}
            onChange={handleChange}
            onFocus={() => handleFocus('precio_tianguis')}
            onBlur={() => handleBlur('precio_tianguis')}
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            step="0.01"
          />
        </div>

        <div className="relative">
          <label
            className={`absolute left-3 transition-all duration-200 ${
              isFocused.anotaciones || inputValues.anotaciones
                ? 'text-xs -top-3 bg-white px-1 text-blue-500'
                : 'top-2 text-gray-500'
            }`}
          >
            Anotaciones
          </label>
          <textarea
            name="anotaciones"
            value={inputValues.anotaciones}
            onChange={handleChange}
            onFocus={() => handleFocus('anotaciones')}
            onBlur={() => handleBlur('anotaciones')}
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[100px]"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            Atrás
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
