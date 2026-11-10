import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';
import ProductGrid from '../components/ProductGrid';

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getProductos(1, 20, categoriaSeleccionada, busqueda),
      api.getCategorias()
    ]).then(([datosProductos, datosCategorias]) => {
      setProductos(datosProductos.productos);
      if (datosCategorias.success) {
        setCategorias(datosCategorias.categorias);
      }
      setLoading(false);
    });
  }, [categoriaSeleccionada, busqueda]);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <div className="h-96 bg-gradient-to-b from-gray-900 to-black border-b border-orange-500 flex flex-col justify-center items-center text-center">
        <img 
          src="http://localhost:5000/logos/logo.png" 
          alt="DRAXEN" 
          className="h-24 mb-4"
        />
        <p className="text-2xl text-orange-500 font-bold">FASE PENDIENTE</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded focus:border-orange-500 focus:outline-none"
          />

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCategoriaSeleccionada(null)}
              className={`px-4 py-2 rounded font-bold transition ${
                categoriaSeleccionada === null
                  ? 'bg-orange-500 text-black'
                  : 'border border-gray-700 text-white hover:border-orange-500'
              }`}
            >
              Todos
            </button>
            {categorias.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoriaSeleccionada(cat.id)}
                className={`px-4 py-2 rounded font-bold transition ${
                  categoriaSeleccionada === cat.id
                    ? 'bg-orange-500 text-black'
                    : 'border border-gray-700 text-white hover:border-orange-500'
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Productos */}
        {loading ? (
          <div className="text-center text-white py-12">
            <p>Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center text-white py-12">
            <p>No hay productos disponibles</p>
          </div>
        ) : (
          <ProductGrid>
            {productos.map(producto => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </ProductGrid>
        )}
      </div>
    </div>
  );
}
