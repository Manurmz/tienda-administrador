// pages/VistaProducto.tsx
import { useParams } from "react-router";

export default function VistaProducto() {
  const { nombreProducto } = useParams();
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Producto: {nombreProducto}
      </h1>
      <p className="mt-4">Esta es la página del producto específico</p>
    </div>
  )
}