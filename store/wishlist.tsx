import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';

type WishlistState = {
  productIds: string[];
};

type WishlistAction =
  | { type: 'TOGGLE'; payload: string }
  | { type: 'REMOVE'; payload: string }
  | { type: 'HYDRATE'; payload: string[] };

const initialState: WishlistState = { productIds: [] };

function reducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'HYDRATE':
      return { productIds: action.payload };
    case 'TOGGLE':
      return {
        productIds: state.productIds.includes(action.payload)
          ? state.productIds.filter((id) => id !== action.payload)
          : [...state.productIds, action.payload],
      };
    case 'REMOVE':
      return { productIds: state.productIds.filter((id) => id !== action.payload) };
    default:
      return state;
  }
}

const WishlistContext = createContext<{
  state: WishlistState;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
} | undefined>(undefined);

const STORAGE_KEY = 'wishlist_state';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) });
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.productIds));
    }
  }, [state.productIds]);

  const toggle = useCallback((id: string) => dispatch({ type: 'TOGGLE', payload: id }), []);
  const remove = useCallback((id: string) => dispatch({ type: 'REMOVE', payload: id }), []);
  const has = useCallback((id: string) => state.productIds.includes(id), [state.productIds]);

  return (
    <WishlistContext.Provider value={{ state, toggle, remove, has }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
