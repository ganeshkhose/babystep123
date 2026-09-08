import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/product';
import { BasketItem, BasketState } from '../../types/basket';

const STORAGE_KEY = 'baby_step_basket';

const loadBasketFromStorage = (): BasketItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn('Failed to load basket from localStorage:', err);
  }
  return [];
};

const saveBasketToStorage = (items: BasketItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('Failed to save basket to localStorage:', err);
  }
};

const initialState: BasketState = {
  items: loadBasketFromStorage(),
};

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    addToBag: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          product,
          quantity,
        });
      }
      saveBasketToStorage(state.items);
    },

    removeFromBag: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product.id !== productId);
      saveBasketToStorage(state.items);
    },

    increaseQuantity: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const existingItem = state.items.find(item => item.product.id === productId);
      if (existingItem) {
        existingItem.quantity += 1;
        saveBasketToStorage(state.items);
      }
    },

    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const existingItem = state.items.find(item => item.product.id === productId);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          // Remove if decreased below 1
          state.items = state.items.filter(item => item.product.id !== productId);
        }
        saveBasketToStorage(state.items);
      }
    },

    clearBag: (state) => {
      state.items = [];
      saveBasketToStorage(state.items);
    },
  },
});

export const {
  addToBag,
  removeFromBag,
  increaseQuantity,
  decreaseQuantity,
  clearBag,
} = basketSlice.actions;

export default basketSlice.reducer;
