import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import api from './services/api';
import { getStoredProducts, initialProducts, storeProducts } from './data/products';

const heroImage = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1800&auto=format&fit=crop';
const bannerOne = 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1200&auto=format&fit=crop';
const bannerTwo = 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop';

function StoreFront({ cart, total, addToCart, removeFromCart, updateCartQuantity, clearCart, cartOpen, closeCart }) {
  const [products, setProducts] = useState(getStoredProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');

  useEffect(() => {
    api.get('/products')
      .then((response) => {
        const apiProducts = Array.isArray(response.data) && response.data.length ? response.data : initialProducts;
        setProducts(apiProducts);
        storeProducts(apiProducts);
        setError('');
      })
      .catch(() => {
        const seeded = getStoredProducts();
        const fallbackProducts = seeded.length ? seeded : initialProducts;
        setProducts(fallbackProducts);
        storeProducts(fallbackProducts);
        setError('');
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ['Todos', ...new Set(products.map((product) => product.category).filter(Boolean))],
    [products]
  );

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'Todos' || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [category, products, search]);

  return (
    <main className="store-page">
      <section id="home" className="hero-banner">
        <img src={heroImage} alt="Editorial urbano SWEG SIDE" />
        <div className="hero-copy">
          <p className="eyebrow">DROP 06</p>
          <h1>SWEG SIDE</h1>
          <span>Streetwear minimalista para rotina real.</span>
          <a href="#destaques" className="primary-button">COMPRAR AGORA</a>
        </div>
      </section>

      <section id="destaques" className="featured-section">
        <div className="section-heading">
          <div>
            <h2>PRODUTOS</h2>
            <span>{loading ? 'CARREGANDO' : `${visibleProducts.length} PECA(S)`}</span>
          </div>
          <div className="catalog-filters">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="BUSCAR PRODUTO"
              aria-label="Buscar produto"
            />
            <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filtrar categoria">
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>

        {error && <div className="empty-state">{error}</div>}

        {!loading && !error && visibleProducts.length === 0 && (
          <div className="empty-state">Nenhum produto encontrado.</div>
        )}

        {visibleProducts.length > 0 && (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                badge={product.featured ? 'HOT' : ''}
              />
            ))}
          </div>
        )}
      </section>

      <section id="drop" className="bento-section">
        <article className="bento-tile large">
          <img src={bannerOne} alt="Colecao oversized SWEG SIDE" />
          <div>
            <h2>OVERSIZED SYSTEM</h2>
            <a href="#destaques">VER DROP</a>
          </div>
        </article>
        <article className="bento-tile">
          <img src={bannerTwo} alt="Techwear SWEG SIDE" />
          <div>
            <h2>TECH TROUSERS</h2>
            <a href="#destaques">EXPLORAR</a>
          </div>
        </article>
        <article className="bento-copy">
          <p>FABRICACAO LIMITADA</p>
          <h2>LINHAS LIMPAS, PESO CERTO, RUA SEM EXCESSO.</h2>
          <span>SWEG SIDE trabalha drops pequenos com pecas essenciais, cores neutras e modelagem direta.</span>
        </article>
      </section>

      <div className={`cart-backdrop ${cartOpen ? 'is-open' : ''}`} onClick={closeCart} />

      <aside id="carrinho" className={`cart-drawer ${cartOpen ? 'is-open' : ''}`} aria-hidden={!cartOpen}>
        <div className="cart-header">
          <div>
            <p className="eyebrow">Pedido</p>
            <h2>CARRINHO</h2>
          </div>
          <button onClick={closeCart} aria-label="Fechar carrinho">X</button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <strong>CARRINHO VAZIO</strong>
            <span>Adicione uma peca para iniciar o pedido.</span>
            <button onClick={closeCart}>CONTINUAR COMPRANDO</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.cartKey}>
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <div className="cart-thumb-empty">SEM FOTO</div>}
                  <div>
                    <h3>{item.name}</h3>
                    <p>Tam: {item.selectedSize || 'Unico'}</p>
                    <span>R$ {Number(item.price).toFixed(2)}</span>
                  </div>
                  <div className="qty-control">
                    <button onClick={() => updateCartQuantity(item.cartKey, item.quantity - 1)}>-</button>
                    <input
                      value={item.quantity}
                      onChange={(event) => updateCartQuantity(item.cartKey, event.target.value)}
                      aria-label={`Quantidade de ${item.name}`}
                    />
                    <button onClick={() => updateCartQuantity(item.cartKey, item.quantity + 1)}>+</button>
                    <button className="remove-button" onClick={() => removeFromCart(item.cartKey)}>REMOVER</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <button className="clear-cart-button" onClick={clearCart}>LIMPAR CARRINHO</button>
              <div>
                <span>Total</span>
                <strong>R$ {total.toFixed(2)}</strong>
              </div>
              <Link to="/checkout" onClick={closeCart} className="whatsapp-button">IR PARA CHECKOUT</Link>
            </div>
          </>
        )}
      </aside>

      <footer id="footer" className="site-footer">
        <div>
          <strong>SWEG SIDE</strong>
          <span>Streetwear minimalista.</span>
          <span>Drop semanal. Estoque limitado.</span>
        </div>
        <div>
          <strong>NAVEGACAO</strong>
          <a href="#home">Home</a>
          <a href="#destaques">Destaques</a>
          <a href="#drop">Drop</a>
        </div>
        <div>
          <strong>SUPORTE</strong>
          <span>WhatsApp</span>
          <span>Trocas e devolucoes</span>
          <span>Entrega nacional</span>
        </div>
        <div>
          <strong>REDES</strong>
          <span>Instagram</span>
          <span>TikTok</span>
          <span>Pinterest</span>
        </div>
        <form>
          <strong>NEWSLETTER</strong>
          <input type="email" placeholder="SEU EMAIL" aria-label="Email newsletter" />
          <button type="button">ENTRAR</button>
        </form>
      </footer>
    </main>
  );
}

export default StoreFront;
