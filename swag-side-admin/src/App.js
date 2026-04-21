import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import StoreFront from './StoreFront';

function App() {
  const [cart, setCart] = useState([]);

  // Função para adicionar produtos ao carrinho
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <Router>
      {/* Menu técnico para você navegar entre os dois lados durante o desenvolvimento */}
      <nav style={{ 
        padding: '10px 20px', 
        backgroundColor: '#121212', 
        display: 'flex', 
        gap: '20px',
        borderBottom: '1px solid #2a2a2a' 
      }}>
        <Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '10px', fontWeight: 'bold' }}>🛒 LOJA</Link>
        <Link to="/admin" style={{ color: '#888', textDecoration: 'none', fontSize: '10px', fontWeight: 'bold' }}>⚙️ ADMIN</Link>
      </nav>

      <Routes>
        <Route path="/" element={<StoreFront cart={cart} addToCart={addToCart} />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;