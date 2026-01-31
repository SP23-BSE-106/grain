import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  savedForLater: CartItem[];
  isLoading: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  saveForLater: (item: CartItem) => void;
  moveToCart: (item: CartItem) => void;
  loadCart: (userId: string, token: string) => Promise<void>;
  saveCart: (userId: string) => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedForLater: [],
      isLoading: false,
      addItem: (product) => set((state) => {
        const existing = state.items.find(item => item.product._id === product._id);
        if (existing) {
          const newItems = state.items.map(item =>
            item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
          );
          // Save to DB if user is logged in
          const { saveCart } = get();
          // Note: We'll handle saving in the component that calls addItem
          return { items: newItems };
        } else {
          const newItems = [...state.items, { product, quantity: 1 }];
          return { items: newItems };
        }
      }),
      removeItem: (productId) => set((state) => {
        const newItems = state.items.filter(item => item.product._id !== productId);
        return { items: newItems };
      }),
      clearCart: () => set({ items: [] }),
      saveForLater: (item) => set((state) => {
        const newItems = state.items.filter(i => i.product._id !== item.product._id);
        const newSavedForLater = [...state.savedForLater, item];
        return { items: newItems, savedForLater: newSavedForLater };
      }),
      moveToCart: (item) => set((state) => {
        const newSavedForLater = state.savedForLater.filter(i => i.product._id !== item.product._id);
        const newItems = [...state.items, item];
        return { items: newItems, savedForLater: newSavedForLater };
      }),
      loadCart: async (userId: string, token: string) => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/cart', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const cart = await res.json();
            set({ items: cart.items || [] });
          }
        } catch (error) {
          console.error('Error loading cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      saveCart: async (userId: string) => {
        try {
          const { items } = get();
          await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items })
          });
        } catch (error) {
          console.error('Error saving cart:', error);
        }
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
