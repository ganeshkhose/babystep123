import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  Truck,
  CreditCard,
  Banknote,
  QrCode,
  Sparkles,
  User,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectBasketItems,
  selectBasketSubtotal,
  selectBasketDiscount,
  selectBasketDelivery,
  selectBasketTotal,
  selectBasketItemCount,
} from '../../features/basket/basketSelectors';
import { clearBag } from '../../features/basket/basketSlice';
import { createOrder } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Order, GuestCustomer, OrderAddress } from '../../types/order';
import { Dropdown } from '../../components/Dropdown';

const INDIAN_STATES = [
  'Maharashtra',
  'Delhi NCR',
  'Karnataka',
  'Tamil Nadu',
  'Telangana',
  'Gujarat',
  'Uttar Pradesh',
  'West Bengal',
  'Kerala',
  'Rajasthan',
  'Punjab',
  'Haryana',
  'Goa',
  'Madhya Pradesh',
  'Bihar',
  'Andhra Pradesh',
  'Assam',
];

const ADDRESS_TYPES = [
  { value: 'Home', label: 'Home (All-day delivery)' },
  { value: 'Work', label: 'Work (9 AM - 6 PM delivery)' },
  { value: 'Other', label: 'Other' },
];

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const items = useAppSelector(selectBasketItems);
  const subtotal = useAppSelector(selectBasketSubtotal);
  const discount = useAppSelector(selectBasketDiscount);
  const delivery = useAppSelector(selectBasketDelivery);
  const total = useAppSelector(selectBasketTotal);
  const itemCount = useAppSelector(selectBasketItemCount);

  // Form State
  const [customer, setCustomer] = useState<GuestCustomer>({
    name: user && !user.isGuest ? user.displayName || '' : '',
    email: user && !user.isGuest ? user.email || '' : '',
    phone: '',
  });

  useEffect(() => {
    if (user && !user.isGuest) {
      setCustomer((prev) => ({
        ...prev,
        name: prev.name || user.displayName || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const [addressType, setAddressType] = useState<string>('Home');
  const [address, setAddress] = useState<OrderAddress>({
    street: '',
    city: '',
    state: 'Maharashtra',
    pinCode: '',
    landmark: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      showToast('Your bag is empty', 'error');
      navigate('/');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        guestInfo: customer,
        shippingAddress: address,
        paymentMethod,
        items,
        userId: user?.uid,
      });

      // Clear basket in Redux
      dispatch(clearBag());
      setPlacedOrder(order);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3B82F6', '#FF6B9D', '#8B5CF6', '#F59E0B'],
        });
      } catch {
        // Safe fallback
      }

      showToast('Order placed successfully!', 'success', 'check');
    } catch (err: any) {
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (placedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-4xl p-8 sm:p-10 border border-slate-100 shadow-soft text-center animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 shadow-soft">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-blue-light text-brand-blue text-xs font-bold rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-peach" />
            <span>Order Confirmed</span>
          </div>

          <h1 className="text-3xl font-extrabold text-brand-navy font-display mb-2">
            Order placed successfully!
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Thank you for trusting Baby Step. We are gently packing your little essentials with love.
          </p>

          <div className="p-4 rounded-2xl bg-brand-cream border border-slate-100 inline-block mb-8 text-left w-full max-w-sm sm:w-auto sm:min-w-[280px]">
            <div className="text-xs text-slate-400">Order Reference</div>
            <div className="text-lg sm:text-xl font-extrabold text-brand-blue font-mono tracking-wider truncate">
              {placedOrder.id}
            </div>
            <div className="text-xs text-slate-500 mt-2 truncate">
              Confirmation sent to: <strong>{placedOrder.guestInfo.email}</strong>
            </div>
          </div>

          {/* Items Summary in Confirmation */}
          <div className="text-left border-t border-slate-100 pt-6 mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Items Ordered ({placedOrder.items.length})
            </h3>
            <div className="space-y-3">
              {placedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-100"
                    />
                    <div>
                      <div className="font-semibold text-brand-navy">{item.name}</div>
                      <div className="text-xs text-slate-400">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <span className="font-extrabold text-brand-navy">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between font-bold text-base text-brand-navy">
              <span>Total Paid ({placedOrder.paymentMethod.toUpperCase()})</span>
              <span>₹{placedOrder.total}</span>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-soft text-white font-bold py-3.5 px-8 rounded-full transition-all duration-200 shadow-soft text-sm"
          >
            <span>Continue Shopping</span>
            <ShoppingBag className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // EMPTY CHECKOUT REDIRECT STATE
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-brand-navy mb-2 font-display">
          Your bag is empty
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Add some gentle essentials before heading to checkout.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-blue text-white font-bold px-6 py-3 rounded-full hover:bg-brand-blue-soft transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10">
      <div className="mb-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link
            to="/bag"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-blue mb-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Bag</span>
          </Link>
          <h1 className="text-xl min-[400px]:text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
            Checkout & Delivery
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>256-Bit Encrypted Safe Checkout</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* Left Column: Form Fields (7-8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-6">
          {/* Step 1: Customer Contact Info */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-soft-sm">
            {/* Guest Sign In / Register Prompt */}
            {user?.isGuest && (
              <div className="mb-4 p-3.5 rounded-2xl bg-brand-blue-light/70 border border-brand-baby-blue/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-navy">Ordering as Guest</p>
                    <p className="text-[11px] text-slate-500">Sign in or register to save your address & track your delivery.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthModal()}
                  className="inline-flex items-center justify-center gap-1 px-4 py-1.5 rounded-full bg-white hover:bg-brand-blue hover:text-white border border-brand-baby-blue/40 text-brand-blue text-xs font-bold transition-all shadow-soft-sm shrink-0"
                >
                  <span>Sign In / Register</span>
                </button>
              </div>
            )}

            <h2 className="text-sm sm:text-base font-bold text-brand-navy font-display mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <span>Parent / Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditi Roy"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (for order updates) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="parent@example.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number (for delivery coordinator) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-soft-sm">
            <h2 className="text-sm sm:text-base font-bold text-brand-navy font-display mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <span>Shipping & Nursery Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  House / Flat No. & Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Flat 302, Palm Heights, Sector 14"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 sm:px-4 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Mumbai"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 sm:px-4 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>

              <div>
                <Dropdown
                  id="checkout-state-select"
                  label="State *"
                  options={INDIAN_STATES}
                  value={address.state || 'Maharashtra'}
                  onChange={(val) => setAddress({ ...address, state: String(val) })}
                  size="md"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="400001"
                  value={address.pinCode}
                  onChange={(e) => setAddress({ ...address, pinCode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 sm:px-4 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Near Children's Hospital"
                  value={address.landmark}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 sm:px-4 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>

              <div>
                <Dropdown<string>
                  id="checkout-address-type"
                  label="Address Type"
                  options={ADDRESS_TYPES}
                  value={addressType}
                  onChange={(val) => setAddressType(val)}
                  size="md"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-soft-sm">
            <h2 className="text-sm sm:text-base font-bold text-brand-navy font-display mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <span>Select Payment Method (Mock Flow)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <label
                className={`flex sm:flex-col items-center sm:items-start p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all gap-3 sm:gap-0 ${
                  paymentMethod === 'cod'
                    ? 'border-brand-blue bg-brand-blue-light/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="sr-only"
                />
                <Banknote className="w-6 h-6 text-brand-blue sm:mb-2 shrink-0" />
                <div>
                  <span className="text-sm font-bold text-brand-navy block">Cash on Delivery</span>
                  <span className="text-[11px] text-slate-500 sm:mt-1 block">Pay when order arrives</span>
                </div>
              </label>

              <label
                className={`flex sm:flex-col items-center sm:items-start p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all gap-3 sm:gap-0 ${
                  paymentMethod === 'upi'
                    ? 'border-brand-blue bg-brand-blue-light/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="sr-only"
                />
                <QrCode className="w-6 h-6 text-brand-blue sm:mb-2 shrink-0" />
                <div>
                  <span className="text-sm font-bold text-brand-navy block">UPI / QR Code</span>
                  <span className="text-[11px] text-slate-500 sm:mt-1 block">GPay, PhonePe, Paytm</span>
                </div>
              </label>

              <label
                className={`flex sm:flex-col items-center sm:items-start p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all gap-3 sm:gap-0 ${
                  paymentMethod === 'card'
                    ? 'border-brand-blue bg-brand-blue-light/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="sr-only"
                />
                <CreditCard className="w-6 h-6 text-brand-blue sm:mb-2 shrink-0" />
                <div>
                  <span className="text-sm font-bold text-brand-navy block">Credit / Debit Card</span>
                  <span className="text-[11px] text-slate-500 sm:mt-1 block">Visa, Mastercard, RuPay</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Submit (4-5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-soft sticky top-24 sm:top-28">
            <h2 className="text-base font-bold text-slate-800 font-display mb-4">
              Review Bag ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </h2>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 mb-5">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-50 shrink-0"
                    />
                    <div className="truncate">
                      <div className="font-semibold text-slate-800 truncate">
                        {item.product.name}
                      </div>
                      <div className="text-slate-400">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 py-4 border-t border-b border-slate-100 mb-5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Promotional Discount</span>
                <span className={`font-semibold ${discount > 0 ? 'text-brand-pink' : 'text-slate-500'}`}>
                  {discount > 0 ? `-₹${discount}` : '₹0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Standard Delivery</span>
                <span className="font-semibold">
                  {delivery === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${delivery}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Amount</span>
                <span className="text-lg text-brand-blue">₹{total}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              id="place-order-submit-btn"
              className="w-full bg-gradient-to-r from-brand-blue to-brand-blue-soft text-white font-bold py-4 px-6 rounded-2xl transition-all border-2 border-brand-blue shadow-[0_4px_14px_rgba(22,137,216,0.35)] ring-2 ring-brand-baby-blue/50 hover:shadow-[0_0_18px_rgba(22,137,216,0.55),0_4px_16px_rgba(22,137,216,0.35)] hover:border-white hover:ring-2 hover:ring-brand-blue/80 hover:brightness-105 active:scale-98 disabled:opacity-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-baby-blue/80"
            >
              {isSubmitting ? 'Placing Order...' : `Place Order (₹${total})`}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <Truck className="w-3.5 h-3.5 text-brand-blue" />
              <span>Standard delivery within 2-3 business days</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
