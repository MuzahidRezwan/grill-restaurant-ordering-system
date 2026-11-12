import React, { useState, useEffect } from 'react';
import {
  Search,
  Clock,
  ChefHat,
  BellRing,
  CheckCircle2,
  XCircle,
  RefreshCw,
  MapPin,
  Receipt,
} from 'lucide-react';
import { formatCurrency, api } from '../api';

const STEPS = [
  { key: 'Pending', label: 'Order Received', desc: 'Waiting for kitchen confirmation', icon: Clock },
  { key: 'Preparing', label: 'Preparing', desc: 'Chef is cooking your meal', icon: ChefHat },
  { key: 'Ready', label: 'Ready', desc: 'Ready for serving / pickup / dispatch', icon: BellRing },
  { key: 'Completed', label: 'Completed', desc: 'Order delivered & completed', icon: CheckCircle2 },
];

export function statusBadgeClass(status) {
  switch (status) {
    case 'Pending':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Preparing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Ready':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Completed':
      return 'bg-neutral-900 text-white border-neutral-900';
    case 'Cancelled':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    default:
      return 'bg-neutral-100 text-neutral-700 border-neutral-200';
  }
}

export default function OrderTrackingView({ orders, selectedOrderId, onSelectOrderId, onRefreshOrders }) {
  const [lookupId, setLookupId] = useState(selectedOrderId || '');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const targetId = selectedOrderId || orders[0]?.id;
    if (targetId) {
      const found = orders.find((o) => o.id.toUpperCase() === targetId.toUpperCase());
      if (found) {
        setTrackedOrder(found);
        setLookupId(found.id);
        setLookupError('');
      }
    }
  }, [selectedOrderId, orders]);

  // Poll every 5 seconds while viewing tracking
  useEffect(() => {
    const timer = setInterval(() => {
      onRefreshOrders();
    }, 5000);
    return () => clearInterval(timer);
  }, [onRefreshOrders]);

  async function handleTrackLookup(e) {
    e.preventDefault();
    const id = lookupId.trim().toUpperCase();
    if (!id) return;
    setLookupError('');
    try {
      const res = await api.getOrderById(id);
      setTrackedOrder(res.order);
      onSelectOrderId(res.order.id);
    } catch (err) {
      setLookupError(err.message || `Order ${id} not found.`);
    }
  }

  async function handleManualRefresh() {
    setRefreshing(true);
    await onRefreshOrders();
    setTimeout(() => setRefreshing(false), 300);
  }

  const currentStepIndex = trackedOrder
    ? STEPS.findIndex((s) => s.key === trackedOrder.status)
    : -1;

  return (
    <div className="flex-1 p-5 sm:p-7 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Live Order Tracking</h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Track your order status in real time from kitchen preparation to completion.
            </p>
          </div>

          <form onSubmit={handleTrackLookup} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="Enter Order ID (e.g. ORD-1002)"
                className="bg-white border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold uppercase placeholder:normal-case w-60 focus:outline-none focus:ring-2 focus:ring-neutral-900/15"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#1A1A1A] text-white text-xs font-semibold hover:bg-neutral-800 transition cursor-pointer"
            >
              Track
            </button>
            <button
              type="button"
              onClick={handleManualRefresh}
              title="Refresh status"
              className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </form>
        </div>

        {lookupError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-medium">
            {lookupError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active & Recent Orders Picker */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 space-y-2.5 h-fit">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 px-1">
              Recent Orders
            </h2>
            {orders.length === 0 ? (
              <p className="text-xs text-neutral-400 py-6 text-center">No orders placed yet.</p>
            ) : (
              orders.slice(0, 8).map((order) => {
                const isSelected = trackedOrder?.id === order.id;
                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => {
                      setTrackedOrder(order);
                      setLookupId(order.id);
                      setLookupError('');
                      onSelectOrderId(order.id);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                        : 'bg-[#F8F8FA] hover:bg-neutral-100 border-neutral-200/70 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{order.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isSelected ? 'bg-white/15 text-white border-white/20' : statusBadgeClass(order.status)
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className={`text-[11px] truncate ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {order.customerName} • {order.orderType} • {formatCurrency(order.totalAmount)}
                    </p>
                  </button>
                );
              })
            )}
          </div>

          {/* Main Tracking Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200/80 p-6">
            {!trackedOrder ? (
              <div className="py-16 text-center text-neutral-400 text-sm">
                Select an order or enter an Order ID to view live tracking.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Order Summary Top */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-neutral-100">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-xl font-bold text-neutral-900">{trackedOrder.id}</h2>
                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-bold border ${statusBadgeClass(
                          trackedOrder.status
                        )}`}
                      >
                        {trackedOrder.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Placed {new Date(trackedOrder.createdAt).toLocaleString()} •{' '}
                      <span className="font-semibold text-neutral-700">{trackedOrder.customerName}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] text-neutral-400 font-medium">Estimated Time</p>
                    <p className="text-base font-bold text-neutral-900">
                      {trackedOrder.status === 'Completed'
                        ? 'Delivered'
                        : trackedOrder.status === 'Cancelled'
                        ? 'Cancelled'
                        : `${trackedOrder.estimatedMinutes || 15} mins`}
                    </p>
                  </div>
                </div>

                {/* Progress Stepper */}
                {trackedOrder.status === 'Cancelled' ? (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-center gap-3">
                    <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
                    <div>
                      <h3 className="text-sm font-bold text-rose-900">Order Cancelled</h3>
                      <p className="text-xs text-rose-700">
                        This order was cancelled. Please contact restaurant staff if you need assistance.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {STEPS.map((step, index) => {
                      const Icon = step.icon;
                      const reached = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;
                      return (
                        <div
                          key={step.key}
                          className={`rounded-2xl p-3.5 border transition ${
                            isCurrent
                              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                              : reached
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                              : 'bg-neutral-50 border-neutral-200/70 text-neutral-400'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-bold">0{index + 1}</span>
                          </div>
                          <p className="text-xs font-bold">{step.label}</p>
                          <p
                            className={`text-[10px] mt-0.5 leading-snug ${
                              isCurrent ? 'text-neutral-300' : reached ? 'text-emerald-700' : 'text-neutral-400'
                            }`}
                          >
                            {step.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Order Meta & Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#F8F8FA] rounded-xl p-4 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-neutral-800 mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      Fulfillment Details
                    </div>
                    <p className="text-neutral-600">
                      Order Type: <span className="font-semibold text-neutral-900">{trackedOrder.orderType}</span>
                    </p>
                    {trackedOrder.tableNumber && (
                      <p className="text-neutral-600">
                        Table: <span className="font-semibold text-neutral-900">{trackedOrder.tableNumber}</span>
                      </p>
                    )}
                    {trackedOrder.deliveryAddress && (
                      <p className="text-neutral-600">
                        Address: <span className="font-semibold text-neutral-900">{trackedOrder.deliveryAddress}</span>
                      </p>
                    )}
                    <p className="text-neutral-600">
                      Payment: <span className="font-semibold text-neutral-900">{trackedOrder.paymentMethod}</span>
                    </p>
                  </div>

                  <div className="bg-[#F8F8FA] rounded-xl p-4 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-neutral-800 mb-1">
                      <Receipt className="w-3.5 h-3.5" />
                      Bill Summary
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Subtotal</span>
                      <span>{formatCurrency(trackedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount {trackedOrder.discountCode ? `(${trackedOrder.discountCode})` : ''}</span>
                      <span>-{formatCurrency(trackedOrder.discountAmount)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Tax</span>
                      <span>{formatCurrency(trackedOrder.taxAmount)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-neutral-900 pt-1 border-t border-neutral-200">
                      <span>Total Paid</span>
                      <span>{formatCurrency(trackedOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Ordered Items List */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2.5">
                    Ordered Items
                  </h3>
                  <div className="divide-y divide-neutral-100 border border-neutral-200/80 rounded-xl overflow-hidden">
                    {trackedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between px-4 py-2.5 bg-white">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || '/dishes/onion-pizza.jpg'}
                            alt={item.name}
                            className="w-9 h-9 rounded-full bg-neutral-100 object-cover"
                          />
                          <div>
                            <p className="text-xs font-bold text-neutral-900">{item.name}</p>
                            <p className="text-[10px] text-neutral-400">
                              {item.size} • {formatCurrency(item.price)} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-neutral-900">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
