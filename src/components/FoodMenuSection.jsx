import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Heart,
  Star,
  Sparkles,
  Plus,
  Check,
  X,
} from 'lucide-react';
import { CATEGORIES, formatCurrency } from '../api';

export default function FoodMenuSection({
  items,
  recommendations,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onAddToCart,
  cartItems,
  favorites,
  onToggleFavorite,
  showFavoritesOnly = false,
  onViewAll,
  onOpenAdmin,
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(150);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const cartQtyMap = new Map(cartItems.map((c) => [c.itemId, c.quantity]));

  const filteredItems = items
    .filter((item) => {
      if (showFavoritesOnly && !favorites.includes(item.id)) return false;
      if (Number(item.price) > maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return (b.orderCount || 0) - (a.orderCount || 0);
      return 0;
    });

  return (
    <div className="flex-1 flex flex-col min-w-0 p-5 sm:p-7 overflow-y-auto">
      {/* Top Header Row matching Image 1 */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-medium text-neutral-400 mb-0.5">{todayFormatted}</p>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-neutral-900">
              Grill Restaurant
            </h1>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neutral-200/80 text-neutral-700 hover:bg-neutral-300 transition cursor-pointer"
            >
              Staff Portal
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative flex items-center gap-2 w-full md:w-[340px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Here"
              className="w-full bg-white border border-neutral-200/90 rounded-xl pl-10 pr-8 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            title="Filter & Sort"
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              filterOpen
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-white text-neutral-700 border-neutral-200/90 hover:bg-neutral-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {filterOpen && (
            <div className="absolute right-0 top-13 w-64 bg-white border border-neutral-200 rounded-2xl shadow-xl p-4 z-30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Sort & Filter
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy('featured');
                    setMaxPrice(150);
                  }}
                  className="text-xs text-neutral-500 hover:text-neutral-900 cursor-pointer"
                >
                  Reset
                </button>
              </div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 text-xs mb-3 focus:outline-none"
              >
                <option value="featured">Featured Menu</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>

              <label className="flex justify-between text-xs font-semibold text-neutral-700 mb-1">
                <span>Max Price</span>
                <span>{formatCurrency(maxPrice)}</span>
              </label>
              <input
                type="range"
                min="15"
                max="150"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#1A1A1A]"
              />
            </div>
          )}
        </div>
      </header>

      {/* Section Heading + View All */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-neutral-900">
          {showFavoritesOnly ? 'Your Saved Favorites' : 'Find The Best Food'}
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Category Filter Pills matching Image 1 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5">
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                active
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'bg-white text-neutral-600 hover:bg-neutral-200/70'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Bonus Feature: Smart Recommendations Strip */}
      {!showFavoritesOnly && recommendations && recommendations.length > 0 && (
        <section className="mb-6 bg-white/85 border border-neutral-200/80 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-neutral-900">
                  {cartItems.length > 0
                    ? 'Pairs Well With Your Order'
                    : 'Chef Recommended & Popular Dishes'}
                </h3>
              </div>
            </div>
            <span className="text-[11px] font-medium text-neutral-400">
              Smart Suggestions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="flex items-center gap-2.5 bg-[#F7F7F9] hover:bg-neutral-100 rounded-xl p-2 transition"
              >
                <img
                  src={rec.image}
                  alt={rec.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 bg-white"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-neutral-900 truncate">{rec.name}</p>
                  <p className="text-[10px] text-amber-700 font-medium truncate">{rec.reason}</p>
                  <p className="text-[11px] font-semibold text-neutral-700">
                    {formatCurrency(rec.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onAddToCart(rec)}
                  title={`Add ${rec.name}`}
                  className="w-7 h-7 rounded-lg bg-[#1A1A1A] text-white flex items-center justify-center hover:bg-neutral-800 transition shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Food Grid */}
      {filteredItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-dashed border-neutral-300">
          <p className="text-sm font-semibold text-neutral-700 mb-1">No dishes match your filter</p>
          <p className="text-xs text-neutral-400 mb-4">
            Try clearing your search or switching back to All categories.
          </p>
          <button
            type="button"
            onClick={onViewAll}
            className="px-4 py-2 rounded-xl bg-[#1A1A1A] text-white text-xs font-semibold cursor-pointer"
          >
            Show All Dishes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
          {filteredItems.map((item) => {
            const isFav = favorites.includes(item.id);
            const inCartQty = cartQtyMap.get(item.id) || 0;
            const unavailable = item.available === false;

            return (
              <article
                key={item.id}
                className={`relative bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-neutral-100 flex flex-col transition hover:shadow-md ${
                  unavailable ? 'opacity-60' : ''
                }`}
              >
                {/* Heart Icon Top Right */}
                <button
                  type="button"
                  onClick={() => onToggleFavorite(item.id)}
                  title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                  className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 transition cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 transition ${
                      isFav ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'
                    }`}
                  />
                </button>

                {/* Circular Food Image */}
                <div className="flex justify-center mt-1 mb-3">
                  <div className="relative w-28 h-28 rounded-full bg-neutral-50 flex items-center justify-center p-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain rounded-full"
                    />
                    {unavailable && (
                      <span className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center text-[11px] font-bold text-rose-600">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Price Row */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                    {item.name}
                  </h3>
                  <span className="text-sm font-bold text-neutral-900 shrink-0">
                    {formatCurrency(item.price)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[11px] text-neutral-400 leading-relaxed line-clamp-2 mb-3 flex-1">
                  {item.description}
                </p>

                {/* Footer: Star Rating & Add to Cart Button */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-neutral-800">
                      {Number(item.rating).toFixed(1)}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-medium">
                      • {item.size}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={unavailable}
                    onClick={() => onAddToCart(item)}
                    className={`px-3.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      inCartQty > 0
                        ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                        : 'bg-[#1A1A1A] text-white hover:bg-neutral-800'
                    }`}
                  >
                    {inCartQty > 0 ? (
                      <>
                        <Check className="w-3 h-3" />
                        Add ({inCartQty})
                      </>
                    ) : (
                      'Add to cart'
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
