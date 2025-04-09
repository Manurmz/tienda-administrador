// components/BotonRegresar.tsx
import { useNavigate } from "react-router";

const BotonRegresar = () => {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate(-1)}
      className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
    >
      ← Regresar
    </button>
  );
};

export default BotonRegresar;