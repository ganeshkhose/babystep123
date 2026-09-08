import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Truck } from 'lucide-react';
import { useAppSelector } from '../../app/hooks';
import {
  selectBasketSubtotal,
  selectBasketDiscount,
  selectBasketDelivery,
  selectBasketTotal,
  selectBasketItemCount,
} from '../../features/basket/basketSelectors';

interface OrderSummaryProps {
  onProceedCheckout?: () => void;
  showCheckoutButton?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  onProceedCheckout,
  showCheckoutButton = true,
}) => {
  const navigate = useNavigate();
  const subtotal = useAppSelector(selectBasketSubtotal);
  const discount = useAppSelector(selectBasketDiscount);
  const delivery = useAppSelector(selectBasketDelivery);
  const total = useAppSelector(selectBasketTotal);
  const count = useAppSelector(selectBasketItemCount);

  const freeDeliveryThreshold = 499;
  const isFreeDelivery = delivery === 0 && subtotal > 0;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleCheckout = () => {
    if (onProceedCheckout) {
      onProceedCheckout();
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-soft sticky top-24 sm:top-28">
      <h2 className="text-base sm:text-lg font-bold text-brand-navy mb-3.5 sm:mb-4 flex items-center justify-between">
        <span>Order Summary</span>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          {count} {count === 1 ? 'item' : 'items'}
        </span>
      </h2>

      {/* Free Delivery Bar */}
      <div className="bg-brand-blue-light/70 rounded-2xl p-3 sm:p-3.5 mb-4 sm:mb-5 border border-brand-baby-blue/40">
        <div className="flex items-center gap-2 mb-2">
          <Truck className="w-4 h-4 text-brand-blue shrink-0" />
          <p className="text-xs font-semibold text-slate-700">
            {isFreeDelivery ? (
              <span className="text-emerald-700 font-bold">You unlocked Free Standard Delivery!</span>
            ) : (
              <span>
                Add <strong className="text-brand-blue">₹{amountNeededForFreeDelivery}</strong> more for Free Delivery
              </span>
            )}
          </p>
        </div>
        <div className="w-full h-1.5 bg-brand-blue-powder/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-baby-blue to-brand-blue transition-all duration-500 rounded-full"
            style={{ width: `${deliveryProgress}%` }}
          />
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-2.5 sm:space-y-3 text-sm text-slate-600 mb-4 sm:mb-5 pb-4 sm:pb-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-brand-navy">₹{subtotal}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span>Special Discount</span>
            {discount > 0 && (
              <span className="text-[10px] font-bold bg-brand-peach-light text-brand-navy border border-brand-peach/40 px-1.5 py-0.5 rounded">
                PROMO
              </span>
            )}
          </span>
          <span className={`font-bold ${discount > 0 ? 'text-brand-pink' : 'text-slate-500'}`}>
            {discount > 0 ? `-₹${discount}` : '₹0'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Estimated Delivery</span>
          <span className="font-semibold">
            {delivery === 0 ? (
              <span className="text-emerald-600 font-bold uppercase text-xs tracking-wider">
                FREE
              </span>
            ) : (
              `₹${delivery}`
            )}
          </span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="flex items-baseline justify-between mb-5 sm:mb-6">
        <div>
          <span className="text-sm sm:text-base font-bold text-brand-navy block">Total Amount</span>
          <span className="text-[10px] sm:text-[11px] text-slate-400">Inclusive of all taxes</span>
        </div>
        <span className="text-xl sm:text-2xl font-extrabold text-brand-navy tracking-tight">₹{total}</span>
      </div>

      {/* Checkout Button */}
      {showCheckoutButton && (
        <button
          onClick={handleCheckout}
          disabled={count === 0}
          id="proceed-to-checkout-btn"
          className="w-full bg-brand-pink hover:bg-brand-pink-soft text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-soft hover:shadow-glow-pink active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] text-sm sm:text-base"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {/* Trust Guarantee */}
      <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-50 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
        <ShieldCheck className="w-4 h-4 text-brand-blue shrink-0" />
        <span>Safe, secure & parent-verified packaging</span>
      </div>
    </div>
  );
};
