import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  RestaurantStore,
  calculateBill,
  getRecommendations,
  getDailySalesReport,
} from './store.js';

function createTempStore() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'grill-test-'));
  return new RestaurantStore(path.join(tmpDir, 'db.json'));
}

test('calculateBill computes subtotal, percentage discount, tax, and total accurately', () => {
  const cart = [
    { id: 'item-1', price: 60, quantity: 2 },
    { id: 'item-3', price: 50, quantity: 1 },
  ];
  const coupon = { code: 'GRILL10', type: 'percent', value: 10, minOrder: 20, active: true };
  const bill = calculateBill(cart, coupon, true);
  assert.equal(bill.subtotal, 170);
  assert.equal(bill.discountAmount, 17);
  assert.equal(bill.appliedCoupon, 'GRILL10');
  assert.equal(bill.taxAmount, 7.65); // 5% of (170 - 17 = 153)
  assert.equal(bill.totalAmount, 160.65);
  assert.equal(bill.totalCount, 3);
});

test('RestaurantStore menu CRUD adds, updates, filters, and deletes items', () => {
  const store = createTempStore();
  const initialCount = store.getMenu().length;
  assert.ok(initialCount >= 16);

  const created = store.addMenuItem({
    name: 'Truffle Grill Steak',
    category: 'Sea Food',
    price: 99.5,
    description: 'Charcoal seared fillet',
    rating: 4.9,
  });
  assert.equal(store.getMenu().length, initialCount + 1);
  assert.equal(created.name, 'Truffle Grill Steak');

  const updated = store.updateMenuItem(created.id, { price: 88, available: false });
  assert.equal(updated.price, 88);
  assert.equal(updated.available, false);

  const deleted = store.deleteMenuItem(created.id);
  assert.equal(deleted, true);
  assert.equal(store.getMenu().length, initialCount);
});

test('Order lifecycle: place order with coupon, track by ID, update status, and reflect in daily sales', () => {
  const store = createTempStore();
  const order = store.createOrder({
    customerName: 'Muzahid Rezwan',
    orderType: 'Dine',
    tableNumber: 'T-12',
    paymentMethod: 'E-Wallet',
    discountCode: 'DIU20',
    items: [
      { itemId: 'item-1', quantity: 1 },
      { itemId: 'item-3', quantity: 1 },
    ],
  });

  assert.equal(order.status, 'Pending');
  assert.equal(order.subtotal, 110);
  assert.equal(order.discountAmount, 22);
  assert.equal(order.discountCode, 'DIU20');

  const tracked = store.getOrderById(order.id);
  assert.equal(tracked.customerName, 'Muzahid Rezwan');

  const preparing = store.updateOrderStatus(order.id, 'Preparing');
  assert.equal(preparing.status, 'Preparing');

  const completed = store.updateOrderStatus(order.id, 'Completed');
  assert.equal(completed.status, 'Completed');

  const report = getDailySalesReport(store.getOrders());
  assert.ok(report.totalOrders >= 5);
  assert.ok(report.totalRevenue >= completed.totalAmount);
  assert.ok(report.topSellingItems.length > 0);
});

test('Recommendation engine suggests popular items on empty cart and complementary items when cart has items', () => {
  const store = createTempStore();
  const menu = store.getMenu();
  const orders = store.getOrders();

  const emptyRecs = getRecommendations([], menu, orders, 4);
  assert.equal(emptyRecs.length, 4);

  const pizzaItem = menu.find((m) => m.id === 'item-1');
  const cartRecs = getRecommendations([pizzaItem], menu, orders, 4);
  assert.equal(cartRecs.length, 4);
  assert.ok(cartRecs.every((r) => r.id !== 'item-1'));
  assert.ok(cartRecs.some((r) => r.reason && r.reason.length > 0));
});
