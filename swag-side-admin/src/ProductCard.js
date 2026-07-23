import React from 'react';
import { Link } from 'react-router-dom';

const fallbackImage = 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=900&auto=format&fit=crop';

function ProductCard({ product, badge, variant = '' }) {
  const mainImage = product.images?.[0]?.url || product.imageUrl || fallbackImage;
  const stock = Number(product.stock || 0);
  const isSoldOut = stock <= 0;

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
        </div>
        <strong>R$ {Number(product.price).toFixed(2)}</strong>
      </div>

      {isSoldOut ? (
        <button className="add-button" disabled>ESGOTADO</button>
      ) : (
        <Link className="add-button" to={`/products/${product.id}`}>ADICIONAR</Link>
      )}
    </article>
  );
}

export default ProductCard;
