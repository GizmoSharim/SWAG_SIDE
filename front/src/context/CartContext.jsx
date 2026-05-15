import { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext(null);

const initialState = {
  items: [],      // { product, size, qty }
  isOpen: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, size } = action.payload;
      const exists = state.items.find(
        (i) => i.product.id === product.id && i.size === size
      );
      return {
        ...state,
        items: exists
          ? state.items.map((i) =>
              i.product.id === product.id && i.size === size
                ? { ...i, qty: i.qty + 1 }
                : i
            )
          : [...state.items, { product, size, qty: 1 }],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.product.id === action.payload.productId && i.size === action.payload.size)
        ),
      };

    case 'CHANGE_QTY': {
      const { productId, size, delta } = action.payload;
      const updated = state.items
        .map((i) =>
          i.product.id === productId && i.size === size
            ? { ...i, qty: i.qty + delta }
            : i
        )
        .filter((i) => i.qty > 0);
      return { ...state, items: updated };
    }

    case 'CLEAR':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'OPEN_CART':
      return { ...state, isOpen: true };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem     = useCallback((product, size) => dispatch({ type: 'ADD_ITEM', payload: { product, size } }), []);
  const removeItem  = useCallback((productId, size) => dispatch({ type: 'REMOVE_ITEM', payload: { productId, size } }), []);
  const changeQty   = useCallback((productId, size, delta) => dispatch({ type: 'CHANGE_QTY', payload: { productId, size, delta } }), []);
  const clearCart   = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const openCart    = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart   = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);
  const toggleCart  = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), []);

  const totalItems  = state.items.reduce((s, i) => s + i.qty, 0);
  // price vem do Prisma como Decimal serializado (string) → parseFloat garante soma correta
  const totalPrice  = state.items.reduce((s, i) => s + parseFloat(i.product.price) * i.qty, 0);

  const isInCart = useCallback(
    (productId, size) => state.items.some((i) => i.product.id === productId && i.size === size),
    [state.items]
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        changeQty,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
