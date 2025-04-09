// App.tsx
import { Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Home from "./pages/Home";
import ListaProductos from "./pages/ListaProductos";
import EditarInventario from "./pages/EditarInventario";
import EditarProducto from "./pages/EditarProducto";
import NotFound from "./pages/NotFound";
import CarruselActualizar from "./pages/CarruselActualizar";
import AgregarProducto from "./pages/AgregarProducto";
import AgregarProveedor from "./pages/AgregarProveedor";
import EditarProveedor from "./pages/EditarProveedor";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <header className="bg-blue-500 text-white shadow-md p-4">
          <h1 className="text-xl font-semibold">Tienda</h1>
        </header>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lista-productos" element={<ListaProductos />} />
            <Route path="/editar-inventario" element={<EditarInventario />} />
            <Route path="/agregar-producto" element={<AgregarProducto/>} />
            <Route path="/editar-producto/:productoNombre" element={<EditarProducto />} />
            <Route path="/editar-producto/:productoNombre/agregarProveedor" element={<AgregarProveedor/>} />
            <Route path="/editar-producto/:productoNombre/editarProveedor/:proveedorId" element={<EditarProveedor/>} />
            <Route path="/actualizarTodo/:productoId" element={<CarruselActualizar/>}/>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;