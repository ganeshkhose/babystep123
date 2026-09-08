import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, ArrowLeft, Plus } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectBasketItems,
  selectBasketItemCount,
} from '../../features/basket/basketSelectors';
import { addToBag, clearBag } from '../../features/basket/basketSlice';
import { BagItem } from '../../components/BagItem/BagItem';
import { OrderSummary } from '../../components/OrderSummary/OrderSummary';
import { EmptyBag } from '../../components/EmptyBag/EmptyBag';
import { SAMPLE_PRODUCTS } from '../../data/sampleProducts';
import { useToast } from '../../context/ToastContext';
import { Product } from '../../types/product';

export const BagPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectBasketItems);
  const itemCount = useAppSelector(selectBasketItemCount);
  const { showToast } = useToast();

  // Recommendations: Find 2-3 products not currently in the bag
  const bagProductIds = new Set(items.map(item => item.product.id));
  const recommendedProducts = SAMPLE_PRODUCTS
    .filter(p => !bagProductIds.has(p.id))
    .slice(0, 3);

  const handleAddRecommended = (product: Product) => {
    dispatch(addToBag({ product, quantity: 1 }));
    showToast(`Added ${product.name} to your bag`, 'success', 'bag');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyBag />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 sm:pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-blue uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Shopping Bag</span>
          </div>
          <h1 className="text-xl min-[400px]:text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
            Your Baby Bag ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-blue transition-colors py-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your bag?')) {
                dispatch(clearBag());
                showToast('Your bag has been emptied', 'info', 'trash');
              }
            }}
            className="text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors py-1.5"
          >
            Clear bag
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* Left Column: Bag Items List & "Complete Your Little Essentials" (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3 sm:space-y-4">
          {items.map((item) => (
            <BagItem key={item.product.id} item={item} />
          ))}

          {/* Section 12: Unique Bag Experience - "Complete your little essentials" */}
          {recommendedProducts.length > 0 && (
            <div className="mt-8 pt-6 sm:mt-10 sm:pt-8 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-brand-peach" />
                <h3 className="text-base font-bold text-brand-navy font-display">
                  Complete your little essentials
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Thoughtfully paired items other parents frequently add to their bag:
              </p>

              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {recommendedProducts.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-white rounded-2xl p-3 border border-slate-100 shadow-soft-sm hover:shadow-soft transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-full aspect-square rounded-xl bg-slate-50 overflow-hidden mb-2.5">
                        <img
                          src={rec.imageUrl}
                          alt={rec.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-brand-blue uppercase">
                        {rec.category}
                      </span>
                      <h4 className="text-xs font-bold text-brand-navy line-clamp-1 mt-0.5">
                        {rec.name}
                      </h4>
                      <p className="text-[11px] font-extrabold text-brand-navy mt-1">₹{rec.price}</p>
                    </div>

                    <button
                      onClick={() => handleAddRecommended(rec)}
                      className="mt-3 w-full flex items-center justify-center gap-1 py-2 px-3 bg-brand-blue-light hover:bg-brand-blue text-brand-blue hover:text-white rounded-xl text-xs font-bold transition-colors min-h-[38px] active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary (4-5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};
