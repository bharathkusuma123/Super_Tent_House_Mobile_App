// import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
// import { CartItem } from '@/types';

// type CartState = {
//   items: CartItem[];
//   savedForLater: CartItem[];
//   appliedCoupon: string | null;
//   couponDiscount: number;
// };

// type CartAction =
//   | { type: 'ADD_ITEM'; payload: CartItem }
//   | { type: 'REMOVE_ITEM'; payload: string }
//   | { type: 'UPDATE_QTY'; payload: { id: string; quantity: number } }
//   | { type: 'SAVE_FOR_LATER'; payload: string }
//   | { type: 'MOVE_TO_CART'; payload: string }
//   | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } }
//   | { type: 'REMOVE_COUPON' }
//   | { type: 'CLEAR_CART' }
//   | { type: 'HYDRATE'; payload: CartState };

// const initialState: CartState = {
//   items: [],
//   savedForLater: [],
//   appliedCoupon: null,
//   couponDiscount: 0,
// };

// function cartReducer(state: CartState, action: CartAction): CartState {
//   switch (action.type) {
//     case 'HYDRATE':
//       return action.payload;
//     case 'ADD_ITEM': {
//       const existing = state.items.find((i) => i.id === action.payload.id);
//       if (existing) {
//         return {
//           ...state,
//           items: state.items.map((i) =>
//             i.id === action.payload.id ? { ...i, quantity: i.quantity + action.payload.quantity } : i
//           ),
//         };
//       }
//       return { ...state, items: [...state.items, action.payload] };
//     }
//     case 'REMOVE_ITEM':
//       return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
//     case 'UPDATE_QTY':
//       return {
//         ...state,
//         items: state.items.map((i) =>
//           i.id === action.payload.id ? { ...i, quantity: Math.max(1, action.payload.quantity) } : i
//         ),
//       };
//     case 'SAVE_FOR_LATER': {
//       const item = state.items.find((i) => i.id === action.payload);
//       if (!item) return state;
//       return {
//         ...state,
//         items: state.items.filter((i) => i.id !== action.payload),
//         savedForLater: [...state.savedForLater, item],
//       };
//     }
//     case 'MOVE_TO_CART': {
//       const item = state.savedForLater.find((i) => i.id === action.payload);
//       if (!item) return state;
//       return {
//         ...state,
//         savedForLater: state.savedForLater.filter((i) => i.id !== action.payload),
//         items: [...state.items, item],
//       };
//     }
//     case 'APPLY_COUPON':
//       return { ...state, appliedCoupon: action.payload.code, couponDiscount: action.payload.discount };
//     case 'REMOVE_COUPON':
//       return { ...state, appliedCoupon: null, couponDiscount: 0 };
//     case 'CLEAR_CART':
//       return { ...initialState };
//     default:
//       return state;
//   }
// }

// const CartContext = createContext<{
//   state: CartState;
//   addItem: (item: CartItem) => void;
//   removeItem: (id: string) => void;
//   updateQty: (id: string, quantity: number) => void;
//   saveForLater: (id: string) => void;
//   moveToCart: (id: string) => void;
//   applyCoupon: (code: string, discount: number) => void;
//   removeCoupon: () => void;
//   clearCart: () => void;
//   totalItems: number;
//   subtotal: number;
//   deliveryCharge: number;
//   gst: number;
//   grandTotal: number;
// } | undefined>(undefined);

// const STORAGE_KEY = 'cart_state';

// function getStorage() {
//   if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
//   return null;
// }

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(cartReducer, initialState);

//   useEffect(() => {
//     const s = getStorage();
//     if (s) {
//       const saved = s.getItem(STORAGE_KEY);
//       if (saved) {
//         try {
//           dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) });
//         } catch {}
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const s = getStorage();
//     if (s) s.setItem(STORAGE_KEY, JSON.stringify(state));
//   }, [state]);

//   const addItem = useCallback((item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item }), []);
//   const removeItem = useCallback((id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id }), []);
//   const updateQty = useCallback((id: string, quantity: number) => dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } }), []);
//   const saveForLater = useCallback((id: string) => dispatch({ type: 'SAVE_FOR_LATER', payload: id }), []);
//   const moveToCart = useCallback((id: string) => dispatch({ type: 'MOVE_TO_CART', payload: id }), []);
//   const applyCoupon = useCallback((code: string, discount: number) => dispatch({ type: 'APPLY_COUPON', payload: { code, discount } }), []);
//   const removeCoupon = useCallback(() => dispatch({ type: 'REMOVE_COUPON' }), []);
//   const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

//   const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
//   const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
//   const deliveryCharge = subtotal > 50000 ? 0 : subtotal > 0 ? 1500 : 0;
//   const gst = Math.round(subtotal * 0.18);
//   const grandTotal = Math.max(0, subtotal + deliveryCharge + gst - state.couponDiscount);

