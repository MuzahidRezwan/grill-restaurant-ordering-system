import React, { useState } from 'react';
import { Search, RotateCcw, Eye, Clock, X } from 'lucide-react';
import { formatCurrency, ORDER_TYPES } from '../api';
import { statusBadgeClass } from './OrderTrackingView';

export default function OrderHistoryView({ orders, onTrackOrder, onReorder }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [receiptOrder, setReceiptOrder] = useState(null);

  const filtered = orders.filter((o) => {
    if (typeFilter !== 'All' && o.orderType !== typeFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        (o.customerName || '').toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex-1 p-5 sm:p-7 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Customer Order History</h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Review past orders, inspect receipts, track live status, or reorder in one click.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order ID, guest, dish..."
                className="bg-white border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs w-60 focus:outline-none focus:ring-2 focus:ring-neutral-900/15"
              />
            </div>

            <div className="flex bg-white border border-neutral-200 rounded-xl p-1 gap-1">
              {['All', ...ORDER_TYPES].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    typeFilter === t ? 'bg-[#1A1A1A] text-white' : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-neutral-300 py-16 text-center">
            <p className="text-sm font-semibold text-neutral-700">No matching orders found</p>
            <p className="text-xs text-neutral-400 mt-1">
              Orders you place will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900">{order.id}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusBadgeClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 text-[11px] font-semibold">
                      {order.orderType}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 text-[11px] font-semibold">
                      {order.paymentMethod}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600">
                    <span className="font-semibold text-neutral-800">{order.customerName}</span> •{' '}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <div className="text-left sm:text-right">
                    <p className="text-base font-bold text-neutral-900">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    {order.discountAmount > 0 && (
                      <p className="text-[11px] text-emerald-600 font-semibold">
                        Saved {formatCurrency(order.discountAmount)} ({order.discountCode})
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReceiptOrder(order)}
                      className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Receipt
                    </button>
                    <button
                      type="button"
                      onClick={() => onTrackOrder(order.id)}
                      className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Track
                    </button>
                    <button
                      type="button"
                      onClick={() => onReorder(order)}
                      className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] text-white text-xs font-semibold hover:bg-neutral-800 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reorder
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {receiptOrder && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Grill Restaurant — Receipt
                </h3>
                <p className="text-xs text-neutral-500">{receiptOrder.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setReceiptOrder(null)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-1 text-neutral-600">
              <p>
                Guest: <span className="font-semibold text-neutral-900">{receiptOrder.customerName}</span>
              </p>
              <p>
                Date: <span className="font-semibold text-neutral-900">{new Date(receiptOrder.createdAt).toLocaleString()}</span>
              </p>
              <p>
                Type: <span className="font-semibold text-neutral-900">{receiptOrder.orderType}</span> • Payment:{' '}
                <span className="font-semibold text-neutral-900">{receiptOrder.paymentMethod}</span>
              </p>
            </div>

            <div className="border-y border-neutral-200 py-3 space-y-2">
              {receiptOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-neutral-700">
                    {item.quantity}× {item.name}
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span>{formatCurrency(receiptOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-{formatCurrency(receiptOrder.discountAmount)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Tax (5%)</span>
                <span>{formatCurrency(receiptOrder.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1">
                <span>Total</span>
                <span>{formatCurrency(receiptOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onReorder(receiptOrder);
                  setReceiptOrder(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#1A1A1A] text-white text-xs font-bold cursor-pointer"
              >
                Reorder Items
              </button>
              <button
                type="button"
                onClick={() => setReceiptOrder(null)}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
