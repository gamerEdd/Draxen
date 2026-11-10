export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export const api = {
  // Auth
  register: (data) => 
    fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  login: (data) =>
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  // Productos
  getProductos: (page = 1, limite = 12, categoria = null, search = null) => {
    let url = `${API_URL}/productos?page=${page}&limit=${limite}`;
    if (categoria) url += `&categoria_id=${categoria}`;
    if (search) url += `&search=${search}`;
    return fetch(url).then(r => r.json());
  },

  getProducto: (id) =>
    fetch(`${API_URL}/productos/${id}`).then(r => r.json()),

  // Categorías
  getCategorias: () =>
    fetch(`${API_URL}/categorias`).then(r => r.json()),

  // Pedidos
  createPedido: (data, token) =>
    fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  getPedidosUsuario: (token) =>
    fetch(`${API_URL}/pedidos/usuario/mis-pedidos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()),

  getPedido: (id, token) =>
    fetch(`${API_URL}/pedidos/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()),

  getPerfil: (token) =>
    fetch(`${API_URL}/auth/perfil`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()),

  updatePerfil: (data, token) =>
    fetch(`${API_URL}/auth/perfil`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }).then(r => r.json())
};
