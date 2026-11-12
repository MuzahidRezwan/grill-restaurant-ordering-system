import React, { useState, useEffect } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Download,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Tag,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import { CATEGORIES, ORDER_STATUSES, formatCurrency, api } from '../api';
import { statusBadgeClass } from './OrderTrackingView';

const DISH_IMAGES = [
  { label: 'Onion Pizza', value: '/dishes/onion-pizza.jpg' },
  { label: 'Pepperoni Pizza', value: '/dishes/pepperoni-pizza.jpg' },
  { label: 'Mix Veg', value: '/dishes/mix-veg.jpg' },
  { label: 'Noodle Soup', value: '/dishes/noodle-soup.jpg' },
  { label: 'Salad', value: '/dishes/salad.jpg' },
  { label: 'Makai Shorba', value: '/dishes/makai-shorba.jpg' },
  { label: 'Egg Corn', value: '/dishes/egg-corn.jpg' },
  { label: 'Burger', value: '/dishes/burger.jpg' },
  { label: 'Grilled Salmon', value: '/dishes/salmon.jpg' },
  { label: 'Spicy Prawns', value: '/dishes/prawns.jpg' },
  { label: 'Salmon Sushi', value: '/dishes/sushi.jpg' },
  { label: 'Dragon Roll', value: '/dishes/dragon-roll.jpg' },
  { label: 'Miso Ramen', value: '/dishes/ramen.jpg' },
  { label: 'Spicy Ramen', value: '/dishes/spicy-ramen.jpg' },
  { label: 'Lava Cake', value: '/dishes/lava-cake.jpg' },
  { label: 'Cheesecake', value: '/dishes/cheesecake.jpg' },
];

const EMPTY_FOOD_FORM = {
  name: '',
  category: 'Pizza',
  price: '',
  size: 'Regular',
  rating: '4.9',
  prepMinutes: '12',
  description: '',
  image: '/dishes/onion-pizza.jpg',
  available: true,
  popular: false,
};

