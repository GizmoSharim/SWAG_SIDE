// Em desenvolvimento, deixe vazio para usar o proxy do Vite em /products e /orders.
// Em producao, defina VITE_API_URL com a URL publica da API.
const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.details || error.message || error.error || `Erro ${res.status}`);
  }

  return res.json();
}

// ── Produtos ──────────────────────────────────────────────
export const getProducts = () => request('/products');

export const createProduct = (data) =>
  request('/products', { method: 'POST', body: JSON.stringify(data) });

export const updateProduct = (id, data) =>
  request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteProduct = (id) =>
  request(`/products/${id}`, { method: 'DELETE' });

// ── Pedidos ───────────────────────────────────────────────
export const createOrder = (data) =>
  request('/orders', { method: 'POST', body: JSON.stringify(data) });
