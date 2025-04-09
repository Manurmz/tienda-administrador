import { useProveedores } from "../../peticiones/queryProveedores";
import { useProductos } from "../../peticiones/queryProductos";
import { Proveedor } from "../../types/proveedores";
import { Tooltip } from 'react-tooltip';
import { useParams, useNavigate } from "react-router";

export default function TablaProveedores() {
  const { data: proveedores = [], isLoading, error } = useProveedores();
  const { data: productos = [] } = useProductos();
  const { productoNombre } = useParams();
  const navigate = useNavigate()
  const producto = productos.find(p => p.producto == productoNombre);
  const productoId = producto?.id;

  const filteredProveedores = proveedores.filter(
    (proveedor: Proveedor) => proveedor.id_producto === productoId
  );

  if (isLoading) {
    return <div className="text-center py-4">Cargando proveedores...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error al cargar proveedores</div>;
  }

  if (!productoId) {
    return <div className="text-center py-4">Producto no encontrado</div>;
  }

  const handleEditarProveedor = (id: number) => {
    navigate(`/editar-producto/${productoNombre}/editarProveedor/${id}`)
    console.log('editar proveedor: ', id);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Historial de Proveedores</h3>
      {filteredProveedores.length === 0 ? (
        <div className="text-center py-4">No hay proveedores registrados para este producto</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Lote
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidades/Lote
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProveedores.map((proveedor: Proveedor) => (
                <tr
                  key={proveedor.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleEditarProveedor(proveedor.id)}
                >
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    data-tooltip-id={`tooltip-${proveedor.id}`}
                  >
                    {proveedor.nombre}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    data-tooltip-id={`tooltip-${proveedor.id}`}
                  >
                    ${proveedor.precio_compra_lote!.toFixed(2)}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    data-tooltip-id={`tooltip-${proveedor.id}`}
                  >
                    {proveedor.unidades_por_lote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProveedores.map((proveedor: Proveedor) => (
            <Tooltip
              key={`tooltip-${proveedor.id}`}
              id={`tooltip-${proveedor.id}`}
              className="z-50"
              opacity={0.92}
              place="right"
            >
              <div className="space-y-2">
                <div className="flex items-center">
                  <p className="font-bold mr-1">Precio unitario:</p>
                  ${proveedor.precio_unitario!.toFixed(2)}
                </div>
                <div className="flex items-start">
                  <p className="font-bold mr-1">Anotaciones:</p>
                  {proveedor.anotaciones || 'Ninguna'}
                </div>
              </div>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}
