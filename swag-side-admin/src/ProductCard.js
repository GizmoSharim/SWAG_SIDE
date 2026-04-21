import React from 'react';

const CardStyles = {
  container: { 
    backgroundColor: '#242424', 
    padding: '15px',
    borderRadius: '4px',
    textAlign: 'left'
  },
  imageBox: { 
    width: '100%', 
    aspectRatio: '1/1', 
    backgroundColor: '#121212', 
    overflow: 'hidden', 
    marginBottom: '15px' 
  },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  name: { fontSize: '12px', fontWeight: '900', color: '#fff', marginBottom: '5px', textTransform: 'uppercase' },
  price: { fontSize: '12px', color: '#888', fontFamily: 'monospace', marginBottom: '15px' },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#e2e2e2',
    color: '#000',
    border: 'none',
    fontWeight: '900',
    fontSize: '10px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }
};

function ProductCard({ product, addToCart }) {
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0].url 
    : 'https://via.placeholder.com/400x400?text=SWAG_SIDE';

  return (
    <div style={CardStyles.container}>
      <div style={CardStyles.imageBox}>
        <img src={mainImage} alt={product.name} style={CardStyles.img} />
      </div>
      <h3 style={CardStyles.name}>{product.name}</h3>
      <p style={CardStyles.price}>R$ {Number(product.price).toFixed(2)}</p>
      <button style={CardStyles.button} onClick={() => addToCart(product)}>
        + Add to Drop
      </button>
    </div>
  );
}

export default ProductCard;