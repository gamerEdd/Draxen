import { API_ENABLED } from '../utils/deployment';
import { createContext, useContext, useState, useEffect,useCallback } from 'react';
import { API_URL } from '../utils/api';

const AuthContext = createContext();
const readToken = () => { try { return localStorage.getItem('token'); } catch { return null; } };
const storeToken = value => { try { value ? localStorage.setItem('token', value) : localStorage.removeItem('token'); } catch { /* Session remains usable when browser storage is unavailable. */ } };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(readToken);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active=true;
    if (API_ENABLED && token) {
      // Validar token y obtener usuario
      fetch(`${API_URL}/auth/perfil`, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: AbortSignal.timeout(10000)
      })
        .then(res => res.json())
        .then(data => {
          if(!active)return;
          if (data.success) {
            setUser(data.usuario);
          } else {
            storeToken(null);
            setToken(null);
            setUser(null);
          }
        })
        .catch(() => {
          if(!active)return;
          storeToken(null);
          setToken(null);
          setUser(null);
        })
        .finally(() => {if(active)setLoading(false);});
    } else {
      setUser(null);
      setLoading(false);
    }
    return()=>{active=false;};
  }, [token]);

  const login = useCallback((newToken, userData) => {
    storeToken(newToken);
    setToken(newToken);
    setUser(userData);
  },[]);

  const logout = () => {
    storeToken(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
