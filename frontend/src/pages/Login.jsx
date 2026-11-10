import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = await api.login({ email, password });

    if (data.success) {
      login(data.token, data.usuario);
      navigate('/');
    } else {
      setError(data.message || 'Error al iniciar sesión');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="bg-gray-900 p-8 rounded border border-gray-700">
          <div className="flex justify-center mb-6">
            <img 
              src="http://localhost:5000/logos/logo.png" 
              alt="DRAXEN" 
              className="h-12"
            />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 text-center">LOGIN</h1>
          <p className="text-gray-400 mb-8">Inicia sesión en tu cuenta</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-2 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white font-bold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:border-orange-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-black py-3 rounded font-bold hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'INICIAR SESIÓN'}
            </button>
          </form>

          <p className="text-gray-400 text-center mt-6">
            ¿No tienes cuenta?{' '}
            <a href="/register" className="text-orange-500 hover:text-orange-600 font-bold">
              Registrarse
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
