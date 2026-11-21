import GoogleSignIn from './GoogleSignIn';
import { API_ENABLED } from '../utils/deployment';
import { useState,useCallback } from 'react';
import { Link, useNavigate,useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import './account.css';
import BrandLogo from './BrandLogo';

export default function AccountForm({ register = false }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params]=useSearchParams();
  const requested=params.get('next');
  const next=requested?.startsWith('/')&&!requested.startsWith('//')&&!requested.includes('\\')?requested:'/pedidos';
  const complete=useCallback(data=>{login(data.token,data.usuario);navigate(next);},[login,navigate,next]);
  async function submit(event) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    setError('');
    if (register && fields.password !== fields.confirm) { setError('Las contraseñas no coinciden.'); return; }
    setLoading(true);
    try {
      const data = await (register ? api.register(fields) : api.login(fields));
      if (!data.success) throw new Error(data.message || 'Revisa tus datos e inténtalo de nuevo.');
      login(data.token, data.usuario);
      navigate(next);
    } catch (err) {
      setError(err instanceof TypeError ? 'No pudimos conectar con el servidor. Inténtalo de nuevo.' : err.message);
    } finally { setLoading(false); }
  }
  if (!API_ENABLED) return <main className="shell empty-state" id="main-content"><h1>Explora sin crear una cuenta.</h1><p>Esta versión permite explorar el catálogo, personalizar prendas y guardar tu selección. Las cuentas y los pedidos en línea todavía no están disponibles.</p><Link className="button button-dark" to="/personalizar">Crear mi prenda</Link></main>;
  return <main className="account-page" id="main-content">
    <div className="account-intro"><span className="account-kicker">TU UNIVERSO. TU ESTILO.</span><h1>{register ? 'Hazlo parte de ti.' : 'Qué bueno verte.'}</h1><p>Anime, rock y todo lo que te mueve. Encuentra tu próxima prenda favorita.</p><Link to="/">Explorar la tienda ↗</Link></div>
    <section className="account-panel" aria-labelledby="account-title"><BrandLogo/><span className="account-kicker">MI CUENTA</span><h2 id="account-title">{register ? 'Crear una cuenta' : 'Iniciar sesión'}</h2><p>{register ? 'Tu estilo empieza aquí.' : 'Entra con tu correo y contraseña.'}</p>
      <GoogleSignIn onLogin={complete}/><form onSubmit={submit}>
        {register && <label>Nombre<input name="nombre" autoComplete="name" required maxLength={100} /></label>}
        <label>Correo electrónico<input name="email" type="email" autoComplete="email" required /></label>
        <label>Contraseña<input name="password" type="password" autoComplete={register ? 'new-password' : 'current-password'} minLength={register ? 8 : undefined} required /></label>
        {register && <label>Repetir contraseña<input name="confirm" type="password" autoComplete="new-password" minLength={8} required /></label>}
        {error && <p className="account-error" role="alert">{error}</p>}
        <button disabled={loading} type="submit">{loading ? 'Un momento…' : register ? 'Crear mi cuenta ↗' : 'Entrar ↗'}</button>
      </form><p className="account-switch">{register ? '¿Ya tienes cuenta?' : '¿Primera vez por aquí?'} <Link to={`${register ? '/login' : '/register'}?next=${encodeURIComponent(next)}`}>{register ? 'Inicia sesión' : 'Regístrate'}</Link></p><p className="account-note">Puedes explorar y editar sin entrar. Para guardar tu pedido e imagen, inicia sesión.</p>
    </section>
  </main>;
}
