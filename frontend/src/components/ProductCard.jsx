import { Link } from 'react-router-dom';

export default function ProductCard({ producto }) {
  // Construir URL completa de la imagen
  const imagenUrl = producto.imagen_principal 
    ? (producto.imagen_principal.startsWith('http') 
        ? producto.imagen_principal 
        : `http://localhost:5000${producto.imagen_principal}`)
    : 'https://via.placeholder.com/300x400';

  return (
    <Link to={`/producto/${producto.id}`}>
      <div className="bg-gray-900 rounded overflow-hidden hover:shadow-lg hover:shadow-orange-500/50 transition cursor-pointer">
        <div className="h-64 bg-gray-800 overflow-hidden">
          <img
            src={imagenUrl}
            alt={producto.nombre}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </div>
        <div className="p-4">
          <p className="text-gray-400 text-sm mb-1">{producto.categoria_nombre}</p>
          <h3 className="text-white font-bold text-lg mb-2 truncate">
            {producto.nombre}
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-orange-500 font-bold text-xl">
              ${producto.precio}
            </span>
            <button className="bg-orange-500 text-black px-3 py-1 rounded text-sm font-bold hover:bg-orange-600 transition">
              Ver
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