//   return (
//     <CartContext.Provider
//       value={{ state, addItem, removeItem, updateQty, saveForLater, moveToCart, applyCoupon, removeCoupon, clearCart, totalItems, subtotal, deliveryCharge, gst, grandTotal }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error('useCart must be used within CartProvider');
//   return ctx;
// }

// store/cart.tsx
/// store/cart.tsx
// // store/cart.tsx - Updated with proper API sync
// import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
// import { CartItem } from '@/types';
// import { API_BASE_URL } from '@/services/api';
// import axios from 'axios';

// type CartState = {
//   items: CartItem[];
//   savedForLater: CartItem[];
//   appliedCoupon: string | null;
//   couponDiscount: number;
// };

// type CartAction =
//   | { type: 'ADD_ITEM'; payload: CartItem }
//   | { type: 'REMOVE_ITEM'; payload: string }
//   | { type: 'UPDATE_QTY'; payload: { id: string; quantity: number; productId?: string } }
//   | { type: 'SAVE_FOR_LATER'; payload: string }
//   | { type: 'MOVE_TO_CART'; payload: string }
//   | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } }
//   | { type: 'REMOVE_COUPON' }
//   | { type: 'CLEAR_CART' }
//   | { type: 'HYDRATE'; payload: CartState }
//   | { type: 'SET_CART_ITEMS'; payload: CartItem[] };

// const initialState: CartState = {
//   items: [],
//   savedForLater: [],
//   appliedCoupon: null,
//   couponDiscount: 0,
// };

// function cartReducer(state: CartState, action: CartAction): CartState {
//   switch (action.type) {
//     case 'HYDRATE':
//       return action.payload;
//     case 'SET_CART_ITEMS':
//       return { ...state, items: action.payload };
//     case 'ADD_ITEM': {
//       const existing = state.items.find((i) => i.productId === action.payload.productId);
//       if (existing) {
//         return {
//           ...state,
//           items: state.items.map((i) =>
//             i.productId === action.payload.productId 
//               ? { ...i, quantity: i.quantity + action.payload.quantity } 
//               : i
//           ),
//         };
//       }
//       return { ...state, items: [...state.items, action.payload] };
//     }
//     case 'REMOVE_ITEM':
//       return { ...state, items: state.items.filter((i) => i.id !== action.payload && i.productId !== action.payload) };
//     case 'UPDATE_QTY': {
//       const updatedItems = state.items.map((i) => {
//         if (i.id === action.payload.id || i.productId === action.payload.productId || i.productId === action.payload.id) {
//           return { ...i, quantity: Math.max(1, action.payload.quantity) };
//         }
//         return i;
//       });
//       return { ...state, items: updatedItems };
//     }
//     case 'SAVE_FOR_LATER': {
//       const item = state.items.find((i) => i.id === action.payload || i.productId === action.payload);
//       if (!item) return state;
//       return {
//         ...state,
//         items: state.items.filter((i) => i.id !== action.payload && i.productId !== action.payload),
//         savedForLater: [...state.savedForLater, { ...item, quantity: 1 }],
//       };
//     }
//     case 'MOVE_TO_CART': {
//       const item = state.savedForLater.find((i) => i.id === action.payload || i.productId === action.payload);
//       if (!item) return state;
//       return {
//         ...state,
//         savedForLater: state.savedForLater.filter((i) => i.id !== action.payload && i.productId !== action.payload),
//         items: [...state.items, { ...item, quantity: 1 }],
//       };
//     }
//     case 'APPLY_COUPON':
//       return { ...state, appliedCoupon: action.payload.code, couponDiscount: action.payload.discount };
//     case 'REMOVE_COUPON':
//       return { ...state, appliedCoupon: null, couponDiscount: 0 };
//     case 'CLEAR_CART':
//       return { ...initialState };
//     default:
//       return state;
//   }
// }

// const CartContext = createContext<{
//   state: CartState;
//   addItem: (item: CartItem, customerId?: string) => Promise<void>;
//   removeItem: (id: string, customerId?: string) => Promise<void>;
//   updateQty: (id: string, quantity: number, productId?: string, customerId?: string) => Promise<void>;
//   saveForLater: (id: string) => void;
//   moveToCart: (id: string) => void;
//   applyCoupon: (code: string, discount: number) => void;
//   removeCoupon: () => void;
//   clearCart: () => void;
//   setCartItems: (items: CartItem[]) => void;
//   syncCart: (customerId: string) => Promise<void>;
//   fetchCart: (customerId: string) => Promise<void>;
//   totalItems: number;
//   subtotal: number;
//   deliveryCharge: number;
//   gst: number;
//   grandTotal: number;
// } | undefined>(undefined);

// const STORAGE_KEY = 'cart_state';

// function getStorage() {
//   if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
//   return null;
// }

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(cartReducer, initialState);

