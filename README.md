# Grill Restaurant — Food Ordering & Management System

**Course:** SE331 — Software Engineering Design Capstone Project (Assessment 2)  
**Department of Software Engineering, Daffodil International University**

A full-stack digital food ordering and restaurant management platform built with **React**, **Tailwind CSS**, and **Node.js / Express** to replace traditional paper-based restaurant ordering.

---

## Features Implemented

### Core Features
- **Display Food Menu**: Responsive 3-column POS food grid with dish photos, prices, ratings, portion sizes, descriptions, and availability status.
- **Food Category Filtering**: Instant category pills (`All`, `Pizza`, `Fast Food`, `Noodle`, `Dessert`, `Sea Food`, `Sushi`, `Ramen`).
- **Search & Filter Food Items**: Real-time search by dish name/category/description plus sort & max-price filters.
- **Shopping Cart (`My Order`)**: Add items, view live item count, remove individual items, or clear the cart.
- **Quantity Controls**: Increment/decrement item quantities (`01`, `02`, ...) with live line-item pricing.
- **Bill Calculation**: Real-time calculation of subtotal, coupon discount, 5% tax, and final `Total Amount`.
- **Place an Order**: Supports `Dine` (table number), `Pick Up`, and `Delivery` (address), plus `Cash`, `Debit`, and `E-Wallet` payment methods, returning a generated Order ID (`ORD-1005+`).
- **Live Order Tracking**: Real-time 4-stage order progress tracker (`Pending` → `Preparing` → `Ready` → `Completed`) searchable by Order ID with auto-refresh.
- **Admin Food Management**: Full CRUD interface to add new dishes, edit prices/details, toggle availability (`Available` / `Sold Out`), and delete menu items.

### Advanced Features
- **Discount Coupon System**: Validate and apply promo codes (`GRILL10`, `DIU20`, `SAVE15`, `WELCOME5`) with minimum-order checks, plus Admin coupon creation & toggling.
- **Order Status Management**: Staff kitchen/order queue with status filters and 1-click progression (`Start Preparing` → `Mark Ready` → `Complete Order` / `Cancelled`).
- **Daily Sales Report**: Real-time revenue, order counts, average order value, discount totals, payment/dining breakdowns, top-selling dishes chart, and **CSV export**.
- **Customer Order History**: Searchable order archive with itemized receipt modal and 1-click **Reorder** functionality.

### Bonus Challenge
- **Smart Recommendation Engine**: Suggests popular dishes when the cart is empty and complementary/frequently paired dishes based on items currently in `My Order` and historical co-occurrence.

---

## Tech Stack

- **Frontend:** React 19, Vite 6, Tailwind CSS 4, Lucide Icons
- **Backend:** Node.js, Express 4, Persistent JSON Store (`server/data/db.json`)
- **Testing:** Node.js built-in test runner (`node --test`)

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode (Frontend + Backend)
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

### 3. Run in Production Mode
```bash
npm run build
npm start
```
Then open `http://localhost:3001`.

### 4. Run Unit Tests
```bash
npm test
```

---

## Sample Discount Coupons
| Code | Discount | Minimum Order |
| --- | --- | --- |
| `GRILL10` | 10% off | $20.00 |
| `DIU20` | 20% off | $50.00 |
| `SAVE15` | $15.00 off | $60.00 |
| `WELCOME5` | $5.00 off | $15.00 |
