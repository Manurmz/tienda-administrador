// pages/Home.tsx
import ButtonLink from '../components/ButtonLink';
import { Link } from "react-router";

function Home(){
    return(
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Gestión de Inventario</h1>
            <div className="flex flex-col gap-4 max-w-xs mx-auto">
                <ButtonLink nombre="Ver Productos" vista="/lista-productos" />
                <ButtonLink nombre="Editar Inventario" vista="/editar-inventario" />
                <ButtonLink nombre="Nueva Vista" vista="/nueva-vista" className="bg-purple-500" />
                <ButtonLink nombre="Actualizar todo" vista="/actualizarTodo/1" className="bg-purple-500" />
                
                <Link 
                    to="/reportes"
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg text-center hover:bg-yellow-600 transition"
                >
                    Reportes
                </Link>
            </div>
        </div>
    )
}

export default Home;