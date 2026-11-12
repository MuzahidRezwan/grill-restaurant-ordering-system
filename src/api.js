export const CATEGORIES = [
  'All',
  'Pizza',
  'Fast Food',
  'Noodle',
  'Dessert',
  'Sea Food',
  'Sushi',
  'Ramen',
];

export const ORDER_STATUSES = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
export const ORDER_TYPES = ['Dine', 'Pick Up', 'Delivery'];
export const PAYMENT_METHODS = ['Cash', 'Debit', 'E-Wallet'];
export const TAX_RATE = 0.05;

export function roundMoney(val) {
  return Math.round((Number(val) + Number.EPSILON) * 100) / 100;
}

export function formatCurrency(amount) {
  return `$${Number(amount || 0).toFixed(2)}`;
}

export function formatPadQty(qty) {
  return String(qty).padStart(2, '0');
}

export function calculateCartBill(cartItems = [], coupon = null) {
  const subtotal = roundMoney(
    cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity || 1), 0)
  );
  let discountAmount = 0;
  let appliedCoupon = null;

  if (coupon && coupon.active && subtotal >= Number(coupon.minOrder || 0)) {
    if (coupon.type === 'percent') {
      discountAmount = roundMoney((subtotal * Number(coupon.value)) / 100);
    } else if (coupon.type === 'fixed') {
      discountAmount = roundMoney(Math.min(subtotal, Number(coupon.value)));
    }
    appliedCoupon = coupon.code;
  }

  const afterDiscount = roundMoney(Math.max(0, subtotal - discountAmount));
  const taxAmount = roundMoney(afterDiscount * TAX_RATE);
  const totalAmount = roundMoney(afterDiscount + taxAmount);

  return { subtotal, discountAmount, appliedCoupon, taxAmount, totalAmount };
}

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  getMenu: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.category && params.category !== 'All') qs.set('category', params.category);
    if (params.search) qs.set('search', params.search);
    if (params.availableOnly) qs.set('availableOnly', 'true');
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return request(`/api/menu${query}`);
  },
  addMenuItem: (payload) => request('/api/menu', { method: 'POST', body: JSON.stringify(payload) }),
  updateMenuItem: (id, payload) => request(`/api/menu/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteMenuItem: (id) => request(`/api/menu/${id}`, { method: 'DELETE' }),

  getCoupons: () => request('/api/coupons'),
  validateCoupon: (code, subtotal) =>
    request('/api/coupons/validate', { method: 'POST', body: JSON.stringify({ code, subtotal }) }),
  addCoupon: (payload) => request('/api/coupons', { method: 'POST', body: JSON.stringify(payload) }),
  toggleCoupon: (code) => request(`/api/coupons/${encodeURIComponent(code)}/toggle`, { method: 'PATCH' }),

  getOrders: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.status && params.status !== 'All') qs.set('status', params.status);
    if (params.search) qs.set('search', params.search);
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return request(`/api/orders${query}`);
  },
  getOrderById: (id) => request(`/api/orders/${encodeURIComponent(id)}`),
  createOrder: (payload) => request('/api/orders', { method: 'POST', body: JSON.stringify(payload) }),
  updateOrderStatus: (id, status) =>
    request(`/api/orders/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getRecommendations: (cartIds = []) => {
    const query = cartIds.length ? `?cartIds=${encodeURIComponent(cartIds.join(','))}` : '';
    return request(`/api/recommendations${query}`);
  },

  getDailySales: (date) => {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    return request(`/api/analytics/daily-sales${query}`);
  },
};