//   useEffect(() => {
//     const s = getStorage();
//     if (s) {
//       const saved = s.getItem(STORAGE_KEY);
//       if (saved) {
//         try {
//           dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) });
//         } catch {}
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const s = getStorage();
//     if (s) s.setItem(STORAGE_KEY, JSON.stringify(state));
//   }, [state]);

//   const setCartItems = useCallback((items: CartItem[]) => {
//     dispatch({ type: 'SET_CART_ITEMS', payload: items });
//   }, []);

//   const fetchCart = useCallback(async (customerId: string) => {
//     if (!customerId) return [];
//     try {
//       console.log('📦 Fetching cart for customer:', customerId);
//       const response = await axios.get(`${API_BASE_URL}/cart/${customerId}`);
//       console.log('📦 Cart response:', response.data);
      
//       if (response.data.success && response.data.data) {
//         const items = response.data.data.map((item: any) => ({
//           id: item.id?.toString() || `${item.product_id}_${Date.now()}`,
//           productId: item.product_id?.toString() || '',
//           name: item.product_name || '',
//           image: item.image || 'https://via.placeholder.com/300x300',
//           price: parseFloat(item.price) || 0,
//           quantity: parseInt(item.quantity) || 1,
//           type: 'product' as const,
//         }));
//         setCartItems(items);
//         return items;
//       }
//       setCartItems([]);
//       return [];
//     } catch (error) {
//       console.error('Failed to fetch cart:', error);
//       setCartItems([]);
//       return [];
//     }
//   }, [setCartItems]);

//   // ─── ADD ITEM - Syncs with API ──────────────────────────────────────────────
//   const addItem = useCallback(async (item: CartItem, customerId?: string) => {
//     console.log('📦 Adding item to cart:', { item, customerId });
    
//     // Update local state first
//     dispatch({ type: 'ADD_ITEM', payload: item });
    
//     // If customerId is provided, sync with backend
//     if (customerId) {
//       try {
//         const response = await axios.post(`${API_BASE_URL}/cart`, {
//           customerId: customerId,
//           product: {
//             id: item.productId || item.id,
//             name: item.name,
//             price: item.price,
//             image: item.image,
//           },
//         });
//         console.log('📦 Add item response:', response.data);
        
//         if (response.data.success) {
//           // Refresh cart from server to ensure consistency
//           await fetchCart(customerId);
//         }
//       } catch (error) {
//         console.error('Failed to add item to backend:', error);
//       }
//     }
//   }, [fetchCart]);

//   // ─── REMOVE ITEM - Syncs with API ───────────────────────────────────────────
//   const removeItem = useCallback(async (id: string, customerId?: string) => {
//     console.log('📦 Removing item:', { id, customerId });
    
//     // Find the item to get productId
//     const item = state.items.find(i => i.id === id || i.productId === id);
    
//     // Update local state
//     dispatch({ type: 'REMOVE_ITEM', payload: id });
    
//     // If customerId and productId are available, sync with backend
//     if (customerId && item) {
//       try {
//         await axios.delete(`${API_BASE_URL}/cart/item`, {
//           data: { customerId, productId: item.productId || item.id },
//         });
//         console.log('📦 Item removed from backend');
//         await fetchCart(customerId);
//       } catch (error) {
//         console.error('Failed to remove item from backend:', error);
//       }
//     }
//   }, [state.items, fetchCart]);

//   // ─── UPDATE QUANTITY - Syncs with API ──────────────────────────────────────
//   const updateQty = useCallback(async (id: string, quantity: number, productId?: string, customerId?: string) => {
//     console.log('📦 updateQty called:', { id, quantity, productId, customerId });
    
//     // Update local state
//     dispatch({ type: 'UPDATE_QTY', payload: { id, quantity, productId } });
    
//     // If customerId and productId are available, sync with backend
//     if (customerId && (productId || id)) {
//       try {
//         const response = await axios.put(`${API_BASE_URL}/cart`, {
//           customerId,
//           productId: productId || id,
//           quantity,
//         });
//         console.log('📦 Update qty response:', response.data);
        
//         if (response.data.success) {
//           await fetchCart(customerId);
//         }
//       } catch (error) {
//         console.error('Failed to update quantity in backend:', error);
//       }
//     }
//   }, [fetchCart]);

//   const syncCart = useCallback(async (customerId: string) => {
//     if (!customerId || state.items.length === 0) return;
//     try {
//       for (const item of state.items) {
//         await axios.post(`${API_BASE_URL}/cart`, {
//           customerId: customerId,
//           product: {
//             id: item.productId || item.id,
//             name: item.name,
//             price: item.price,
//             image: item.image,
//           },
//         });
//       }
//     } catch (error) {
//       console.error('Failed to sync cart:', error);
//     }
//   }, [state.items]);

//   const saveForLater = useCallback((id: string) => {
//     dispatch({ type: 'SAVE_FOR_LATER', payload: id });
//   }, []);

