import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AddProductForm from './AddProductForm';
import { initialProducts } from './data/products';
import api from './services/api';

const categories = ['Todos', 'Camisetas', 'Calcas', 'Moletons', 'Jaquetas', 'Acessorios'];

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    api.get('/products')
      .then((response) => setProducts(Array.isArray(response.data) ? response.data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'Todos' || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [category, products, search]);

  const stats = useMemo(() => ({
    products: products.length,
    stock: products.reduce((sum, product) => sum + Number(product.stock || 0), 0),
    featured: products.filter((product) => product.featured).length
  }), [products]);

  const openCreateForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, productData);
      } else {
        await api.post('/products', productData);
      }
      fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
      return true;
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao salvar produto.');
      setLoading(false);
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja mesmo excluir este produto?')) return;

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao excluir produto.');
      setLoading(false);
    }
  };

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">RBAC ADMIN</p>
          <h1>PAINEL SWEG SIDE</h1>
          <span>Rota protegida para gerenciar catalogo, estoque e destaques.</span>
        </div>
        <button className="primary-button" onClick={openCreateForm}>NOVO PRODUTO</button>
      </header>

      <section className="stats-grid">
        <div><span>Produtos</span><strong>{stats.products}</strong></div>
        <div><span>Itens em estoque</span><strong>{stats.stock}</strong></div>
        <div><span>Destaques</span><strong>{stats.featured}</strong></div>
      </section>

      {showForm && (
        <AddProductForm
          editingProduct={editingProduct}
          onProductSaved={saveProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      <section className="admin-panel">
        <div className="admin-toolbar">
          <div>
            <h2>PRODUTOS</h2>
            <p>{loading ? 'Sincronizando...' : `${filteredProducts.length} item(ns) encontrados`}</p>
          </div>
          <div className="catalog-filters">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="BUSCAR PRODUTO" />
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preco</th>
                <th>Estoque</th>
                <th>Cores</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-product">
                      <img src={product.images?.[0]?.url || initialProducts[0].images[0].url} alt={product.name} />
                      <div>
                        <strong>{product.name}</strong>
                        {product.featured && <span>Destaque</span>}
                      </div>
                    </div>
                  </td>
                  <td>{product.category || '-'}</td>
                  <td>R$ {Number(product.price).toFixed(2)}</td>
                  <td>{product.stock ?? 0}</td>
                  <td>
                    <div className="color-dots">
                      {(product.colors || []).map((color) => <span key={color} style={{ backgroundColor: color }} />)}
                    </div>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button onClick={() => openEditForm(product)}>EDITAR</button>
                      <button onClick={() => handleDelete(product.id)}>EXCLUIR</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