export default function AdminPortalView({
  menuItems,
  orders,
  coupons,
  onRefreshAll,
}) {
  const [subTab, setSubTab] = useState('orders'); // orders | menu | sales | coupons
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [salesReport, setSalesReport] = useState(null);
  const [reportDate, setReportDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Food Modal State
  const [foodModalOpen, setFoodModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [foodForm, setFoodForm] = useState(EMPTY_FOOD_FORM);
  const [foodError, setFoodError] = useState('');

  // Coupon Form State
  const [couponForm, setCouponForm] = useState({
    code: '',
    type: 'percent',
    value: '15',
    minOrder: '30',
    description: '',
  });
  const [couponError, setCouponError] = useState('');

  async function loadSalesReport(dateVal = reportDate) {
    try {
      const res = await api.getDailySales(dateVal);
      setSalesReport(res.report);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (subTab === 'sales') {
      loadSalesReport(reportDate);
    }
  }, [subTab, reportDate, orders.length]);

  function openAddFood() {
    setEditingId(null);
    setFoodForm(EMPTY_FOOD_FORM);
    setFoodError('');
    setFoodModalOpen(true);
  }

  function openEditFood(item) {
    setEditingId(item.id);
    setFoodForm({
      name: item.name,
      category: item.category,
      price: String(item.price),
      size: item.size || 'Regular',
      rating: String(item.rating || 4.8),
      prepMinutes: String(item.prepMinutes || 12),
      description: item.description || '',
      image: item.image || '/dishes/onion-pizza.jpg',
      available: item.available !== false,
      popular: Boolean(item.popular),
    });
    setFoodError('');
    setFoodModalOpen(true);
  }

  async function handleSaveFood(e) {
    e.preventDefault();
    setFoodError('');
    try {
      const payload = {
        ...foodForm,
        price: Number(foodForm.price),
        rating: Number(foodForm.rating),
        prepMinutes: Number(foodForm.prepMinutes),
      };
      if (editingId) {
        await api.updateMenuItem(editingId, payload);
      } else {
        await api.addMenuItem(payload);
      }
      setFoodModalOpen(false);
      await onRefreshAll();
    } catch (err) {
      setFoodError(err.message);
    }
  }

  async function handleToggleAvailability(item) {
    await api.updateMenuItem(item.id, { available: item.available === false });
    await onRefreshAll();
  }

  async function handleDeleteFood(item) {
    await api.deleteMenuItem(item.id);
    await onRefreshAll();
  }

  async function handleStatusChange(orderId, nextStatus) {
    await api.updateOrderStatus(orderId, nextStatus);
    await onRefreshAll();
  }

  async function handleCreateCoupon(e) {
    e.preventDefault();
    setCouponError('');
    try {
      await api.addCoupon({
        ...couponForm,
        value: Number(couponForm.value),
        minOrder: Number(couponForm.minOrder),
      });
      setCouponForm({ code: '', type: 'percent', value: '15', minOrder: '30', description: '' });
      await onRefreshAll();
    } catch (err) {
      setCouponError(err.message);
    }
  }

  async function handleToggleCoupon(code) {
    await api.toggleCoupon(code);
    await onRefreshAll();
  }

  function handleExportCsv() {
    if (!salesReport) return;
    const rows = [
      ['Order ID', 'Date', 'Guest', 'Type', 'Payment', 'Status', 'Subtotal', 'Discount', 'Tax', 'Total'],
      ...salesReport.recentTransactions.map((o) => [
        o.id,
        o.createdAt,
        `"${(o.customerName || '').replace(/"/g, '""')}"`,
        o.orderType,
        o.paymentMethod,
        o.status,
        o.subtotal,
        o.discountAmount,
        o.taxAmount,
        o.totalAmount,
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `grill-restaurant-sales-${salesReport.date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const filteredOrders = orders.filter(
    (o) => orderStatusFilter === 'All' || o.status === orderStatusFilter
  );

  return (
    <div className="flex-1 p-5 sm:p-7 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Restaurant Staff & Admin Portal
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Manage live orders, menu items, discount coupons, and daily sales analytics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-white border border-neutral-200 rounded-xl p-1">
            {[
              { id: 'orders', label: 'Order Queue' },
              { id: 'menu', label: 'Food Management' },
              { id: 'sales', label: 'Daily Sales Report' },
              { id: 'coupons', label: 'Coupons' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  subTab === tab.id
                    ? 'bg-[#1A1A1A] text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. ORDER STATUS MANAGEMENT */}
        {subTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {['All', ...ORDER_STATUSES].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      orderStatusFilter === st
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {st} ({st === 'All' ? orders.length : orders.filter((o) => o.status === st).length})
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={onRefreshAll}
                className="px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-neutral-200/80 p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-900">{order.id}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {order.customerName} • {order.orderType}
                        {order.tableNumber ? ` (${order.tableNumber})` : ''} • {order.paymentMethod}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-neutral-900">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>

                  <div className="bg-[#F7F7F9] rounded-xl p-2.5 text-xs text-neutral-700 space-y-1">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {i.quantity}× {i.name}
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(i.price * i.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Status Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] text-neutral-400">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {order.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order.id, 'Preparing')}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700 cursor-pointer"
                        >
                          Start Preparing
                        </button>
                      )}
                      {order.status === 'Preparing' && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order.id, 'Ready')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700 cursor-pointer"
                        >
                          Mark Ready
                        </button>
                      )}
                      {order.status === 'Ready' && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order.id, 'Completed')}
                          className="px-2.5 py-1 rounded-lg bg-[#1A1A1A] text-white text-[11px] font-semibold hover:bg-neutral-800 cursor-pointer"
                        >
                          Complete Order
                        </button>
                      )}
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-neutral-100 border border-neutral-200 rounded-lg px-2 py-1 text-[11px] font-semibold text-neutral-700 cursor-pointer"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. ADMIN FOOD MANAGEMENT */}
        {subTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-neutral-500">
                {menuItems.length} dishes in catalog
              </p>
              <button
                type="button"
                onClick={openAddFood}
                className="px-4 py-2 rounded-xl bg-[#1A1A1A] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-neutral-800 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Food Item
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200/80 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[680px]">
                <thead>
                  <tr className="border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-[#FAFAFB]">
                    <th className="py-3 px-4">Dish</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Availability</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50/70">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-9 h-9 rounded-full bg-neutral-100 object-cover"
                          />
                          <div>
                            <p className="font-bold text-neutral-900">{item.name}</p>
                            <p className="text-[11px] text-neutral-400 truncate max-w-[220px]">
                              {item.size} • {item.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-neutral-700">{item.category}</td>
                      <td className="py-3 px-4 font-bold text-neutral-900">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-amber-600">
                        ★ {Number(item.rating).toFixed(1)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(item)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                            item.available !== false
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {item.available !== false ? 'Available' : 'Sold Out'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditFood(item)}
                            title="Edit item"
                            className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFood(item)}
                            title="Delete item"
                            className="p-1.5 rounded-lg border border-neutral-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. DAILY SALES REPORT */}
        {subTab === 'sales' && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-neutral-700">Report Date:</label>
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-semibold"
                />
              </div>
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={!salesReport}
                className="px-4 py-2 rounded-xl bg-[#1A1A1A] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-800 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV Report
              </button>
            </div>

            {salesReport && (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl border border-neutral-200/80 p-4">
                    <div className="flex items-center justify-between text-neutral-400 mb-2">
                      <span className="text-xs font-semibold">Daily Revenue</span>
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">
                      {formatCurrency(salesReport.totalRevenue)}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Tax collected: {formatCurrency(salesReport.totalTax)}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-neutral-200/80 p-4">
                    <div className="flex items-center justify-between text-neutral-400 mb-2">
                      <span className="text-xs font-semibold">Total Orders</span>
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">
                      {salesReport.totalOrders}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      {salesReport.completedOrders} completed • {salesReport.cancelledOrders} cancelled
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-neutral-200/80 p-4">
                    <div className="flex items-center justify-between text-neutral-400 mb-2">
                      <span className="text-xs font-semibold">Avg Order Value</span>
                      <TrendingUp className="w-4 h-4 text-amber-600" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">
                      {formatCurrency(salesReport.averageOrderValue)}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Across {salesReport.validOrdersCount} active orders
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-neutral-200/80 p-4">
                    <div className="flex items-center justify-between text-neutral-400 mb-2">
                      <span className="text-xs font-semibold">Discounts Given</span>
                      <Tag className="w-4 h-4 text-rose-600" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">
                      {formatCurrency(salesReport.totalDiscounts)}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-1">Coupon redemptions</p>
                  </div>
                </div>

                {/* Breakdowns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Top Selling Dishes */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200/80 p-5">
                    <h3 className="text-sm font-bold text-neutral-900 mb-4">
                      Top Selling Dishes Today
                    </h3>
                    {salesReport.topSellingItems.length === 0 ? (
                      <p className="text-xs text-neutral-400 py-8 text-center">
                        No sales recorded for {salesReport.date}.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {salesReport.topSellingItems.map((item) => {
                          const maxQty = salesReport.topSellingItems[0]?.quantitySold || 1;
                          const pct = Math.round((item.quantitySold / maxQty) * 100);
                          return (
                            <div key={item.itemId} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="font-semibold text-neutral-800">
                                  {item.name}{' '}
                                  <span className="text-neutral-400 font-normal">
                                    ({item.category})
                                  </span>
                                </span>
                                <span className="font-bold text-neutral-900">
                                  {item.quantitySold} sold • {formatCurrency(item.revenue)}
                                </span>
                              </div>
                              <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                                <div
                                  className="h-full bg-[#1A1A1A] rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Payment & Dining Split */}
                  <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 space-y-5">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 mb-3">
                        By Payment Method
                      </h3>
                      <div className="space-y-2 text-xs">
                        {Object.entries(salesReport.paymentBreakdown).map(([method, info]) => (
                          <div key={method} className="flex justify-between">
                            <span className="text-neutral-600">
                              {method} ({info.count})
                            </span>
                            <span className="font-bold text-neutral-900">
                              {formatCurrency(info.revenue)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-100">
                      <h3 className="text-sm font-bold text-neutral-900 mb-3">
                        By Order Type
                      </h3>
                      <div className="space-y-2 text-xs">
                        {Object.entries(salesReport.orderTypeBreakdown).map(([type, info]) => (
                          <div key={type} className="flex justify-between">
                            <span className="text-neutral-600">
                              {type} ({info.count})
                            </span>
                            <span className="font-bold text-neutral-900">
                              {formatCurrency(info.revenue)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 4. COUPON MANAGEMENT */}
        {subTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form
              onSubmit={handleCreateCoupon}
              className="bg-white rounded-2xl border border-neutral-200/80 p-5 space-y-3 h-fit"
            >
              <h3 className="text-sm font-bold text-neutral-900">Create Discount Coupon</h3>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) =>
                    setCouponForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                  }
                  placeholder="e.g. WEEKEND25"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Type
                  </label>
                  <select
                    value={couponForm.type}
                    onChange={(e) => setCouponForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-2 text-xs"
                  >
                    <option value="percent">Percent (%)</option>
                    <option value="fixed">Fixed ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Value
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={couponForm.value}
                    onChange={(e) => setCouponForm((f) => ({ ...f, value: e.target.value }))}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Minimum Order ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={couponForm.minOrder}
                  onChange={(e) => setCouponForm((f) => ({ ...f, minOrder: e.target.value }))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={couponForm.description}
                  onChange={(e) => setCouponForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Weekend special offer"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              {couponError && <p className="text-xs text-rose-600 font-medium">{couponError}</p>}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#1A1A1A] text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
              >
                Create Coupon
              </button>
            </form>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 h-fit">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="bg-white rounded-2xl border border-neutral-200/80 p-4 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold tracking-wide text-neutral-900">
                        {c.code}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.active ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-600'
                        }`}
                      >
                        {c.active ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1">{c.description}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Min order: {formatCurrency(c.minOrder)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleCoupon(c.code)}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold hover:bg-neutral-50 cursor-pointer"
                  >
                    {c.active ? 'Disable' : 'Enable'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Food Modal */}
      {foodModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSaveFood}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-900">
                {editingId ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <button
                type="button"
                onClick={() => setFoodModalOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Dish Name
                </label>
                <input
                  type="text"
                  required
                  value={foodForm.name}
                  onChange={(e) => setFoodForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Grilled BBQ Wings"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Category
                </label>
                <select
                  value={foodForm.category}
                  onChange={(e) => setFoodForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.5"
                  required
                  value={foodForm.price}
                  onChange={(e) => setFoodForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="45.00"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Portion / Size
                </label>
                <input
                  type="text"
                  value={foodForm.size}
                  onChange={(e) => setFoodForm((f) => ({ ...f, size: e.target.value }))}
                  placeholder="Regular Plate"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Dish Image
                </label>
                <select
                  value={foodForm.image}
                  onChange={(e) => setFoodForm((f) => ({ ...f, image: e.target.value }))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs"
                >
                  {DISH_IMAGES.map((img) => (
                    <option key={img.value} value={img.value}>
                      {img.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Rating (1 - 5)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={foodForm.rating}
                  onChange={(e) => setFoodForm((f) => ({ ...f, rating: e.target.value }))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={foodForm.description}
                onChange={(e) => setFoodForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Fresh ingredients, signature spices..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-2 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={foodForm.available}
                  onChange={(e) => setFoodForm((f) => ({ ...f, available: e.target.checked }))}
                />
                Available for ordering
              </label>
              <label className="flex items-center gap-2 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={foodForm.popular}
                  onChange={(e) => setFoodForm((f) => ({ ...f, popular: e.target.checked }))}
                />
                Mark as Popular
              </label>
            </div>

            {foodError && <p className="text-xs text-rose-600 font-medium">{foodError}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFoodModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#1A1A1A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                {editingId ? 'Save Changes' : 'Add Dish'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
