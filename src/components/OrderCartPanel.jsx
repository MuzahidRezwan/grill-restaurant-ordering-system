import React, { useState } from 'react';
import {
  X,
  Trash2,
  Minus,
  Plus,
  Tag,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  ORDER_TYPES,
  PAYMENT_METHODS,
  formatCurrency,
  formatPadQty,
  calculateCartBill,
  api,
} from '../api';

export default function OrderCartPanel({
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  orderType,
  onChangeOrderType,
  paymentMethod,
  onChangePaymentMethod,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onPlaceOrder,
  submitting,
}) {
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('T-05');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  const bill = calculateCartBill(cartItems, appliedCoupon);

  async function handleValidateCoupon(codeOverride) {
    const code = (codeOverride ?? couponInput).trim().toUpperCase();
    if (!code) return;
    setCouponFeedback(null);
    try {
      const res = await api.validateCoupon(code, bill.subtotal);
      onApplyCoupon(res.coupon);
      setCouponInput(res.coupon.code);
      setCouponFeedback({ ok: true, text: res.message });
    } catch (err) {
      setCouponFeedback({ ok: false, text: err.message });
    }
  }

  async function handleCheckoutSubmit(e) {
    e.preventDefault();
    setCheckoutError('');
    if (cartItems.length === 0) {
      setCheckoutError('Add at least one dish to place an order.');
      return;
    }
    if (orderType === 'Delivery' && !deliveryAddress.trim()) {
      setCheckoutError('Please enter a delivery address.');
      return;
    }

    try {
      await onPlaceOrder({
        customerName: customerName.trim() || 'Walk-in Guest',
        customerPhone: customerPhone.trim(),
        tableNumber: orderType === 'Dine' ? tableNumber.trim() || 'T-01' : '',
        deliveryAddress: orderType === 'Delivery' ? deliveryAddress.trim() : '',
        orderType,
        paymentMethod,
        discountCode: appliedCoupon?.code || null,
        items: cartItems.map((i) => ({
          itemId: i.itemId,
          quantity: i.quantity,
          size: i.size,
        })),
      });
      setCouponInput('');
      setCouponFeedback(null);
      setCheckoutError('');
    } catch (err) {
      setCheckoutError(err.message);
    }
  }

  return (
    <aside className="w-full lg:w-[350px] xl:w-[370px] bg-white border-t lg:border-t-0 lg:border-l border-neutral-200/80 flex flex-col shrink-0 h-auto lg:h-screen lg:sticky lg:top-0">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-neutral-100">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">My Order</h2>
          <p className="text-[11px] text-neutral-400">
            {cartItems.reduce((s, i) => s + i.quantity, 0)} item(s) selected
          </p>
        </div>
        <button
          type="button"
          onClick={onClearCart}
          title="Clear order"
          disabled={cartItems.length === 0}
          className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-40 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Order Type Toggle: Dine / Pick Up / Delivery */}
      <div className="px-6 pt-4">
        <div className="grid grid-cols-3 gap-1.5 bg-[#F4F4F6] p-1 rounded-xl">
          {ORDER_TYPES.map((type) => {
            const active = orderType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onChangeOrderType(type)}
                className={`py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  active
                    ? 'bg-[#1A1A1A] text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        {/* Customer Info Inputs */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Guest Name"
            className="bg-[#F7F7F9] border border-neutral-200/80 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
          {orderType === 'Dine' ? (
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Table # (e.g. T-05)"
              className="bg-[#F7F7F9] border border-neutral-200/80 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          ) : (
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Phone Number"
              className="bg-[#F7F7F9] border border-neutral-200/80 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          )}
        </div>
        {orderType === 'Delivery' && (
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Delivery Address (Required)"
            className="mt-2 w-full bg-[#F7F7F9] border border-neutral-200/80 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {cartItems.length === 0 ? (
          <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-center py-6">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mb-2.5">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-neutral-600">Your order is empty</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Click "Add to cart" on any dish to begin.
            </p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.itemId}
              className="flex items-center gap-3 pb-3 border-b border-neutral-100 last:border-b-0"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-full object-contain bg-neutral-50 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-neutral-900 truncate">{item.name}</h4>
                    <p className="text-[10px] text-neutral-400">{item.size}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.itemId)}
                    title="Remove item"
                    className="text-neutral-400 hover:text-rose-600 transition cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-bold text-neutral-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>

                  {/* Quantity Stepper matching Image 1 */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.itemId, item.quantity + 1)}
                      aria-label={`Increase ${item.name}`}
                      className="w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-neutral-800 w-5 text-center">
                      {formatPadQty(item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.itemId, item.quantity - 1)}
                      aria-label={`Decrease ${item.name}`}
                      className="w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Billing, Coupon & Payment Section */}
      <form
        onSubmit={handleCheckoutSubmit}
        className="px-6 py-4 bg-[#FAFAFB] border-t border-neutral-200/80 space-y-3"
      >
        {/* Discount Coupon Input */}
        <div>
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Coupon code (e.g. GRILL10)"
                className="w-full bg-white border border-neutral-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs font-medium uppercase placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <button
              type="button"
              onClick={() => handleValidateCoupon()}
              disabled={cartItems.length === 0}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 disabled:opacity-40 transition cursor-pointer"
            >
              Apply
            </button>
          </div>

          {/* Quick Coupon Chips */}
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {['GRILL10', 'DIU20', 'SAVE15'].map((code) => (
              <button
                key={code}
                type="button"
                disabled={cartItems.length === 0}
                onClick={() => {
                  setCouponInput(code);
                  handleValidateCoupon(code);
                }}
                className="px-2 py-0.5 rounded bg-neutral-200/70 hover:bg-neutral-300 text-[10px] font-semibold text-neutral-700 disabled:opacity-40 cursor-pointer"
              >
                {code}
              </button>
            ))}
            {appliedCoupon && (
              <button
                type="button"
                onClick={() => {
                  onRemoveCoupon();
                  setCouponFeedback(null);
                  setCouponInput('');
                }}
                className="ml-auto text-[10px] font-semibold text-rose-600 hover:underline cursor-pointer"
              >
                Remove {appliedCoupon.code}
              </button>
            )}
          </div>

          {couponFeedback && (
            <p
              className={`mt-1 flex items-center gap-1 text-[11px] font-medium ${
                couponFeedback.ok ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {couponFeedback.ok ? (
                <CheckCircle2 className="w-3 h-3 shrink-0" />
              ) : (
                <AlertCircle className="w-3 h-3 shrink-0" />
              )}
              {couponFeedback.text}
            </p>
          )}
        </div>

        {/* Summary Lines */}
        <div className="space-y-1.5 pt-2 border-t border-neutral-200/70 text-xs">
          <div className="flex justify-between text-neutral-500">
            <span>Items</span>
            <span className="font-semibold text-neutral-800">{formatCurrency(bill.subtotal)}</span>
          </div>
          <div className="flex justify-between text-neutral-500">
            <span>Discount {bill.appliedCoupon ? `(${bill.appliedCoupon})` : ''}</span>
            <span className="font-semibold text-emerald-600">
              -{formatCurrency(bill.discountAmount)}
            </span>
          </div>
          <div className="flex justify-between text-neutral-500">
            <span>Tax (5%)</span>
            <span className="font-semibold text-neutral-800">{formatCurrency(bill.taxAmount)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1.5 border-t border-neutral-200/70">
            <span>Total Amount</span>
            <span>{formatCurrency(bill.totalAmount)}</span>
          </div>
        </div>

        {/* Payments */}
        <div>
          <p className="text-xs font-bold text-neutral-900 mb-2">Payments</p>
          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_METHODS.map((method) => {
              const active = paymentMethod === method;
              return (
                <button
                  key={method}
                  type="button"
                  onClick={() => onChangePaymentMethod(method)}
                  className={`py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    active
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {method}
                </button>
              );
            })}
          </div>
        </div>

        {checkoutError && (
          <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {checkoutError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || cartItems.length === 0}
          className="w-full py-3 rounded-xl bg-[#2F3136] hover:bg-[#1A1A1A] text-white text-sm font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
        >
          {submitting ? 'Placing Order...' : 'Checkout'}
        </button>
      </form>
    </aside>
  );
}
