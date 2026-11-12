import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DATA_DIR = path.join(__dirname, 'data');
export const DB_PATH = path.join(DATA_DIR, 'db.json');

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
export const TAX_RATE = 0.05; // 5% restaurant service tax

const COMPLEMENTARY_PAIRS = {
  Pizza: ['Noodle', 'Fast Food', 'Dessert'],
  'Fast Food': ['Dessert', 'Pizza', 'Noodle'],
  Noodle: ['Pizza', 'Sushi', 'Dessert'],
  Dessert: ['Pizza', 'Ramen', 'Fast Food'],
  'Sea Food': ['Sushi', 'Ramen', 'Dessert'],
  Sushi: ['Ramen', 'Sea Food', 'Dessert'],
  Ramen: ['Sushi', 'Dessert', 'Fast Food'],
};

function todayIsoAt(hoursAgo = 0) {
  const d = new Date(Date.now() - hoursAgo * 3600 * 1000);
  return d.toISOString();
}

export function createSeedData() {
  const menu = [
    {
      id: 'item-1',
      name: 'Onion Pizza',
      category: 'Pizza',
      price: 60.0,
      description: 'With Onion, cheese, Olives And many more...',
      rating: 5.0,
      size: 'Small Size',
      image: '/dishes/onion-pizza.jpg',
      available: true,
      popular: true,
      orderCount: 42,
      prepMinutes: 15,
      tags: ['vegetarian', 'bestseller'],
    },
    {
      id: 'item-2',
      name: 'Mix Veg',
      category: 'Fast Food',
      price: 85.1,
      description: 'With Onion, cheese, Olives And many more...',
      rating: 5.0,
      size: 'Regular Plate',
      image: '/dishes/mix-veg.jpg',
      available: true,
      popular: true,
      orderCount: 31,
      prepMinutes: 12,
      tags: ['vegetarian', 'healthy'],
    },
    {
      id: 'item-3',
      name: 'Chicken Noodle Soup',
      category: 'Noodle',
      price: 50.0,
      description: 'With Onion, cheese, Olives And many more...',
      rating: 5.0,
      size: 'Small Bowl',
      image: '/dishes/noodle-soup.jpg',
      available: true,
      popular: true,
      orderCount: 54,
      prepMinutes: 10,
      tags: ['hot', 'bestseller'],
    },
    {
      id: 'item-4',
      name: 'Salad',
      category: 'Fast Food',
      price: 15.0,
      description: 'With Onion, cheese, Olives And many more...',
      rating: 5.0,
      size: 'Regular Bowl',
      image: '/dishes/salad.jpg',
      available: true,
      popular: false,
      orderCount: 28,
      prepMinutes: 6,
      tags: ['vegetarian', 'fresh'],
    },
    {
      id: 'item-5',
      name: 'Makai Shorba',
      category: 'Noodle',
      price: 65.5,
      description: 'Creamy roasted sweet corn broth with herbs & spices.',
      rating: 5.0,
      size: 'Medium Bowl',
      image: '/dishes/makai-shorba.jpg',
      available: true,
      popular: false,
      orderCount: 22,
      prepMinutes: 10,
      tags: ['vegetarian', 'soup'],
    },
    {
      id: 'item-6',
      name: 'Egg Corn',
      category: 'Fast Food',
      price: 45.0,
      description: 'Golden sweet corn stir-fried with seasoned egg & herbs.',
      rating: 5.0,
      size: 'Regular Plate',
      image: '/dishes/egg-corn.jpg',
      available: true,
      popular: true,
      orderCount: 35,
      prepMinutes: 9,
      tags: ['protein', 'quick'],
    },
    {
      id: 'item-7',
      name: 'Smoky Pepperoni Pizza',
      category: 'Pizza',
      price: 72.0,
      description: 'Wood-fired crust topped with pepperoni & mozzarella.',
      rating: 4.9,
      size: 'Medium Size',
      image: '/dishes/pepperoni-pizza.jpg',
      available: true,
      popular: true,
      orderCount: 48,
      prepMinutes: 16,
      tags: ['bestseller'],
    },
    {
      id: 'item-8',
      name: 'Chargrilled Burger',
      category: 'Fast Food',
      price: 38.0,
      description: 'Juicy flame-grilled patty, cheddar & caramelized onion.',
      rating: 4.8,
      size: 'Combo Meal',
      image: '/dishes/burger.jpg',
      available: true,
      popular: true,
      orderCount: 39,
      prepMinutes: 12,
      tags: ['grill'],
    },
    {
      id: 'item-9',
      name: 'Grilled Garlic Salmon',
      category: 'Sea Food',
      price: 92.0,
      description: 'Atlantic salmon fillet seared in lemon-herb butter.',
      rating: 4.9,
      size: 'Chef Plate',
      image: '/dishes/salmon.jpg',
      available: true,
      popular: true,
      orderCount: 27,
      prepMinutes: 18,
      tags: ['seafood', 'chef-special'],
    },
    {
      id: 'item-10',
      name: 'Spicy Garlic Prawns',
      category: 'Sea Food',
      price: 78.0,
      description: 'Tiger prawns tossed in chili garlic glaze & lime.',
      rating: 4.8,
      size: 'Regular Plate',
      image: '/dishes/prawns.jpg',
      available: true,
      popular: false,
      orderCount: 19,
      prepMinutes: 14,
      tags: ['seafood', 'spicy'],
    },
    {
      id: 'item-11',
      name: 'Salmon Nigiri Platter',
      category: 'Sushi',
      price: 68.0,
      description: 'Hand-pressed sushi rice topped with fresh salmon & wasabi.',
      rating: 4.9,
      size: '8 Pieces',
      image: '/dishes/sushi.jpg',
      available: true,
      popular: true,
      orderCount: 33,
      prepMinutes: 12,
      tags: ['fresh', 'bestseller'],
    },
    {
      id: 'item-12',
      name: 'Dragon Roll Sushi',
      category: 'Sushi',
      price: 74.0,
      description: 'Crispy tempura shrimp rolled with avocado & unagi sauce.',
      rating: 4.8,
      size: '8 Pieces',
      image: '/dishes/dragon-roll.jpg',
      available: true,
      popular: false,
      orderCount: 24,
      prepMinutes: 14,
      tags: ['sushi'],
    },
    {
      id: 'item-13',
      name: 'Tonkotsu Miso Ramen',
      category: 'Ramen',
      price: 58.0,
      description: 'Rich slow-simmered broth, soft-boiled egg, nori & scallions.',
      rating: 4.9,
      size: 'Large Bowl',
      image: '/dishes/ramen.jpg',
      available: true,
      popular: true,
      orderCount: 44,
      prepMinutes: 13,
      tags: ['hot', 'bestseller'],
    },
    {
      id: 'item-14',
      name: 'Spicy Shoyu Ramen',
      category: 'Ramen',
      price: 54.0,
      description: 'Soy-garlic broth with chili oil, bamboo shoots & noodles.',
      rating: 4.7,
      size: 'Large Bowl',
      image: '/dishes/spicy-ramen.jpg',
      available: true,
      popular: false,
      orderCount: 21,
      prepMinutes: 13,
      tags: ['spicy'],
    },
    {
      id: 'item-15',
      name: 'Molten Lava Cake',
      category: 'Dessert',
      price: 24.0,
      description: 'Warm dark chocolate cake with vanilla bean gelato.',
      rating: 5.0,
      size: 'Single Serve',
      image: '/dishes/lava-cake.jpg',
      available: true,
      popular: true,
      orderCount: 51,
      prepMinutes: 8,
      tags: ['sweet', 'bestseller'],
    },
    {
      id: 'item-16',
      name: 'Caramel Berry Cheesecake',
      category: 'Dessert',
      price: 28.0,
      description: 'Velvety baked cheesecake drizzled with berry compote.',
      rating: 4.8,
      size: 'Slice',
      image: '/dishes/cheesecake.jpg',
      available: true,
      popular: false,
      orderCount: 26,
      prepMinutes: 5,
      tags: ['sweet'],
    },
  ];

  const coupons = [
    {
      code: 'GRILL10',
      type: 'percent',
      value: 10,
      minOrder: 20,
      description: '10% off on orders $20+',
      active: true,
    },
    {
      code: 'DIU20',
      type: 'percent',
      value: 20,
      minOrder: 50,
      description: '20% off Capstone Special ($50+)',
      active: true,
    },
    {
      code: 'SAVE15',
      type: 'fixed',
      value: 15,
      minOrder: 60,
      description: '$15 flat off on orders $60+',
      active: true,
    },
    {
      code: 'WELCOME5',
      type: 'fixed',
      value: 5,
      minOrder: 15,
      description: '$5 welcome discount on orders $15+',
      active: true,
    },
  ];

  const orders = [
    {
      id: 'ORD-1001',
      customerName: 'Arafat Rahman',
      customerPhone: '+880 1711-223344',
      tableNumber: 'T-04',
      deliveryAddress: '',
      orderType: 'Dine',
      paymentMethod: 'Cash',
      status: 'Completed',
      items: [
        { itemId: 'item-3', name: 'Chicken Noodle Soup', size: 'Small Bowl', price: 50.0, quantity: 1, image: '/dishes/noodle-soup.jpg', category: 'Noodle' },
        { itemId: 'item-1', name: 'Onion Pizza', size: 'Small Size', price: 60.0, quantity: 2, image: '/dishes/onion-pizza.jpg', category: 'Pizza' },
      ],
      subtotal: 170.0,
      discountCode: 'GRILL10',
      discountAmount: 17.0,
      taxAmount: 7.65,
      totalAmount: 160.65,
      createdAt: todayIsoAt(3.5),
      updatedAt: todayIsoAt(3.0),
      estimatedMinutes: 18,
    },
    {
      id: 'ORD-1002',
      customerName: 'Nusrat Jahan',
      customerPhone: '+880 1812-556677',
      tableNumber: '',
      deliveryAddress: 'Daffodil Smart City, Ashulia',
      orderType: 'Delivery',
      paymentMethod: 'E-Wallet',
      status: 'Ready',
      items: [
        { itemId: 'item-11', name: 'Salmon Nigiri Platter', size: '8 Pieces', price: 68.0, quantity: 1, image: '/dishes/sushi.jpg', category: 'Sushi' },
        { itemId: 'item-13', name: 'Tonkotsu Miso Ramen', size: 'Large Bowl', price: 58.0, quantity: 1, image: '/dishes/ramen.jpg', category: 'Ramen' },
        { itemId: 'item-15', name: 'Molten Lava Cake', size: 'Single Serve', price: 24.0, quantity: 1, image: '/dishes/lava-cake.jpg', category: 'Dessert' },
      ],
      subtotal: 150.0,
      discountCode: 'DIU20',
      discountAmount: 30.0,
      taxAmount: 6.0,
      totalAmount: 126.0,
      createdAt: todayIsoAt(1.2),
      updatedAt: todayIsoAt(0.4),
      estimatedMinutes: 22,
    },
    {
      id: 'ORD-1003',
      customerName: 'Tanvir Ahmed',
      customerPhone: '+880 1919-889900',
      tableNumber: '',
      deliveryAddress: '',
      orderType: 'Pick Up',
      paymentMethod: 'Debit',
      status: 'Preparing',
      items: [
        { itemId: 'item-8', name: 'Chargrilled Burger', size: 'Combo Meal', price: 38.0, quantity: 2, image: '/dishes/burger.jpg', category: 'Fast Food' },
        { itemId: 'item-4', name: 'Salad', size: 'Regular Bowl', price: 15.0, quantity: 1, image: '/dishes/salad.jpg', category: 'Fast Food' },
      ],
      subtotal: 91.0,
      discountCode: null,
      discountAmount: 0,
      taxAmount: 4.55,
      totalAmount: 95.55,
      createdAt: todayIsoAt(0.35),
      updatedAt: todayIsoAt(0.2),
      estimatedMinutes: 14,
    },
    {
      id: 'ORD-1004',
      customerName: 'Farhana Kabir',
      customerPhone: '+880 1614-334455',
      tableNumber: 'T-09',
      deliveryAddress: '',
      orderType: 'Dine',
      paymentMethod: 'Cash',
      status: 'Pending',
      items: [
        { itemId: 'item-9', name: 'Grilled Garlic Salmon', size: 'Chef Plate', price: 92.0, quantity: 1, image: '/dishes/salmon.jpg', category: 'Sea Food' },
        { itemId: 'item-16', name: 'Caramel Berry Cheesecake', size: 'Slice', price: 28.0, quantity: 1, image: '/dishes/cheesecake.jpg', category: 'Dessert' },
      ],
      subtotal: 120.0,
      discountCode: 'SAVE15',
      discountAmount: 15.0,
      taxAmount: 5.25,
      totalAmount: 110.25,
      createdAt: todayIsoAt(0.08),
      updatedAt: todayIsoAt(0.08),
      estimatedMinutes: 20,
    },
  ];

  return { menu, coupons, orders, nextOrderSeq: 1005 };
}

