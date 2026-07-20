import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Link, Navigate, Route, Routes } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import Checkout from './Checkout';
import Login from './Login';
import ProductPage from './ProductPage';
import StoreFront from './StoreFront';
import { AuthProvider, useAuth } from './AuthContext';
import './App.css';

const CART_KEY = 'swag_side_cart';

function Icon({ name }) {
  const icons = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.6-4 4.2-6 8-6s6.4 2 8 6" />
      </>
    ),
    bag: (
      <>
        <path d="M6 8h12l-1 13H7L6 8Z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </>
    )
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
}

function ProtectedAdmin({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <main className="checkout-page"><div className="empty-state">VALIDANDO SESSAO...</div></main>;
  return isAdmin ? children : <Navigate to="/login" replace state={{ from: '/admin' }} />;
}

function AppShell() {
  const { user, isAdmin, logout } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [cart]
  );

  const addToCart = (product, selectedSize, quantity = 1) => {
    const stock = Number(product.stock || 0);
    if (stock <= 0) return;

    const imageUrl = product.images?.[0]?.url || product.imageUrl || '';
    const cartKey = `${product.id}-${selectedSize || 'unico'}`;
    const nextQuantity = Math.max(1, Math.min(Number(quantity) || 1, stock));

    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.cartKey === cartKey);
      if (existing) {
        return currentCart.map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: Math.min(item.quantity + nextQuantity, item.stock || stock) }
            : item
        );
      }

      return [
        ...currentCart,
        {
          cartKey,
          id: product.id,
          name: product.name,
          price: Number(product.price),
          imageUrl,
          selectedSize: selectedSize || 'Unico',
          quantity: nextQuantity,
          stock
        }
      ];
    });
    setCartOpen(true);
  };

  const removeFromCart = (cartKey) => {
    setCart((currentCart) => currentCart.filter((item) => item.cartKey !== cartKey));
  };

  const updateCartQuantity = (cartKey, quantity) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.cartKey !== cartKey) return item;

        const maxStock = Number(item.stock || 0);
        const nextQuantity = Math.max(1, Number(quantity) || 1);
        return {
          ...item,
          quantity: maxStock > 0 ? Math.min(nextQuantity, maxStock) : nextQuantity
        };
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCartOpen(false);
  };

  const handleSectionClick = (event, sectionId, categoryFilter = null) => {
    event.preventDefault();
    if (categoryFilter) {
      window.dispatchEvent(new CustomEvent('swag-filter-category', { detail: { category: categoryFilter } }));
    }

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <Router>
      <nav className="site-nav">
        <div className="nav-inner">
          <Link to="/" className="brand-mark">SWEG SIDE</Link>

          <div className="nav-links">
            <a href="#home" onClick={(event) => handleSectionClick(event, 'home')}>Home</a>
            <a href="#destaques" onClick={(event) => handleSectionClick(event, 'destaques', 'Roupas')}>Roupas</a>
            <a href="#destaques" onClick={(event) => handleSectionClick(event, 'destaques', 'Calçados')}>Calçados</a>
            <a href="#destaques" onClick={(event) => handleSectionClick(event, 'destaques')}>Destaques</a>
            <a href="#drop" onClick={(event) => handleSectionClick(event, 'drop')}>Drop</a>
            <a href="#footer" onClick={(event) => handleSectionClick(event, 'footer')}>Contato</a>
          </div>

          <div className="nav-actions">
            {user ? (
              <button className="role-toggle" onClick={logout}>
                SAIR
              </button>
            ) : (
              <Link to="/login" className="admin-link">Login</Link>
            )}
            {isAdmin && <Link to="/admin" className="admin-link">Admin</Link>}
            <a href="#destaques" className="icon-button" aria-label="Buscar produtos" onClick={(event) => handleSectionClick(event, 'destaques')}>
              <Icon name="search" />
            </a>
            <Link className="icon-button" aria-label="Perfil" to={user ? '/admin' : '/login'}>
              <Icon name="user" />
            </Link>
            <button className="cart-pill" aria-label="Abrir carrinho" onClick={() => setCartOpen(true)}>
              <Icon name="bag" />
              <strong>{cartCount}</strong>
            </button>
          </div>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <StoreFront
              cart={cart}
              total={total}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              updateCartQuantity={updateCartQuantity}
              clearCart={clearCart}
              cartOpen={cartOpen}
              closeCart={() => setCartOpen(false)}
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout cart={cart} total={total} clearCart={clearCart} />} />
        <Route path="/products/:id" element={<ProductPage addToCart={addToCart} />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminDashboard />
            </ProtectedAdmin>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