//   const moveToCart = useCallback((id: string) => {
//     dispatch({ type: 'MOVE_TO_CART', payload: id });
//   }, []);

//   const applyCoupon = useCallback((code: string, discount: number) => {
//     dispatch({ type: 'APPLY_COUPON', payload: { code, discount } });
//   }, []);

//   const removeCoupon = useCallback(() => {
//     dispatch({ type: 'REMOVE_COUPON' });
//   }, []);

//   const clearCart = useCallback(() => {
//     dispatch({ type: 'CLEAR_CART' });
//   }, []);

//   const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
//   const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
//   const deliveryCharge = subtotal > 50000 ? 0 : subtotal > 0 ? 1500 : 0;
//   const gst = Math.round(subtotal * 0.18);
//   const grandTotal = Math.max(0, subtotal + deliveryCharge + gst - state.couponDiscount);

//   return (
//     <CartContext.Provider
//       value={{
//         state,
//         addItem,
//         removeItem,
//         updateQty,
//         saveForLater,
//         moveToCart,
//         applyCoupon,
//         removeCoupon,
//         clearCart,
//         setCartItems,
//         fetchCart,
//         syncCart,
//         totalItems,
//         subtotal,
//         deliveryCharge,
//         gst,
//         grandTotal,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error('useCart must be used within CartProvider');
//   return ctx;
// }




// // store/cart.tsx
// import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
// import { CartItem } from '@/types';
// import { API_BASE_URL } from '@/services/api';
// import axios from 'axios';

// type CartState = {
//   items: CartItem[];
//   savedForLater: CartItem[];
//   appliedCoupon: string | null;
//   couponDiscount: number;
// };

// type CartAction =
//   | { type: 'ADD_ITEM'; payload: CartItem }
//   | { type: 'REMOVE_ITEM'; payload: string }
//   | { type: 'UPDATE_QTY'; payload: { id: string; quantity: number; productId?: string } }
//   | { type: 'SAVE_FOR_LATER'; payload: string }
//   | { type: 'MOVE_TO_CART'; payload: string }
//   | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } }
//   | { type: 'REMOVE_COUPON' }
//   | { type: 'CLEAR_CART' }
//   | { type: 'HYDRATE'; payload: CartState }
//   | { type: 'SET_CART_ITEMS'; payload: CartItem[] };

// const initialState: CartState = {
//   items: [],
//   savedForLater: [],
//   appliedCoupon: null,
//   couponDiscount: 0,
// };

// function cartReducer(state: CartState, action: CartAction): CartState {
//   switch (action.type) {
//     case 'HYDRATE':
//       return action.payload;
//     case 'SET_CART_ITEMS':
//       return { ...state, items: action.payload };
//     case 'ADD_ITEM': {
//       const existing = state.items.find((i) => i.productId === action.payload.productId);
//       if (existing) {
//         return {
//           ...state,
//           items: state.items.map((i) =>
//             i.productId === action.payload.productId 
//               ? { ...i, quantity: i.quantity + action.payload.quantity } 
//               : i
//           ),
//         };
//       }
//       return { ...state, items: [...state.items, action.payload] };
//     }
//     case 'REMOVE_ITEM':
//       return { ...state, items: state.items.filter((i) => i.id !== action.payload && i.productId !== action.payload) };
//     case 'UPDATE_QTY': {
//       const updatedItems = state.items.map((i) => {
//         if (i.id === action.payload.id || i.productId === action.payload.productId || i.productId === action.payload.id) {
//           return { ...i, quantity: Math.max(1, action.payload.quantity) };
//         }
//         return i;
//       });
//       return { ...state, items: updatedItems };
//     }
//     case 'SAVE_FOR_LATER': {
//       const item = state.items.find((i) => i.id === action.payload || i.productId === action.payload);
//       if (!item) return state;
//       return {
//         ...state,
//         items: state.items.filter((i) => i.id !== action.payload && i.productId !== action.payload),
//         savedForLater: [...state.savedForLater, { ...item, quantity: 1 }],
//       };
//     }
//     case 'MOVE_TO_CART': {
//       const item = state.savedForLater.find((i) => i.id === action.payload || i.productId === action.payload);
//       if (!item) return state;
//       return {
//         ...state,
//         savedForLater: state.savedForLater.filter((i) => i.id !== action.payload && i.productId !== action.payload),
//         items: [...state.items, { ...item, quantity: 1 }],
//       };
//     }
//     case 'APPLY_COUPON':
//       return { ...state, appliedCoupon: action.payload.code, couponDiscount: action.payload.discount };
//     case 'REMOVE_COUPON':
//       return { ...state, appliedCoupon: null, couponDiscount: 0 };
//     case 'CLEAR_CART':
//       return { ...initialState };
//     default:
//       return state;
//   }
// }

