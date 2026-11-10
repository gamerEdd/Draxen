import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useCarrito } from '../context/CarritoContext';

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCarrito();
  const [producto, setProducto] = useState(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    api.getProducto(id).then(data => {
      if (data.success) {
        setProducto(data.producto);
        const imagenPrincipal = data.producto.imagenes?.[0]?.url;
        const urlCompleta = imagenPrincipal
          ? (imagenPrincipal.startsWith('http')
              ? imagenPrincipal
              : `http://localhost:5000${imagenPrincipal}`)
          : 'https://via.placeholder.com/500x600';
        setImagenPrincipal(urlCompleta);
        if (data.producto.tallas.length > 0) {
          setTallaSeleccionada(data.producto.tallas[0]);
        }
      }
      setLoading(false);
    });
  }, [id]);

  const handleAgregarCarrito = () => {
    if (!tallaSeleccionada) {
      alert('Por favor selecciona una talla');
      return;
    }

    addItem(producto, tallaSeleccionada, cantidad);
    setAgregado(true);

    setTimeout(() => setAgregado(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Cargando producto...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Producto no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="text-orange-500 hover:text-orange-600 mb-6 font-bold"
        >
          ← Volver
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imágenes */}
          <div>
            <div className="relative h-96 md:h-full bg-gray-900 rounded mb-4 overflow-hidden">
              <img
                src={imagenPrincipal}
                alt={producto.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            {producto.imagenes?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {producto.imagenes.map((img, idx) => {
                  const urlCompleta = img.url.startsWith('http')
                    ? img.url
                    : `http://localhost:5000${img.url}`;
                  return (
                    <img
                      key={idx}
                      src={urlCompleta}
                      alt="Miniatura"
                      onClick={() => setImagenPrincipal(urlCompleta)}
                      className="w-20 h-20 object-cover rounded cursor-pointer opacity-70 hover:opacity-100 border-2 border-gray-700"
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Información */}
          <div className="text-white">
            <p className="text-orange-500 text-sm mb-2">{producto.categoria_nombre}</p>
            <h1 className="text-4xl font-black mb-4">{producto.nombre}</h1>
            <p className="text-gray-400 mb-6">{producto.descripcion}</p>

            <div className="text-5xl font-black text-orange-500 mb-8">
              ${producto.precio}
            </div>

            {/* Tallas */}
            <div className="mb-6">
              <p className="text-lg font-bold mb-3">Talla</p>
              <div className="flex gap-2 flex-wrap">
                {producto.tallas.map(talla => (
                  <button
                    key={talla.id}
                    onClick={() => setTallaSeleccionada(talla)}
                    disabled={talla.stock === 0}
                    className={`px-6 py-3 font-bold rounded transition ${
                      tallaSeleccionada?.id === talla.id
                        ? 'bg-orange-500 text-black'
                        : talla.stock === 0
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'border border-gray-700 hover:border-orange-500'
                    }`}
                  >
                    {talla.talla} {talla.stock === 0 ? '(Agotado)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Cantidad */}
            <div className="mb-6">
              <p className="text-lg font-bold mb-3">Cantidad</p>
              <div className="flex items-center gap-4 bg-gray-900 p-3 rounded w-fit">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="text-orange-500 text-xl font-bold hover:text-orange-600"
                >
                  −
                </button>
                <span className="text-xl font-bold w-8 text-center">{cantidad}</span>
                <button
                  onClick={() => setCantidad(cantidad + 1)}
                  className="text-orange-500 text-xl font-bold hover:text-orange-600"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botón agregar */}
            <button
              onClick={handleAgregarCarrito}
              disabled={tallaSeleccionada?.stock === 0}
              className={`w-full py-4 text-lg font-black rounded transition ${
                tallaSeleccionada?.stock === 0
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : agregado
                  ? 'bg-green-500 text-black'
                  : 'bg-orange-500 text-black hover:bg-orange-600'
              }`}
            >
              {agregado ? '✓ Agregado al carrito' : 'AGREGAR AL CARRITO'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
