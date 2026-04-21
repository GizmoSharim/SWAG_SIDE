import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddProductForm({ editingProduct, onProductSaved }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sizes: '',
    images: ''
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        sizes: editingProduct.sizes.join(', '),
        images: editingProduct.images?.map(img => img.url).join(', ') || ''
      });
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      sizes: formData.sizes.split(',').map(s => s.trim()),
      images: formData.images.split(',').map(url => url.trim())
    };

    try {
      if (editingProduct) {
        await axios.put(`http://localhost:3333/products/${editingProduct.id}`, productData);
        alert("🔄 Produto atualizado!");
      } else {
        await axios.post('http://localhost:3333/products', productData);
        alert("✅ Produto cadastrado!");
      }
      onProductSaved();
    } catch (error) {
      alert("❌ Erro ao salvar produto.");
    }
  };

  // Estilos Dark Swag
  const s = {
    form: { backgroundColor: '#18181b', padding: '30px', borderRadius: '16px', border: '1px solid #27272a', marginBottom: '30px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' },
    label: { display: 'block', color: '#a1a1aa', fontSize: '12px', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' },
    input: { width: '100%', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '12px', color: '#fff', marginBottom: '20px', outline: 'none', fontSize: '14px' },
    button: { width: '100%', padding: '14px', backgroundColor: editingProduct ? '#3b82f6' : '#fff', color: editingProduct ? '#fff' : '#000', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px', transition: '0.2s' }
  };

  return (
    <form onSubmit={handleSubmit} style={s.form}>
      <h2 style={{ marginBottom: '25px', fontSize: '20px', fontWeight: '800' }}>
        {editingProduct ? 'EDITAR PRODUTO' : 'NOVO PRODUTO'}
      </h2>

      <label style={s.label}>Nome da Peça</label>
      <input type="text" placeholder="Ex: Camisa Oversized Midnight" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={s.input} />

      <label style={s.label}>Descrição</label>
      <textarea rows="3" placeholder="Detalhes do material, caimento..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required style={{...s.input, resize: 'none'}} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={s.label}>Preço (R$)</label>
          <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required style={s.input} />
        </div>
        <div>
          <label style={s.label}>Tamanhos (separe por vírgula)</label>
          <input type="text" placeholder="P, M, G, GG" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} required style={s.input} />
        </div>
      </div>

      {!editingProduct && (
        <>
          <label style={s.label}>URLs das Imagens (mínimo 3, separe por vírgula)</label>
          <input type="text" placeholder="http://link-da-foto.com/1.jpg, ..." value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} required style={s.input} />
        </>
      )}

      <button type="submit" style={s.button}>
        {editingProduct ? 'SALVAR ALTERAÇÕES' : 'CONFIRMAR CADASTRO'}
      </button>
    </form>
  );
}

export default AddProductForm;