import { useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import styles from './ProductsPage.module.css';

const ASSET = '/prototype-assets/';

const CARD_ASSETS = [
  `${ASSET}hoodie.jpg`,
  `${ASSET}pants.jpg`,
  `${ASSET}tee.jpg`,
  `${ASSET}jacket.jpg`,
];

const SWATCHES = [
  ['#f8f8f8', '#252929', '#111111'],
  ['#f8f8f8', '#2f3434', '#151515'],
  ['#f8f8f8', '#2e3333', '#676b6b'],
  ['#f8f8f8', '#252929', '#111111'],
];

function getCreatedTime(product) {
  const createdAt = product.createdAt ? new Date(product.createdAt).getTime() : NaN;
  return Number.isNaN(createdAt) ? product.id || 0 : createdAt;
}

function decorateProducts(products) {
  return products.map((product, index) => ({
    ...product,
    coverUrl: product.images?.[0]?.url || CARD_ASSETS[index % CARD_ASSETS.length],
    swatches: SWATCHES[index % SWATCHES.length],
  }));
}

export function ProductsPage() {
  const { products, loading, error, refetch } = useProducts();

  const catalog = useMemo(() => decorateProducts(products), [products]);
  const newProducts = useMemo(
    () => [...catalog].sort((a, b) => getCreatedTime(a) - getCreatedTime(b)),
    [catalog]
  );
  const hasProducts = catalog.length > 0;

  return (
    <main className={styles.page} id="home">
      <section className={styles.hero} id="new">
        <div className={styles.heroCopy}>
          <span className={styles.dropTag}>Drop 01 / Itacoatiara concrete</span>
          <h1>Nova Coleção.</h1>
          <p>Pecas oversized, textura pesada e energia de rua para sair do visual copiado.</p>
          <a href="#produtos">Ver agora</a>
        </div>
        <div className={styles.heroStamp}>Limited<br />Side</div>
      </section>

      <section className={styles.productsSection} id="produtos">
        <div className={styles.sectionHead}>
          <div>
            <h2></h2>
            {!loading && !hasProducts && (
              <p className={styles.helperText}>
                Cadastre produtos no sistema para habilitar compras.
              </p>
            )}
          </div>

          {error && (
            <button className={styles.retryBtn} onClick={refetch}>
              Recarregar
            </button>
          )}
        </div>

        {loading ? (
          <div className={styles.status}>Carregando produtos...</div>
        ) : hasProducts ? (
          <div className={styles.productGrid}>
            {catalog.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.status}>
            Nenhum produto cadastrado  ainda.
          </div>
        )}
      </section>

      {hasProducts && (
        <section className={`${styles.productsSection} ${styles.newProductsSection}`} id="novos">
          <div className={styles.sectionHead}>
            <div>
              <h2>Novas Coleções</h2>
              <p className={styles.helperText}>
                Veja nossos novos produtos!
              </p>
            </div>
          </div>
          <div className={styles.productGrid}>
            {newProducts.map((product) => (
              <ProductCard key={`new-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

function Footer() {
  return (
    <footer className={styles.footer} id="about">
      <div>
        <h3>Navegacao</h3>
        <a href="#home">Home</a>
        <a href="#produtos">Produtos</a>
        <a href="#novos">Novos</a>
        <a href="#about">Sobre nos</a>
      </div>

      <div>
        <h3>Contato</h3>
        <a href="#about">92 984052457</a>
        <a href="#about">Trocas e devolucoes</a>
        <a href="#about">Atendimento</a>
        
        
      </div>

      <div>
        <h3>Siga-nos</h3>
        <div className={styles.socials}>
          <span>IG</span>
          <span>TT</span>
        </div>
      </div>

    

      <p className={styles.copy}>Swag Side - Loja Online | Design & Atitude</p>
    </footer>
  );
}
