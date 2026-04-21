import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

function StoreFront({ cart, addToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3333/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error("Erro na vitrine:", error));
  }, []);

  const checkoutWhatsApp = () => {
    const numeroZap = "5592984052457"; // TROCA PRO NUMERO DO NIKOLAS
    
    // 1. Agrupar itens repetidos e calcular subtotal
    const resumoItens = cart.reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + 1;
      return acc;
    }, {});

    const listaTexto = Object.entries(resumoItens)
      .map(([nome, qtd]) => `▪️ *${qtd}x* ${nome.toUpperCase()}`)
      .join('\n');

    const total = cart.reduce((acc, item) => acc + Number(item.price), 0);
    
    // 2. Montar a "Nota Fiscal" Estilizada
    const mensagem = encodeURIComponent(
      ` *SWAG_SIDE - NOVO DROP REQUEST*\n` +
      `________________________________\n\n` +
      `Salve, pessoal da SwegSide! Acabei de montar meu kit no site e quero fechar:\n\n` +
      `${listaTexto}\n\n` +
      ` *VALOR TOTAL:* R$ ${total.toFixed(2)}\n` +
      `________________________________\n\n` +
      ` *DADOS DO CLIENTE*\n` +
      `Nome:\n` +
      `Endereço de Entrega:\n\n` +
      `*Aguardo as instruções para o PIX!* ⚡`
    );

    window.open(`https://wa.me/${numeroZap}?text=${mensagem}`, '_blank');
  };

  const swagStyles = {
    wrapper: { backgroundColor: '#1c1c1c', minHeight: '100vh', color: '#e2e2e2', fontFamily: 'Arial, sans-serif' },
    hero: { 
      width: '100%', height: '60vh', backgroundColor: '#121212', 
      backgroundImage: 'url("https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop")',
      backgroundSize: 'cover', backgroundPosition: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    },
    grid: { maxWidth: '1200px', margin: '60px auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '30px', padding: '0 20px' },
    cartFloat: {
      position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#e2e2e2', color: '#000',
      padding: '20px', borderRadius: '4px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 1000, textAlign: 'center'
    }
  };

  return (
    <div style={swagStyles.wrapper}>
      <div style={swagStyles.hero}>
        <h2 style={{ fontSize: '60px', fontWeight: '900', margin: 0, letterSpacing: '-3px' }}>SEASON 2026</h2>
        <p style={{ letterSpacing: '5px', fontSize: '12px', color: '#888' }}>DESIGNED IN AMAZONAS</p>
      </div>

      <div style={swagStyles.grid}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>

      {cart.length > 0 && (
        <div style={swagStyles.cartFloat}>
          <p style={{ fontWeight: '900', fontSize: '12px', marginBottom: '10px' }}>{cart.length} ITENS NO DROP</p>
          <button 
            onClick={checkoutWhatsApp}
            style={{ backgroundColor: '#000', color: '#fff', padding: '10px 20px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '10px' }}
          >
            FINALIZAR NO WHATSAPP
          </button>
        </div>
      )}
    </div>
  );
}

export default StoreFront;