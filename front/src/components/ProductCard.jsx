import { useState } from 'react';
import { useCart } from '../context/CartContext';
import styles from './ProductCard.module.css';

function normalizeProduct(product) {
  return {
    ...product,
    price: parseFloat(product.price),
    coverUrl: product.coverUrl || product.images?.[0]?.url || null,
    sizes: product.sizes?.length ? product.sizes : ['P', 'M', 'G'],
  };
}

export function ProductCard({ product: raw }) {
  const product = normalizeProduct(raw);
  const { addItem, isInCart, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const inCart = isInCart(product.id, selectedSize);

  function handleAdd() {
    if (product.isPreview || !selectedSize) return;
    addItem(product, selectedSize);
    openCart();
  }

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {product.coverUrl ? (
          <img src={product.coverUrl} alt={product.name} className={styles.img} />
        ) : (
          <div className={styles.placeholder}>SW</div>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>
          {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>

        {product.sizes.length > 0 && (
          <div className={styles.sizes} aria-label="Tamanhos disponiveis">
            {product.sizes.map((size) => (
              <button
                key={size}
                className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeActive : ''}`}
                type="button"
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        <button
          className={styles.addBtn}
          onClick={handleAdd}
          disabled={product.isPreview}
        >
          {product.isPreview ? 'Indisponivel' : inCart ? 'No carrinho' : 'Comprar'}
        </button>
      </div>
    </article>
  );
}
