import { useCart } from '../context/CartContext';
import styles from './Header.module.css';

export function Header() {
  const { totalItems, openCart } = useCart();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>SWAG SIDE</div>

      <nav className={styles.nav}>
        <a className={styles.active} href="#new">Drop</a>
        <a href="#produtos">Shop</a>
        <a href="#novos">Novos</a>
        <a href="#about">Contato</a>
      </nav>

      <div className={styles.actions}>
        <button className={styles.iconBtn} type="button" aria-label="Buscar">
          <SearchIcon />
        </button>
        <button className={styles.cartBtn} onClick={openCart} aria-label="Abrir carrinho">
          <CartIcon />
          <span className={styles.badge}>{totalItems}</span>
        </button>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="20" r="1.6" />
      <circle cx="18" cy="20" r="1.6" />
      <path d="M2.5 3.5h3l2.2 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.5L21 8H7" />
    </svg>
  );
}