// const CartContext = createContext<{
//   state: CartState;
//   addItem: (item: CartItem, customerId?: string) => Promise<void>;
//   removeItem: (id: string, customerId?: string) => Promise<void>;
//   updateQty: (id: string, quantity: number, productId?: string, customerId?: string) => Promise<void>;
//   saveForLater: (id: string) => void;
//   moveToCart: (id: string) => void;
//   applyCoupon: (code: string, discount: number) => void;
//   removeCoupon: () => void;
//   clearCart: () => void;
//   setCartItems: (items: CartItem[]) => void;
//   syncCart: (customerId: string) => Promise<void>;
//   fetchCart: (customerId: string) => Promise<CartItem[]>;
//   totalItems: number;
//   subtotal: number;
//   deliveryCharge: number;
//   gst: number;
//   grandTotal: number;
// } | undefined>(undefined);

// const STORAGE_KEY = 'cart_state';

// function getStorage() {
//   if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
//   return null;
// }

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(cartReducer, initialState);

//   useEffect(() => {
//     const s = getStorage();
//     if (s) {
//       const saved = s.getItem(STORAGE_KEY);
//       if (saved) {
//         try {
//           dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) });
//         } catch {}
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const s = getStorage();
//     if (s) s.setItem(STORAGE_KEY, JSON.stringify(state));
//   }, [state]);

//   const setCartItems = useCallback((items: CartItem[]) => {
//     dispatch({ type: 'SET_CART_ITEMS', payload: items });
//   }, []);

//  // store/cart.tsx - Update the fetchCart function to handle IDs properly

// // store/cart.tsx - FIXED fetchCart function

// const fetchCart = useCallback(async (customerId: string) => {
//   if (!customerId) {
//     console.log('📦 No customerId provided to fetchCart');
//     return [];
//   }
  
//   try {
//     console.log('📦 Fetching cart for customer:', customerId);
//     const response = await axios.get(`${API_BASE_URL}/cart/${customerId}`);
//     console.log('📦 Cart response status:', response.status);
//     console.log('📦 Cart response data:', response.data);
    
//     if (response.data.success && response.data.data) {
//       const items = response.data.data.map((item: any) => {
//         // Use the product_id from the database as the productId
//         const productId = String(item.product_id || '');
//         // Use the database id as the cart item id
//         const id = String(item.id || `${productId}_${Date.now()}`);
        
//         return {
//           id: id,
//           productId: productId,
//           name: item.product_name || '',
//           image: item.image || 'https://via.placeholder.com/300x300',
//           price: parseFloat(item.price) || 0,
//           quantity: parseInt(item.quantity) || 1,
//           type: 'product' as const,
//         };
//       });
//       console.log('📦 Mapped items:', items);
//       dispatch({ type: 'SET_CART_ITEMS', payload: items });
//       return items;
//     }
//     dispatch({ type: 'SET_CART_ITEMS', payload: [] });
//     return [];
//   } catch (error: any) {
//     console.error('Failed to fetch cart:', error);
//     console.error('Error details:', error.response?.data || error.message);
//     dispatch({ type: 'SET_CART_ITEMS', payload: [] });
//     return [];
//   }
// }, []);
//   // ─── ADD ITEM - FIXED ──────────────────────────────────────────────────────
//   // store/cart.tsx - FIXED addItem function

// // store/cart.tsx - COMPLETE FIX for addItem

// // store/cart.tsx - Add better error handling in addItem

// const addItem = useCallback(async (item: CartItem, customerId?: string) => {
//   console.log('📦 Adding item to cart:', { item, customerId });
  
//   // If no customerId, store locally only
//   if (!customerId) {
//     console.log('📦 No customerId, storing locally only');
//     dispatch({ type: 'ADD_ITEM', payload: item });
//     return;
//   }
  
//   // Ensure we have a productId
//   const productId = item.productId || item.id.split('_')[0] || item.id;
  
//   // Create a proper cart item with both IDs
//   const cartItem = {
//     ...item,
//     productId: productId,
//     id: item.id || `${productId}_${Date.now()}`,
//     quantity: item.quantity || 1,
//   };
  
//   try {
//     // Prepare the product data for the backend
//     const productData = {
//       id: productId,
//       name: item.name,
//       price: item.price,
//       image: item.image || '',
//       quantity: item.quantity || 1,
//     };
    
//     console.log('📦 Sending to backend:', { customerId, product: productData });
    
//     // Send to backend
//     const response = await axios.post(`${API_BASE_URL}/cart`, {
//       customerId: customerId,
//       product: productData,
//     });
    
//     console.log('📦 Backend response:', response.data);
    
//     if (response.data.success) {
//       // Refresh cart from backend to get the latest state
//       await fetchCart(customerId);
//     } else {
//       // If backend fails, update local state as fallback
//       console.log('📦 Backend failed, updating local state');
//       dispatch({ type: 'ADD_ITEM', payload: cartItem });
//     }
    
