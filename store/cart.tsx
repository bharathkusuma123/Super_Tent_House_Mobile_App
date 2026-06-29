import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { CartItem } from '@/types';

type CartState = {
  items: CartItem[];
  savedForLater: CartItem[];
  appliedCoupon: string | null;
  couponDiscount: number;
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QTY'; payload: { id: string; quantity: number } }
  | { type: 'SAVE_FOR_LATER'; payload: string }
  | { type: 'MOVE_TO_CART'; payload: string }
  | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; payload: CartState };

const initialState: CartState = {
  items: [],
  savedForLater: [],
  appliedCoupon: null,
  couponDiscount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + action.payload.quantity } : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: Math.max(1, action.payload.quantity) } : i
        ),
      };
    case 'SAVE_FOR_LATER': {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return state;
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
        savedForLater: [...state.savedForLater, item],
      };
    }
    case 'MOVE_TO_CART': {
      const item = state.savedForLater.find((i) => i.id === action.payload);
      if (!item) return state;
      return {
        ...state,
        savedForLater: state.savedForLater.filter((i) => i.id !== action.payload),
        items: [...state.items, item],
      };
    }
    case 'APPLY_COUPON':
      return { ...state, appliedCoupon: action.payload.code, couponDiscount: action.payload.discount };
    case 'REMOVE_COUPON':
      return { ...state, appliedCoupon: null, couponDiscount: 0 };
    case 'CLEAR_CART':
      return { ...initialState };
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, quantity: number) => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryCharge: number;
  gst: number;
  grandTotal: number;
} | undefined>(undefined);

const STORAGE_KEY = 'cart_state';

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  return null;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const s = getStorage();
    if (s) {
      const saved = s.getItem(STORAGE_KEY);
      if (saved) {
        try {
          dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) });
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    const s = getStorage();
    if (s) s.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = useCallback((item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item }), []);
  const removeItem = useCallback((id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id }), []);
  const updateQty = useCallback((id: string, quantity: number) => dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } }), []);
  const saveForLater = useCallback((id: string) => dispatch({ type: 'SAVE_FOR_LATER', payload: id }), []);
  const moveToCart = useCallback((id: string) => dispatch({ type: 'MOVE_TO_CART', payload: id }), []);
  const applyCoupon = useCallback((code: string, discount: number) => dispatch({ type: 'APPLY_COUPON', payload: { code, discount } }), []);
  const removeCoupon = useCallback(() => dispatch({ type: 'REMOVE_COUPON' }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryCharge = subtotal > 50000 ? 0 : subtotal > 0 ? 1500 : 0;
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = Math.max(0, subtotal + deliveryCharge + gst - state.couponDiscount);

  return (
    <CartContext.Provider
      value={{ state, addItem, removeItem, updateQty, saveForLater, moveToCart, applyCoupon, removeCoupon, clearCart, totalItems, subtotal, deliveryCharge, gst, grandTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
