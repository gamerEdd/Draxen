import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cantidad } = useCarrito();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-black text-white sticky top-0 z-50 border-b border-orange-500">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="http://localhost:5000/logos/logo.png" 
            alt="DRAXEN Logo" 
            className="h-10 hover:opacity-80 transition"
          />
        </Link>

        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-orange-500 transition">
            Tienda
          </Link>

          {user?.rol === 'ADMIN' ? (
            <Link to="/admin" className="hover:text-orange-500 transition">
              Admin
            </Link>
          ) : null}

          <Link to="/carrito" className="relative hover:text-orange-500 transition">
            🛒 Carrito
            {cantidad > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                {cantidad}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/pedidos" className="hover:text-orange-500 transition">
                Mis Pedidos
              </Link>
              <div className="flex gap-3 items-center border-l border-gray-700 pl-6">
                <span className="text-sm">{user.nombre}</span>
                <button
                  onClick={handleLogout}
                  className="bg-orange-500 text-black px-4 py-2 rounded font-bold hover:bg-orange-600 transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="border border-orange-500 text-orange-500 px-4 py-2 rounded hover:bg-orange-500 hover:text-black transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-orange-500 text-black px-4 py-2 rounded font-bold hover:bg-orange-600 transition"
              >
                Registrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
