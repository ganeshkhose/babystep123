import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { BasketItem } from '../../types/basket';
import { useAppDispatch } from '../../app/hooks';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromBag,
} from '../../features/basket/basketSlice';
import { useToast } from '../../context/ToastContext';

interface BagItemProps {
  item: BasketItem;
}

export const BagItem: React.FC<BagItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { product, quantity } = item;

  const handleIncrease = () => {
    dispatch(increaseQuantity(product.id));
  };

  const handleDecrease = () => {
    if (quantity === 1) {
      handleRemove();
    } else {
      dispatch(decreaseQuantity(product.id));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromBag(product.id));
    showToast(`Removed ${product.name} from your bag`, 'info', 'trash');
  };

  const itemTotal = product.price * quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-5 bg-white rounded-3xl border border-slate-100 shadow-soft-sm transition-all duration-200 hover:shadow-soft">
      {/* Product Visual & Info */}
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
        <Link
          to={`/products/${product.id}`}
          className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[10px] sm:text-[11px] font-semibold text-brand-blue uppercase tracking-wider">
            {product.category}
          </span>
          <Link
            to={`/products/${product.id}`}
            className="text-sm sm:text-base font-bold text-brand-navy hover:text-brand-blue transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs sm:text-sm font-semibold text-slate-700">₹{product.price}</span>
            <span className="text-[10px] sm:text-xs text-slate-400">each</span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-emerald-600 font-medium mt-0.5">In Stock</span>
        </div>
      </div>

      {/* Stepper, Subtotal, and Delete Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        {/* Quantity Stepper */}
        <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-200/80 p-1">
          <button
            onClick={handleDecrease}
            aria-label={`Decrease quantity of ${product.name}`}
            className="w-9 h-9 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-colors shadow-none hover:shadow-sm active:scale-90"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 sm:w-9 text-center text-sm font-bold text-brand-navy">
            {quantity}
          </span>
          <button
            onClick={handleIncrease}
            aria-label={`Increase quantity of ${product.name}`}
            className="w-9 h-9 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-colors shadow-none hover:shadow-sm active:scale-90"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Item Subtotal */}
        <div className="flex flex-col items-end min-w-[65px]">
          <span className="text-base sm:text-lg font-extrabold text-brand-navy">₹{itemTotal}</span>
          <span className="text-[10px] text-slate-400 font-medium">Subtotal</span>
        </div>

        {/* Remove Button with 44px min touch target */}
        <button
          onClick={handleRemove}
          aria-label={`Remove ${product.name} from bag`}
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors active:scale-90"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
