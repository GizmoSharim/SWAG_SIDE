import React, { useEffect, useState } from 'react';
import api from './services/api';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'Camisetas',
  stock: 0,
  featured: false,
  colors: '#111111, #ffffff, #8d8a82',
  sizes: 'P, M, G, GG',
  images: ''
};

function AddProductForm({ editingProduct, onProductSaved, onCancel }) {
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price || '',
        category: editingProduct.category || 'Camisetas',
        stock: editingProduct.stock ?? 0,
        featured: Boolean(editingProduct.featured),
        colors: editingProduct.colors?.join(', ') || '',
        sizes: editingProduct.sizes?.join(', ') || '',
        images: editingProduct.images?.map((image) => image.url || image).join(', ') || ''
      });
      return;
    }

    setFormData(emptyForm);
  }, [editingProduct]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      colors: formData.colors.split(',').map((color) => color.trim()).filter(Boolean),
      sizes: formData.sizes.split(',').map((size) => size.trim()).filter(Boolean),
      images: formData.images.split(',').map((url) => ({ url: url.trim() })).filter((image) => image.url)
    };

    try {
      const saved = await onProductSaved(productData);
      if (saved === false) return;
      setFormData(emptyForm);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const data = new FormData();
    files.forEach((file) => data.append('images', file));

    setUploading(true);
    try {
      const response = await api.post('/uploads/images', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const urls = (response.data.images || []).map((image) => image.url).filter(Boolean);
      setFormData((current) => ({
        ...current,
        images: [current.images, ...urls].filter(Boolean).join(', ')
      }));
    } catch {
      alert('Nao foi possivel enviar a imagem. Confira login de admin e Cloudinary.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="form-heading">
        <div>
          <p className="eyebrow">Catalogo</p>
          <h2>{editingProduct ? 'EDITAR PRODUTO' : 'NOVO PRODUTO'}</h2>
        </div>
        <button type="button" onClick={onCancel}>CANCELAR</button>
      </div>

      <div className="form-grid">
        <label>
          Nome da peca
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Preco
          <input name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange} required />
        </label>
        <label>
          Categoria
          <select name="category" value={formData.category} onChange={handleChange}>
            <option>Camisetas</option>
            <option>Calcas</option>
            <option>Moletons</option>
            <option>Jaquetas</option>
            <option>Acessorios</option>
          </select>
        </label>
        <label>
          Estoque
          <input name="stock" type="number" min="0" value={formData.stock} onChange={handleChange} required />
        </label>
      </div>

      <label>
        Descricao
        <textarea name="description" rows="3" value={formData.description} onChange={handleChange} required />
      </label>

      <div className="form-grid two">
        <label>
          Cores HEX
          <input name="colors" value={formData.colors} onChange={handleChange} placeholder="#111111, #ffffff" required />
        </label>
        <label>
          Tamanhos disponiveis
          <input name="sizes" value={formData.sizes} onChange={handleChange} placeholder="P, M, G, GG" required />
        </label>
      </div>

      <label>
        URLs das imagens
        <input name="images" value={formData.images} onChange={handleChange} placeholder="https://imagem-1.jpg, https://imagem-2.jpg" />
      </label>

      <label>
        Upload de imagens
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
      </label>
      {uploading && <p className="form-hint">Enviando imagem...</p>}

      <label className="checkbox-line">
        <input name="featured" type="checkbox" checked={formData.featured} onChange={handleChange} />
        Marcar como destaque da semana
      </label>

      <button className="primary-button wide" disabled={saving || uploading}>
        {saving ? 'SALVANDO...' : editingProduct ? 'SALVAR ALTERACOES' : 'CADASTRAR PRODUTO'}
      </button>
    </form>
  );
}

export default AddProductForm;
