import React from 'react';
import { CheckCircle2, Clock, X } from 'lucide-react';
import { formatCurrency } from '../api';

export default function OrderConfirmationModal({ order, onClose, onTrackOrder }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Order Confirmed!</h3>
              <p className="text-xs text-neutral-500">
                Order ID: <span className="font-bold text-neutral-900">{order.id}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#F7F7F9] rounded-2xl p-4 space-y-2 text-xs">
          <div className="flex justify-between text-neutral-600">
            <span>Guest</span>
            <span className="font-bold text-neutral-900">{order.customerName}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Dining Type</span>
            <span className="font-bold text-neutral-900">
              {order.orderType} {order.tableNumber ? `(${order.tableNumber})` : ''}
            </span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Payment</span>
            <span className="font-bold text-neutral-900">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Estimated Wait</span>
            <span className="font-bold text-emerald-700">{order.estimatedMinutes} mins</span>
          </div>
        </div>

        <div className="space-y-1.5 text-xs border-t border-neutral-100 pt-3">
          {order.items.map((i, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="text-neutral-700">
                {i.quantity}× {i.name}
              </span>
              <span className="font-semibold text-neutral-900">
                {formatCurrency(i.price * i.quantity)}
              </span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-sm text-neutral-900 pt-2 border-t border-neutral-100">
            <span>Total Paid</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => onTrackOrder(order.id)}
            className="flex-1 py-2.5 rounded-xl bg-[#1A1A1A] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-neutral-800 cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            Track Order Live
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold hover:bg-neutral-50 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
