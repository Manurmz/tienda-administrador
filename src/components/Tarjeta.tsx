import { useNavigate } from "react-router";
import { Producto } from "../types/productos";

interface TarjetaProps {
  producto: Producto;
}

const Tarjeta = ({ producto }: TarjetaProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/editar-producto/${producto.producto}`);
  };

  return (
    <div 
      className='border-2 border-gray-200 p-4 rounded-lg hover:shadow-md transition cursor-pointer'
      onClick={handleClick}
    >
      <div className="mb-2 space-y-1">
        <h3 className="font-semibold text-base">{producto.producto}</h3>
        <div className="text-sm text-gray-600 space-y-0.5">
          {producto.precio_tienda !== null && (
            <p className="font-medium">Tienda: ${producto.precio_tienda.toFixed(2)}</p>
          )}
          {producto.precio_tianguis !== null && (
            <p className="font-medium">Tianguis: ${producto.precio_tianguis.toFixed(2)}</p>
          )}
        {producto.anotaciones && (
            <p className="text-xs italic">Notas: {producto.anotaciones}</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default Tarjeta;