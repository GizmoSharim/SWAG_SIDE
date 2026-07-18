import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from './services/api';
import { getStoredProducts, initialProducts } from './data/products';

const fallbackImage = initialProducts[0].images[0].url;

function ProductPage({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const localProduct = getStoredProducts().find((item) => String(item.id) === String(id));

    api.get(`/products/${id}`)
      .then((response) => {
        const nextProduct = response.data || localProduct;
        setProduct(nextProduct);
        setSelectedImage(nextProduct.images?.[0]?.url || fallbackImage);
        setSelectedSize(nextProduct.sizes?.[0] || 'Unico');
      })
      .catch(() => {
        if (localProduct) {
          setProduct(localProduct);
          setSelectedImage(localProduct.images?.[0]?.url || fallbackImage);
          setSelectedSize(localProduct.sizes?.[0] || 'Unico');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const images = useMemo(() => product?.images?.length ? product.images : [{ url: fallbackImage }], [product]);

  if (loading) {
    return <main className="product-page"><div className="empty-state">CARREGANDO PRODUTO...</div></main>;
  }

  if (!product) {
    return (
      <main className="product-page">
        <div className="empty-state">
          <h1>PRODUTO NAO ENCONTRADO</h1>
          <Link className="primary-button" to="/">VOLTAR PARA A LOJA</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="product-page">
      <Link to="/" className="back-link">VOLTAR PARA A LOJA</Link>
      <section className="product-detail">
        <div className="gallery">
          <div className="main-gallery-image">
            <img src={selectedImage || fallbackImage} alt={product.name} />
          </div>
          <div className="thumb-row">
            {images.map((image) => (
              <button
                key={image.url}
                className={selectedImage === image.url ? 'active' : ''}
                onClick={() => setSelectedImage(image.url)}
              >
                <img src={image.url} alt={`${product.name} thumbnail`} />
              </button>
            ))}
          </div>
        </div>

        <div className="detail-panel">
          <p className="eyebrow">Produto SWEG SIDE</p>
          <h1>{product.name}</h1>
          <strong className="detail-price">R$ {Number(product.price).toFixed(2)}</strong>
          <div className="color-dots">
            {(product.colors || []).map((color) => <span key={color} style={{ backgroundColor: color }} />)}
          </div>
          <p>{product.description}</p>

          <div className="detail-block">
            <span>TAMANHO</span>
            <div className="size-row">
              {(product.sizes || ['Unico']).map((size) => (
                <button
                  key={size}
                  className={selectedSize === size ? 'active' : ''}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="detail-block">
            <span>QUANTIDADE</span>
            <div className="qty-inline">
              <button onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button>
              <input value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))} />
              <button onClick={() => setQuantity((value) => value + 1)}>+</button>
            </div>
          </div>

          <button className="primary-button wide" onClick={() => addToCart(product, selectedSize, quantity)}>
            ADICIONAR AO CARRINHO
          </button>
        </div>
      </section>
    </main>
  );
}

export default ProductPage;
