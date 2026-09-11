/**
 * Centralized pricing, discount, and shipping constants for The Baby Step storefront.
 */

export const FREE_DELIVERY_THRESHOLD = 499;
export const STANDARD_DELIVERY_FEE = 49;
export const PROMO_DISCOUNT_THRESHOLD = 999;
export const PROMO_DISCOUNT_AMOUNT = 100;

export interface FinancialSummary {
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
}

/**
 * Calculates discount, delivery charge, and grand total consistently across basket, checkout, and orders.
 */
export const calculateOrderFinancials = (subtotal: number): FinancialSummary => {
  const discount = subtotal >= PROMO_DISCOUNT_THRESHOLD ? PROMO_DISCOUNT_AMOUNT : 0;
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY_FEE;
  const total = Math.max(0, subtotal - discount + delivery);

  return {
    subtotal,
    discount,
    delivery,
    total,
  };
};
