import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { CartPanel } from './components/CartPanel';
import { ProductsPage } from './pages/ProductsPage';
import './index.css';

export default function App() {
  return (
    <CartProvider>
      <Header />
      <ProductsPage />
      <CartPanel />
    </CartProvider>
  );
}
