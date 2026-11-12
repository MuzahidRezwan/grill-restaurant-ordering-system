import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RestaurantStore, CATEGORIES, ORDER_STATUSES } from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

export function createApp(store = new RestaurantStore()) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'Grill Restaurant API', categories: CATEGORIES, statuses: ORDER_STATUSES });
  });

  // Menu endpoints
  app.get('/api/menu', (req, res) => {
    const { category, search, availableOnly } = req.query;
    const items = store.getMenu({
      category,
      search,
      availableOnly: availableOnly === 'true',
    });
    res.json({ items, categories: CATEGORIES });
  });

  app.post('/api/menu', (req, res) => {
    try {
      const created = store.addMenuItem(req.body || {});
      res.status(201).json({ item: created });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/menu/:id', (req, res) => {
    try {
      const updated = store.updateMenuItem(req.params.id, req.body || {});
      if (!updated) return res.status(404).json({ error: 'Menu item not found.' });
      res.json({ item: updated });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/menu/:id', (req, res) => {
    const removed = store.deleteMenuItem(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Menu item not found.' });
    res.json({ deleted: true, id: req.params.id });
  });

  // Coupons endpoints
  app.get('/api/coupons', (_req, res) => {
    res.json({ coupons: store.getCoupons() });
  });

  app.post('/api/coupons/validate', (req, res) => {
    const { code, subtotal } = req.body || {};
    const result = store.validateCoupon(code, Number(subtotal) || 0);
    if (!result.valid) return res.status(400).json(result);
    res.json(result);
  });

  app.post('/api/coupons', (req, res) => {
    try {
      const coupon = store.addCoupon(req.body || {});
      res.status(201).json({ coupon });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch('/api/coupons/:code/toggle', (req, res) => {
    const coupon = store.toggleCoupon(req.params.code);
    if (!coupon) return res.status(404).json({ error: 'Coupon not found.' });
    res.json({ coupon });
  });

  // Orders endpoints
  app.get('/api/orders', (req, res) => {
    const { status, search } = req.query;
    res.json({ orders: store.getOrders({ status, search }) });
  });

  app.get('/api/orders/:id', (req, res) => {
    const order = store.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json({ order });
  });

  app.post('/api/orders', (req, res) => {
    try {
      const order = store.createOrder(req.body || {});
      res.status(201).json({ order });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch('/api/orders/:id/status', (req, res) => {
    try {
      const order = store.updateOrderStatus(req.params.id, req.body?.status);
      if (!order) return res.status(404).json({ error: 'Order not found.' });
      res.json({ order });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Recommendations (Bonus Challenge)
  app.get('/api/recommendations', (req, res) => {
    const idsParam = String(req.query.cartIds || '').trim();
    const itemIds = idsParam ? idsParam.split(',').map((s) => s.trim()).filter(Boolean) : [];
    const recommendations = store.getRecommendationsForCart(itemIds);
    res.json({ recommendations });
  });

  // Daily Sales Report (Advanced Feature)
  app.get('/api/analytics/daily-sales', (req, res) => {
    const report = store.getDailySales(req.query.date);
    res.json({ report });
  });

  // Serve built Vite frontend if dist exists
  if (fs.existsSync(DIST_DIR)) {
    app.use(express.static(DIST_DIR));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    });
  }

  return app;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);
if (isMain) {
  const port = Number(process.env.PORT) || 3001;
  const app = createApp();
  app.listen(port, () => {
    console.log(`Grill Restaurant server listening on http://localhost:${port}`);
  });
}
