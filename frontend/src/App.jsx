import React from 'react';
import {BrowserRouter,Routes,Route,Navigate,useLocation} from 'react-router-dom';
import {AuthProvider,useAuth} from './context/AuthContext';
import {CarritoProvider} from './context/CarritoContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductoDetalle from './pages/ProductoDetalle';
import Personalizador from './pages/Personalizador';
import Login from './pages/Login';
import Register from './pages/Register';
import Carrito from './pages/Carrito';
import MisPedidos from './pages/MisPedidos';
import AdminPanel from './pages/AdminPanel';
import './index.css';
function ProtectedRoute({children,admin=false}){const {user,loading}=useAuth();if(loading)return <main className="shell empty-state"><p>Cargando tu cuenta…</p></main>;if(!user)return <Navigate to="/login"/>;if(admin&&user.rol!=='ADMIN')return <Navigate to="/"/>;return <div className="legacy-page">{children}</div>;}
function AppContent(){const location=useLocation();React.useEffect(()=>{if(location.hash){document.getElementById(location.hash.slice(1))?.scrollIntoView({block:'start'});}else{window.scrollTo(0,0);}},[location.pathname,location.hash]);return <><a href="#main-content" className="skip-link">Saltar al contenido</a><Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/producto/:id" element={<ProductoDetalle/>}/><Route path="/personalizar" element={<Personalizador/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/carrito" element={<Carrito/>}/><Route path="/pedidos" element={<ProtectedRoute><MisPedidos/></ProtectedRoute>}/><Route path="/admin" element={<ProtectedRoute admin><AdminPanel/></ProtectedRoute>}/><Route path="*" element={<main className="shell empty-state" id="main-content"><h1>Esta página se salió del drop.</h1><a className="button button-dark" href="/">Volver al inicio</a></main>}/></Routes><Footer/></>;}
export default function App(){return <BrowserRouter><AuthProvider><CarritoProvider><AppContent/></CarritoProvider></AuthProvider></BrowserRouter>;}
