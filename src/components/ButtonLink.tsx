// components/ButtonLink.tsx
import { Link } from "react-router";

interface ButtonProps {
  nombre: string;
  vista: string;
  className?: string;
}

const ButtonLink = ({ nombre, vista, className = '' }: ButtonProps) => {
  return (
    <Link 
      to={vista}
      className={`text-white py-2 px-4 rounded-lg text-center transition ${className || 'bg-blue-500 hover:bg-blue-600'}`}
    >
      {nombre}
    </Link>
  );
};

export default ButtonLink;