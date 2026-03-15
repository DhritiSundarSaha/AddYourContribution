import { create } from 'zustand';
import type { Product } from '@/types';

type CartItem = {
  product: Product;
  size: string;
  color: string;
  quantity: number;
  designId?: string;
};

type AppState = {
  cart: CartItem[];
  selectedProduct?: Product;
  disclaimerAccepted: boolean;
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
  setSelectedProduct: (product: Product) => void;
  setDisclaimerAccepted: (value: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  cart: [],
  disclaimerAccepted: false,
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  clearCart: () => set({ cart: [] }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setDisclaimerAccepted: (value) => set({ disclaimerAccepted: value })
}));
