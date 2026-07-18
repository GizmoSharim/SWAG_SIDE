import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const fallbackImage = 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=900&auto=format&fit=crop';

function ProductCard({ product, addToCart, badge, variant = '' }) {
  const sizes = useMemo(() => product.sizes || [], [product.sizes]);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || 'Unico');
  const mainImage = product.images?.[0]?.url || product.imageUrl || fallbackImage;
  const colors = product.colors || ['#111111', '#ffffff', '#8d8a82'];

  return (
    <article className={`product-card ${variant ? `product-card-${variant}` : ''}`}>
      <Link to={`/products/${product.id}`} className="product-media" aria-label={`Ver ${product.name}`}>
        {badge && <span className="product-badge">{badge}</span>}
        <img src={mainImage} alt={product.name} />
      </Link>

      <div className="product-info">
        <div>
          <Link to={`/products/${product.id}`}>
            <h3>{product.name}</h3>
          </Link>
          <div className="color-dots" aria-label="Cores disponiveis">
            {colors.map((color) => (
              <span key={color} style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
        <strong>R$ {Number(product.price).toFixed(2)}</strong>
      </div>

      {sizes.length > 0 && (
        <div className="size-row" aria-label="Tamanhos disponiveis">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              className={selectedSize === size ? 'active' : ''}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      )}

      <button className="add-button" onClick={() => addToCart(product, selectedSize)}>
        ADICIONAR
      </button>
    </article>
  );
}

export default ProductCard;
