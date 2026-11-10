import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export default function Carrito() {
  const { items, removeItem, updateCantidad, limpiarCarrito, total } = useCarrito();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [direccion, setDireccion] = useState('');
  const [error, setError] = useState('');

  const impuestos = total * 0.21;
  const totalConImpuestos = total + impuestos;

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!direccion.trim()) {
      setError('Por favor ingresa una dirección de envío');
      return;
    }

    setLoading(true);
    setError('');

    const data = await api.createPedido(
      {
        carrito: items,
        direccion_envio: direccion
      },
      token
    );

    if (data.success) {
      limpiarCarrito();
      alert('¡Pedido creado exitosamente!');
      navigate('/pedidos');
    } else {
      setError(data.message || 'Error al crear el pedido');
    }

    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black text-white mb-4">CARRITO</h1>
          <p className="text-gray-400 text-xl mb-8">Tu carrito está vacío</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-black px-8 py-3 rounded font-bold hover:bg-orange-600 transition"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <img 
            src="http://localhost:5000/logos/logo.png" 
            alt="DRAXEN" 
            className="h-10"
          />
          <h1 className="text-4xl font-black text-white">CARRITO DE COMPRAS</h1>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div
                key={`${item.producto_id}-${item.talla_id}`}
                className="bg-gray-900 p-6 rounded border border-gray-700 flex gap-4"
              >
                {item.imagen && (
                  <img
                    src={item.imagen.startsWith('http') ? item.imagen : `http://localhost:5000${item.imagen}`}
                    alt={item.nombre}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{item.nombre}</h3>
                  <p className="text-gray-400">Talla: {item.talla}</p>
                  <p className="text-orange-500 font-bold">${item.precio}</p>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 bg-gray-800 p-2 rounded">
                      <button
                        onClick={() =>
                          updateCantidad(item.producto_id, item.talla_id, item.cantidad - 1)
                        }
                        className="text-orange-500 font-bold hover:text-orange-600"
                      >
                        −
                      </button>
                      <span className="text-white w-4 text-center">{item.cantidad}</span>
                      <button
                        onClick={() =>
                          updateCantidad(item.producto_id, item.talla_id, item.cantidad + 1)
                        }
                        className="text-orange-500 font-bold hover:text-orange-600"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.producto_id, item.talla_id)}
                      className="text-red-500 hover:text-red-600 font-bold"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="bg-gray-900 p-6 rounded border border-gray-700 h-fit">
            <h2 className="text-white font-black text-xl mb-6">RESUMEN</h2>

            <div className="space-y-3 mb-6 border-b border-gray-700 pb-6">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Impuestos (21%):</span>
                <span>${impuestos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total:</span>
                <span className="text-orange-500">${totalConImpuestos.toFixed(2)}</span>
              </div>
            </div>

            {user ? (
              <>
                <div className="mb-6">
                  <label className="block text-white font-bold mb-2">
                    Dirección de Envío
                  </label>
                  <textarea
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Calle, número, piso, ciudad..."
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:border-orange-500 focus:outline-none"
                    rows="3"
                  />
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-orange-500 text-black py-3 rounded font-bold hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {loading ? 'Procesando...' : 'PROCESAR COMPRA'}
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-orange-500 text-black py-3 rounded font-bold hover:bg-orange-600 transition"
              >
                Iniciar Sesión
              </button>
            )}

            <button
              onClick={() => navigate('/')}
              className="w-full mt-3 border border-gray-700 text-white py-2 rounded font-bold hover:border-orange-500 transition"
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
