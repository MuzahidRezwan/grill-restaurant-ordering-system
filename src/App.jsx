import React, { useState, useEffect, useCallback } from 'react';
import SidebarNav from './components/SidebarNav';
import FoodMenuSection from './components/FoodMenuSection';
import OrderCartPanel from './components/OrderCartPanel';
import OrderTrackingView from './components/OrderTrackingView';
import OrderHistoryView from './components/OrderHistoryView';
import AdminPortalView from './components/AdminPortalView';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import { api } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('menu'); // menu | catalog | tracking | favorites | history | admin
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Pre-seed cart items? Let's keep cart clean or load from localStorage so reload preserves cart
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('grill_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('grill_favs_v1');
      return saved ? JSON.parse(saved) : ['item-1', 'item-3'];
    } catch {
      return ['item-1', 'item-3'];
    }
  });

  const [orderType, setOrderType] = useState('Dine');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [trackedOrderId, setTrackedOrderId] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem('grill_cart_v1', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('grill_favs_v1', JSON.stringify(favorites));
  }, [favorites]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  }, []);

  const refreshAll = useCallback(async () => {
    try {
      const [menuRes, ordersRes, couponsRes] = await Promise.all([
        api.getMenu(),
        api.getOrders(),
        api.getCoupons(),
      ]);
      setMenuItems(menuRes.items || []);
      setOrders(ordersRes.orders || []);
      setCoupons(couponsRes.coupons || []);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    try {
      const res = await api.getOrders();
      setOrders(res.orders || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Fetch smart recommendations whenever cart changes or menu updates
  useEffect(() => {
    const ids = cartItems.map((c) => c.itemId);
    api
      .getRecommendations(ids)
      .then((res) => setRecommendations(res.recommendations || []))
      .catch(() => {});
  }, [cartItems, menuItems.length]);

  const displayedMenu = menuItems.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function handleAddToCart(item) {
    if (item.available === false) return;
    setCartItems((prev) => {
      const existing = prev.find((c) => c.itemId === item.id);
      if (existing) {
        return prev.map((c) =>
          c.itemId === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [
        ...prev,
        {
          itemId: item.id,
          name: item.name,
          size: item.size || 'Regular',
          price: item.price,
          image: item.image,
          category: item.category,
          quantity: 1,
        },
      ];
    });
    showToast(`Added ${item.name} to My Order`);
  }

  function handleUpdateQty(itemId, nextQty) {
    if (nextQty <= 0) {
      setCartItems((prev) => prev.filter((c) => c.itemId !== itemId));
      return;
    }
    setCartItems((prev) =>
      prev.map((c) => (c.itemId === itemId ? { ...c, quantity: nextQty } : c))
    );
  }

  function handleRemoveFromCart(itemId) {
    setCartItems((prev) => prev.filter((c) => c.itemId !== itemId));
  }

  function handleClearCart() {
    setCartItems([]);
    setAppliedCoupon(null);
  }

  function handleToggleFavorite(itemId) {
    setFavorites((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  }

  async function handlePlaceOrder(payload) {
    setSubmittingOrder(true);
    try {
      const res = await api.createOrder(payload);
      const created = res.order;
      setConfirmedOrder(created);
      setTrackedOrderId(created.id);
      setCartItems([]);
      setAppliedCoupon(null);
      await refreshAll();
    } finally {
      setSubmittingOrder(false);
    }
  }

  function handleTrackOrder(orderId) {
    setTrackedOrderId(orderId);
    setConfirmedOrder(null);
    setActiveTab('tracking');
  }

  function handleReorder(order) {
    const restored = (order.items || []).map((i) => ({
      itemId: i.itemId,
      name: i.name,
      size: i.size || 'Regular',
      price: i.price,
      image: i.image || '/dishes/onion-pizza.svg',
      category: i.category || 'Menu',
      quantity: i.quantity || 1,
    }));
    setCartItems(restored);
    setOrderType(order.orderType || 'Dine');
    setActiveTab('menu');
    showToast(`Loaded items from ${order.id} into cart`);
  }

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'Completed' && o.status !== 'Cancelled'
  ).length;

  const showPosLayout = activeTab === 'menu' || activeTab === 'catalog' || activeTab === 'favorites';

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F3F3F5] text-[#171717]">
      {/* Left Sidebar Navigation */}
      <SidebarNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'catalog') {
            setSelectedCategory('All');
            setSearchQuery('');
          }
        }}
        activeOrdersCount={activeOrdersCount}
        favoritesCount={favorites.length}
      />

      {/* Main Content + Right Cart Panel */}
      {showPosLayout && (
        <>
          <FoodMenuSection
            items={displayedMenu}
            recommendations={recommendations}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            showFavoritesOnly={activeTab === 'favorites'}
            onViewAll={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setActiveTab('menu');
            }}
            onOpenAdmin={() => setActiveTab('admin')}
          />

          <OrderCartPanel
            cartItems={cartItems}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            orderType={orderType}
            onChangeOrderType={setOrderType}
            paymentMethod={paymentMethod}
            onChangePaymentMethod={setPaymentMethod}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={setAppliedCoupon}
            onRemoveCoupon={() => setAppliedCoupon(null)}
            onPlaceOrder={handlePlaceOrder}
            submitting={submittingOrder}
          />
        </>
      )}

      {activeTab === 'tracking' && (
        <OrderTrackingView
          orders={orders}
          selectedOrderId={trackedOrderId}
          onSelectOrderId={setTrackedOrderId}
          onRefreshOrders={refreshOrders}
        />
      )}

      {activeTab === 'history' && (
        <OrderHistoryView
          orders={orders}
          onTrackOrder={handleTrackOrder}
          onReorder={handleReorder}
        />
      )}

      {activeTab === 'admin' && (
        <AdminPortalView
          menuItems={menuItems}
          orders={orders}
          coupons={coupons}
          onRefreshAll={refreshAll}
        />
      )}

      {/* Post-Checkout Order Confirmation Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onTrackOrder={handleTrackOrder}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
