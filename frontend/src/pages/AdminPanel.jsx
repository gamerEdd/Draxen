import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export default function AdminPanel() {
  const { user, token } = useAuth();
  const [tabs, setTabs] = useState('productos');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: '',
    imagenes: [],
    tallas: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    Promise.all([
      api.getProductos(1, 100),
      api.getCategorias()
    ]).then(([datosProductos, datosCategorias]) => {
      setProductos(datosProductos.productos);
      if (datosCategorias.success) {
        setCategorias(datosCategorias.categorias);
      }
    });
  };

  const handleAddProducto = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = await fetch('http://localhost:5000/api/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(nuevoProducto)
    }).then(r => r.json());

    if (data.success) {
      alert('Producto creado exitosamente');
      setNuevoProducto({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria_id: '',
        imagenes: [],
        tallas: []
      });
      loadData();
    } else {
      alert('Error al crear producto');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <img 
            src="http://localhost:5000/logos/logo.png" 
            alt="DRAXEN" 
            className="h-10"
          />
          <h1 className="text-4xl font-black text-white">PANEL ADMIN</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setTabs('productos')}
            className={`px-6 py-3 font-bold transition ${
              tabs === 'productos'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setTabs('categorias')}
            className={`px-6 py-3 font-bold transition ${
              tabs === 'categorias'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Categorías
          </button>
        </div>

        {/* Productos Tab */}
        {tabs === 'productos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-gray-900 p-6 rounded border border-gray-700 h-fit">
              <h2 className="text-2xl font-bold text-white mb-4">Nuevo Producto</h2>
              <form onSubmit={handleAddProducto} className="space-y-4">
                <div>
                  <label className="block text-white font-bold mb-2">Nombre</label>
                  <input
                    type="text"
                    value={nuevoProducto.nombre}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded"
                  />
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">Descripción</label>
                  <textarea
                    value={nuevoProducto.descripcion}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white font-bold mb-2">Precio</label>
                    <input
                      type="number"
                      step="0.01"
                      value={nuevoProducto.precio}
                      onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-bold mb-2">Categoría</label>
                    <select
                      value={nuevoProducto.categoria_id}
                      onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria_id: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded"
                    >
                      <option value="">Seleccionar</option>
                      {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 text-black py-2 rounded font-bold hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {loading ? 'Creando...' : 'CREAR PRODUCTO'}
                </button>
              </form>
            </div>

            {/* List */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Productos Actuales</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {productos.map(p => (
                  <div
                    key={p.id}
                    className="bg-gray-900 p-3 rounded border border-gray-700 text-sm"
                  >
                    <p className="text-white font-bold">{p.nombre}</p>
                    <p className="text-orange-500">${p.precio}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Categorías Tab */}
        {tabs === 'categorias' && (
          <div className="bg-gray-900 p-6 rounded border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Categorías</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorias.map(cat => (
                <div key={cat.id} className="bg-gray-800 p-4 rounded border border-gray-700">
                  <p className="text-white font-bold">{cat.nombre}</p>
                  <p className="text-gray-400 text-sm">{cat.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
