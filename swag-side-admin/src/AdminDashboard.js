import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddProductForm from './AddProductForm';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = () => {
    axios.get('http://localhost:3333/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error("Erro ao carregar produtos:", error));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Deseja mesmo excluir este produto?")) {
      try {
        await axios.delete(`http://localhost:3333/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) { alert("Erro ao excluir"); }
    }
  };

  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#09090b', color: '#f4f4f5', padding: '40px', fontFamily: 'Inter, sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #27272a', paddingBottom: '20px' },
    title: { fontSize: '32px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-1px' },
    buttonAdd: { backgroundColor: '#ffffff', color: '#000000', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
    tableCard: { backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #27272a', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { backgroundColor: '#27272a', padding: '16px', fontSize: '12px', color: '#a1a1aa', textTransform: 'uppercase' },
    td: { padding: '16px', borderBottom: '1px solid #27272a' },
    price: { color: '#10b981', fontFamily: 'monospace', fontWeight: 'bold' },
    tag: { backgroundColor: '#27272a', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', marginRight: '5px', border: '1px solid #3f3f46' },
    btnAction: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', marginRight: '10px' }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>SWAG_SIDE ADMIN</h1>
          <p style={{ color: '#71717a', fontSize: '14px' }}>Gerenciamento de Estoque Profissional</p>
        </div>
        <button 
          style={styles.buttonAdd}
          onClick={() => { setShowForm(!showForm); if(showForm) setEditingProduct(null); }}
        >
          {showForm ? 'FECHAR' : '+ NOVO PRODUTO'}
        </button>
      </header>

      {showForm && (
        <div style={{ marginBottom: '40px' }}>
          <AddProductForm 
            editingProduct={editingProduct} 
            onProductSaved={() => { fetchProducts(); setShowForm(false); setEditingProduct(null); }} 
          />
        </div>
      )}

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Produto</th>
              <th style={styles.th}>Preço</th>
              <th style={styles.th}>Tamanhos</th>
              <th style={{ ...styles.th, textAlign: 'right', paddingRight: '20px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#27272a', borderRadius: '6px' }}></div>
                    <span style={{ fontWeight: 'bold' }}>{product.name}</span>
                  </div>
                </td>
                <td style={styles.td}>
                   {/* Aqui corrigimos o erro do toFixed transformando em Number antes */}
                  <span style={styles.price}>R$ {Number(product.price).toFixed(2)}</span>
                </td>
                <td style={styles.td}>
                  {product.sizes.map(s => <span key={s} style={styles.tag}>{s}</span>)}
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <button style={styles.btnAction} onClick={() => { setEditingProduct(product); setShowForm(true); }}>✏️</button>
                  <button style={styles.btnAction} onClick={() => handleDelete(product.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;