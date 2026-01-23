import { create } from 'zustand';

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
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (product) => set((state) => {
    const existing = state.items.find(item => item.product._id === product._id);
    if (existing) {
      return {
        items: state.items.map(item =>
          item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    } else {
      return { items: [...state.items, { product, quantity: 1 }] };
    }
  }),
  removeItem: (productId) => set((state) => ({
    items: state.items.filter(item => item.product._id !== productId)
  })),
  clearCart: () => set({ items: [] }),
}));