export function roundMoney(val) {
  return Math.round((Number(val) + Number.EPSILON) * 100) / 100;
}

export function calculateBill(cartItems = [], coupon = null, includeTax = true) {
  const subtotal = roundMoney(
    cartItems.reduce((sum, entry) => sum + Number(entry.price) * Number(entry.quantity || 1), 0)
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

  const discountedSubtotal = roundMoney(Math.max(0, subtotal - discountAmount));
  const taxAmount = includeTax ? roundMoney(discountedSubtotal * TAX_RATE) : 0;
  const totalAmount = roundMoney(discountedSubtotal + taxAmount);
  const totalCount = cartItems.reduce((sum, entry) => sum + Number(entry.quantity || 1), 0);

  return {
    subtotal,
    discountAmount,
    appliedCoupon,
    taxAmount,
    totalAmount,
    totalCount,
  };
}

export function getRecommendations(cartItems = [], menu = [], orders = [], limit = 4) {
  const availableItems = menu.filter((item) => item.available !== false);
  const cartIds = new Set(cartItems.map((c) => c.itemId || c.id));
  const candidates = availableItems.filter((item) => !cartIds.has(item.id));

  // Count historical co-occurrence and item popularity from orders
  const itemFreq = new Map();
  const coOccurrence = new Map();

  for (const order of orders) {
    if (order.status === 'Cancelled') continue;
    const idsInOrder = (order.items || []).map((i) => i.itemId);
    for (const id of idsInOrder) {
      itemFreq.set(id, (itemFreq.get(id) || 0) + 1);
      for (const otherId of idsInOrder) {
        if (id === otherId) continue;
        const key = `${id}::${otherId}`;
        coOccurrence.set(key, (coOccurrence.get(key) || 0) + 1);
      }
    }
  }

  if (cartItems.length === 0) {
    return candidates
      .map((item) => {
        const freqScore = (itemFreq.get(item.id) || 0) * 10 + (item.orderCount || 0);
        const score = freqScore + (item.popular ? 25 : 0) + (item.rating || 4.5) * 5;
        return {
          ...item,
          score,
          reason: item.popular ? 'Chef Best Seller' : 'Customer Favorite',
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  const cartCategories = cartItems.map((c) => c.category).filter(Boolean);
  const targetPairCategories = new Set();
  for (const cat of cartCategories) {
    const pairs = COMPLEMENTARY_PAIRS[cat] || [];
    for (const p of pairs) targetPairCategories.add(p);
  }

  return candidates
    .map((item) => {
      let score = (item.rating || 4.5) * 4 + (item.orderCount || 0) * 0.5;
      let reason = 'Popular Add-on';

      // Co-occurrence boost from past orders
      let coScore = 0;
      let pairedName = null;
      for (const cartEntry of cartItems) {
        const cid = cartEntry.itemId || cartEntry.id;
        const hits = coOccurrence.get(`${cid}::${item.id}`) || 0;
        if (hits > 0) {
          coScore += hits * 35;
          pairedName = cartEntry.name;
        }
      }

      if (coScore > 0) {
        score += coScore;
        reason = `Often ordered with ${pairedName}`;
      } else if (targetPairCategories.has(item.category) && !cartCategories.includes(item.category)) {
        score += 30;
        const anchor = cartItems[0]?.name || 'your meal';
        reason = `Pairs well with ${anchor}`;
      } else if (item.category === 'Dessert') {
        score += 22;
        reason = 'Sweet finish to your meal';
      } else if (item.popular) {
        score += 15;
        reason = 'Popular Choice';
      }

      return { ...item, score, reason };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getDailySalesReport(orders = [], dateStr = null) {
  const targetDate = dateStr || new Date().toISOString().slice(0, 10);
  const dayOrders = orders.filter((o) => {
    const d = (o.createdAt || '').slice(0, 10);
    return d === targetDate;
  });

  const validOrders = dayOrders.filter((o) => o.status !== 'Cancelled');
  const totalRevenue = roundMoney(validOrders.reduce((s, o) => s + Number(o.totalAmount || 0), 0));
  const totalDiscounts = roundMoney(validOrders.reduce((s, o) => s + Number(o.discountAmount || 0), 0));
  const totalTax = roundMoney(validOrders.reduce((s, o) => s + Number(o.taxAmount || 0), 0));
  const totalOrders = dayOrders.length;
  const completedOrders = dayOrders.filter((o) => o.status === 'Completed').length;
  const cancelledOrders = dayOrders.filter((o) => o.status === 'Cancelled').length;
  const averageOrderValue = validOrders.length > 0 ? roundMoney(totalRevenue / validOrders.length) : 0;

  const paymentBreakdown = {};
  for (const method of PAYMENT_METHODS) paymentBreakdown[method] = { count: 0, revenue: 0 };
  for (const o of validOrders) {
    const m = o.paymentMethod || 'Cash';
    if (!paymentBreakdown[m]) paymentBreakdown[m] = { count: 0, revenue: 0 };
    paymentBreakdown[m].count += 1;
    paymentBreakdown[m].revenue = roundMoney(paymentBreakdown[m].revenue + Number(o.totalAmount || 0));
  }

  const orderTypeBreakdown = {};
  for (const t of ORDER_TYPES) orderTypeBreakdown[t] = { count: 0, revenue: 0 };
  for (const o of validOrders) {
    const t = o.orderType || 'Dine';
    if (!orderTypeBreakdown[t]) orderTypeBreakdown[t] = { count: 0, revenue: 0 };
    orderTypeBreakdown[t].count += 1;
    orderTypeBreakdown[t].revenue = roundMoney(orderTypeBreakdown[t].revenue + Number(o.totalAmount || 0));
  }

  const statusBreakdown = {};
  for (const s of ORDER_STATUSES) statusBreakdown[s] = 0;
  for (const o of dayOrders) {
    statusBreakdown[o.status] = (statusBreakdown[o.status] || 0) + 1;
  }

  const itemMap = new Map();
  for (const o of validOrders) {
    for (const item of o.items || []) {
      const prev = itemMap.get(item.itemId) || {
        itemId: item.itemId,
        name: item.name,
        category: item.category || 'Menu',
        quantitySold: 0,
        revenue: 0,
      };
      prev.quantitySold += Number(item.quantity || 1);
      prev.revenue = roundMoney(prev.revenue + Number(item.price) * Number(item.quantity || 1));
      itemMap.set(item.itemId, prev);
    }
  }
  const topSellingItems = Array.from(itemMap.values())
    .sort((a, b) => b.quantitySold - a.quantitySold || b.revenue - a.revenue)
    .slice(0, 6);

  return {
    date: targetDate,
    totalOrders,
    validOrdersCount: validOrders.length,
    completedOrders,
    cancelledOrders,
    totalRevenue,
    totalDiscounts,
    totalTax,
    averageOrderValue,
    paymentBreakdown,
    orderTypeBreakdown,
    statusBreakdown,
    topSellingItems,
    recentTransactions: dayOrders
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  };
}

export class RestaurantStore {
  constructor(dbPath = DB_PATH) {
    this.dbPath = dbPath;
    this.data = this._load();
  }

  _load() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const raw = fs.readFileSync(this.dbPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.menu) && Array.isArray(parsed.orders)) {
          return parsed;
        }
      }
    } catch {
      // Fall back to fresh seed data if file is missing or corrupt
    }
    const seed = createSeedData();
    this._save(seed);
    return seed;
  }

  _save(data = this.data) {
    fs.mkdirSync(path.dirname(this.dbPath), { recursive: true });
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  getMenu({ category, search, availableOnly } = {}) {
    let items = [...this.data.menu];
    if (availableOnly) {
      items = items.filter((i) => i.available !== false);
    }
    if (category && category !== 'All') {
      items = items.filter((i) => i.category.toLowerCase() === category.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }
    return items;
  }

  addMenuItem(payload) {
    const name = String(payload.name || '').trim();
    const price = Number(payload.price);
    if (!name) throw new Error('Food name is required.');
    if (!Number.isFinite(price) || price <= 0) throw new Error('Price must be greater than 0.');

    const item = {
      id: `item-${Date.now()}`,
      name,
      category: CATEGORIES.includes(payload.category) && payload.category !== 'All' ? payload.category : 'Fast Food',
      price: roundMoney(price),
      description: String(payload.description || 'Freshly prepared signature dish at Grill Restaurant.').trim(),
      rating: Math.min(5, Math.max(1, Number(payload.rating) || 4.8)),
      size: String(payload.size || 'Regular').trim(),
      image: payload.image || '/dishes/onion-pizza.jpg',
      available: payload.available !== false,
      popular: Boolean(payload.popular),
      orderCount: 0,
      prepMinutes: Math.max(1, Number(payload.prepMinutes) || 12),
      tags: Array.isArray(payload.tags) ? payload.tags : [],
    };
    this.data.menu.unshift(item);
    this._save();
    return item;
  }

  updateMenuItem(id, updates) {
    const idx = this.data.menu.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    const current = this.data.menu[idx];
    const nextPrice = updates.price !== undefined ? Number(updates.price) : current.price;
    if (!Number.isFinite(nextPrice) || nextPrice <= 0) {
      throw new Error('Price must be greater than 0.');
    }
    const updated = {
      ...current,
      ...updates,
      id: current.id,
      price: roundMoney(nextPrice),
      rating: updates.rating !== undefined ? Math.min(5, Math.max(1, Number(updates.rating))) : current.rating,
    };
    this.data.menu[idx] = updated;
    this._save();
    return updated;
  }

  deleteMenuItem(id) {
    const before = this.data.menu.length;
    this.data.menu = this.data.menu.filter((i) => i.id !== id);
    if (this.data.menu.length === before) return false;
    this._save();
    return true;
  }

  getCoupons() {
    return [...this.data.coupons];
  }

  validateCoupon(code, subtotal = 0) {
    const normalized = String(code || '').trim().toUpperCase();
    if (!normalized) return { valid: false, message: 'Please enter a coupon code.' };
    const coupon = this.data.coupons.find((c) => c.code.toUpperCase() === normalized);
    if (!coupon) return { valid: false, message: `Coupon "${normalized}" not found.` };
    if (!coupon.active) return { valid: false, message: `Coupon "${normalized}" is currently inactive.` };
    if (subtotal < Number(coupon.minOrder || 0)) {
      return {
        valid: false,
        message: `Minimum order of $${Number(coupon.minOrder).toFixed(2)} required for ${coupon.code}.`,
      };
    }
    const bill = calculateBill([{ price: subtotal, quantity: 1 }], coupon, false);
    return {
      valid: true,
      coupon,
      discountAmount: bill.discountAmount,
      message: `Applied ${coupon.code}: -$${bill.discountAmount.toFixed(2)}`,
    };
  }

  addCoupon(payload) {
    const code = String(payload.code || '').trim().toUpperCase();
    const value = Number(payload.value);
    if (!code) throw new Error('Coupon code is required.');
    if (!Number.isFinite(value) || value <= 0) throw new Error('Discount value must be greater than 0.');
    if (this.data.coupons.some((c) => c.code.toUpperCase() === code)) {
      throw new Error(`Coupon "${code}" already exists.`);
    }
    const coupon = {
      code,
      type: payload.type === 'fixed' ? 'fixed' : 'percent',
      value: roundMoney(value),
      minOrder: roundMoney(Math.max(0, Number(payload.minOrder) || 0)),
      description: String(payload.description || `${value}${payload.type === 'fixed' ? '$' : '%'} off`).trim(),
      active: payload.active !== false,
    };
    this.data.coupons.push(coupon);
    this._save();
    return coupon;
  }

  toggleCoupon(code) {
    const coupon = this.data.coupons.find((c) => c.code.toUpperCase() === String(code).toUpperCase());
    if (!coupon) return null;
    coupon.active = !coupon.active;
    this._save();
    return coupon;
  }

  getOrders({ status, search } = {}) {
    let orders = [...this.data.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (status && status !== 'All') {
      orders = orders.filter((o) => o.status === status);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          (o.customerName || '').toLowerCase().includes(q) ||
          (o.customerPhone || '').toLowerCase().includes(q)
      );
    }
    return orders;
  }

  getOrderById(id) {
    return this.data.orders.find((o) => o.id.toUpperCase() === String(id).toUpperCase()) || null;
  }

  createOrder(payload) {
    const rawItems = Array.isArray(payload.items) ? payload.items : [];
    if (rawItems.length === 0) throw new Error('Cart cannot be empty.');

    const resolvedItems = rawItems.map((entry) => {
      const menuItem = this.data.menu.find((m) => m.id === (entry.itemId || entry.id));
      if (!menuItem) throw new Error(`Menu item not found: ${entry.name || entry.itemId}`);
      const qty = Math.max(1, parseInt(entry.quantity, 10) || 1);
      menuItem.orderCount = (menuItem.orderCount || 0) + qty;
      return {
        itemId: menuItem.id,
        name: menuItem.name,
        size: entry.size || menuItem.size,
        price: menuItem.price,
        quantity: qty,
        image: menuItem.image,
        category: menuItem.category,
        prepMinutes: menuItem.prepMinutes || 12,
      };
    });

    const subtotal = roundMoney(resolvedItems.reduce((s, i) => s + i.price * i.quantity, 0));
    let coupon = null;
    if (payload.discountCode) {
      const check = this.validateCoupon(payload.discountCode, subtotal);
      if (!check.valid) throw new Error(check.message);
      coupon = check.coupon;
    }

    const bill = calculateBill(resolvedItems, coupon, true);
    const maxPrep = Math.max(...resolvedItems.map((i) => i.prepMinutes || 12));
    const seq = this.data.nextOrderSeq || 1005;
    this.data.nextOrderSeq = seq + 1;

    const now = new Date().toISOString();
    const order = {
      id: `ORD-${seq}`,
      customerName: String(payload.customerName || 'Walk-in Guest').trim(),
      customerPhone: String(payload.customerPhone || '').trim(),
      tableNumber: String(payload.tableNumber || '').trim(),
      deliveryAddress: String(payload.deliveryAddress || '').trim(),
      orderType: ORDER_TYPES.includes(payload.orderType) ? payload.orderType : 'Dine',
      paymentMethod: PAYMENT_METHODS.includes(payload.paymentMethod) ? payload.paymentMethod : 'Cash',
      status: 'Pending',
      items: resolvedItems,
      subtotal: bill.subtotal,
      discountCode: bill.appliedCoupon,
      discountAmount: bill.discountAmount,
      taxAmount: bill.taxAmount,
      totalAmount: bill.totalAmount,
      createdAt: now,
      updatedAt: now,
      estimatedMinutes: maxPrep + (payload.orderType === 'Delivery' ? 15 : 5),
    };

    this.data.orders.unshift(order);
    this._save();
    return order;
  }

  updateOrderStatus(id, status) {
    if (!ORDER_STATUSES.includes(status)) {
      throw new Error(`Invalid status "${status}". Allowed: ${ORDER_STATUSES.join(', ')}`);
    }
    const order = this.getOrderById(id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    this._save();
    return order;
  }

  getRecommendationsForCart(itemIds = []) {
    const cartItems = itemIds
      .map((id) => this.data.menu.find((m) => m.id === id))
      .filter(Boolean);
    return getRecommendations(cartItems, this.data.menu, this.data.orders, 4);
  }

  getDailySales(dateStr) {
    return getDailySalesReport(this.data.orders, dateStr);
  }
}