//   } catch (error: any) {
//     console.error('Failed to add item to backend:', error);
//     console.error('Error details:', error.response?.data || error.message);
//     // Update local state as fallback
//     dispatch({ type: 'ADD_ITEM', payload: cartItem });
//     // Re-throw to let the caller handle the error
//     throw error;
//   }
// }, [fetchCart]);

//   // ─── REMOVE ITEM - FIXED ───────────────────────────────────────────────────
//   const removeItem = useCallback(async (id: string, customerId?: string) => {
//     console.log('📦 Removing item:', { id, customerId });
    
//     // Find the item to get productId
//     const item = state.items.find(i => i.id === id || i.productId === id);
//     const productId = item?.productId || id.split('_')[0] || id;
    
//     // Update local state
//     dispatch({ type: 'REMOVE_ITEM', payload: id });
    
//     // If customerId and productId are available, sync with backend
//     if (customerId && productId) {
//       try {
//         await axios.delete(`${API_BASE_URL}/cart/item`, {
//           data: { customerId, productId: productId },
//         });
//         console.log('📦 Item removed from backend');
//         await fetchCart(customerId);
//       } catch (error) {
//         console.error('Failed to remove item from backend:', error);
//       }
//     }
//   }, [state.items, fetchCart]);

//   // ─── UPDATE QUANTITY - FIXED ──────────────────────────────────────────────
//   const updateQty = useCallback(async (id: string, quantity: number, productId?: string, customerId?: string) => {
//     console.log('📦 updateQty called:', { id, quantity, productId, customerId });
    
//     // Extract the actual product ID from the composite ID if needed
//     let actualProductId = productId;
//     if (!actualProductId && id.includes('_')) {
//       actualProductId = id.split('_')[0];
//     }
//     if (!actualProductId) {
//       actualProductId = id;
//     }
    
//     console.log('📦 Extracted productId:', actualProductId);
    
//     // Update local state
//     dispatch({ type: 'UPDATE_QTY', payload: { id, quantity, productId: actualProductId } });
    
//     // If customerId and productId are available, sync with backend
//     if (customerId && actualProductId) {
//       try {
//         const response = await axios.put(`${API_BASE_URL}/cart`, {
//           customerId,
//           productId: actualProductId,
//           quantity,
//         });
//         console.log('📦 Update qty response:', response.data);
        
//         if (response.data.success) {
//           await fetchCart(customerId);
//         } else {
//           // If server says item not found, refresh cart
//           console.log('📦 Item not found on server, refreshing cart');
//           await fetchCart(customerId);
//         }
//       } catch (error) {
//         console.error('Failed to update quantity in backend:', error);
//         // Revert local state if server update fails
//         await fetchCart(customerId);
//       }
//     } else {
//       console.log('📦 No customerId or productId, updating local state only');
//     }
//   }, [fetchCart]);

//   const syncCart = useCallback(async (customerId: string) => {
//     if (!customerId || state.items.length === 0) return;
//     try {
//       for (const item of state.items) {
//         await axios.post(`${API_BASE_URL}/cart`, {
//           customerId: customerId,
//           product: {
//             id: item.productId || item.id.split('_')[0] || item.id,
//             name: item.name,
//             price: item.price,
//             image: item.image,
//           },
//         });
//       }
//     } catch (error) {
//       console.error('Failed to sync cart:', error);
//     }
//   }, [state.items]);

//   const saveForLater = useCallback((id: string) => {
//     dispatch({ type: 'SAVE_FOR_LATER', payload: id });
//   }, []);

//   const moveToCart = useCallback((id: string) => {
//     dispatch({ type: 'MOVE_TO_CART', payload: id });
//   }, []);

//   const applyCoupon = useCallback((code: string, discount: number) => {
//     dispatch({ type: 'APPLY_COUPON', payload: { code, discount } });
//   }, []);

//   const removeCoupon = useCallback(() => {
//     dispatch({ type: 'REMOVE_COUPON' });
//   }, []);

//   const clearCart = useCallback(() => {
//     dispatch({ type: 'CLEAR_CART' });
//   }, []);

//   const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
//   const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
//   const deliveryCharge = subtotal > 50000 ? 0 : subtotal > 0 ? 1500 : 0;
//   const gst = Math.round(subtotal * 0.18);
//   const grandTotal = Math.max(0, subtotal + deliveryCharge + gst - state.couponDiscount);

//   return (
//     <CartContext.Provider
//       value={{
//         state,
//         addItem,
//         removeItem,
//         updateQty,
//         saveForLater,
//         moveToCart,
//         applyCoupon,
//         removeCoupon,
//         clearCart,
//         setCartItems,
//         fetchCart,
//         syncCart,
//         totalItems,
//         subtotal,
//         deliveryCharge,
//         gst,
//         grandTotal,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error('useCart must be used within CartProvider');
//   return ctx;
// }



