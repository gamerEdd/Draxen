import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export default function MisPedidos() {
  const { user, token } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    api.getPedidosUsuario(token).then(data => {
      if (data.success) {
        setPedidos(data.pedidos);
      }
      setLoading(false);
    });
  }, [user, token]);

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <img 
            src="http://localhost:5000/logos/logo.png" 
            alt="DRAXEN" 
            className="h-10"
          />
          <h1 className="text-4xl font-black text-white">MIS PEDIDOS</h1>
        </div>

        {loading ? (
          <p className="text-gray-400">Cargando pedidos...</p>
        ) : pedidos.length === 0 ? (
          <p className="text-gray-400">No tienes pedidos aún</p>
        ) : (
          <div className="space-y-6">
            {pedidos.map(pedido => (
              <div
                key={pedido.id}
                className="bg-gray-900 p-6 rounded border border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-700">
                  <div>
                    <p className="text-gray-400 text-sm">Número de Pedido</p>
                    <p className="text-white font-bold">{pedido.numero_pedido}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total</p>
                    <p className="text-orange-500 font-bold">${pedido.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Estado</p>
                    <p className={`font-bold ${
                      pedido.estado === 'ENTREGADO' ? 'text-green-500' :
                      pedido.estado === 'CANCELADO' ? 'text-red-500' :
                      'text-yellow-500'
                    }`}>
                      {pedido.estado}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Fecha</p>
                    <p className="text-white">
                      {new Date(pedido.fecha_creacion).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-400 text-sm font-bold">Productos:</p>
                  {pedido.items && pedido.items.map(item => (
                    <p key={item.id} className="text-gray-300">
                      • {item.nombre} - Talla {item.talla} x{item.cantidad} - ${(item.precio_unitario * item.cantidad).toFixed(2)}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
