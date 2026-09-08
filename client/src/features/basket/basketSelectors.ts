import { RootState } from '../../app/store';

export const selectBasketItems = (state: RootState) => state.basket.items;

export const selectBasketItemCount = (state: RootState) =>
  state.basket.items.reduce((total, item) => total + item.quantity, 0);

export const selectBasketSubtotal = (state: RootState) =>
  state.basket.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

// Special promotional discount: ₹100 OFF for orders over ₹999
export const selectBasketDiscount = (state: RootState) => {
  const subtotal = selectBasketSubtotal(state);
  return subtotal >= 999 ? 100 : 0;
};

// Free delivery on orders ₹499 and above, otherwise ₹49
export const selectBasketDelivery = (state: RootState) => {
  const items = selectBasketItems(state);
  if (items.length === 0) return 0;
  const subtotal = selectBasketSubtotal(state);
  return subtotal >= 499 ? 0 : 49;
};

export const selectBasketTotal = (state: RootState) => {
  const subtotal = selectBasketSubtotal(state);
  if (subtotal === 0) return 0;
  const discount = selectBasketDiscount(state);
  const delivery = selectBasketDelivery(state);
  return Math.max(0, subtotal - discount + delivery);
};

export const selectIsInBasket = (productId: string) => (state: RootState) =>
  state.basket.items.some(item => item.product.id === productId);