// store/cart.tsx
import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { CartItem } from '@/types';
import { API_BASE_URL } from '@/services/api';
import axios from 'axios';

type CartState = {
  items: CartItem[];
  savedForLater: CartItem[];
  appliedCoupon: string | null;
  couponDiscount: number;
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QTY'; payload: { id: string; quantity: number; productId?: string } }
  | { type: 'SAVE_FOR_LATER'; payload: string }
  | { type: 'MOVE_TO_CART'; payload: string }
  | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; payload: CartState }
  | { type: 'SET_CART_ITEMS'; payload: CartItem[] };

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
    case 'SET_CART_ITEMS':
      return { ...state, items: action.payload };
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.productId === action.payload.productId);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.payload.productId 
              ? { ...i, quantity: i.quantity + action.payload.quantity } 
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload && i.productId !== action.payload) };
    case 'UPDATE_QTY': {
      const updatedItems = state.items.map((i) => {
        if (i.id === action.payload.id || i.productId === action.payload.productId || i.productId === action.payload.id) {
          return { ...i, quantity: Math.max(1, action.payload.quantity) };
        }
        return i;
      });
      return { ...state, items: updatedItems };
    }
    case 'SAVE_FOR_LATER': {
      const item = state.items.find((i) => i.id === action.payload || i.productId === action.payload);
      if (!item) return state;
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload && i.productId !== action.payload),
        savedForLater: [...state.savedForLater, { ...item, quantity: 1 }],
      };
    }
    case 'MOVE_TO_CART': {
      const item = state.savedForLater.find((i) => i.id === action.payload || i.productId === action.payload);
      if (!item) return state;
      return {
        ...state,
        savedForLater: state.savedForLater.filter((i) => i.id !== action.payload && i.productId !== action.payload),
        items: [...state.items, { ...item, quantity: 1 }],
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
  addItem: (item: CartItem, customerId?: string) => Promise<void>;
  removeItem: (id: string, customerId?: string) => Promise<void>;
  updateQty: (id: string, quantity: number, productId?: string, customerId?: string) => Promise<void>;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  setCartItems: (items: CartItem[]) => void;
  syncCart: (customerId: string) => Promise<void>;
  fetchCart: (customerId: string) => Promise<CartItem[]>;
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

  const setCartItems = useCallback((items: CartItem[]) => {
    dispatch({ type: 'SET_CART_ITEMS', payload: items });
  }, []);

  const fetchCart = useCallback(async (customerId: string) => {
    if (!customerId) {
      console.log('📦 No customerId provided to fetchCart');
      return [];
    }
    
    try {
      console.log('📦 Fetching cart for customer:', customerId);
      const response = await axios.get(`${API_BASE_URL}/cart/${customerId}`);
      console.log('📦 Cart response status:', response.status);
      console.log('📦 Cart response data:', response.data);
      
      if (response.data.success && response.data.data) {
        const items = response.data.data.map((item: any) => {
          const productId = String(item.product_id || '');
          const id = String(item.id || `${productId}_${Date.now()}`);
          
          return {
            id: id,
            productId: productId,
            name: item.product_name || '',
            image: item.image || 'https://via.placeholder.com/300x300',
            price: parseFloat(item.price) || 0,
            quantity: parseInt(item.quantity) || 1,
            type: 'product' as const,
          };
        });
        console.log('📦 Mapped items:', items);
        dispatch({ type: 'SET_CART_ITEMS', payload: items });
        return items;
      }
      dispatch({ type: 'SET_CART_ITEMS', payload: [] });
      return [];
    } catch (error: any) {
      console.error('Failed to fetch cart:', error);
      console.error('Error details:', error.response?.data || error.message);
      dispatch({ type: 'SET_CART_ITEMS', payload: [] });
      return [];
    }
  }, []);

 // store/cart.tsx - Update the addItem function

const addItem = useCallback(async (item: CartItem, customerId?: string) => {
  console.log('📦 Adding item to cart:', { item, customerId });
  
  // If no customerId, try to get it from localStorage
  let finalCustomerId = customerId;
  if (!finalCustomerId) {
    try {
      const userStr = localStorage.getItem('auth_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        finalCustomerId = user.id;
        console.log('📦 Got customerId from localStorage in cart store:', finalCustomerId);
      }
    } catch (error) {
      console.error('❌ Failed to get user from localStorage in cart store:', error);
    }
  }
  
  // If still no customerId, store locally only
  if (!finalCustomerId) {
    console.log('📦 No customerId, storing locally only');
    dispatch({ type: 'ADD_ITEM', payload: item });
    return;
  }
  
  // Ensure we have a productId
  const productId = item.productId || item.id.split('_')[0] || item.id;
  
  // Create a proper cart item
  const cartItem = {
    ...item,
    productId: productId,
    id: item.id || `${productId}_${Date.now()}`,
    quantity: item.quantity || 1,
  };
  
  try {
    // Prepare the product data for the backend
    const productData = {
      id: productId,
      name: item.name,
      price: item.price,
      image: item.image || '',
      quantity: item.quantity || 1,
    };
    
    console.log('📦 Sending to backend:', { customerId: finalCustomerId, product: productData });
    
    // Send to backend
    const response = await axios.post(`${API_BASE_URL}/cart`, {
      customerId: finalCustomerId,
      product: productData,
    });
    
    console.log('📦 Backend response:', response.data);
    
    if (response.data.success) {
      // Refresh cart from backend to get the latest state
      const updatedCart = await fetchCart(finalCustomerId);
      console.log('📦 Cart updated successfully, items:', updatedCart.length);
    } else {
      console.log('📦 Backend failed, updating local state as fallback');
      dispatch({ type: 'ADD_ITEM', payload: cartItem });
    }
    
  } catch (error: any) {
    console.error('❌ Failed to add item to backend:', error);
    console.error('Error details:', error.response?.data || error.message);
    // Update local state as fallback
    dispatch({ type: 'ADD_ITEM', payload: cartItem });
    // Re-throw to let the caller handle the error
    throw error;
  }
}, [fetchCart]);
  const removeItem = useCallback(async (id: string, customerId?: string) => {
    console.log('📦 Removing item:', { id, customerId });
    
    // Find the item to get productId
    const item = state.items.find(i => i.id === id || i.productId === id);
    const productId = item?.productId || id.split('_')[0] || id;
    
    // Update local state
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    
    // If customerId and productId are available, sync with backend
    if (customerId && productId) {
      try {
        await axios.delete(`${API_BASE_URL}/cart/item`, {
          data: { customerId, productId: productId },
        });
        console.log('📦 Item removed from backend');
        await fetchCart(customerId);
      } catch (error) {
        console.error('Failed to remove item from backend:', error);
      }
    }
  }, [state.items, fetchCart]);

  const updateQty = useCallback(async (id: string, quantity: number, productId?: string, customerId?: string) => {
    console.log('📦 updateQty called:', { id, quantity, productId, customerId });
    
    // Extract the actual product ID from the composite ID if needed
    let actualProductId = productId;
    if (!actualProductId && id.includes('_')) {
      actualProductId = id.split('_')[0];
    }
    if (!actualProductId) {
      actualProductId = id;
    }
    
    console.log('📦 Extracted productId:', actualProductId);
    
    // Update local state
    dispatch({ type: 'UPDATE_QTY', payload: { id, quantity, productId: actualProductId } });
    
    // If customerId and productId are available, sync with backend
    if (customerId && actualProductId) {
      try {
        const response = await axios.put(`${API_BASE_URL}/cart`, {
          customerId,
          productId: actualProductId,
          quantity,
        });
        console.log('📦 Update qty response:', response.data);
        
        if (response.data.success) {
          await fetchCart(customerId);
        } else {
          // If server says item not found, refresh cart
          console.log('📦 Item not found on server, refreshing cart');
          await fetchCart(customerId);
        }
      } catch (error) {
        console.error('Failed to update quantity in backend:', error);
        // Revert local state if server update fails
        await fetchCart(customerId);
      }
    } else {
      console.log('📦 No customerId or productId, updating local state only');
    }
  }, [fetchCart]);

  const syncCart = useCallback(async (customerId: string) => {
    if (!customerId || state.items.length === 0) return;
    try {
      for (const item of state.items) {
        await axios.post(`${API_BASE_URL}/cart`, {
          customerId: customerId,
          product: {
            id: item.productId || item.id.split('_')[0] || item.id,
            name: item.name,
            price: item.price,
            image: item.image,
          },
        });
      }
    } catch (error) {
      console.error('Failed to sync cart:', error);
    }
  }, [state.items]);

  const saveForLater = useCallback((id: string) => {
    dispatch({ type: 'SAVE_FOR_LATER', payload: id });
  }, []);

  const moveToCart = useCallback((id: string) => {
    dispatch({ type: 'MOVE_TO_CART', payload: id });
  }, []);

  const applyCoupon = useCallback((code: string, discount: number) => {
    dispatch({ type: 'APPLY_COUPON', payload: { code, discount } });
  }, []);

  const removeCoupon = useCallback(() => {
    dispatch({ type: 'REMOVE_COUPON' });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryCharge = subtotal > 50000 ? 0 : subtotal > 0 ? 1500 : 0;
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = Math.max(0, subtotal + deliveryCharge + gst - state.couponDiscount);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQty,
        saveForLater,
        moveToCart,
        applyCoupon,
        removeCoupon,
        clearCart,
        setCartItems,
        fetchCart,
        syncCart,
        totalItems,
        subtotal,
        deliveryCharge,
        gst,
        grandTotal,
      }}
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